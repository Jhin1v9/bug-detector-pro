# ☁️ BugDetector Cloud

> Dashboard e API REST para centralizar reports do BugDetector Pro.

---

## 🚀 Quick Start

```bash
cd packages/bug-detector-cloud
npm install
npm run dev
```

Acesse:
- Dashboard: `http://localhost:3456`
- API: `http://localhost:3456/api`

---

## 📡 API Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/health` | Health check |
| GET | `/api/stats` | Estatísticas (total, pending, resolved) |
| GET | `/api/reports` | Listar reports |
| GET | `/api/reports/:id` | Detalhes de um report |
| POST | `/api/reports` | Criar report |
| PATCH | `/api/reports/:id/status` | Atualizar status |
| DELETE | `/api/reports/:id` | Remover report |

---

## 🏗️ Build do Dashboard

```bash
cd dashboard
npm install
npm run build
```

O Vite gera os arquivos estáticos em `dashboard/dist`, servidos automaticamente pelo Express.

---

## 🗄️ Banco de Dados

SQLite via `better-sqlite3`. O arquivo padrão é `data/reports.db`.

Para mudar o path:

```bash
DB_PATH=/path/to/db.db node server.js
```

---

## 🔧 Deploy em Produção

Recomenda-se usar um process manager como PM2:

```bash
npm install -g pm2
pm2 start server.js --name bug-detector-cloud
```

Variáveis de ambiente:
- `PORT` — porta do servidor (padrão: 3456)
- `DB_PATH` — caminho do banco SQLite

---

## 📄 Licença

MIT
