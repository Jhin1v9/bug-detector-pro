# Status — BugDetector Pro

## Current focus
Developer-first bug reporting library (widget + SDKs) with self-hosted cloud dashboard. Monorepo: `packages/bug-detector` (library: vanilla, React, Vue, IIFE builds) and `packages/bug-detector-cloud` (Express + SQLite ingest API + React dashboard).

## What's working
- Library builds clean: core (CJS/ESM), React adapter, Vue adapter, IIFE; `tsc --noEmit` passes
- Cloud ingest API: POST/GET/PATCH/DELETE `/api/reports`, stats, health — validated end-to-end on localhost:5201
- Dashboard builds (`tsc -b && vite build`) and is served by the cloud server
- Session replay, console capture, network monitor, DOM inspector, AI analysis hooks

## What's broken / pending
- No unit test suite in the library (e2e only) — regressions are caught by typecheck/build only
- XHR interception cannot be cleanly uninstalled (`stop()` restores fetch but not XMLHttpRequest — known limitation documented in code)
