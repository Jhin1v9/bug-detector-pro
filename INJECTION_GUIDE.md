# 🚀 Guia de Injeção BugDetector Pro

## Método 1 — Script Tag (Recomendado para projetos próprios)

```html
<script src="https://seu-cdn.com/bug-detector.iife.js"></script>
<script>
  BugDetector.init({
    shortcut: 'Ctrl+Shift+D',
    trigger: 'floating-button',
    branding: {
      primaryColor: '#06b6d4',
      position: 'bottom-right',
      buttonText: '🐛'
    },
    integrations: {
      cloud: { baseURL: 'https://seu-cloud.com' }
    }
  });
</script>
```

---

## Método 2 — Console (Para testar em qualquer site)

Abra o DevTools (F12), cole e execute:

```js
BugDetector.inject(
  'https://raw.githack.com/Jhin1v9/bug-detector-pro/main/packages/bug-detector/dist/bug-detector.iife.js',
  { trigger: 'floating-button' }
);
```

Ou se já tiver o script carregado:
```js
BugDetector.init({ shortcut: 'Ctrl+Shift+D' });
```

---

## Método 3 — Bookmarklet

Crie um favorito com este URL:

```javascript
javascript:(function(){if(window.__bugDetectorInjected)return;window.__bugDetectorInjected=true;var s=document.createElement('script');s.src='https://raw.githack.com/Jhin1v9/bug-detector-pro/main/packages/bug-detector/dist/bug-detector.iife.js';s.crossOrigin='anonymous';s.onload=function(){window.BugDetector&&window.BugDetector.init({trigger:'floating-button'});};document.head.appendChild(s);})();
```

Clique no favorito em qualquer página para ativar.

---

## Método 4 — React (Versão mais polida)

```tsx
import { BugDetectorProvider, BugDetectorFloatingButton } from '@auris/bug-detector/react';

function App() {
  return (
    <BugDetectorProvider config={{ shortcut: 'Ctrl+Shift+D' }}>
      <YourApp />
      <BugDetectorFloatingButton />
    </BugDetectorProvider>
  );
}
```

---

## Atalhos do Botão Flutuante

| Ação | Resultado |
|------|-----------|
| **Click** | Ativar / Desativar modo inspeção |
| **Shift + Click** | Abrir painel de reports |
| **Right Click** | Menu com Reports / Inspecionar / Configurações |

---

## Configurações Avançadas

```js
BugDetector.init({
  trigger: 'keyboard-shortcut',
  shortcut: 'Ctrl+Shift+D',
  headless: false,
  persistTo: 'localStorage',
  autoError: { enabled: true },
  privacy: { maskEmails: true, maskCreditCards: true },
  rageClick: { enabled: true },
  video: { maxDurationMs: 30000, quality: 'medium' },
  ai: {
    provider: 'gemini',
    apiKey: 'SUA_CHAVE',
    model: 'gemini-1.5-flash'
  },
  integrations: {
    github: { repo: 'owner/repo', token: 'ghp_xxx', labels: ['bug'] },
    cloud: { baseURL: 'http://localhost:3456' }
  },
  branding: {
    primaryColor: '#10b981',
    position: 'bottom-right',
    buttonText: 'Reportar Bug'
  },
  guestMode: false,
});
```

---

## API Programática (Vanilla)

```js
const bd = BugDetector.get();

// Ativar / desativar
bd.activate();
bd.deactivate();
bd.toggle();

// Inspecionar elemento específico
bd.inspectElement('#meu-botao');

// Criar report manualmente
bd.createReport({
  description: 'Botão não responde ao click',
  type: 'bug',
  severity: 'high'
});

// Exportar
bd.exportReport(reportId, { format: 'markdown' });

// Estatísticas
console.log(bd.getStats());
```
