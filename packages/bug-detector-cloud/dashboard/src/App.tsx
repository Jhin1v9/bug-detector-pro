import { useEffect, useMemo, useState } from 'react';
import './App.css';

const API_BASE = import.meta.env.VITE_API_BASE || '';

type Severity = 'critical' | 'high' | 'medium' | 'low';
type Status = 'pending' | 'resolved';
type TabKey = 'overview' | 'media' | 'technical' | 'performance' | 'ai';

interface ConsoleLog {
  type: 'log' | 'warn' | 'error' | 'info';
  message: string;
  timestamp: string;
  stack?: string;
}

interface NetworkRequest {
  url: string;
  method: string;
  status: number;
  statusText?: string;
  duration: number;
  timestamp: string;
  error?: string;
}

interface PerformanceMetrics {
  loadTime: number;
  domContentLoaded: number;
  firstPaint?: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
}

interface AIAnalysis {
  provider: 'gemini' | 'deepseek' | 'openai';
  severity: 'low' | 'medium' | 'high' | 'critical';
  rootCause: string;
  solution?: string;
  technicalDescription?: string;
  analysis?: string;
  recommendations?: string[];
  codeFix?: {
    linguagem: string;
    codigoAtual: string;
    codigoCorrigido: string;
    explicacao: string;
  };
  confidence: number;
}

interface Report {
  id: string;
  timestamp: string;
  status: Status;
  severity: Severity;
  type: string;
  description: string;
  expectedBehavior?: string;
  url?: string;
  pageTitle?: string;
  userAgent?: string;
  viewport?: { width: number; height: number } | null;
  elementTag?: string;
  elementSelector?: string;
  element?: { tag?: string; selector?: string; innerHTML?: string } | null;
  screenshot?: string;
  video?: string;
  sessionReplay?: { events: unknown[] } | null;
  consoleLogs?: ConsoleLog[] | null;
  networkRequests?: NetworkRequest[] | null;
  performanceMetrics?: PerformanceMetrics | null;
  aiAnalysis?: AIAnalysis | null;
}

function App() {
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Record<string, TabKey>>({});
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | Status>('all');
  const [lightbox, setLightbox] = useState<{ type: 'img' | 'video'; src: string } | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/reports`)
      .then((r) => r.json())
      .then((data: Report[]) => {
        setReports(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetch(`${API_BASE}/api/stats`)
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return reports.filter((r) => {
      const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
      const matchesSearch =
        !term ||
        r.description.toLowerCase().includes(term) ||
        (r.url || '').toLowerCase().includes(term) ||
        (r.elementSelector || '').toLowerCase().includes(term) ||
        (r.aiAnalysis?.rootCause || '').toLowerCase().includes(term);
      return matchesStatus && matchesSearch;
    });
  }, [reports, search, filterStatus]);

  const updateStatus = async (id: string, status: Status) => {
    await fetch(`${API_BASE}/api/reports/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    // Atualiza stats localmente sem refetch
    setStats((prev) => {
      const wasResolved = reports.find((r) => r.id === id)?.status === 'resolved';
      const isResolved = status === 'resolved';
      if (wasResolved && !isResolved) {
        return { ...prev, pending: prev.pending + 1, resolved: Math.max(0, prev.resolved - 1) };
      }
      if (!wasResolved && isResolved) {
        return { ...prev, pending: Math.max(0, prev.pending - 1), resolved: prev.resolved + 1 };
      }
      return prev;
    });
  };

  const deleteReport = async (id: string) => {
    if (!confirm('Excluir report?')) return;
    await fetch(`${API_BASE}/api/reports/${id}`, { method: 'DELETE' });
    setReports((prev) => prev.filter((r) => r.id !== id));
  };

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const formatDate = (ts: string) =>
    new Date(ts).toLocaleString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const deviceFromUA = (ua?: string) => {
    if (!ua) return 'Desconhecido';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
    if (ua.includes('Windows')) return 'Windows';
    if (ua.includes('Mac')) return 'macOS';
    if (ua.includes('Linux')) return 'Linux';
    return 'Navegador';
  };

  const browserFromUA = (ua?: string) => {
    if (!ua) return 'Desconhecido';
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Edge')) return 'Edge';
    return 'Navegador';
  };

  const getTab = (id: string) => activeTab[id] || 'overview';
  const setTab = (id: string, tab: TabKey) =>
    setActiveTab((prev) => ({ ...prev, [id]: tab }));

  const tabButtons: { key: TabKey; label: string; count?: number }[] = [
    { key: 'overview', label: 'Visão geral' },
    { key: 'media', label: 'Mídia' },
    { key: 'technical', label: 'Técnico' },
    { key: 'performance', label: 'Performance' },
    { key: 'ai', label: 'IA' },
  ];

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <div className="brand-icon">🐞</div>
          <div className="brand-text">
            <h1>BugDetector Cloud</h1>
            <p>Dashboard de reports</p>
          </div>
        </div>
        <div className="stats">
          <div className="stat-pill">
            <span>Total</span> {stats.total}
          </div>
          <div className="stat-pill">
            <span>Pendentes</span> {stats.pending}
          </div>
          <div className="stat-pill">
            <span>Resolvidos</span> {stats.resolved}
          </div>
        </div>
      </header>

      <div className="controls">
        <input
          className="search"
          placeholder="Buscar por descrição, URL, seletor ou causa raiz..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {(['all', 'pending', 'resolved'] as const).map((s) => (
          <button
            key={s}
            className={`filter-btn ${filterStatus === s ? 'active' : ''}`}
            onClick={() => setFilterStatus(s)}
          >
            {s === 'all' ? 'Todos' : s === 'pending' ? 'Pendentes' : 'Resolvidos'}
          </button>
        ))}
      </div>

      <main className="main">
        {loading ? (
          <>
            <div className="skeleton" style={{ marginBottom: 14 }} />
            <div className="skeleton" style={{ marginBottom: 14 }} />
            <div className="skeleton" />
          </>
        ) : filtered.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">📭</div>
            <h3>Nenhum report por aqui</h3>
            <p>
              {reports.length === 0
                ? 'Envie seu primeiro bug pelo widget para começar.'
                : 'Nenhum resultado encontrado com os filtros atuais.'}
            </p>
          </div>
        ) : (
          <div className="list">
            {filtered.map((report) => {
              const isExpanded = expandedId === report.id;
              const tab = getTab(report.id);
              const hasMedia = report.screenshot || report.video;
              const hasConsole = report.consoleLogs && report.consoleLogs.length > 0;
              const hasNetwork = report.networkRequests && report.networkRequests.length > 0;
              const hasPerf = !!report.performanceMetrics;
              const hasAI = !!report.aiAnalysis;
              const hasReplay = report.sessionReplay && report.sessionReplay.events && report.sessionReplay.events.length > 0;

              return (
                <div key={report.id} className="card">
                  <div className="card-header">
                    <div className="card-left">
                      <div className="card-title">
                        <span className={`severity ${report.severity}`}>{report.severity}</span>
                        <span>{report.description}</span>
                      </div>
                      <div className="card-meta">
                        <span className={`status-dot ${report.status}`} />
                        <span>{report.status === 'resolved' ? 'Resolvido' : 'Pendente'}</span>
                        <span>•</span>
                        <span>{report.type}</span>
                        <span>•</span>
                        <span>{formatDate(report.timestamp)}</span>
                        {report.elementTag && (
                          <>
                            <span>•</span>
                            <span>&lt;{report.elementTag}&gt;</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="card-actions">
                      {report.status !== 'resolved' && (
                        <button
                          className="icon-btn resolve"
                          title="Marcar como resolvido"
                          onClick={() => updateStatus(report.id, 'resolved')}
                        >
                          ✓
                        </button>
                      )}
                      <button
                        className="icon-btn delete"
                        title="Excluir"
                        onClick={() => deleteReport(report.id)}
                      >
                        🗑
                      </button>
                    </div>
                  </div>

                  {hasMedia && !isExpanded && (
                    <div className="media-strip">
                      {report.screenshot && (
                        <div className="media-thumb" onClick={() => setLightbox({ type: 'img', src: report.screenshot! })}>
                          <img src={report.screenshot} alt="Screenshot" />
                          <div className="overlay">🔍</div>
                        </div>
                      )}
                      {report.video && (
                        <div className="media-thumb" onClick={() => setLightbox({ type: 'video', src: report.video! })}>
                          <video src={report.video} />
                          <div className="overlay">▶</div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="toggle-row">
                    <button
                      className="toggle-btn"
                      onClick={() => setExpandedId(isExpanded ? null : report.id)}
                    >
                      {isExpanded ? '▲ Ocultar detalhes' : '▼ Ver detalhes'}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="details">
                      <div className="tabs">
                        {tabButtons.map((t) => {
                          let count: number | undefined;
                          if (t.key === 'media') count = [report.screenshot, report.video, hasReplay ? 1 : 0].filter(Boolean).length;
                          if (t.key === 'technical') count = (report.consoleLogs?.length || 0) + (report.networkRequests?.length || 0);
                          if (t.key === 'performance') count = hasPerf ? 1 : 0;
                          if (t.key === 'ai') count = hasAI ? 1 : 0;
                          return (
                            <button
                              key={t.key}
                              className={`tab ${tab === t.key ? 'active' : ''}`}
                              onClick={() => setTab(report.id, t.key)}
                            >
                              {t.label}
                              {count ? <span className="tab-badge">{count}</span> : null}
                            </button>
                          );
                        })}
                      </div>

                      {tab === 'overview' && (
                        <div className="panel">
                          <div className="details-grid two">
                            {report.pageTitle && (
                              <div className="detail-block">
                                <label>Página</label>
                                <div className="value">{report.pageTitle}</div>
                              </div>
                            )}
                            {report.url && (
                              <div className="detail-block">
                                <label>URL</label>
                                <a href={report.url} target="_blank" rel="noreferrer">
                                  {report.url}
                                </a>
                              </div>
                            )}
                            <div className="detail-block">
                              <label>Dispositivo</label>
                              <div className="value">
                                {deviceFromUA(report.userAgent)} • {browserFromUA(report.userAgent)}
                              </div>
                            </div>
                            {report.viewport && (
                              <div className="detail-block">
                                <label>Viewport</label>
                                <div className="value">
                                  {report.viewport.width}px × {report.viewport.height}px
                                </div>
                              </div>
                            )}
                            {report.expectedBehavior && (
                              <div className="detail-block wide">
                                <label>Comportamento esperado</label>
                                <div className="value">{report.expectedBehavior}</div>
                              </div>
                            )}
                            {report.element?.innerHTML && (
                              <div className="detail-block wide">
                                <label>HTML do elemento</label>
                                <div className="code-block">
                                  <pre>{report.element.innerHTML.slice(0, 800)}{report.element.innerHTML.length > 800 ? '...' : ''}</pre>
                                  <button
                                    className="copy-btn"
                                    onClick={() => copy(report.element!.innerHTML!, `html-${report.id}`)}
                                  >
                                    {copied === `html-${report.id}` ? 'Copiado!' : 'Copiar'}
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {tab === 'media' && (
                        <div className="panel">
                          <div className="media-grid">
                            {report.screenshot && (
                              <div className="media-card" onClick={() => setLightbox({ type: 'img', src: report.screenshot! })}>
                                <img src={report.screenshot} alt="Screenshot" />
                                <div className="media-label">Screenshot</div>
                              </div>
                            )}
                            {report.video && (
                              <div className="media-card" onClick={() => setLightbox({ type: 'video', src: report.video! })}>
                                <video src={report.video} />
                                <div className="media-label">Gravação de tela</div>
                              </div>
                            )}
                            {hasReplay && (
                              <div className="media-card placeholder">
                                <div className="media-placeholder">🎬</div>
                                <div className="media-label">Session Replay ({report.sessionReplay!.events.length} eventos)</div>
                                <div className="media-hint">Visualização em breve</div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {tab === 'technical' && (
                        <div className="panel">
                          {hasConsole && (
                            <div className="section">
                              <h4>Console logs ({report.consoleLogs!.length})</h4>
                              <div className="console-box">
                                {report.consoleLogs!.map((log, idx) => (
                                  <div key={idx} className={`console-line ${log.type}`}>
                                    <span className="console-badge">{log.type}</span>
                                    <span className="console-msg">{log.message}</span>
                                    {log.stack && (
                                      <pre className="console-stack">{log.stack}</pre>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {hasNetwork && (
                            <div className="section">
                              <h4>Network requests ({report.networkRequests!.length})</h4>
                              <div className="table-wrap">
                                <table className="data-table">
                                  <thead>
                                    <tr>
                                      <th>Método</th>
                                      <th>Status</th>
                                      <th>URL</th>
                                      <th>Duração</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {report.networkRequests!.map((req, idx) => (
                                      <tr key={idx}>
                                        <td><span className="method">{req.method}</span></td>
                                        <td>
                                          <span className={`status ${req.status >= 400 || req.error ? 'bad' : 'good'}`}>
                                            {req.error ? 'ERR' : req.status}
                                          </span>
                                        </td>
                                        <td className="url">{req.url}</td>
                                        <td>{Math.round(req.duration)}ms</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}

                          {report.element?.selector && (
                            <div className="section">
                              <h4>Seletor do elemento</h4>
                              <div className="code-block">
                                <code>{report.element.selector}</code>
                                <button
                                  className="copy-btn"
                                  onClick={() => copy(report.element!.selector!, `sel-${report.id}`)}
                                >
                                  {copied === `sel-${report.id}` ? 'Copiado!' : 'Copiar'}
                                </button>
                              </div>
                            </div>
                          )}

                          {!hasConsole && !hasNetwork && !report.element?.selector && (
                            <p className="muted">Nenhum dado técnico capturado neste report.</p>
                          )}
                        </div>
                      )}

                      {tab === 'performance' && (
                        <div className="panel">
                          {hasPerf ? (
                            <div className="perf-grid">
                              <div className="perf-card">
                                <div className="perf-value">{Math.round(report.performanceMetrics!.loadTime)}ms</div>
                                <div className="perf-label">Load time</div>
                              </div>
                              <div className="perf-card">
                                <div className="perf-value">{Math.round(report.performanceMetrics!.domContentLoaded)}ms</div>
                                <div className="perf-label">DOMContentLoaded</div>
                              </div>
                              {report.performanceMetrics!.firstPaint && (
                                <div className="perf-card">
                                  <div className="perf-value">{Math.round(report.performanceMetrics!.firstPaint)}ms</div>
                                  <div className="perf-label">First Paint</div>
                                </div>
                              )}
                              {report.performanceMetrics!.firstContentfulPaint && (
                                <div className="perf-card">
                                  <div className="perf-value">{Math.round(report.performanceMetrics!.firstContentfulPaint)}ms</div>
                                  <div className="perf-label">First Contentful Paint</div>
                                </div>
                              )}
                              {report.performanceMetrics!.largestContentfulPaint && (
                                <div className="perf-card">
                                  <div className="perf-value">{Math.round(report.performanceMetrics!.largestContentfulPaint)}ms</div>
                                  <div className="perf-label">Largest Contentful Paint</div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <p className="muted">Nenhuma métrica de performance capturada.</p>
                          )}
                        </div>
                      )}

                      {tab === 'ai' && (
                        <div className="panel">
                          {hasAI ? (
                            <div className="ai-panel">
                              <div className="ai-header">
                                <div>
                                  <h4>Análise da IA</h4>
                                  <p className="muted">
                                    Provider: {report.aiAnalysis!.provider} • Confiança: {report.aiAnalysis!.confidence}%
                                  </p>
                                </div>
                              </div>

                              <div className="detail-block wide">
                                <label>Causa raiz</label>
                                <div className="value">{report.aiAnalysis!.rootCause}</div>
                              </div>

                              {report.aiAnalysis!.technicalDescription && (
                                <div className="detail-block wide">
                                  <label>Descrição técnica</label>
                                  <div className="value">{report.aiAnalysis!.technicalDescription}</div>
                                </div>
                              )}

                              {report.aiAnalysis!.solution && (
                                <div className="detail-block wide">
                                  <label>Solução sugerida</label>
                                  <div className="value">{report.aiAnalysis!.solution}</div>
                                </div>
                              )}

                              {report.aiAnalysis!.recommendations && report.aiAnalysis!.recommendations.length > 0 && (
                                <div className="detail-block wide">
                                  <label>Recomendações</label>
                                  <ul className="recommendations">
                                    {report.aiAnalysis!.recommendations.map((rec, i) => (
                                      <li key={i}>{rec}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {report.aiAnalysis!.codeFix && (
                                <div className="detail-block wide">
                                  <label>Código corrigido ({report.aiAnalysis!.codeFix.linguagem})</label>
                                  <div className="code-block">
                                    <pre>{report.aiAnalysis!.codeFix.codigoCorrigido}</pre>
                                    <button
                                      className="copy-btn"
                                      onClick={() =>
                                        copy(
                                          report.aiAnalysis!.codeFix!.codigoCorrigido,
                                          `fix-${report.id}`
                                        )
                                      }
                                    >
                                      {copied === `fix-${report.id}` ? 'Copiado!' : 'Copiar'}
                                    </button>
                                  </div>
                                  {report.aiAnalysis!.codeFix.explicacao && (
                                    <p className="muted" style={{ marginTop: 8 }}>
                                      {report.aiAnalysis!.codeFix.explicacao}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          ) : (
                            <p className="muted">Nenhuma análise de IA disponível para este report.</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button className="lightbox-close" onClick={() => setLightbox(null)}>
            ×
          </button>
          {lightbox.type === 'img' ? (
            <img src={lightbox.src} alt="Preview" />
          ) : (
            <video src={lightbox.src} controls autoPlay />
          )}
        </div>
      )}
    </div>
  );
}

export default App;
