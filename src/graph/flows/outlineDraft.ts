import { createRun, finishRun, pushStep } from '@/src/graph/run';
import { queryPlanner } from '@/src/graph/nodes/queryPlanner';
import { webIntel } from '@/src/graph/nodes/webIntel';
import { outlineSynth } from '@/src/graph/nodes/outlineSynth';

export async function runOutlineDraft(input: { topic: string }) {
  const run = await createRun('OUTLINE_DRAFT', input, {
    nodes: ['QueryPlanner','WebIntel','OutlineSynth'],
    edges: [['QueryPlanner','WebIntel'],['WebIntel','OutlineSynth']]
  });

  try {
    await pushStep(run.id, 'QueryPlanner', 'running', { in: input });
    const queries = await queryPlanner(input.topic);
    await pushStep(run.id, 'QueryPlanner', 'succeeded', { out: { queries } });

    await pushStep(run.id, 'WebIntel', 'running', { in: { queries } });
    const intel = await webIntel(queries);
    await pushStep(run.id, 'WebIntel', 'succeeded', { out: intel });

    await pushStep(run.id, 'OutlineSynth', 'running', { in: { topic: input.topic, hints: intel.titles } });
    const outline = await outlineSynth(input.topic, intel.titles);
    await pushStep(run.id, 'OutlineSynth', 'succeeded', { out: { outline } });

    await finishRun(run.id, 'succeeded', { outline });
    return { run_id: run.id, outline };
  } catch (e: any) {
    await pushStep(run.id, 'ERROR', 'failed', { error_text: e?.message });
    await finishRun(run.id, 'failed', null, e?.stack || String(e));
    throw e;
  }
}
