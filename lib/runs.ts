import { exec, q } from './db';

export type Run = { id: number; kind: string; status: string };

export async function createRun(kind: string, input: any, graph?: any) {
  const res = await exec(
    'INSERT INTO runs (kind, status, input_json, graph_json, started_at) VALUES (?, "running", ?, ?, NOW())',
    [kind, JSON.stringify(input ?? null), JSON.stringify(graph ?? null)]
  );
  const id = (res.insertId as number);
  return { id, kind, status: 'running' } as Run;
}

export async function finishRun(id: number, status: 'succeeded'|'failed', output?: any, error_text?: string) {
  await exec(
    'UPDATE runs SET status=?, output_json=?, error_text=?, finished_at=NOW() WHERE id=?',
    [status, JSON.stringify(output ?? null), error_text ?? null, id]
  );
}

export async function pushStep(run_id: number, node: string, status: 'running'|'succeeded'|'failed', data: {
  in?: any; out?: any; tokens?: any; timings?: any; error_text?: string;
}) {
  await exec(
    'INSERT INTO run_steps (run_id, node, status, in_json, out_json, tokens_json, timings_json, error_text) VALUES (?,?,?,?,?,?,?,?)',
    [
      run_id, node, status,
      JSON.stringify(data.in ?? null),
      JSON.stringify(data.out ?? null),
      JSON.stringify(data.tokens ?? null),
      JSON.stringify(data.timings ?? null),
      data.error_text ?? null
    ]
  );
}

export async function getRunWithSteps(id: number) {
  const [run] = await q<any>('SELECT * FROM runs WHERE id=?', [id]);
  const steps = await q<any>('SELECT * FROM run_steps WHERE run_id=? ORDER BY id ASC', [id]);
  return { run, steps };
}
