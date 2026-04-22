const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = process.env.DB_PATH || path.join(__dirname, 'data', 'reports.db');
fs.mkdirSync(path.dirname(dbPath), { recursive: true });
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS reports (
    id TEXT PRIMARY KEY,
    timestamp TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    url TEXT,
    pageTitle TEXT,
    userAgent TEXT,
    viewportWidth INTEGER,
    viewportHeight INTEGER,
    description TEXT NOT NULL,
    type TEXT NOT NULL,
    severity TEXT NOT NULL,
    expectedBehavior TEXT,
    screenshot TEXT,
    video TEXT,
    sessionReplay TEXT,
    consoleLogs TEXT,
    networkRequests TEXT,
    performanceMetrics TEXT,
    elementTag TEXT,
    elementSelector TEXT,
    elementHtml TEXT,
    aiAnalysis TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

function saveReport(report) {
  const stmt = db.prepare(`
    INSERT INTO reports (
      id, timestamp, status, url, pageTitle, userAgent,
      viewportWidth, viewportHeight, description, type, severity,
      expectedBehavior, screenshot, video, sessionReplay,
      consoleLogs, networkRequests, performanceMetrics,
      elementTag, elementSelector, elementHtml, aiAnalysis
    ) VALUES (
      @id, @timestamp, @status, @url, @pageTitle, @userAgent,
      @viewportWidth, @viewportHeight, @description, @type, @severity,
      @expectedBehavior, @screenshot, @video, @sessionReplay,
      @consoleLogs, @networkRequests, @performanceMetrics,
      @elementTag, @elementSelector, @elementHtml, @aiAnalysis
    )
    ON CONFLICT(id) DO UPDATE SET
      status = excluded.status,
      screenshot = excluded.screenshot,
      video = excluded.video,
      sessionReplay = excluded.sessionReplay,
      aiAnalysis = excluded.aiAnalysis
  `);
  stmt.run({
    id: report.id,
    timestamp: report.timestamp,
    status: report.status || 'pending',
    url: report.url || null,
    pageTitle: report.pageTitle || null,
    userAgent: report.userAgent || null,
    viewportWidth: report.viewport?.width || null,
    viewportHeight: report.viewport?.height || null,
    description: report.description,
    type: report.type,
    severity: report.severity,
    expectedBehavior: report.expectedBehavior || null,
    screenshot: report.screenshot || null,
    video: report.video || null,
    sessionReplay: report.sessionReplay ? JSON.stringify(report.sessionReplay) : null,
    consoleLogs: report.consoleLogs ? JSON.stringify(report.consoleLogs) : null,
    networkRequests: report.networkRequests ? JSON.stringify(report.networkRequests) : null,
    performanceMetrics: report.performanceMetrics ? JSON.stringify(report.performanceMetrics) : null,
    elementTag: report.element?.tag || null,
    elementSelector: report.element?.selector || null,
    elementHtml: report.element?.innerHTML || null,
    aiAnalysis: report.aiAnalysis ? JSON.stringify(report.aiAnalysis) : null,
  });
  return report.id;
}

function getReports(limit = 100, offset = 0) {
  const stmt = db.prepare(`
    SELECT * FROM reports
    ORDER BY createdAt DESC
    LIMIT ? OFFSET ?
  `);
  const rows = stmt.all(limit, offset);
  return rows.map(parseReport);
}

function getReportById(id) {
  const stmt = db.prepare('SELECT * FROM reports WHERE id = ?');
  const row = stmt.get(id);
  return row ? parseReport(row) : null;
}

function updateReportStatus(id, status) {
  const stmt = db.prepare('UPDATE reports SET status = ? WHERE id = ?');
  return stmt.run(status, id).changes > 0;
}

function deleteReport(id) {
  const stmt = db.prepare('DELETE FROM reports WHERE id = ?');
  return stmt.run(id).changes > 0;
}

function getStats() {
  const total = db.prepare('SELECT COUNT(*) as count FROM reports').get().count;
  const pending = db.prepare("SELECT COUNT(*) as count FROM reports WHERE status IN ('pending','analyzing')").get().count;
  const resolved = db.prepare("SELECT COUNT(*) as count FROM reports WHERE status IN ('resolved','rejected')").get().count;
  return { total, pending, resolved };
}

function parseReport(row) {
  return {
    ...row,
    viewport: row.viewportWidth && row.viewportHeight
      ? { width: row.viewportWidth, height: row.viewportHeight }
      : null,
    sessionReplay: safeJsonParse(row.sessionReplay),
    consoleLogs: safeJsonParse(row.consoleLogs),
    networkRequests: safeJsonParse(row.networkRequests),
    performanceMetrics: safeJsonParse(row.performanceMetrics),
    aiAnalysis: safeJsonParse(row.aiAnalysis),
    element: row.elementTag ? {
      tag: row.elementTag,
      selector: row.elementSelector,
      innerHTML: row.elementHtml,
    } : null,
  };
}

function safeJsonParse(str) {
  if (!str) return null;
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

module.exports = {
  saveReport,
  getReports,
  getReportById,
  updateReportStatus,
  deleteReport,
  getStats,
};
