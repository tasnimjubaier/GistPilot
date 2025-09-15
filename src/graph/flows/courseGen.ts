import { createRun, finishRun, pushStep } from '@/src/graph/run';
import { retrieveRelevant } from '@/src/graph/nodes/retrieve';
import { composeLesson } from '@/src/graph/nodes/composeLesson';

export async function runCourseGen(input: { topic: string; moduleTitle: string; lessonTitle: string }) {
  const run = await createRun('COURSE_GEN', input, {
    nodes: ['Retriever','Composer'],
    edges: [['Retriever','Composer']]
  });

  try {
    await pushStep(run.id, 'Retriever', 'running', { in: input });
    const ctx = await retrieveRelevant(`${input.topic} ${input.lessonTitle}`, 6);
    await pushStep(run.id, 'Retriever', 'succeeded', { out: { k: ctx.length } });

    await pushStep(run.id, 'Composer', 'running', { in: { lessonTitle: input.lessonTitle } });
    const lesson = await composeLesson(input.topic, input.lessonTitle, ctx);
    await pushStep(run.id, 'Composer', 'succeeded', { out: { size: lesson.content?.length || 0 } });

    await finishRun(run.id, 'succeeded', { lesson });
    return { run_id: run.id, lesson };
  } catch (e: any) {
    await pushStep(run.id, 'ERROR', 'failed', { error_text: e?.message });
    await finishRun(run.id, 'failed', null, e?.stack || String(e));
    throw e;
  }
}
