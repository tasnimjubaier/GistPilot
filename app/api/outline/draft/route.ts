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
