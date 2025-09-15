import { createRun, finishRun, pushStep } from '@/src/graph/run';
import { retrieveRelevant } from '@/src/graph/nodes/retrieve';
import { mmrRerank } from '@/src/graph/nodes/rerank';
import { composeLesson } from '@/src/graph/nodes/composeLesson';
import { checkCitations } from '@/src/graph/nodes/citationCheck';
import { pLimit } from '@/src/graph/util/pLimit';
import { saveLesson } from '@/src/graph/persistence/courses';

export type Outline = { modules: { title: string; lessons: { title: string }[] }[] };

export async function runCourseGenFanout(input: {
  topic: string;
  outline: Outline;
  maxModules?: number;
  maxLessonsPerModule?: number;
  concurrency?: number;
}) {
  const run = await createRun('COURSE_GEN_FANOUT', input, {
    nodes: ['Retriever','Reranker','Composer','CitationCheck','Saver'],
    edges: [['Retriever','Reranker'],['Reranker','Composer'],['Composer','CitationCheck'],['CitationCheck','Saver']]
  });

  const maxM = input.maxModules ?? 4;
  const maxL = input.maxLessonsPerModule ?? 3;
  const limit = pLimit(input.concurrency ?? 3);

  const tasks: Promise<any>[] = [];
  const results: any[] = [];

  try {
    for (const mod of input.outline.modules.slice(0, maxM)) {
      for (const lesson of mod.lessons.slice(0, maxL)) {
        tasks.push(limit(async () => {
          // Retrieve
          await pushStep(run.id, 'Retriever', 'running', { in: { mod: mod.title, lesson: lesson.title } });
          const raw = await retrieveRelevant(`${input.topic} ${mod.title} ${lesson.title}`, 12);
          await pushStep(run.id, 'Retriever', 'succeeded', { out: { k: raw.length } });

          // Rerank
          await pushStep(run.id, 'Reranker', 'running', {});
          const reranked = await mmrRerank(`${input.topic} ${lesson.title}`, raw.map(r => ({ id: r.id, text: r.text })), 0.7, 8);
          const contexts = reranked.map(d => ({ text: d.text }));
          await pushStep(run.id, 'Reranker', 'succeeded', { out: { k: contexts.length } });

          // Compose
          await pushStep(run.id, 'Composer', 'running', {});
          const lessonDoc = await composeLesson(input.topic, lesson.title, contexts);
          await pushStep(run.id, 'Composer', 'succeeded', { out: { size: lessonDoc.content?.length || 0 } });

          // Citation check
          await pushStep(run.id, 'CitationCheck', 'running', {});
          const audit = await checkCitations(lessonDoc.content, contexts);
          await pushStep(run.id, 'CitationCheck', 'succeeded', { out: { unsupportedCount: audit.unsupported.length } });

          // Save (hook)
          await pushStep(run.id, 'Saver', 'running', {});
          const saved = await saveLesson({
            moduleTitle: mod.title,
            lessonTitle: lesson.title,
            content: lessonDoc.content,
            sources: contexts.map((c, i) => ({ label: `S${i+1}` })) // map to your chunk ids if you store them
          });
          await pushStep(run.id, 'Saver', 'succeeded', { out: { lessonId: saved.lessonId } });

          const res = { module: mod.title, lesson: lesson.title, content: lessonDoc.content, audit, saved };
          results.push(res);
          return res;
        }));
      }
    }

    const done = await Promise.all(tasks);
    await finishRun(run.id, 'succeeded', { generated: done.length });
    return { run_id: run.id, generated: done.length, items: done };
  } catch (e: any) {
    await pushStep(run.id, 'ERROR', 'failed', { error_text: e?.message });
    await finishRun(run.id, 'failed', null, e?.stack || String(e));
    throw e;
  }
}
