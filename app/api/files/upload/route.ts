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
