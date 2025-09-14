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
