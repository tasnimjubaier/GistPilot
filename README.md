# GistPilot — TiDB + Kimi (No Prisma)

A clean vertical slice using **Next.js** + **mysql2** (no ORM) storing everything in **TiDB**.  
LLM defaults to a **mock** for first-run success; switch to **Kimi** (or any OpenAI-compatible endpoint) via env.

## One-time setup
```bash
npm i
cp .env.example .env
# Fill DATABASE_URL (TiDB) and Kimi envs if you want real generation
npm run migrate     # creates tables in TiDB (idempotent)
npm run dev         # http://localhost:3000
```
If envs are missing, the app still boots and shows a setup notice.
The **mock** LLM generates deterministic sample content without network calls.

## Env (.env)
```
# TiDB connection string (MySQL protocol). Example:
# mysql://user:pass@host:4000/dbname?sslaccept=strict
DATABASE_URL=

# LLM provider: "mock" (default) or "kimi"
LLM_PROVIDER=mock

# For Kimi or any OpenAI-compatible endpoint:
LLM_BASE_URL=   # e.g., https://api.moonshot.cn/v1 (example; use your provider docs)
LLM_API_KEY=
LLM_MODEL=      # e.g., moonshot-v1-8k / k2-... (set per your provider)

# Optional embeddings (if your provider supports it). If not set, embeddings are skipped.
EMBED_BASE_URL=
EMBED_API_KEY=
EMBED_MODEL=
```

## SQL Storage (TiDB)
Tables created by `npm run migrate`:
- `courses` (topic, outline_json, status)
- `modules` (title, description, order, fk → course)
- `lessons` (title, content, order, fk → module, `embedding_json` JSON)

> We use JSON for embeddings for maximum compatibility. You can later migrate to TiDB VECTOR and add a KNN index.

## Endpoints
- `GET /api/health` — checks env & optionally DB connectivity
- `POST /api/course` — generate + store course
- `GET  /api/course/:id` — fetch course with modules & lessons

---

Generated: 2025-09-13T18:46:33.314271