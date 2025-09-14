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
    }
  }
}