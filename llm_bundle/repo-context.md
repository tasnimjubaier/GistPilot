# Repo Context Bundle

- Generated: 2025-09-14T17:31:53.127Z
- Node: v23.4.0
- Branch: main  Commit: c0eafe9
- Files included: 72

## Routes (heuristic)
- `/(public)`
- `/(public)/auth/login`
- `/(public)/docs`
- `/(public)/faq`
- `/(public)/pricing`
- `/app`
- `/app/create`
- `/course/[id]`

## File list
```
README.md
app/(public)/auth/login/page.tsx
app/(public)/docs/page.tsx
app/(public)/faq/page.tsx
app/(public)/layout.tsx
app/(public)/page.tsx
app/(public)/pricing/page.tsx
app/(public)/public.css
app/api/chat/route.ts
app/api/course/[id]/route.ts
app/api/course/route.ts
app/api/files/upload/route.ts
app/api/health/route.ts
app/api/outline/draft/route.ts
app/api/outline/iterate/route.ts
app/api/quiz/module/route.ts
app/app/app.css
app/app/create/page.tsx
app/app/create/wizard.css
app/app/layout.tsx
app/app/page.tsx
app/course/[id]/page.tsx
app/course/layout.tsx
app/course/viewer.css
app/globals.css
app/layout.tsx
components/app/AppShell.tsx
components/app/CourseCard.tsx
components/app/NewCourseButton.tsx
components/app/Topbar.tsx
components/course/InteractionProvider.tsx
components/course/InteractiveReader.tsx
components/course/RightRailTabs.tsx
components/course/panes/ChatPane.tsx
components/course/panes/NotesPane.tsx
components/course/panes/QuizPane.tsx
components/course/panes/SearchPane.tsx
components/public/FAQList.tsx
components/public/FooterPublic.tsx
components/public/Hero.tsx
components/public/NavbarPublic.tsx
components/public/PricingTable.tsx
components/wizard/FilePicker.tsx
components/wizard/IngestPicker.tsx
components/wizard/LevelSelect.tsx
components/wizard/OutlineEditor.tsx
components/wizard/OutlinePreview.tsx
components/wizard/ProgressModal.tsx
components/wizard/Stepper.tsx
components/wizard/Wizard.tsx
components/wizard/WizardV2.tsx
components/wizard/types.ts
estimate_loc.sh
next-env.d.ts
next.config.mjs
package.json
scripts/health.mjs
scripts/make-llm-bundle.mjs
scripts/migrate.mjs
src/actions/create-course.ts
src/data/courses.ts
src/data/list-courses.ts
src/lib/db.ts
src/lib/health.ts
src/lib/migrate.ts
src/lib/site.ts
src/lib/uuid.ts
src/llm/index.ts
src/llm/kimi.ts
src/llm/mock.ts
src/llm/types.ts
tsconfig.json
```



===== FILE: README.md (1765 bytes) =====
```md
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
```


===== FILE: app/(public)/auth/login/page.tsx (791 bytes) =====
```tsx
export default function LoginStubPage() {
  return (
    <main className="container section">
      <h2>Sign in</h2>
      <div className="card" style={{marginTop:12}}>
        <p className="small">
          This is a safe stub. Hook your auth provider here (Auth0 / Auth.js / custom).
        </p>
        <ol className="small" style={{paddingLeft:16}}>
          <li>Create your provider app (callback URL: <code>https://your-domain.com/api/auth/callback</code>).</li>
          <li>Add env vars in <code>.env</code>.</li>
          <li>Wire provider routes under <code>app/api/auth/*</code> and protect app pages.</li>
        </ol>
        <p className="small">
          For now, you can continue without signing in and try the app features.
        </p>
      </div>
    </main>
  )
}
```


===== FILE: app/(public)/docs/page.tsx (394 bytes) =====
```tsx
export default function DocsPage() {
  return (
    <main className="container section">
      <h2>Docs</h2>
      <div className="card" style={{marginTop:12}}>
        <p className="small">
          This is a placeholder for public docs. We’ll add guides for creating courses, refining outlines,
          search, quizzes, exports, and API usage.
        </p>
      </div>
    </main>
  )
}
```


===== FILE: app/(public)/faq/page.tsx (170 bytes) =====
```tsx
import FAQList from '../../../components/public/FAQList'

export default function FAQPage() {
  return (
    <main className="section">
      <FAQList/>
    </main>
  )
}
```


===== FILE: app/(public)/layout.tsx (376 bytes) =====
```tsx
import '../(public)/public.css'
import type { ReactNode } from 'react'
import NavbarPublic from '../../components/public/NavbarPublic'
import FooterPublic from '../../components/public/FooterPublic'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <NavbarPublic/>
      {children}
      <FooterPublic/>
    </div>
  )
}
```


===== FILE: app/(public)/page.tsx (706 bytes) =====
```tsx
import Hero from '../../components/public/Hero'

export default function LandingPage() {
  return (
    <main>
      <Hero/>
      <section className="container section grid-2">
        <div className="card">
          <h3>Why GistPilot?</h3>
          <p className="small">Ship courses faster: structured outlines, clean lessons, and tools to refine them.</p>
        </div>
        <div className="card">
          <h3>How it works</h3>
          <ol className="small" style={{paddingLeft:16}}>
            <li>Enter a topic & constraints</li>
            <li>Preview & edit the outline</li>
            <li>Generate lessons and quiz</li>
          </ol>
        </div>
      </section>
    </main>
  )
}
```


===== FILE: app/(public)/pricing/page.tsx (189 bytes) =====
```tsx
import PricingTable from '../../../components/public/PricingTable'

export default function PricingPage() {
  return (
    <main className="section">
      <PricingTable/>
    </main>
  )
}
```


===== FILE: app/(public)/public.css (2498 bytes) =====
```css
:root { --bg:#0b0f14; --fg:#e5e7eb; --muted:#9ca3af; --card:#0f1720; --border:#1f2937; --accent:#3b82f6; }
*{box-sizing:border-box}
body{background:var(--bg);color:var(--fg)}
a{color:var(--fg)}
.container{max-width:1100px;margin:0 auto;padding:0 16px}
.center{text-align:center}
.muted{color:var(--muted)}

.nav{position:sticky;top:0;z-index:30;background:rgba(11,15,20,.8);backdrop-filter:saturate(180%) blur(8px);border-bottom:1px solid var(--border)}
.nav-inner{display:flex;align-items:center;justify-content:space-between;height:56px}
.brand{font-weight:700;font-size:18px}
.nav-links a{margin:0 8px;padding:6px 8px;border-radius:8px}
.nav-links a.active{background:var(--card)}
.nav-cta .btn{margin-left:8px}

.footer{margin-top:64px;border-top:1px solid var(--border)}
.footer-inner{display:flex;align-items:center;justify-content:space-between;padding:24px 0}

.btn{display:inline-flex;align-items:center;gap:8px;border:1px solid var(--border);background:var(--card);color:var(--fg);padding:8px 14px;border-radius:10px;text-decoration:none}
.btn:hover{border-color:#334155}
.btn-primary{background:var(--accent);border-color:var(--accent);color:white}
.btn[disabled]{opacity:.6;cursor:not-allowed}

.hero{display:grid;grid-template-columns:1.2fr 1fr;gap:24px;align-items:center;padding:48px 0}
.hero-copy h1{font-size:36px;line-height:1.1;margin:0 0 12px}
.lead{color:var(--muted);font-size:16px}
.hero-actions .btn{margin-right:8px}
.hero-demo .demo-card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:16px}
.demo-title{font-weight:600;margin-bottom:8px}
.demo-body{color:var(--muted)}

.pricing{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:16px}
.price-card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:16px}
.price-card.featured{border-color:var(--accent)}
.price-title{font-weight:600;margin-bottom:6px}
.price-amount{font-size:32px;font-weight:800;margin-bottom:8px}
.price-features{margin:8px 0 16px;padding-left:16px}
.price-features li{margin-bottom:6px}

.faq-list{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:16px}
.faq{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:12px}
summary{cursor:pointer;font-weight:600}

.section{padding:32px 0}
.card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:16px}
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.small{font-size:12px;color:var(--muted)}
```


===== FILE: app/api/chat/route.ts (1082 bytes) =====
```ts
import { NextResponse } from 'next/server'
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import type { ChatMessage } from '../../../src/llm/types'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const messages: ChatMessage[] = Array.isArray(body?.messages) ? body.messages : []

    const { getProvider } = await import('../../../src/llm')
    const provider = getProvider()

    // Prefer real chat(); fallback to a quick single-turn prompt using generateLesson as a last resort.
    let reply = ''
    if (provider.chat) {
      reply = await provider.chat(messages)
      console.log(reply)
    } else {
      const q = messages.filter(m => m.role === 'user').slice(-1)[0]?.content || ''
      reply = await provider.generateLesson('Q&A', 'Answer', q)
    }

    // console.log(reply)

    return NextResponse.json({ reply }, { status: 200 })
  } catch (e: any) {
    console.error('[chat] error', e)
    return NextResponse.json({ reply: `Error: ${e?.message || e}` }, { status: 200 })
  }
}

```


===== FILE: app/api/course/[id]/route.ts (591 bytes) =====
```ts
// app/api/course/[id]/route.ts
import { NextResponse } from 'next/server'
import { getCourseWithContent } from '../../../../src/data/courses'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const res = await getCourseWithContent(params.id)
    if (!res.ok) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(res, { status: 200 })
  } catch (e: any) {
    console.error('[GET /api/course/:id] error:', e)
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 })
  }
}

```


===== FILE: app/api/course/route.ts (1130 bytes) =====
```ts
// app/api/course/route.ts
import { NextResponse } from 'next/server'
import { createCourse } from '../../../src/actions/create-course'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req: Request) {
  console.log('received a request')
  try {
    const body = await req.json().catch(() => ({}))
    const topic = typeof body?.topic === 'string' ? body.topic.trim() : ''
    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }
    console.log('creating course', topic)
    const res = await createCourse(topic)
    console.log('course created')
    if (!res.ok) {
      const status = res.status ?? 500
      return NextResponse.json({ error: res.error ?? 'Failed to create course' }, { status })
    }

    return NextResponse.json({ id: res.id }, { status: 200 })
  } catch (e: any) {
    // Log to server console so you can see the real stack in your terminal
    console.error('[POST /api/course] Unhandled error:', e)
    return NextResponse.json(
      { error: e?.message ?? 'Unexpected error' },
      { status: 500 },
    )
  }
}

```


===== FILE: app/api/files/upload/route.ts (4881 bytes) =====
```ts
// app/api/files/upload/route.ts
import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { getPool } from '../../../../src/lib/db'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// --- Types ---
type DocRow = { id: string; name: string; mime: string; bytes: number; text: string; sha256: string }

// --- Schema bootstrap ---
async function ensureTables() {
  const pool = getPool()
  await pool.query(`
    CREATE TABLE IF NOT EXISTS documents (
      id CHAR(32) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      mime VARCHAR(128) NULL,
      bytes BIGINT NOT NULL,
      sha256 CHAR(64) NOT NULL,
      text LONGTEXT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) /*T! */;
  `)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS document_chunks (
      id BIGINT PRIMARY KEY AUTO_RANDOM,
      document_id CHAR(32) NOT NULL,
      seq INT NOT NULL,
      content MEDIUMTEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX (document_id, seq),
      CONSTRAINT fk_doc FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
    ) /*T! */;
  `)
}

// --- Utilities ---
function chunk(text: string, size = 1800, overlap = 200) {
  // defensive: keep sane values
  size = Math.max(200, Math.min(4000, size))
  overlap = Math.max(0, Math.min(size - 1, overlap))

  const out: { seq: number; content: string }[] = []
  if (!text) return [{ seq: 0, content: '' }]

  let i = 0, seq = 0
  while (i < text.length) {
    const end = Math.min(text.length, i + size)
    out.push({ seq: seq++, content: text.slice(i, end) })
    if (end >= text.length) break
    i = Math.max(0, end - overlap)
    if (i <= 0 && end >= text.length) break
  }
  return out
}

async function tryExtractPDF(buf: Buffer): Promise<string | null> {
  try {
    // optional dep
    // @ts-ignore
    const pdfParse = (await import('pdf-parse')).default || (await import('pdf-parse'))
    const res = await pdfParse(buf)
    return (res?.text || '').trim() || null
  } catch { return null }
}

async function tryExtractDOCX(buf: Buffer): Promise<string | null> {
  try {
    // optional dep
    // @ts-ignore
    const mammoth = await import('mammoth')
    const res = await (mammoth as any).extractRawText({ buffer: buf })
    return (res?.value || '').trim() || null
  } catch { return null }
}

function looksTextual(mime: string | null, name: string) {
  if (!mime) return /\.(txt|md|csv|json|js|ts|tsx|jsx|py|java|c|cpp|go|rs|rb|php|cs|sh|html|css|xml|yml|yaml|tex)$/i.test(name)
  return /^text\/|\/json$|\/xml$/.test(mime) || /(javascript|typescript)/i.test(mime)
}

// --- Route ---
export async function POST(req: Request) {
  try {
    await ensureTables()
    const fd = await req.formData()

    const files: File[] = []
    for (const [, v] of fd.entries()) if (v instanceof File) files.push(v)
    if (files.length === 0) {
      return NextResponse.json({ error: 'No files found in form-data' }, { status: 400 })
    }

    const pool = getPool()
    const results: { id: string; name: string; bytes: number }[] = []

    for (const f of files) {
      const buf = Buffer.from(await f.arrayBuffer())
      const sha256 = crypto.createHash('sha256').update(buf).digest('hex')
      const id = crypto.randomUUID().replace(/-/g, '')
      const mime = f.type || ''
      const name = f.name || 'file'

      let text = ''
      if (looksTextual(mime, name)) {
        text = buf.toString('utf8')
      } else if (/\.pdf$/i.test(name) || /application\/pdf/i.test(mime)) {
        text = (await tryExtractPDF(buf)) || '[PDF uploaded – text extraction not enabled]'
      } else if (/\.docx$/i.test(name) || /officedocument\.wordprocessingml\.document/i.test(mime)) {
        text = (await tryExtractDOCX(buf)) || '[DOCX uploaded – text extraction not enabled]'
      } else {
        const guess = buf.toString('utf8')
        text = guess && /[ -~\s]+/.test(guess) ? guess : '[Binary file uploaded – text extraction not enabled]'
      }

      // Save document
      await pool.query(
        `INSERT INTO documents (id, name, mime, bytes, sha256, text) VALUES (?, ?, ?, ?, ?, ?)`,
        [id, name, mime || null, buf.byteLength, sha256, text]
      )

      // Save chunks (sequential insert; avoids VALUES ? issues)
      const chunks = chunk(text).slice(0, 500) // hard cap for safety
      for (const c of chunks) {
        await pool.query(
          `INSERT INTO document_chunks (document_id, seq, content) VALUES (?, ?, ?)`,
          [id, c.seq, c.content]
        )
      }

      results.push({ id, name, bytes: buf.byteLength })
    }

    return NextResponse.json({ ok: true, files: results }, { status: 200 })
  } catch (e: any) {
    console.error('[files/upload] error', e)
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 })
  }
}

```


===== FILE: app/api/health/route.ts (222 bytes) =====
```ts
import { dbHealth } from '../../../src/lib/health'

export async function GET() {
  const info = await dbHealth(true)
  return new Response(JSON.stringify(info), {
    headers: { 'Content-Type': 'application/json' }
  })
}
```


===== FILE: app/api/outline/draft/route.ts (2624 bytes) =====
```ts
import { NextResponse } from 'next/server'
import { getPool } from '../../../../src/lib/db'

// Local Outline type
type Outline = { title?: string; modules?: { title: string; lessons?: { title: string }[] }[] }

async function getProvider() {
  try {
    // @ts-ignore
    const mod = await import('../../../../src/llm')
    if ((mod as any).getProvider) return (mod as any).getProvider()
  } catch {}
  return {
    async generateOutline(topic: string): Promise<Outline> {
      const base = topic.replace(/\n+/g, ' ').slice(0, 120) || 'Course'
      return {
        title: `Intro to ${base}`,
        modules: Array.from({ length: 4 }).map((_, i) => ({
          title: `Module ${i+1}: ${base}`,
          lessons: Array.from({ length: 3 }).map((__, j) => ({ title: `${base} ${i+1}.${j+1}` })),
        })),
      }
    },
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const topic = (body?.topic || '').toString().trim()
    const level = (body?.level || 'core').toString()
    const fileIds: string[] = Array.isArray(body?.fileIds) ? body.fileIds : []

    if (!topic && fileIds.length === 0) {
      return NextResponse.json({ error: 'Provide a topic or at least one file.' }, { status: 400 })
    }

    // Pull context from TiDB (chunks) for the selected files
    let context = ''
    if (fileIds.length) {
      const pool = getPool()
      const [rows] = await pool.query(
        `SELECT content FROM document_chunks WHERE document_id IN (?) ORDER BY document_id, seq LIMIT 200`,
        [fileIds]
      )
      const texts = (rows as any[]).map(r => r.content as string)
      context = texts.join('\n\n').slice(0, 40_000) // keep prompt reasonable
    }

    const depthHintMap: Record<string, string> = {
      essentials: 'Intuitive, examples-first, minimal notation.',
      core: 'Balance intuition and formalism; include key proofs when helpful.',
      rigorous: 'Full mathematical rigor; proofs and derivations.',
      frontier: 'Research-oriented; recent advances and open problems.',
    }
    const depthHint = depthHintMap[level] ?? ''

    const provider = await getProvider()
    const title = topic || 'Materials'
    const prompt = `${title}\n\n${context}\n\nConstraints: ${depthHint}\nIf materials are provided, base the outline on them.`

    const outline = await provider.generateOutline(prompt)
    return NextResponse.json({ outline }, { status: 200 })
  } catch (e: any) {
    console.error('[POST /api/outline/draft]', e)
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 })
  }
}

```


===== FILE: app/api/outline/iterate/route.ts (1883 bytes) =====
```ts
import { NextResponse } from 'next/server'

// Local Outline type
type Outline = { title?: string; modules?: { title: string; lessons?: { title: string }[] }[] }

async function getProvider() {
  try {
    // @ts-ignore (optional runtime import; OK if src/llm is missing)
    const mod = await import('../../../../src/llm')
    if ((mod as any).getProvider) return (mod as any).getProvider()
  } catch {}
  return {
    async generateOutline(topic: string): Promise<Outline> {
      return { title: topic.slice(0, 140) || 'Course', modules: [] }
    },
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const topic = (body?.topic || '').toString().trim()
    const level = (body?.level || 'core').toString()
    const outline = body?.outline as Outline | undefined
    const comments = (body?.comments || '').toString()

    if (!outline) return NextResponse.json({ error: 'Missing outline' }, { status: 400 })

    const depthHintMap: Record<string, string> = {
      essentials: 'Keep intuitive; minimize notation.',
      core: 'Balance formalism and intuition.',
      rigorous: 'Increase rigor; proofs & derivations.',
      frontier: 'Include latest research and open questions.',
    }
    const depthHint = depthHintMap[level] ?? ''

    const provider = await getProvider()
    const prompt =
      (outline.title || topic || 'Course') +
      `\n\nRefine the outline based on comments: ${comments}\n` +
      `Keep JSON shape: title; modules[].title; modules[].lessons[].title.\n` +
      `Depth: ${depthHint}`

    const refined = await provider.generateOutline(prompt)
    return NextResponse.json({ outline: refined }, { status: 200 })
  } catch (e: any) {
    console.error('[POST /api/outline/iterate]', e)
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 })
  }
}

```


===== FILE: app/api/quiz/module/route.ts (1321 bytes) =====
```ts
import { NextResponse } from 'next/server'
type Q = { q: string; a: string[]; correct: number }

async function getProvider() {
  try {
    // @ts-ignore optional
    const mod = await import('../../../../src/llm')
    if ((mod as any).getProvider) return (mod as any).getProvider()
  } catch {}
  return {
    async quiz(topic: string): Promise<Q[]> {
      return Array.from({ length: 5 }).map((_, i) => ({
        q: `Sample question ${i+1} about ${topic}`,
        a: ['Option A', 'Option B', 'Option C', 'Option D'],
        correct: i % 4,
      }))
    }
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(()=>({}))
    const moduleTitle = (body?.moduleTitle || 'this module').toString()
    const provider = await getProvider()
    const quizFn = (provider as any).quiz
    const questions: Q[] = quizFn ? await quizFn(moduleTitle)
      : Array.from({ length: 5 }).map((_, i) => ({
          q: `Sample question ${i+1} about ${moduleTitle}`,
          a: ['Option A', 'Option B', 'Option C', 'Option D'],
          correct: i % 4,
        }))
    return NextResponse.json({ questions }, { status: 200 })
  } catch (e:any) {
    console.error('[quiz/module] error', e)
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 })
  }
}

```


===== FILE: app/app/app.css (2512 bytes) =====
```css

:root { --bg:#0b0f14; --fg:#e5e7eb; --muted:#9ca3af; --card:#0f1720; --border:#1f2937; --accent:#3b82f6; }
.app-shell { display:grid; grid-template-columns: 240px 1fr; min-height: 100dvh; background: var(--bg); color: var(--fg); }
.sidebar { border-right:1px solid var(--border); padding:16px; position:sticky; top:0; height:100dvh; }
.brand { font-weight:700; margin-bottom:16px; display:block; text-decoration:none; color:var(--fg); }
.nav-sec { margin-top:16px; font-size:12px; color:var(--muted); text-transform:uppercase; letter-spacing:.06em }
.nav-list { margin-top:8px; display:grid; gap:4px }
.nav-list a { padding:8px 10px; border-radius:8px; color:var(--fg); text-decoration:none; display:block }
.nav-list a:hover { background:#111827; }
.content { padding:20px; }
.topbar { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px }
.search { flex:1; max-width:420px; background:#0d1520; border:1px solid var(--border); color:var(--fg); padding:8px 12px; border-radius:10px }
.user { font-size:12px; color:var(--muted) }

.grid { display:grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap:12px }
.card { background:var(--card); border:1px solid var(--border); border-radius:12px; padding:12px }
.badge { display:inline-block; font-size:11px; border:1px solid var(--border); border-radius:999px; padding:2px 8px; margin-left:6px }
.badge.ready { border-color:#22c55e; color:#22c55e }
.badge.pending { border-color:#f59e0b; color:#f59e0b }
.badge.failed { border-color:#ef4444; color:#ef4444 }

.btn { display:inline-flex; align-items:center; gap:8px; border:1px solid var(--border); background:#111827; color:#fff; padding:8px 12px; border-radius:10px; text-decoration:none }
.btn:hover { border-color:#334155 }
.btn.secondary { background:#0b0f14; color:var(--fg) }

.empty { border:1px dashed var(--border); border-radius:12px; padding:24px; text-align:center; color:var(--muted) }

.dialog-backdrop { position:fixed; inset:0; background:rgba(0,0,0,.5); display:flex; align-items:center; justify-content:center }
.dialog { background:#0f1720; border:1px solid var(--border); border-radius:14px; padding:16px; width:420px }
.input, .select { width:100%; margin-top:6px; background:#0d1520; border:1px solid var(--border); color:var(--fg); padding:8px 10px; border-radius:8px }
.row { display:grid; grid-template-columns:1fr 1fr; gap:8px }
.actions { display:flex; gap:8px; justify-content:flex-end; margin-top:12px }
.small { color:var(--muted); font-size:12px }

```


===== FILE: app/app/create/page.tsx (295 bytes) =====
```tsx
// app/app/create/page.tsx
'use client'

import '../create/wizard.css'
import CreateWizardV2 from '../../../components/wizard/WizardV2'

export default function CreatePage() {
  return (
    <div>
      <h2 style={{marginBottom:8}}>Create a Course</h2>
      <CreateWizardV2 />
    </div>
  )
}

```


===== FILE: app/app/create/wizard.css (2793 bytes) =====
```css

.wiz { color: var(--fg, #e5e7eb); }
.wiz .stepper { display:flex; gap:8px; margin:8px 0 16px; flex-wrap:wrap }
.wiz .chip { padding:6px 10px; border:1px solid var(--border,#1f2937); border-radius:999px; font-size:12px; opacity:.7 }
.wiz .chip.active { background:#111827; opacity:1 }
.wiz .panel { background:var(--card,#0f1720); border:1px solid var(--border,#1f2937); border-radius:12px; padding:12px; margin-bottom:12px }
.wiz .row { display:grid; grid-template-columns:1fr 1fr; gap:8px }
.wiz .input, .wiz .select, .wiz textarea { width:100%; background:#0d1520; border:1px solid var(--border,#1f2937); color:var(--fg,#e5e7eb); padding:8px 10px; border-radius:8px }
.wiz .hint { font-size:12px; color:var(--muted,#9ca3af) }
.wiz .btn { display:inline-flex; align-items:center; gap:8px; border:1px solid var(--border,#1f2937); background:#111827; color:#fff; padding:8px 12px; border-radius:10px; text-decoration:none }
.wiz .btn.secondary { background:#0b0f14; color:var(--fg,#e5e7eb) }
.wiz .actions { display:flex; gap:8px; justify-content:flex-end; margin-top:12px }
.wiz .grid { display:grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap:8px }
.wiz .module { background:#0b111a; border:1px solid #1b2636; border-radius:10px; padding:10px }
.wiz .module h4 { margin:0 0 6px; font-size:14px }
.wiz .les { display:grid; gap:6px }
.wiz .les input { width:100% }
.wiz .modalbk { position:fixed; inset:0; background:rgba(0,0,0,.55); display:flex; align-items:center; justify-content:center; z-index:50 }
.wiz .modal { background:#0f1720; border:1px solid var(--border,#1f2937); border-radius:12px; padding:16px; width:460px }
.wiz progress { width:100%; height:10px }

/* app/app/create/wizard.css */
.wiz { color: var(--fg, #e5e7eb); }
.wiz .stepper { display:flex; gap:8px; margin:8px 0 16px; flex-wrap:wrap }
.wiz .chip { padding:6px 10px; border:1px solid var(--border,#1f2937); border-radius:999px; font-size:12px; opacity:.7 }
.wiz .chip.active { background:#111827; opacity:1 }
.wiz .panel { background:var(--card,#0f1720); border:1px solid var(--border,#1f2937); border-radius:12px; padding:12px; margin-bottom:12px }
.wiz .input, .wiz .select, .wiz textarea { width:100%; background:#0d1520; border:1px solid var(--border,#1f2937); color:var(--fg,#e5e7eb); padding:8px 10px; border-radius:8px }
.wiz .btn { display:inline-flex; align-items:center; gap:8px; border:1px solid var(--border,#1f2937); background:#111827; color:#fff; padding:8px 12px; border-radius:10px; text-decoration:none }
.wiz .btn.secondary { background:#0b0f14; color:var(--fg,#e5e7eb) }
.wiz .actions { display:flex; gap:8px; justify-content:flex-end; margin-top:12px }
.wiz .module { background:#0b111a; border:1px solid #1b2636; border-radius:10px; padding:10px }
.wiz .les { display:grid; gap:6px }

```


===== FILE: app/app/layout.tsx (300 bytes) =====
```tsx

import type { ReactNode } from 'react'
import AppShell from '../../components/app/AppShell'
import Topbar from '../../components/app/Topbar'

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell>
      <Topbar />
      {children}
    </AppShell>
  )
}

```


===== FILE: app/app/page.tsx (802 bytes) =====
```tsx

import { listCourses } from '../../src/data/list-courses'
import CourseCard from '../../components/app/CourseCard'
import NewCourseButton from '../../components/app/NewCourseButton'

export default async function DashboardPage() {
  const courses = await listCourses(24, 0)

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:12}}>
        <h2 style={{margin:0}}>My Courses</h2>
        <NewCourseButton />
      </div>

      {courses.length === 0 ? (
        <div className="empty">
          No courses yet. Click <b>New course</b> to create your first one.
        </div>
      ) : (
        <div className="grid">
          {courses.map((c:any) => <CourseCard key={c.id} c={c} />)}
        </div>
      )}
    </div>
  )
}

```


===== FILE: app/course/[id]/page.tsx (1627 bytes) =====
```tsx
import { getCourseWithContent } from '../../../src/data/courses'
import '../../course/viewer.css'
import InteractionProvider from '../../../components/course/InteractionProvider'
import InteractiveReader from '../../../components/course/InteractiveReader'
import RightRailTabs from '../../../components/course/RightRailTabs'


export default async function CoursePage({ params }: { params: { id: string } }) {
  const res = await getCourseWithContent(params.id)

  const courseId = params.id
  const { course, modules } = res
  // adapt to your data shape if different:
  // const course = res.data ?? res.course ?? {}
  const firstModule = course.modules?.[0] ?? {}
  const firstLesson = firstModule.lessons?.[0] ?? {}

  const currentLessonId = firstLesson.id ?? 'lesson-1'
  const currentModuleTitle = firstModule.title ?? 'Module 1'

  if (!res.ok) {
    return <div className="card">Course not found.</div>
  }
  
  return (
    <InteractionProvider>
      <div className="viewer">
        <aside className="pane left">
          {/* keep your existing outline tree */}
        </aside>
    
        <section className="pane center">
            <InteractiveReader>
              {/* render your current lesson content exactly as before */}
            </InteractiveReader>
        </section>
    
        <aside className="pane right">
          <RightRailTabs
            courseId={courseId}
            lessonId={currentLessonId}         // pass your real lesson id
            moduleTitle={currentModuleTitle}   // pass current module title
            />
        </aside>
      </div>
    </InteractionProvider>
  )
}
```


===== FILE: app/course/layout.tsx (235 bytes) =====
```tsx
// app/course/layout.tsx
export default function CourseLayout({ children }: { children: React.ReactNode }) {
    return (
      <div className="fixed inset-0 bg-background text-foreground">
        {children}
      </div>
    );
  }
  
```


===== FILE: app/course/viewer.css (2058 bytes) =====
```css
.viewer { display:grid; grid-template-columns: 280px 1fr 360px; min-height: calc(100dvh - 60px); gap: 12px; }
.pane { background:#0f1720; border:1px solid #1f2937; border-radius:12px; }
.left { padding:10px; }
.center { position:relative; padding:18px 18px 40px; overflow:auto; }
.right { padding:10px; }

.reader { color:#e5e7eb; line-height:1.6; }
.reader h1,h2,h3,h4 { margin:16px 0 8px; }
.reader code { background:#0b111a; border:1px solid #1b2636; border-radius:6px; padding:2px 4px; }
.reader pre { background:#0b111a; border:1px solid #1b2636; border-radius:8px; padding:12px; overflow:auto }

.selbar { position:sticky; top:0; left:0; right:0; z-index:20; display:flex; gap:8px;
  background:#0b0f14dd; border:1px solid #1f2937; border-top-left-radius:0; border-top-right-radius:0; border-bottom-left-radius:10px; border-bottom-right-radius:10px;
  padding:8px 10px; backdrop-filter: blur(6px); align-items:center; }
.selbar .txt { flex:1; color:#9ca3af; font-size:12px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis }
.btn { display:inline-flex; align-items:center; gap:6px; border:1px solid #1f2937; background:#111827; color:#fff; padding:6px 10px; border-radius:8px; text-decoration:none }
.btn.secondary { background:#0b0f14; color:#e5e7eb }
.tabbar { display:flex; gap:6px; margin-bottom:8px }
.tabbar button { padding:6px 10px; border:1px solid #1f2937; background:#0b0f14; color:#e5e7eb; border-radius:8px }
.tabbar button[aria-selected="true"] { background:#1e293b; border-color:#334155 }
.chat { display:flex; flex-direction:column; height:100% }
.chat .log { flex:1; overflow:auto; padding:8px; display:grid; gap:8px }
.chat .msg { background:#0b111a; border:1px solid #1b2636; border-radius:8px; padding:8px; }
.chat form { display:flex; gap:8px; }
.chat textarea { flex:1; background:#0d1520; border:1px solid #1f2937; color:#e5e7eb; border-radius:8px; padding:8px }
.quiz .q { margin-bottom:10px; padding:8px; border:1px solid #1f2937; border-radius:8px; background:#0b111a }
.quiz .opt { display:block; margin-top:6px }

```


===== FILE: app/globals.css (590 bytes) =====
```css
:root { color-scheme: light; }
body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'; }
h1, h2, h3 { margin: 0.5rem 0; }
input, button { font: inherit; }
a { color: #2563eb; text-decoration: none; }
a:hover { text-decoration: underline; }
.card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; background: white; }
.err { color: #b91c1c; }
.mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
small.hint { color: #6b7280; }
```


===== FILE: app/layout.tsx (340 bytes) =====
```tsx
import './globals.css'
import type { ReactNode } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{margin:0}}>
        <div style={{maxWidth:960, margin:'0 auto', padding:'16px'}}>
          {children}
        </div>
      </body>
    </html>
  )
}
```


===== FILE: components/app/AppShell.tsx (933 bytes) =====
```tsx

'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import '../../app/app/app.css'

const nav = [
  { href: '/app', label: 'Dashboard' },
  { href: '/app/create', label: 'Create' },
  { href: '/app/library', label: 'Library' },
  { href: '/app/settings', label: 'Settings' },
]

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link href="/app" className="brand">GistPilot</Link>
        <div className="nav-sec">Navigate</div>
        <div className="nav-list">
          {nav.map(n => (
            <Link key={n.href} href={n.href} aria-current={pathname === n.href ? 'page' : undefined}>
              {n.label}
            </Link>
          ))}
        </div>
      </aside>
      <main className="content">{children}</main>
    </div>
  )
}

```


===== FILE: components/app/CourseCard.tsx (1018 bytes) =====
```tsx

import Link from 'next/link'

export type CourseMeta = {
  id: string
  topic: string
  status: 'PENDING' | 'READY' | 'FAILED'
  updated_at?: string
  modules?: number
  lessons?: number
}

export default function CourseCard({ c }: { c: CourseMeta }) {
  return (
    <div className="card">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
        <h3 style={{margin:0, fontSize:16}}>{c.topic}</h3>
        <span className={`badge ${c.status.toLowerCase()}`}>{c.status}</span>
      </div>
      <div className="small" style={{marginTop:6}}>
        {typeof c.modules === 'number' ? `${c.modules} modules` : ''}
        {typeof c.lessons === 'number' ? ` • ${c.lessons} lessons` : ''}
      </div>
      <div className="actions" style={{justifyContent:'space-between', marginTop:12}}>
        <Link className="btn" href={`/course/${c.id}`}>Open</Link>
        <span className="small">{c.updated_at?.slice(0,19).replace('T',' ') || ''}</span>
      </div>
    </div>
  )
}

```


===== FILE: components/app/NewCourseButton.tsx (1931 bytes) =====
```tsx

'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewCourseButton() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [topic, setTopic] = useState('Basics of Probability')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function create() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || 'Failed to create course')
      setOpen(false)
      router.push(`/course/${data.id}`)
    } catch (e:any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button className="btn" onClick={() => setOpen(true)}>New course</button>
      {open && (
        <div className="dialog-backdrop" onClick={() => !loading && setOpen(false)}>
          <div className="dialog" onClick={(e)=>e.stopPropagation()}>
            <h3 style={{marginTop:0}}>Create a new course</h3>
            <label>
              <div className="small">Topic</div>
              <input className="input" value={topic} onChange={e=>setTopic(e.target.value)} placeholder="e.g., Linear Algebra" />
            </label>
            {error && <div className="small" style={{color:'#ef4444', marginTop:6}}>{error}</div>}
            <div className="actions">
              <button className="btn secondary" onClick={()=>!loading && setOpen(false)} disabled={loading}>Cancel</button>
              <button className="btn" onClick={create} disabled={loading}>{loading ? 'Creating…' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

```


===== FILE: components/app/Topbar.tsx (237 bytes) =====
```tsx

'use client'

export default function Topbar() {
  return (
    <div className="topbar">
      <input className="search" placeholder="Search (⌘K) — coming soon" />
      <div className="user">Signed in (stub)</div>
    </div>
  )
}

```


===== FILE: components/course/InteractionProvider.tsx (1305 bytes) =====
```tsx
'use client'
import { createContext, useContext, useRef, useState } from 'react'

type Bridge = { prefillAndFocus: (text: string) => void; setPrefillHandler: (fn: (text: string) => void) => void }
const ChatBridgeContext = createContext<Bridge | null>(null)
export function useChatBridge(){ const c = useContext(ChatBridgeContext); if(!c) throw new Error('useChatBridge outside provider'); return c }

type Sel = { text: string } | null
const SelectionContext = createContext<{ selection: Sel; clear: ()=>void; set: (s: Sel)=>void } | null>(null)
export function useSelection(){ const c = useContext(SelectionContext); if(!c) throw new Error('useSelection outside provider'); return c }

export default function InteractionProvider({ children }: { children: React.ReactNode }){
  const [selection, setSelection] = useState<Sel>(null)
  const handlerRef = useRef<(text: string) => void>(() => {})
  const bridge: Bridge = {
    prefillAndFocus: (text) => handlerRef.current?.(text),
    setPrefillHandler: (fn) => { handlerRef.current = fn },
  }
  return (
    <ChatBridgeContext.Provider value={bridge}>
      <SelectionContext.Provider value={{ selection, set: setSelection, clear: ()=>setSelection(null) }}>
        {children}
      </SelectionContext.Provider>
    </ChatBridgeContext.Provider>
  )
}

```


===== FILE: components/course/InteractiveReader.tsx (1371 bytes) =====
```tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import { useSelection, useChatBridge } from './InteractionProvider'

export default function InteractiveReader({ children }: { children?: React.ReactNode }){
  const ref = useRef<HTMLDivElement>(null)
  const { selection, set, clear } = useSelection()
  const bridge = useChatBridge()
  const [localSel, setLocalSel] = useState('')

  useEffect(() => {
    const el = ref.current
    if (!el) return
    function onUp(){
      const sel = window.getSelection()
      if (!sel) return
      const text = sel.toString().trim()
      if (text && el?.contains(sel.anchorNode) && text.length > 3) {
        set({ text }); setLocalSel(text)
      } else set(null)
    }
    el.addEventListener('mouseup', onUp)
    return () => el.removeEventListener('mouseup', onUp)
  }, [set])

  function askAI(){
    if (!selection?.text) return
    bridge.prefillAndFocus(`> ${selection.text}\n\n`)
    clear()
  }

  return (
    <div className="reader" ref={ref}>
      {selection && (
        <div className="selbar">
          <div className="txt">Selected: {localSel.slice(0,120)}{localSel.length>120?'…':''}</div>
          <button className="btn" onClick={askAI}>Ask AI</button>
          <button className="btn secondary" onClick={clear}>Dismiss</button>
        </div>
      )}
      {children}
    </div>
  )
}

```


===== FILE: components/course/RightRailTabs.tsx (1133 bytes) =====
```tsx
'use client'
import { useState } from 'react'
import ChatPane from './panes/ChatPane'
import SearchPane from './panes/SearchPane'
import QuizPane from './panes/QuizPane'
import NotesPane from './panes/NotesPane' 

type Tab = 'search'|'quiz'|'notes'|'chat'
const TABS: { key: Tab; label: string }[] = [
  { key:'search', label:'Search' },
  { key:'quiz', label:'Quiz' },
  { key:'notes', label:'Notes' },
  { key:'chat', label:'Chat' },
]

export default function RightRailTabs({ courseId, lessonId, moduleTitle }:
  { courseId: string; lessonId?: string; moduleTitle?: string }){
  const [tab, setTab] = useState<Tab>('search')
  return (
    <div className="right pane">
      <div className="tabbar">
        {TABS.map(t => <button key={t.key} onClick={()=>setTab(t.key)} aria-selected={tab===t.key}>{t.label}</button>)}
      </div>
      {tab==='search' && <SearchPane />}
      {tab==='quiz' && <QuizPane courseId={courseId} moduleTitle={moduleTitle} />}
      {tab==='notes' && <NotesPane courseId={courseId} lessonId={lessonId} />}
      {tab==='chat' && <ChatPane courseId={courseId} lessonId={lessonId} />}
    </div>
  )
}

```


===== FILE: components/course/panes/ChatPane.tsx (1951 bytes) =====
```tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import { useChatBridge } from '../InteractionProvider'
type Msg = { role:'user'|'assistant'|'system'; content:string }

export default function ChatPane({ courseId, lessonId }:{ courseId:string; lessonId?:string }){
  const [log, setLog] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const bridge = useChatBridge()
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bridge.setPrefillHandler((text: string) => {
      setInput(prev => (text + (prev ? prev : '')))
      inputRef.current?.focus()
    })
  }, [bridge])

  async function send(){
    if (!input.trim()) return
    const userMsg: Msg = { role:'user', content: input }
    setLog(prev => [...prev, userMsg])
    setInput('')
    setBusy(true)
    try {
      const res = await fetch('/api/chat', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ courseId, lessonId, messages: [...log, userMsg] })
      })
      const data = await res.json().catch(()=>({}))
      const text = data?.reply || data?.text || '…'
      setLog(prev => [...prev, { role:'assistant', content: text }])
    } catch (e:any) {
      setLog(prev => [...prev, { role:'assistant', content: `Error: ${e?.message || e}` }])
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="chat">
      <div className="log">
        {log.map((m,i)=> <div key={i} className="msg"><b>{m.role === 'user' ? 'You' : 'AI'}: </b>{m.content}</div>)}
      </div>
      <form onSubmit={(e)=>{e.preventDefault(); send()}}>
        <textarea ref={inputRef} rows={3} value={input} onChange={e=>setInput(e.target.value)} placeholder="Ask a question or paste a selection…" />
        <button className="btn" type="submit" disabled={busy}>{busy?'Thinking…':'Send'}</button>
      </form>
    </div>
  )
}

```


===== FILE: components/course/panes/NotesPane.tsx (642 bytes) =====
```tsx
'use client'
import { useEffect, useState } from 'react'
export default function NotesPane({ courseId, lessonId }: { courseId: string; lessonId?: string }){
  const key = `notes:${courseId}:${lessonId || 'course'}`
  const [t, setT] = useState('')
  useEffect(()=>{ try{ setT(localStorage.getItem(key) || '') }catch{} }, [key])
  function save(){ try{ localStorage.setItem(key, t) } catch {} }
  return (
    <div>
      <textarea className="input" rows={10} placeholder="Your notes…" value={t} onChange={e=>setT(e.target.value)} />
      <div className="actions"><button className="btn" onClick={save}>Save</button></div>
    </div>
  )
}

```


===== FILE: components/course/panes/QuizPane.tsx (1762 bytes) =====
```tsx
'use client'
import { useState } from 'react'
type Q = { q: string; a: string[]; correct: number }

export default function QuizPane({ courseId, moduleTitle }:{ courseId: string; moduleTitle?: string }){
  const [qs, setQs] = useState<Q[] | null>(null)
  const [score, setScore] = useState<number | null>(null)

  async function start(){
    const res = await fetch('/api/quiz/module', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ courseId, moduleTitle })
    })
    const data = await res.json().catch(()=>({}))
    setQs(data?.questions || [])
    setScore(null)
  }

  function grade(){
    if (!qs) return
    let s = 0
    qs.forEach((q,i)=>{
      const sel = (document.querySelector(`input[name="q${i}"]:checked`) as HTMLInputElement | null)
      if (!sel) return
      if (parseInt(sel.value, 10) === q.correct) s++
    })
    setScore(s)
  }

  return (
    <div className="quiz">
      {!qs ? (
        <div>
          <p className="hint">Generate a module test for the current section.</p>
          <button className="btn" onClick={start}>Start Test</button>
        </div>
      ) : (
        <div>
          {qs.map((q,i)=>(
            <div key={i} className="q">
              <div><b>{i+1}.</b> {q.q}</div>
              {q.a.map((opt, j)=>(
                <label key={j} className="opt">
                  <input type="radio" name={`q${i}`} value={j} /> {opt}
                </label>
              ))}
            </div>
          ))}
          <div className="actions">
            <button className="btn" onClick={grade}>Submit</button>
            {score!=null && <span className="hint">Score: {score}/{qs.length}</span>}
          </div>
        </div>
      )}
    </div>
  )
}

```


===== FILE: components/course/panes/SearchPane.tsx (366 bytes) =====
```tsx
'use client'
import { useState } from 'react'
export default function SearchPane(){
  const [q, setQ] = useState('')
  return (
    <div>
      <input className="input" placeholder="Search in lesson (client-only)" value={q} onChange={e=>setQ(e.target.value)} />
      <p className="hint" style={{marginTop:8}}>Server/vector search coming later.</p>
    </div>
  )
}

```


===== FILE: components/public/FAQList.tsx (856 bytes) =====
```tsx
const faqs = [
  { q: 'What is GistPilot?', a: 'An AI-powered course generator that converts any topic into an outline and lessons.' },
  { q: 'Can I edit the outline?', a: 'Yes—reorder modules, rename lessons, and regenerate content as needed.' },
  { q: 'Which models do you support?', a: 'We use a pluggable provider—Kimi (K2) or any OpenAI-compatible API.' },
  { q: 'Do you store my data?', a: 'Courses are stored in TiDB in your project. You control the data.' },
]

export default function FAQList() {
  return (
    <section className="container">
      <h2 className="center">Frequently asked questions</h2>
      <div className="faq-list">
        {faqs.map((f, i) => (
          <details key={i} className="faq">
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
```


===== FILE: components/public/FooterPublic.tsx (455 bytes) =====
```tsx
import Link from 'next/link'

export default function FooterPublic() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="muted">&copy; {new Date().getFullYear()} GistPilot</div>
        <nav className="footer-links">
          <Link href="/docs">Docs</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/pricing">Pricing</Link>
        </nav>
      </div>
    </footer>
  )
}
```


===== FILE: components/public/Hero.tsx (887 bytes) =====
```tsx
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="hero container">
      <div className="hero-copy">
        <h1>Generate structured courses from any topic.</h1>
        <p className="lead">GistPilot turns ideas into clean outlines and readable lessons—fast.</p>
        <div className="hero-actions">
          <Link href="/auth/login" className="btn btn-primary">Start free</Link>
          <Link href="/pricing" className="btn">See pricing</Link>
        </div>
      </div>
      <div className="hero-demo">
        <div className="demo-card">
          <div className="demo-title">Example</div>
          <div className="demo-body">
            <b>Topic:</b> Basics of Probability<br/>
            <b>Modules:</b> 4<br/>
            <b>Lessons:</b> 3 per module<br/>
          </div>
        </div>
      </div>
    </section>
  )
}
```


===== FILE: components/public/NavbarPublic.tsx (755 bytes) =====
```tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { site } from '../../src/lib/site'

export default function NavbarPublic() {
  const pathname = usePathname()
  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link className="brand" href="/">{site.name}</Link>
        <nav className="nav-links">
          {site.nav.map((n) => (
            <Link key={n.href} href={n.href} className={pathname === n.href ? 'active' : ''}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="nav-cta">
          <Link className="btn btn-primary" href={site.cta.href}>{site.cta.label}</Link>
        </div>
      </div>
    </header>
  )
}
```


===== FILE: components/public/PricingTable.tsx (1397 bytes) =====
```tsx
export default function PricingTable() {
  return (
    <section className="container">
      <h2 className="center">Simple pricing</h2>
      <div className="pricing">
        <div className="price-card">
          <div className="price-title">Free</div>
          <div className="price-amount">$0</div>
          <ul className="price-features">
            <li>Basic course generation</li>
            <li>5 courses / month</li>
            <li>Community support</li>
          </ul>
          <button className="btn btn-primary" disabled>Current</button>
        </div>
        <div className="price-card featured">
          <div className="price-title">Pro</div>
          <div className="price-amount">$19</div>
          <ul className="price-features">
            <li>Unlimited courses</li>
            <li>Search & quizzes</li>
            <li>Priority support</li>
          </ul>
          <a className="btn btn-primary" href="/auth/login">Upgrade</a>
        </div>
        <div className="price-card">
          <div className="price-title">Team</div>
          <div className="price-amount">$49</div>
          <ul className="price-features">
            <li>Teams & sharing</li>
            <li>Admin controls</li>
            <li>SAML SSO (soon)</li>
          </ul>
          <a className="btn" href="/auth/login">Contact sales</a>
        </div>
      </div>
    </section>
  )
}
```


===== FILE: components/wizard/FilePicker.tsx (1581 bytes) =====
```tsx
'use client'

import { useRef, useState } from 'react'
export type PickedFile = { name: string; content: string; size: number }

export default function FilePicker({
  onPicked, maxFiles = 5, maxBytes = 1024*1024
}:{ onPicked:(files:PickedFile[])=>void; maxFiles?:number; maxBytes?:number }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string|null>(null)

  function open() { inputRef.current?.click() }

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null)
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    if (files.length > maxFiles) return setError(`Select up to ${maxFiles} files.`)
    let total = 0
    const outs: PickedFile[] = []
    for (const f of files) {
      total += f.size
      if (total > maxBytes) return setError('Files too large (max 1 MB total).')
      const text = await f.text().catch(()=> '')
      outs.push({ name: f.name, content: text.slice(0, 200_000), size: f.size })
    }
    onPicked(outs)
  }

  return (
    <div>
      <div className="hint">Optional files (txt, md, csv — 1MB total)</div>
      <div style={{display:'flex', gap:8, alignItems:'center', marginTop:6}}>
        <button type="button" className="btn" onClick={open}>Choose files</button>
        <input ref={inputRef} type="file" onChange={onChange} multiple accept=".txt,.md,.csv,text/plain,text/markdown" style={{display:'none'}} />
      </div>
      {error && <div className="small" style={{color:'#ef4444', marginTop:6}}>{error}</div>}
    </div>
  )
}

```


===== FILE: components/wizard/IngestPicker.tsx (1593 bytes) =====
```tsx
'use client'
import { useRef, useState } from 'react'

type Uploaded = { id: string; name: string; bytes: number }
export default function IngestPicker({
  onUploaded
}:{ onUploaded: (files: Uploaded[]) => void }) {
  const ref = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const open = () => ref.current?.click()

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null)
    const list = Array.from(e.target.files || [])
    if (!list.length) return
    try {
      setBusy(true)
      const fd = new FormData()
      for (const f of list) fd.append('files', f)
      const res = await fetch('/api/files/upload', { method: 'POST', body: fd })
      const data = await res.json().catch(()=>({}))
      if (!res.ok) throw new Error(data?.error || 'Upload failed')
      onUploaded(data.files || [])
    } catch (err: any) {
      setError(err.message || 'Upload failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <div className="hint">Attach materials (pdf, docx, md, txt, code, csv, html…)</div>
      <div style={{display:'flex', gap:8, alignItems:'center', marginTop:6}}>
        <button type="button" className="btn" onClick={open} disabled={busy}>
          {busy ? 'Uploading…' : 'Upload files'}
        </button>
        <input ref={ref} type="file" onChange={onChange} multiple style={{display:'none'}} />
      </div>
      {error && <div className="small" style={{color:'#ef4444', marginTop:6}}>{error}</div>}
    </div>
  )
}

```


===== FILE: components/wizard/LevelSelect.tsx (1432 bytes) =====
```tsx
'use client'

type Level = 'essentials' | 'core' | 'rigorous' | 'frontier'

const LABELS: Record<Level, {label:string; desc:string}> = {
  essentials: { label: 'Essentials', desc: 'Assumes no background; examples first.' },
  core:       { label: 'Core',       desc: 'Typical university core; some formalism.' },
  rigorous:   { label: 'Rigorous',   desc: 'Proofs, derivations, precise notation.' },
  frontier:   { label: 'Frontier',   desc: 'Research orientation; recent advances.' },
}

export default function LevelSelect({
  value, onChange
}: { value: Level; onChange: (v:Level)=>void }) {
  return (
    <div>
      <div className="hint">Depth preset</div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginTop:6}}>
        {(Object.keys(LABELS) as Level[]).map(k => {
          const active = value === k
          return (
            <button
              key={k}
              type="button"
              onClick={()=>onChange(k)}
              className="btn"
              style={{borderColor: active ? '#3b82f6' : undefined, background: active ? '#1e293b' : undefined, textAlign:'left', display:'block'}}
              title={LABELS[k].desc}
            >
              <div style={{fontWeight:600}}>{LABELS[k].label}</div>
              <div className="small">{LABELS[k].desc}</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export type { Level }

```


===== FILE: components/wizard/OutlineEditor.tsx (1654 bytes) =====
```tsx

'use client'
import type { DraftOutline } from './types'

export default function OutlineEditor({ outline, onChange }:{ outline: DraftOutline; onChange:(o:DraftOutline)=>void }){
  function setTitle(e: React.ChangeEvent<HTMLInputElement>) {
    onChange({ ...outline, title: e.target.value })
  }
  function setModuleTitle(i:number, title:string){
    const modules = outline.modules.map((m, idx)=> idx===i ? { ...m, title } : m)
    onChange({ ...outline, modules })
  }
  function setLessonTitle(mi:number, li:number, title:string){
    const modules = outline.modules.map((m, idx)=> idx===mi ? { ...m, lessons: m.lessons.map((l, j)=> j===li ? { ...l, title } : l) } : m)
    onChange({ ...outline, modules })
  }

  return (
    <div className="panel">
      <label>
        <div className="hint">Course title</div>
        <input className="input" value={outline.title} onChange={setTitle} />
      </label>
      <div className="grid" style={{marginTop:8}}>
        {outline.modules.map((m, i)=> (
          <div className="module" key={i}>
            <h4>Module {i+1}</h4>
            <input className="input" value={m.title} onChange={e=>setModuleTitle(i, e.target.value)} />
            <div className="les" style={{marginTop:8}}>
              {m.lessons.map((l, j)=> (
                <input key={j} className="input" value={l.title} onChange={e=>setLessonTitle(i, j, e.target.value)} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="hint" style={{marginTop:8}}>
        This is a preview outline for planning only. The backend will generate the final content.
      </p>
    </div>
  )
}

```


===== FILE: components/wizard/OutlinePreview.tsx (890 bytes) =====
```tsx
'use client'

// Minimal local type to avoid external deps
type Outline = { title?: string; modules?: { title: string; lessons?: { title: string }[] }[] }

export default function OutlinePreview({ outline }:{ outline: Outline | null }) {
  if (!outline) return <div className="panel"><div className="hint">No outline yet.</div></div>
  return (
    <div className="panel">
      <h3 style={{marginTop:0}}>{outline.title || 'Draft outline'}</h3>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
        {outline.modules?.map((m, i)=> (
          <div key={i} className="module">
            <div style={{fontWeight:600, marginBottom:4}}>{i+1}. {m.title}</div>
            <ol className="les" style={{paddingLeft:16}}>
              {m.lessons?.map((l, j)=> (<li key={j}>{l.title}</li>))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  )
}

```


===== FILE: components/wizard/ProgressModal.tsx (756 bytes) =====
```tsx

'use client'
export default function ProgressModal({ open, error, onClose }:{ open:boolean; error?:string|null; onClose:()=>void }){
  if (!open) return null
  return (
    <div className="modalbk" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <h3 style={{marginTop:0}}>Generating…</h3>
        {!error ? (
          <>
            <progress max={100} />
            <p className="hint" style={{marginTop:8}}>We’re creating modules and lessons. This can take a moment.</p>
          </>
        ) : (
          <>
            <p style={{color:'#ef4444', marginBottom:8}}>{error}</p>
            <button className="btn" onClick={onClose}>Close</button>
          </>
        )}
      </div>
    </div>
  )
}

```


===== FILE: components/wizard/Stepper.tsx (430 bytes) =====
```tsx

'use client'
export default function Stepper({ step, setStep, labels }:{ step:number; setStep:(n:number)=>void; labels:string[] }){
  return (
    <div className="stepper">
      {labels.map((l, i) => (
        <button
          type="button"
          key={i}
          className={`chip ${i===step ? 'active':''}`}
          onClick={() => setStep(i)}
        >
          {i+1}. {l}
        </button>
      ))}
    </div>
  )
}

```


===== FILE: components/wizard/Wizard.tsx (4964 bytes) =====
```tsx

'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Stepper from './Stepper'
import OutlineEditor from './OutlineEditor'
import ProgressModal from './ProgressModal'
import type { DraftOutline } from './types'
import { draftFromTopic } from './types'

const STEP_LABELS = ['Topic & Goals', 'Style', 'Preview Outline', 'Generate']

export default function CreateWizard(){
  const [step, setStep] = useState(0)
  const [topic, setTopic] = useState('Basics of Probability')
  const [audience, setAudience] = useState<'beginner'|'intermediate'|'advanced'>('beginner')
  const [modules, setModules] = useState(4)
  const [lessons, setLessons] = useState(3)
  const [tone, setTone] = useState('clear, concise, example-driven')
  const [outline, setOutline] = useState<DraftOutline>(() => draftFromTopic('Basics of Probability', 4, 3))
  const [running, setRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

  const preview = useMemo(() => draftFromTopic(topic || 'Untitled', modules, lessons), [topic, modules, lessons])

  function toPreview(){
    setOutline(preview)
    setStep(2)
  }

  async function generate(){
    setRunning(true); setError(null)
    try {
      const res = await fetch('/api/course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, audience, modules, lessons, tone }),
      })
      const data = await res.json().catch(()=>({}))
      if (!res.ok) throw new Error(data?.error || 'Failed to create course')
      router.push(`/course/${data.id}`)
    } catch (e:any) {
      setError(e.message || 'Unexpected error')
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="wiz">
      <Stepper step={step} setStep={setStep} labels={STEP_LABELS} />

      {step === 0 && (
        <div className="panel">
          <div className="row">
            <label>
              <div className="hint">Topic</div>
              <input className="input" value={topic} onChange={e=>setTopic(e.target.value)} placeholder="e.g., Linear Algebra" />
            </label>
            <label>
              <div className="hint">Audience</div>
              <select className="select" value={audience} onChange={e=>setAudience(e.target.value as any)}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </label>
          </div>
          <div className="row" style={{marginTop:8}}>
            <label>
              <div className="hint"># Modules</div>
              <input className="input" type="number" min={1} max={8} value={modules} onChange={e=>setModules(parseInt(e.target.value||'4'))} />
            </label>
            <label>
              <div className="hint">Lessons / module</div>
              <input className="input" type="number" min={1} max={8} value={lessons} onChange={e=>setLessons(parseInt(e.target.value||'3'))} />
            </label>
          </div>
          <div className="actions">
            <button className="btn" onClick={()=>setStep(1)}>Next</button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="panel">
          <label>
            <div className="hint">Tone & Style</div>
            <textarea rows={4} defaultValue={tone} onChange={e=>setTone(e.target.value)} />
          </label>
          <div className="actions">
            <button className="btn secondary" onClick={()=>setStep(0)}>Back</button>
            <button className="btn" onClick={toPreview}>Preview outline</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <>
          <OutlineEditor outline={outline} onChange={setOutline} />
          <div className="actions">
            <button className="btn secondary" onClick={()=>setStep(1)}>Back</button>
            <button className="btn" onClick={()=>setStep(3)}>Continue</button>
          </div>
        </>
      )}

      {step === 3 && (
        <div className="panel">
          <p className="hint">We’ll now generate the full course using your topic and preferences.</p>
          <ul className="hint" style={{paddingLeft:16}}>
            <li><b>Topic</b>: {topic}</li>
            <li><b>Audience</b>: {audience}</li>
            <li><b>Plan</b>: {modules} modules × {lessons} lessons</li>
            <li><b>Tone</b>: {tone}</li>
          </ul>
          <div className="actions">
            <button className="btn secondary" onClick={()=>setStep(2)}>Back</button>
            <button className="btn" onClick={generate}>Generate course</button>
          </div>
        </div>
      )}

      <ProgressModal open={running || !!error} error={error} onClose={()=>{ setError(null); setRunning(false); }} />
    </div>
  )
}

```


===== FILE: components/wizard/WizardV2.tsx (5271 bytes) =====
```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Stepper from './Stepper'
import LevelSelect, { type Level } from './LevelSelect'
import FilePicker, { type PickedFile } from './FilePicker'
import OutlinePreview from './OutlinePreview'
import ProgressModal from './ProgressModal'
import IngestPicker from './IngestPicker'

// Local Outline type (same shape used by API)
type Outline = { title?: string; modules?: { title: string; lessons?: { title: string }[] }[] }

const STEPS = ['Input', 'Outline', 'Generate'] as const

export default function CreateWizardV2(){
  const [step, setStep] = useState<number>(0)
  const [topic, setTopic] = useState('Basics of Probability')
  const [level, setLevel] = useState<Level>('core')
  const [uploads, setUploads] = useState<{id:string; name:string; bytes:number}[]>([])
  const [outline, setOutline] = useState<Outline | null>(null)
  const [comments, setComments] = useState('')
  const [running, setRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const fileIds = uploads.map(u => u.id)
  async function draftOutline(){
    setRunning(true); setError(null)
    try {
      const res = await fetch('/api/outline/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, level, fileIds }),
      })
      const data = await res.json().catch(()=>({}))
      if (!res.ok) throw new Error(data?.error || 'Failed to draft outline')
      setOutline(data.outline || null)
      setStep(1)
    } catch (e:any) {
      setError(e.message || 'Unexpected error')
    } finally {
      setRunning(false)
    }
  }

  async function iterateOutline(){
    if (!outline) return
    setRunning(true); setError(null)
    try {
      const res = await fetch('/api/outline/iterate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, level, outline, comments }),
      })
      const data = await res.json().catch(()=>({}))
      if (!res.ok) throw new Error(data?.error || 'Failed to iterate outline')
      setOutline(data.outline || null)
      setComments('')
    } catch (e:any) {
      setError(e.message || 'Unexpected error')
    } finally {
      setRunning(false)
    }
  }

  async function generateCourse(){
    setRunning(true); setError(null)
    try {
      const res = await fetch('/api/course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Backend currently may ignore extras; included for future
        body: JSON.stringify({ topic, level, outline }),
      })
      const data = await res.json().catch(()=>({}))
      if (!res.ok) throw new Error(data?.error || 'Failed to create course')
      router.push(`/course/${data.id}`)
    } catch (e:any) {
      setError(e.message || 'Unexpected error')
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="wiz">
      <Stepper step={step} setStep={setStep} labels={[...STEPS]} />

      {step === 0 && (
        <div className="panel">
          <label>
            <div className="hint">Topic</div>
            <input className="input" value={topic} onChange={e=>setTopic(e.target.value)} placeholder="e.g., Linear Algebra — or upload files below" />
          </label>

          <div style={{marginTop:8}}>
            <LevelSelect value={level} onChange={setLevel} />
          </div>

          <div style={{marginTop:8}}>
            <IngestPicker onUploaded={(f)=> setUploads(prev => [...prev, ...f])} />
            {uploads.length > 0 && (
                <div className="hint" style={{marginTop:6}}>
                {uploads.length} file(s): {uploads.map(f=>f.name).join(', ')}
                </div>
            )}
          </div>


          <div className="actions">
            <button className="btn" onClick={draftOutline}>Draft outline</button>
          </div>
        </div>
      )}

      {step === 1 && (
        <>
          <OutlinePreview outline={outline} />
          <div className="panel">
            <div className="hint">Comments to refine the outline</div>
            <textarea rows={4} className="input" value={comments} onChange={e=>setComments(e.target.value)} placeholder="e.g., Merge 1 & 2, add Bayes, reduce proofs." />
            <div className="actions">
              <button className="btn secondary" onClick={()=>setStep(0)}>Back</button>
              <button className="btn" onClick={iterateOutline}>Iterate</button>
              <button className="btn" onClick={()=>setStep(2)}>Finalize</button>
            </div>
          </div>
        </>
      )}

      {step === 2 && (
        <div className="panel">
          <p className="hint">Ready to generate the full course based on the finalized outline.</p>
          <div className="actions">
            <button className="btn secondary" onClick={()=>setStep(1)}>Back</button>
            <button className="btn" onClick={generateCourse}>Generate course</button>
          </div>
        </div>
      )}

      <ProgressModal open={running || !!error} error={error} onClose={()=>{ setError(null); setRunning(false); }} />
    </div>
  )
}

```


===== FILE: components/wizard/types.ts (626 bytes) =====
```ts

export type DraftLesson = { title: string }
export type DraftModule = { title: string; description?: string; lessons: DraftLesson[] }
export type DraftOutline = { title: string; modules: DraftModule[] }

export function draftFromTopic(topic: string, modules = 4, lessons = 3): DraftOutline {
  const ms = Array.from({ length: modules }).map((_, i) => ({
    title: `Module ${i+1}: ${topic} – Part ${i+1}`,
    description: `Overview of ${topic} (part ${i+1}).`,
    lessons: Array.from({ length: lessons }).map((__, j) => ({ title: `${topic} ${i+1}.${j+1}` })),
  }))
  return { title: `Intro to ${topic}`, modules: ms }
}

```


===== FILE: estimate_loc.sh (1843 bytes) =====
```bash
#!/usr/bin/env bash
# Estimate LOC in a git repo, ignoring files matched by .gitignore.
# Usage:
#   ./estimate_loc.sh           # total LOC
#   ./estimate_loc.sh --by-ext  # breakdown by file extension + total

set -euo pipefail

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Error: run this inside a git repository (needed to honor .gitignore)." >&2
  exit 1
fi

MODE="${1:-total}"

# Get all tracked + untracked, but NOT ignored files (null-separated for safety)
files() {
  git ls-files --cached --others --exclude-standard -z
}

if [[ "$MODE" == "total" ]]; then
  # Sum line counts
  total=$(
    files \
    | while IFS= read -r -d '' f; do
        [[ -f "$f" ]] || continue
        # LC_ALL=C avoids locale issues on some binaries; errors -> 0
        LC_ALL=C wc -l <"$f" 2>/dev/null || echo 0
      done \
    | awk '{s+=$1} END{print s+0}'
  )
  echo "Estimated LOC (ignoring .gitignore): $total"
  exit 0
fi

if [[ "$MODE" == "--by-ext" ]]; then
  tmp="$(mktemp)"
  # Emit "ext<TAB>lines" per file
  files \
  | while IFS= read -r -d '' f; do
      [[ -f "$f" ]] || continue
      lines=$(LC_ALL=C wc -l <"$f" 2>/dev/null || echo 0)
      # derive extension (lowercased); mark none as (noext)
      base="${f##*/}"
      if [[ "$base" == *.* && "$base" != .* ]]; then
        ext="${base##*.}"
        ext="$(printf '%s' "$ext" | tr '[:upper:]' '[:lower:]')"
      else
        ext="(noext)"
      fi
      printf "%s\t%s\n" "$ext" "$lines"
    done >"$tmp"

  echo "LOC by extension (ignoring .gitignore):"
  # Sum per extension, print sorted descending
  awk -F'\t' '{a[$1]+=$2; t+=$2} END{for (k in a) printf "%-16s %12d\n", k, a[k]; printf "%s\n%-16s %12d\n", "------------------------------", "TOTAL", t}' "$tmp" \
  | sort -k2,2nr -k1,1
  rm -f "$tmp"
  exit 0
fi

echo "Usage: $0 [--by-ext]"
exit 1

```


===== FILE: next-env.d.ts (201 bytes) =====
```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.

```


===== FILE: next.config.mjs (125 bytes) =====
```js
/** @type {import('next').NextConfig} */
const nextConfig = { experimental: { typedRoutes: true } }
export default nextConfig
```


===== FILE: package.json (684 bytes) =====
```json
{
  "name": "gistpilot-kimi-tidb",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start -p 3000",
    "migrate": "node scripts/migrate.mjs",
    "health": "node scripts/health.mjs"
  },
  "dependencies": {
    "mammoth": "^1.10.0",
    "mysql2": "^3.10.2",
    "next": "14.2.5",
    "pdf-parse": "^1.1.1",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/node": "^22.5.1",
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "typescript": "^5.6.3"
  },
  "engines": {
    "node": ">=18.18.0"
  }
}

```


===== FILE: scripts/health.mjs (1226 bytes) =====
```js
// scripts/health.mjs
import mysql from 'mysql2/promise'

function parseMysqlUrl(url) {
  const u = new URL(url)
  const user = decodeURIComponent(u.username)
  const password = decodeURIComponent(u.password)
  const host = u.hostname
  const defaultPort = host.endsWith('tidbcloud.com') ? 4000 : 3306
  const port = u.port ? Number(u.port) : defaultPort
  const database = u.pathname.replace(/^\//, '')
  const sslParam = (u.searchParams.get('sslaccept') || '').toLowerCase()
  const isTiDBCloud = host.endsWith('tidbcloud.com')
  const rejectUnauthorized = sslParam === 'strict' || (isTiDBCloud && sslParam !== 'accept')
  const ssl = { minVersion: 'TLSv1.2', rejectUnauthorized }
  return { host, port, user, password, database, ssl }
}

async function dbHealth() {
  const hasEnv = !!process.env.DATABASE_URL
  if (!hasEnv) return { ok: false, databaseUrl: 'missing' }
  try {
    const conn = parseMysqlUrl(process.env.DATABASE_URL)
    const pool = mysql.createPool({ ...conn })
    const [rows] = await pool.query('SELECT 1 as ok')
    return { ok: true, ping: rows?.[0]?.ok === 1 }
  } catch (e) {
    return { ok: false, error: e?.message || 'db error' }
  }
}

console.log(JSON.stringify(await dbHealth(), null, 2))

```


===== FILE: scripts/make-llm-bundle.mjs (7416 bytes) =====
```js
#!/usr/bin/env node
// make-llm-bundle.mjs — create a single Markdown snapshot of your codebase for LLM review.
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const repoRoot = process.cwd();
const outDir = path.join(repoRoot, "llm_bundle");
const outFile = path.join(outDir, "repo-context.md");
const metaFile = path.join(outDir, "meta.json");

// --- settings ---
const MAX_TOTAL_BYTES = parseInt((process.argv.find(a => a.startsWith("--max-total=")) || "").split("=")[1] || "", 10) || 6 * 1024 * 1024; // ~6MB
const PER_FILE_MAX = 350 * 1024; // 350KB per file cap
const includeTests = process.argv.includes("--include-tests");
const full = process.argv.includes("--full"); // less aggressive exclude

const exts = new Set([
  ".ts",".tsx",".js",".jsx",".mjs",".cjs",
  ".css",".scss",".sass",".less",
  ".md",".mdx",".txt",
  ".json",".yaml",".yml",".toml",".ini",
  ".sql",".prisma",
  ".sh",".bash",".zsh",".ps1",".bat",
]);
const configAllow = [
  "package.json","pnpm-workspace.yaml","turbo.json",
  "next.config.js","next.config.mjs","next.config.ts",
  "tailwind.config.js","tailwind.config.ts","postcss.config.js","postcss.config.ts",
  "tsconfig.json","tsconfig.base.json","eslint.config.js",".eslintrc.js",".eslintrc.cjs",".eslintrc.json",
  "prettier.config.js",".prettierrc",".prettierrc.cjs",".prettierrc.json",
  "vite.config.ts","vite.config.js","vitest.config.ts","vitest.config.js",
  "astro.config.mjs","svelte.config.js",
];
const dirExcludes = [
  "node_modules",".git",".next","dist","build","out","coverage",".turbo",".vercel",".cache",".vscode",".idea",
  ".pytest_cache",".venv","venv","__pycache__",".gradle",".parcel-cache",".pnpm-store",
  "public","assets","static","media","img","fonts"
];
const fileExcludes = [
  ".DS_Store",".env",".env.local",".env.production",".env.development",".env.test",".env.ci",
  "yarn.lock","pnpm-lock.yaml","package-lock.json",
  "*.log","*.map","*.min.*","*.lockb","*.lock",
];
const binaryExts = new Set([".png",".jpg",".jpeg",".gif",".svg",".webp",".avif",".ico",".pdf",".wasm",".zip",".mp4",".mp3",".wav",".mov",".heic",".rar",".7z"]);

// util
const rel = p => path.relative(repoRoot, p).replaceAll("\\","/");
const isHidden = name => name.startsWith(".");
const mm = (s, pat) => new RegExp("^" + pat.replace(/\./g,"\\.").replace(/\*/g,".*") + "$").test(s);
const shouldSkipFile = (rp) => {
  const name = path.basename(rp);
  if (!includeTests && /(^|\/|\\)(tests?|__tests__|\.test\.|\.spec\.)/i.test(rp)) return true;
  for (const pat of fileExcludes) if (mm(name, pat)) return true;
  if (!full && rp.split("/").some(seg => dirExcludes.includes(seg))) return true;
  const ext = path.extname(rp).toLowerCase();
  if (binaryExts.has(ext)) return true;
  if (!exts.has(ext) && !configAllow.includes(name)) return true;
  return false;
};

// get files (prefer git for .gitignore fidelity)
function gitLs(args) {
  try { return execSync(`git ${args}`, {cwd: repoRoot, stdio:["ignore","pipe","ignore"]}).toString().split("\n").filter(Boolean); }
  catch { return []; }
}
let files = [];
const tracked = gitLs("ls-files");
const untracked = gitLs("ls-files --others --exclude-standard");
if (tracked.length || untracked.length) {
  files = [...new Set([...tracked, ...untracked])].map(p => path.join(repoRoot, p));
} else {
  // fallback: manual walk
  const stack = [repoRoot];
  while (stack.length) {
    const dir = stack.pop();
    const ents = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of ents) {
      const p = path.join(dir, e.name);
      const rp = rel(p);
      if (e.isDirectory()) {
        if (!full && (dirExcludes.includes(e.name) || isHidden(e.name))) continue;
        stack.push(p);
      } else if (e.isFile()) {
        // skip hidden files at root unless in allowlist
        if (isHidden(e.name) && !configAllow.includes(e.name)) continue;
        if (!shouldSkipFile(rp)) files.push(p);
      }
    }
  }
}

// final filter pass
files = files.filter(f => !shouldSkipFile(rel(f)));

// small helper: detect language fence
const langOf = (rp) => {
  const ext = path.extname(rp).toLowerCase();
  const map = { ".ts":"ts", ".tsx":"tsx", ".js":"js", ".jsx":"jsx", ".mjs":"js", ".cjs":"js",
    ".css":"css",".scss":"scss",".sass":"sass",".less":"less",
    ".md":"md",".mdx":"mdx",".json":"json",".yaml":"yaml",".yml":"yaml",
    ".sql":"sql",".prisma":"prisma",".sh":"bash",".bash":"bash",".zsh":"bash",".ps1":"powershell",".bat":"bat",
    ".toml":"toml",".ini":"ini"
  };
  return map[ext] || "";
};

// build route map heuristics for Next.js
function buildRoutes() {
  const routeFiles = files
    .map(rel)
    .filter(p => p.startsWith("app/") || p.startsWith("pages/"));
  const routes = [];
  for (const p of routeFiles) {
    if (p.startsWith("app/") && /\/page\.(tsx|ts|js|jsx|mdx)$/.test(p)) {
      let r = p.replace(/^app\//,"").replace(/\/page\.(tsx|ts|js|jsx|mdx)$/,"");
      r = r.replace(/\/\([^)]+\)/g,""); // drop route groups
      routes.push("/" + (r === "" ? "" : r));
    }
    if (p.startsWith("pages/")) {
      if (/\/index\.(tsx|ts|js|jsx|mdx)$/.test(p)) {
        const base = p.replace(/^pages\//,"").replace(/\/index\.(tsx|ts|js|jsx|mdx)$/,"");
        routes.push("/" + base);
      } else if (/\.(tsx|ts|js|jsx|mdx)$/.test(p) && !/(_app|_document|_error)\./.test(p)) {
        const base = p.replace(/^pages\//,"").replace(/\.(tsx|ts|js|jsx|mdx)$/,"");
        routes.push("/" + base);
      }
    }
  }
  return [...new Set(routes)].sort();
}

// meta
function safeExec(cmd) { try { return execSync(cmd, {cwd: repoRoot, stdio:["ignore","pipe","ignore"]}).toString().trim(); } catch { return null; } }
const meta = {
  generatedAt: new Date().toISOString(),
  node: process.version,
  repo: {
    branch: safeExec("git rev-parse --abbrev-ref HEAD"),
    commit: safeExec("git rev-parse --short HEAD"),
    remote: safeExec("git config --get remote.origin.url")
  },
  counts: { files: files.length },
  routes: buildRoutes(),
};

// ensure out
fs.mkdirSync(outDir, { recursive: true });

// write meta.json
fs.writeFileSync(metaFile, JSON.stringify(meta, null, 2));

// tree txt (lightweight)
function makeTreeList() {
  const list = files.map(rel).sort();
  return list.join("\n");
}

// write markdown bundle
let written = 0;
let md = `# Repo Context Bundle\n\n`;
md += `- Generated: ${meta.generatedAt}\n- Node: ${meta.node}\n- Branch: ${meta.repo.branch || "n/a"}  Commit: ${meta.repo.commit || "n/a"}\n- Files included: ${meta.counts.files}\n\n`;
if (meta.routes?.length) {
  md += `## Routes (heuristic)\n`;
  md += meta.routes.map(r => `- \`${r || "/"}\``).join("\n") + "\n\n";
}
md += `## File list\n`;
md += "```\n" + makeTreeList() + "\n```\n\n";

for (const abs of files.sort()) {
  const rp = rel(abs);
  try {
    const stat = fs.statSync(abs);
    if (stat.size > PER_FILE_MAX && !full) continue; // skip huge files unless --full
    const buf = fs.readFileSync(abs);
    if (written + buf.length > MAX_TOTAL_BYTES) break;
    const lang = langOf(rp);
    md += `\n\n===== FILE: ${rp} (${stat.size} bytes) =====\n\`\`\`${lang}\n${buf.toString("utf8")}\n\`\`\`\n`;
    written += buf.length;
  } catch {}
}

fs.writeFileSync(outFile, md, "utf8");

console.log(`\n✅ Bundle ready:\n  ${rel(outFile)}  (${written} code bytes)\n  ${rel(metaFile)}\n`);
console.log(`\nUpload 'repo-context.md' here and I’ll dive in.`);

```


===== FILE: scripts/migrate.mjs (2488 bytes) =====
```js
// scripts/migrate.mjs
import mysql from 'mysql2/promise'

function parseMysqlUrl(url) {
  const u = new URL(url)
  const user = decodeURIComponent(u.username)
  const password = decodeURIComponent(u.password)
  const host = u.hostname
  const defaultPort = host.endsWith('tidbcloud.com') ? 4000 : 3306
  const port = u.port ? Number(u.port) : defaultPort
  const database = u.pathname.replace(/^\//, '')
  const sslParam = (u.searchParams.get('sslaccept') || '').toLowerCase()
  const isTiDBCloud = host.endsWith('tidbcloud.com')
  const rejectUnauthorized = sslParam === 'strict' || (isTiDBCloud && sslParam !== 'accept')
  const ssl = { minVersion: 'TLSv1.2', rejectUnauthorized }
  return { host, port, user, password, database, ssl }
}

async function getPool() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL not set')
  const conn = parseMysqlUrl(url)
  return mysql.createPool({
    ...conn,
    waitForConnections: true,
    connectionLimit: 10,
    timezone: 'Z',
    dateStrings: true,
  })
}

async function migrate() {
  const pool = await getPool()
  await pool.query(`
    CREATE TABLE IF NOT EXISTS courses (
      id VARCHAR(36) PRIMARY KEY,
      topic VARCHAR(255) NOT NULL,
      outline_json JSON NOT NULL,
      status ENUM('PENDING','READY','FAILED') DEFAULT 'PENDING',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS modules (
      id VARCHAR(36) PRIMARY KEY,
      course_id VARCHAR(36) NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT NULL,
      ord INT NOT NULL,
      CONSTRAINT fk_modules_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    )
  `)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS lessons (
      id VARCHAR(36) PRIMARY KEY,
      module_id VARCHAR(36) NOT NULL,
      title VARCHAR(255) NOT NULL,
      content MEDIUMTEXT NOT NULL,
      ord INT NOT NULL,
      embedding_json JSON NULL,
      CONSTRAINT fk_lessons_module FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
    )
  `)
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.log('[migrate] DATABASE_URL not set. Skipping.')
    return
  }
  try {
    await migrate()
    console.log('[migrate] done')
  } catch (e) {
    console.error('[migrate] error:', e?.message || e)
    process.exit(1)
  }
}
await main()

```


===== FILE: src/actions/create-course.ts (2982 bytes) =====
```ts
// src/actions/create-course.ts
import { getPool } from '../lib/db'
import { migrate } from '../lib/migrate'
import { uuid } from '../lib/uuid'
import { getProvider } from '../llm'
import type { Outline } from '../llm/types'

type Ok = { ok: true; id: string }
type Err = { ok: false; status?: number; error: string }

export async function createCourse(topic: string): Promise<Ok | Err> {
  // DB must be configured
  if (!process.env.DATABASE_URL) {
    return { ok: false, status: 503, error: 'Configure DATABASE_URL in .env and run npm run migrate' }
  }

  

  try {
    console.log('calling migrate')
    // Ensure schema exists (idempotent)
    await migrate()

    const provider = getProvider()

    let outline: Outline
    try {
      outline = await provider.generateOutline(topic)
    } catch (e: any) {
      return { ok: false, status: 502, error: e?.message || 'LLM outline failed' }
    }
    console.log('outline ', outline)

    const courseId = uuid()
    const pool = getPool()

    // Create course row
    await pool.query(
      'INSERT INTO courses (id, topic, outline_json, status) VALUES (?, ?, CAST(? AS JSON), ?)',
      [courseId, topic, JSON.stringify(outline), 'PENDING'],
    )

    console.log('inserted into courses')

    // Create modules + lessons (limit to 4 x 3)
    let mCount = Math.min(outline.modules?.length ?? 0, 4)

    // test code: need to get rid of : start
    mCount = 1
    // test code: need to get rid of : end
    
    for (let m = 0; m < mCount; m++) {
      const mod = outline.modules[m]
      const moduleId = uuid()
      await pool.query(
        'INSERT INTO modules (id, course_id, title, description, ord) VALUES (?, ?, ?, ?, ?)',
        [moduleId, courseId, mod.title, mod.description || null, m],
      )
      console.log('inserted into modules- ', {m})

      let lCount = Math.min(mod.lessons?.length ?? 0, 3)

      // test code: need to get rid of : start
      lCount = 1
      // test code: need to get rid of : end

      for (let l = 0; l < lCount; l++) {
        const les = mod.lessons[l]
        let content = ''
        try {
          content = await provider.generateLesson(mod.title, les.title, topic)
        } catch (e: any) {
          // Keep course usable even if one lesson fails
          content = `Generation failed: ${e?.message || 'unknown error'}.`
        }
        const lessonId = uuid()
        await pool.query(
          'INSERT INTO lessons (id, module_id, title, content, ord, embedding_json) VALUES (?, ?, ?, ?, ?, ?)',
          [lessonId, moduleId, les.title, content, l, null],
        )
        console.log('inserted into pools- ', {m, l})
      }
    }

    await pool.query('UPDATE courses SET status = ? WHERE id = ?', ['READY', courseId])

    console.log('updated courses')

    return { ok: true, id: courseId }
  } catch (e: any) {
    console.error('[createCourse] error:', e)
    return { ok: false, status: 500, error: e?.message || 'createCourse failed' }
  }
}

```


===== FILE: src/data/courses.ts (740 bytes) =====
```ts
import { getPool } from '../lib/db'

export async function getCourseWithContent(id: string) {
  if (!process.env.DATABASE_URL) return { ok: false, error: 'DB not configured' } as const
  const pool = getPool()
  const [cs] = await pool.query('SELECT * FROM courses WHERE id = ?', [id])
  const course = (cs as any[])[0]
  if (!course) return { ok: false, error: 'not found' } as const

  const [mods] = await pool.query('SELECT * FROM modules WHERE course_id = ? ORDER BY ord ASC', [id])
  const modules = (mods as any[])

  for (const m of modules) {
    const [ls] = await pool.query('SELECT * FROM lessons WHERE module_id = ? ORDER BY ord ASC', [m.id])
    m.lessons = (ls as any[])
  }

  return { ok: true, course, modules } as const
}
```


===== FILE: src/data/list-courses.ts (878 bytes) =====
```ts

import { getPool } from '../lib/db'

export type CourseRow = {
  id: string, topic: string, status: 'PENDING'|'READY'|'FAILED',
  created_at: string, updated_at: string, modules: number, lessons: number
}

export async function listCourses(limit = 24, offset = 0): Promise<CourseRow[]> {
  if (!process.env.DATABASE_URL) return []
  try {
    const pool = getPool()
    const [rows] = await pool.query(`
      SELECT
        c.id, c.topic, c.status, c.created_at, c.updated_at,
        (SELECT COUNT(*) FROM modules m WHERE m.course_id = c.id) AS modules,
        (
          SELECT COUNT(*) FROM lessons l WHERE l.module_id IN (
            SELECT id FROM modules WHERE course_id = c.id
          )
        ) AS lessons
      FROM courses c
      ORDER BY c.updated_at DESC
      LIMIT ? OFFSET ?
    `, [limit, offset])
    return rows as any
  } catch {
    return []
  }
}

```


===== FILE: src/lib/db.ts (1366 bytes) =====
```ts
// src/lib/db.ts
import mysql from 'mysql2/promise'

let pool: mysql.Pool | null = null

function parseMysqlUrl(url: string) {
  const u = new URL(url)

  const user = decodeURIComponent(u.username)
  const password = decodeURIComponent(u.password)
  const host = u.hostname

  // Default TiDB Cloud port to 4000 when not provided
  const defaultPort = host.endsWith('tidbcloud.com') ? 4000 : 3306
  const port = u.port ? Number(u.port) : defaultPort

  const database = u.pathname.replace(/^\//, '')

  // Enforce TLS for TiDB Cloud (and default to TLS in general)
  const sslParam = (u.searchParams.get('sslaccept') || '').toLowerCase()
  const isTiDBCloud = host.endsWith('tidbcloud.com')

  // If sslaccept=strict → verify cert, else still use TLS but allow default verification
  const rejectUnauthorized =
    sslParam === 'strict' || (isTiDBCloud && sslParam !== 'accept')

  const ssl: mysql.SslOptions = {
    minVersion: 'TLSv1.2',
    rejectUnauthorized
  }

  return { host, port, user, password, database, ssl }
}

export function getPool() {
  if (pool) return pool
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL not set')
  const conn = parseMysqlUrl(url)
  pool = mysql.createPool({
    ...conn,
    waitForConnections: true,
    connectionLimit: 10,
    timezone: 'Z',
    dateStrings: true,
  })
  return pool
}

```


===== FILE: src/lib/health.ts (460 bytes) =====
```ts
import { getPool } from './db'

export async function dbHealth(checkDb = false) {
  const hasEnv = !!process.env.DATABASE_URL
  if (!checkDb || !hasEnv) {
    return { ok: hasEnv, databaseUrl: hasEnv ? 'present' : 'missing' }
  }
  try {
    const pool = getPool()
    const [rows] = await pool.query('SELECT 1 as ok')
    return { ok: true, ping: (rows as any)[0]?.ok === 1 }
  } catch (e:any) {
    return { ok: false, error: e?.message || 'db error' }
  }
}
```


===== FILE: src/lib/migrate.ts (1195 bytes) =====
```ts
import { getPool } from './db'

export async function migrate() {
  const pool = getPool()
  // Create tables (idempotent)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS courses (
      id VARCHAR(36) PRIMARY KEY,
      topic VARCHAR(255) NOT NULL,
      outline_json JSON NOT NULL,
      status ENUM('PENDING','READY','FAILED') DEFAULT 'PENDING',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS modules (
      id VARCHAR(36) PRIMARY KEY,
      course_id VARCHAR(36) NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT NULL,
      ord INT NOT NULL,
      CONSTRAINT fk_modules_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    )`)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS lessons (
      id VARCHAR(36) PRIMARY KEY,
      module_id VARCHAR(36) NOT NULL,
      title VARCHAR(255) NOT NULL,
      content MEDIUMTEXT NOT NULL,
      ord INT NOT NULL,
      embedding_json JSON NULL,
      CONSTRAINT fk_lessons_module FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
    )`)
}
```


===== FILE: src/lib/site.ts (316 bytes) =====
```ts
export const site = {
  name: "GistPilot",
  tagline: "Cut to the gist, then go deeper.",
  nav: [
    { href: "/", label: "Home" },
    { href: "/pricing", label: "Pricing" },
    { href: "/docs", label: "Docs" },
    { href: "/faq", label: "FAQ" },
  ],
  cta: { href: "/auth/login", label: "Sign in" },
} as const
```


===== FILE: src/lib/uuid.ts (228 bytes) =====
```ts
export function uuid() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return (crypto as any).randomUUID()
  }
  // Fallback
  return 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36)
}
```


===== FILE: src/llm/index.ts (319 bytes) =====
```ts
import { createMockProvider } from './mock'
import { createKimiProvider } from './kimi'
import type { LLMProvider } from './types'

export function getProvider(): LLMProvider {
  const p = (process.env.LLM_PROVIDER || 'mock').toLowerCase()
  if (p === 'kimi') return createKimiProvider()
  return createMockProvider()
}
```


===== FILE: src/llm/kimi.ts (4305 bytes) =====
```ts
import type { LLMProvider, Outline } from './types'

async function chatJSON(baseUrl: string, apiKey: string, model: string, system: string, user: string) {
  const r = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ]
    })
  })
  if (!r.ok) {
    const t = await r.text()
    throw new Error(`LLM error: ${r.status} ${t}`)
  }
  const j = await r.json()
  const content = j.choices?.[0]?.message?.content || '{}'
  return content
}

async function chatText(baseUrl: string, apiKey: string, model: string, system: string, user: string) {
  const r = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      temperature: 0.5,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ]
    })
  })
  if (!r.ok) {
    const t = await r.text()
    throw new Error(`LLM error: ${r.status} ${t}`)
  }
  const j = await r.json()
  return j.choices?.[0]?.message?.content || ''
}

async function embedText(baseUrl: string, apiKey: string, model: string, input: string) {
  const r = await fetch(`${baseUrl}/embeddings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({ model, input })
  })
  if (!r.ok) {
    const t = await r.text()
    throw new Error(`Embed error: ${r.status} ${t}`)
  }
  const j = await r.json()
  return j.data?.[0]?.embedding as number[]
}

// --- helper: OpenAI-compatible chat ---
async function callChat(
  baseUrl: string,
  apiKey: string,
  model: string,
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
  temperature = 0.3
): Promise<string> {
  const base = baseUrl.replace(/\/+$/, '')
  const res = await fetch(`${base}/chat/completions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, messages, temperature, stream: false }),
  })
  if (!res.ok) {
    const t = await res.text().catch(() => '')
    throw new Error(`LLM ${res.status}: ${t || res.statusText}`)
  }
  const data = await res.json().catch(() => ({} as any))
  return (
    data?.choices?.[0]?.message?.content ??
    data?.choices?.[0]?.delta?.content ??
    ''
  )
}


export function createKimiProvider(): LLMProvider {
  const baseUrl = process.env.LLM_BASE_URL || ''
  const apiKey = process.env.LLM_API_KEY || ''
  const model = process.env.LLM_MODEL || ''

  return {
    async generateOutline(topic: string) {
      if (!baseUrl || !apiKey || !model) throw new Error('LLM env missing')
      const sys = 'You are a course architect. Return JSON with keys: title, modules[].title, modules[].description, modules[].lessons[].title (4 modules, 3 lessons each).'
      const user = `Topic: ${topic}`
      const content = await chatJSON(baseUrl, apiKey, model, sys, user)
      return JSON.parse(content) as Outline
    },
    async generateLesson(moduleTitle: string, lessonTitle: string, topic: string) {
      if (!baseUrl || !apiKey || !model) throw new Error('LLM env missing')
      const sys = 'You write crisp, beginner-friendly lessons (400-600 words) with clear sections and examples.'
      const user = `Topic: ${topic}\nModule: ${moduleTitle}\nLesson: ${lessonTitle}\nWrite the full lesson content.`
      return await chatText(baseUrl, apiKey, model, sys, user)
    },
    async embed(text: string) {
      const eb = process.env.EMBED_BASE_URL
      const ek = process.env.EMBED_API_KEY
      const em = process.env.EMBED_MODEL
      if (!eb || !ek || !em) return []
      return await embedText(eb, ek, em, text)
    },

    // NEW:
    async chat(messages) {
      if (!baseUrl || !apiKey || !model) throw new Error('LLM env missing')
      return await callChat(baseUrl, apiKey, model, messages)
    },
  }
}
```


===== FILE: src/llm/mock.ts (1202 bytes) =====
```ts
import type { LLMProvider, Outline } from './types'

export function createMockProvider(): LLMProvider {
  return {
    async generateOutline(topic: string) {
      const outline: Outline = {
        title: `Intro to ${topic}`,
        modules: Array.from({length: 4}).map((_, i) => ({
          title: `Module ${i+1}: ${topic} – Part ${i+1}`,
          description: `Overview of ${topic} (part ${i+1}).`,
          lessons: Array.from({length: 3}).map((__, j) => ({ title: `${topic} Lesson ${i+1}.${j+1}` }))
        }))
      }
      return outline
    },
    async generateLesson(moduleTitle: string, lessonTitle: string, topic: string) {
      return `# ${lessonTitle}\n\nThis is a mock lesson for **${topic}** under _${moduleTitle}_.\n\n- Key idea 1\n- Key idea 2\n- Key idea 3\n\n> Replace mock with real Kimi by setting env.`
    },
    async embed(text: string) {
      // Return a small deterministic vector (not used by DB yet)
      return Array.from({length: 16}).map((_, i) => (i + text.length % 7) / 100)
    },
    chat: async (messages) => {
      const last = messages.filter(m => m.role === 'user').slice(-1)[0]?.content || ''
      return `Mock: ${last.slice(0, 400)}`
    },
  }
}
```


===== FILE: src/llm/types.ts (679 bytes) =====
```ts
export type Outline = {
  title: string
  modules: { title: string; description?: string; lessons: { title: string }[] }[]
}

export type GeneratedCourse = {
  outline: Outline
  lessons: { moduleIndex: number; title: string; content: string }[]
}


// add at top (or near other types)
export type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string }

// extend the provider interface
export type LLMProvider = {
  generateOutline(topic: string): Promise<Outline>
  generateLesson(moduleTitle: string, lessonTitle: string, topic: string): Promise<string>
  embed?(text: string): Promise<number[]>
  // NEW:
  chat?(messages: ChatMessage[]): Promise<string>
}

```


===== FILE: tsconfig.json (689 bytes) =====
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": [
      "dom",
      "dom.iterable",
      "es2021"
    ],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "types": [
      "node"
    ],
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ]
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}

```
