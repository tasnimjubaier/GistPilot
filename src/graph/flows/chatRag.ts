import { createRun, finishRun, pushStep } from '@/src/graph/run';
import { retrieveRelevant } from '@/src/graph/nodes/retrieve';
import { chat } from '@/src/graph/llmChat';

export async function runChatRag(input: { courseId?: number; message: string }) {
  const run = await createRun('CHAT_RAG', input, {
    nodes: ['Retriever','Answerer'],
    edges: [['Retriever','Answerer']]
  });

  try {
    await pushStep(run.id, 'Retriever', 'running', { in: { q: input.message } });
    const ctx = await retrieveRelevant(input.message, 6);
    await pushStep(run.id, 'Retriever', 'succeeded', { out: { k: ctx.length } });

    const contextText = ctx.map((c,i)=>`[S${i+1}] ${c.text}`).join('\n\n');
    const { text } = await chat([
      { role: 'system', content: 'Answer using the provided context. Cite sources [S1], [S2]. If missing info, say so.' },
      { role: 'user', content: `Context:\n${contextText}\n\nQuestion: ${input.message}` }
    ]);

    await pushStep(run.id, 'Answerer', 'succeeded', { out: { text } });
    await finishRun(run.id, 'succeeded', { text });
    return { run_id: run.id, text };
  } catch (e: any) {
    await pushStep(run.id, 'ERROR', 'failed', { error_text: e?.message });
    await finishRun(run.id, 'failed', null, e?.stack || String(e));
    throw e;
  }
}
