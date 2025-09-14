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
