# Decisions

- [2026-04] npm workspaces monorepo: the library (`packages/bug-detector`) ships 4 builds (vanilla CJS/ESM, React, Vue, IIFE) from one codebase via rollup; the cloud (`packages/bug-detector-cloud`) is a separate self-hosted package.
- [2026-04] Self-hosted first: ingest API with Express + better-sqlite3 (zero external services), optional `BUGDETECTOR_API_KEY` auth.
- [2026-07-19] Ingest API applies defaults for missing report fields instead of rejecting them — reports from older/custom SDK versions must never 500.
