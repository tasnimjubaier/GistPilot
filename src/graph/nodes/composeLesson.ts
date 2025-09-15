import { chat } from '@/src/graph/llmChat';

export async function composeLesson(topic: string, lessonTitle: string, contexts: {text: string}[]) {
  const ctx = contexts.map((c,i) => `# Source ${i+1}\n${c.text}`).join('\n\n');
  const { text } = await chat([
    { role: 'system', content: 'Write clear, attributable lesson content. Cite sources inline as [S1], [S2] etc.' },
    { role: 'user', content: `Topic: ${topic}\nLesson: ${lessonTitle}\n\nUse these sources:\n${ctx}\n\nProduce:\n- Overview\n- Key Concepts\n- Worked Example\n- Mini quiz (3 questions)\nInclude citations like [S1] where facts appear.` }
  ]);
  return { content: text };
}
