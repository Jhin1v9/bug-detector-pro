# 🐛 BugDetector Pro

> **Developer-first bug reporting with AI.**  
> When a bug is reported, 8 AI expert personalities analyze it simultaneously — architect, UI/UX, performance, TypeScript, React, CSS, QA, and DX.

[![npm version](https://img.shields.io/npm/v/@auris/bug-detector.svg)](https://www.npmjs.com/package/@auris/bug-detector)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎥 **Session Replay** | Event-based replay of the last 30s before a bug (mouse, clicks, scroll, inputs) |
| 📸 **Screenshots** | Annotated screenshots with html2canvas — element or full page |
| 🧠 **8 AI Personalities** | Parallel AI analysis from 8 expert perspectives, consolidated into one diagnosis |
| 💬 **AI Chat** | Interactive chat about any bug report with context-aware responses |
| 🌐 **Console & Network** | Automatic capture of console logs and network requests |
| ⚡ **Performance Metrics** | Navigation timing, First Paint, FCP |
| 🔍 **DOM Inspector** | Hover-to-inspect with CSS/XPath selectors, computed styles, parent chain |
| 🔗 **Integrations** | GitHub Issues, Jira, Slack, Webhook, Cloud Dashboard |
| 🎨 **React UI** | Floating button, bug report modal, tracker panel, screenshot annotation canvas |
| 👤 **Guest Mode** | End-users can report bugs without accounts |
| 🏷️ **White-label** | Custom branding, colors, logo, positioning |
| ☁️ **Self-hosted Cloud** | Express + SQLite dashboard you can host yourself |

---

## 🚀 Quick Start

### React

```bash
npm install @auris/bug-detector
```

```tsx
import { useBugDetector } from '@auris/bug-detector/react';

function App() {
  const { isActive, toggle, reports } = useBugDetector({
    ai: {
      provider: 'kimi',
      apiKey: 'YOUR_KIMI_API_KEY',
      model: 'kimi-for-coding',
      baseURL: 'https://api.kimi.com/coding/v1',
    },
    integrations: {
      github: { repo: 'user/repo', token: 'ghp_xxx' },
      slack: { webhook: 'https://hooks.slack.com/...' },
    },
  });

  return (
    <div>
      <button onClick={toggle}>
        {isActive ? 'Deactivate' : 'Activate'} BugDetector
      </button>
      <p>{reports.length} bugs reported</p>
    </div>
  );
}
```

### Vanilla JS

```html
<script src="https://unpkg.com/@auris/bug-detector/dist/bug-detector.iife.js"></script>
<script>
  const detector = new BugDetector.BugDetector({
    ai: {
      provider: 'kimi',
      apiKey: 'YOUR_KIMI_API_KEY',
      model: 'kimi-for-coding',
      baseURL: 'https://api.kimi.com/coding/v1'
    }
  });
  detector.activate();
</script>
```

### Vue

```ts
import { createBugDetector } from '@auris/bug-detector/vue';

const detector = createBugDetector({
  ai: { provider: 'kimi', apiKey: 'YOUR_KIMI_API_KEY', model: 'kimi-for-coding' }
});
```

---

## 🧠 The 8 AI Personalities

When you report a bug, 8 specialists analyze it in parallel:

| Personality | Focus | Icon |
|-------------|-------|------|
| 🏗️ **Architect** | Code structure, design patterns, coupling | `architect` |
| 🎨 **UI/UX Expert** | Accessibility, visual consistency, feedback | `uiux` |
| ⚡ **Performance** | Render, memory leaks, bundle size | `performance` |
| 📘 **TypeScript** | Type safety, generics, inference | `typescript` |
| ⚛️ **React Specialist** | Hooks, state management, re-renders | `react` |
| 🎨 **CSS Expert** | Specificity, responsiveness, Tailwind | `css` |
| 🧪 **QA Engineer** | Testability, edge cases, coverage | `testing` |
| 🛠️ **DX Engineer** | Documentation, readability, tooling | `dx` |

Each personality returns insights, issues, and recommendations. A consolidator AI synthesizes everything into a single diagnosis with root cause and code fix.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    @auris/bug-detector                      │
├─────────────────────────────────────────────────────────────┤
│  CORE          │  Inspector │ BugDetector │ Config         │
│  CAPTURE       │  Screenshots │ Console │ Network │ Perf   │
│  REPLAY        │  SessionReplayEngine (30s buffer)          │
│  AI            │  IntelligenceEngine (8 personalities)      │
│  UI            │  React: Overlay, Modal, Panel, Canvas      │
│  INTEGRATIONS  │  GitHub │ Jira │ Slack │ CloudAPI        │
│  STORAGE       │  localStorage │ indexedDB │ API          │
│  EXPORT        │  Markdown │ JSON │ HTML │ PDF            │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Packages

| Package | Description | Path |
|---------|-------------|------|
| `@auris/bug-detector` | Core SDK + React UI + hooks | `packages/bug-detector` |
| `@auris/bug-detector-cloud` | Self-hosted dashboard (Express + SQLite) | `packages/bug-detector-cloud` |

---

## ☁️ Self-hosted Cloud Dashboard

```bash
cd packages/bug-detector-cloud
npm install
npm start
```

Dashboard runs at `http://localhost:3456`

API endpoints:
- `GET /api/health` — Health check
- `GET /api/reports` — List reports
- `POST /api/reports` — Create report
- `PATCH /api/reports/:id/status` — Update status

---

## 🔧 Configuration

```ts
interface BugDetectorConfig {
  trigger?: 'floating-button' | 'keyboard-shortcut' | 'manual';
  shortcut?: string;
  headless?: boolean;
  persistTo?: 'localStorage' | 'indexedDB' | 'api' | 'none';
  ai?: {
    provider: 'gemini' | 'openai' | 'deepseek' | 'kimi' | 'none';
    apiKey: string;
    model?: string;
    temperature?: number;
  };
  integrations?: {
    github?: { repo: string; token: string; labels?: string[] };
    jira?: { host: string; project: string; email: string; token: string };
    slack?: { webhook: string; channel?: string };
    cloud?: { baseURL: string };
  };
  capture?: {
    screenshot?: boolean;
    console?: boolean;
    network?: boolean;
    performance?: boolean;
  };
  branding?: {
    primaryColor?: string;
    logoURL?: string;
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  };
  guestMode?: boolean;
}
```

---

## 🛣️ Roadmap

See [ROADMAP.md](./ROADMAP.md) for the full evolution plan including:

- Video recording (MediaRecorder API)
- Auto error detection (window.onerror)
- Privacy masking engine
- Rage/dead click detection
- AI session summaries
- Heatmaps
- Team collaboration
- Real-time dashboard
- Mobile SDK (React Native, Flutter)

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

---

## 📄 License

MIT © Auris Team

---

<p align="center">
  Built with ❤️ for developers who debug like there's no tomorrow.
</p>
