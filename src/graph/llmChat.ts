import OpenAI from 'openai';

const kimi = new OpenAI({
  apiKey: process.env.KIMI_API_KEY!,
  baseURL: process.env.MOONSHOT_BASE_URL || 'https://api.moonshot.cn/v1',
});

export type ChatMsg = { role: 'system'|'user'|'assistant'|'tool'; content: string };

export async function chat(messages: ChatMsg[], opts?: { model?: string; temperature?: number; tools?: any[] }) {
  const model = opts?.model || process.env.CHAT_MODEL || 'moonshot-v1-32k';
  const res = await kimi.chat.completions.create({
    model,
    temperature: opts?.temperature ?? 0.2,
    messages,
    tools: opts?.tools
  });
  const c = res.choices[0];
  return { text: c.message?.content || '', raw: res, usage: res.usage, model };
}
