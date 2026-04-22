# Changelog

## [1.0.0] - 2026-04-16

### Fase 1 — Canvas de Anotações
- CanvasAnnotationEngine com retângulo, seta, blur/pixelização, texto e undo/redo
- ScreenshotAnnotationCanvas integrado ao BugReportModal
- Blur automático de dados sensíveis (senhas, CPF, email)
- Suporte vanilla no UIManager

### Fase 2 — Screen Recording
- ScreenRecorder com getDisplayMedia + MediaRecorder
- Gravação de até 10s com timer e preview
- Integração no modal React e vanilla
- Exportação de vídeo em base64 anexado ao report

### Fase 3 — Session Replay
- SessionReplayEngine com buffer circular de 30s
- Captura de mousemove, click, scroll, input, resize, navigation
- SessionReplayPlayer com cursor, timeline e controles de play/pause
- Exibição no painel de reports (expandir detalhes)

### Fase 4 — Cloud Dashboard MVP
- Backend Node.js + Express + SQLite
- API REST completa para reports e estatísticas
- Dashboard React com listagem, screenshot, vídeo e session replay
- CloudAPI client para envio automático de reports

### Fase 5 — White-label, Guest Mode e 2-way Sync
- BrandingConfig: primaryColor, backgroundColor, logoURL, position, buttonText
- Guest mode (painel simplificado sem lista de reports)
- 2-way sync com GitHub Issues (criar issue + sincronizar status open/closed)
- Botão de sincronização manual no BugTrackerPanel
