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
