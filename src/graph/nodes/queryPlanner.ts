import { chat } from '@/src/graph/llmChat';

export async function queryPlanner(topic: string): Promise<string[]> {
  const { text } = await chat([
    { role: 'system', content: 'Expand a topic into diverse web search queries. Return pure JSON array.' },
    { role: 'user', content: `Topic: ${topic}\nInclude: overview, tutorial, prerequisites, pitfalls, latest, alternatives, case studies.` }
  ]);
  try {
    const arr = JSON.parse(text);
    return Array.isArray(arr) ? arr.slice(0, 10) : [`${topic} overview`];
  } catch {
    return [
      `${topic} overview`,
      `${topic} prerequisites`,
      `${topic} pitfalls`,
      `${topic} latest`,
      `${topic} tutorial`,
      `${topic} case studies`,
    ];
  }
}
