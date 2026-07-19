# Changelog

- [2026-07-19] Cloud `db.js`: `saveReport` now defaults `timestamp` (now), `type` ('bug') and `severity` ('medium') when absent — POST /api/reports no longer crashes with `NOT NULL constraint failed: reports.timestamp` on minimal payloads.
- [2026-07-19] Library `NetworkMonitor.ts`: fixed fetch capture logic — with `captureSuccessful: false`, failed requests were captured even when `captureFailed: false`. Now `(captureSuccessful && ok) || (captureFailed && !ok)`, matching the XHR interceptor.
- [2026-07-19] Library `NetworkMonitor.ts`: `fetch(new Request(...))` logged URL as `"[object Request]"`; now reads `input.url` when input is a Request.
- [2026-07-19] Dashboard built for the first time in this clone (`dashboard/dist`); cloud server serves it at `/`.
