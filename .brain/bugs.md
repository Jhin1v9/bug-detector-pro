# Bugs

## Open

(none known)

## Resolved

- [2026-07-19] Cloud: POST /api/reports → HTTP 500 `NOT NULL constraint failed: reports.timestamp` when the client omitted timestamp/type/severity. Fixed with server-side defaults in `saveReport`.
- [2026-07-19] Library: inverted fetch-capture logic in `NetworkMonitor.interceptFetch` captured failures regardless of `captureFailed` when `captureSuccessful` was false.
- [2026-07-19] Library: fetch with a `Request` object recorded `"[object Request]"` as the URL instead of the real one.
