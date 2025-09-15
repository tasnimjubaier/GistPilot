import { exec, q } from '../lib/db';

export async function createRun(kind: string, input: any, graph?: any) {
  const res = await exec(
    'INSERT INTO runs (kind, status, input_json, graph_json, started_at) VALUES (?, "running", ?, ?, NOW())',
    [kind, JSON.stringify(input ?? null), JSON.stringify(graph ?? null)]
  );
  return { id: res.insertId as number };
}

export async function pushStep(run_id: number, node: string, status: 'running'|'succeeded'|'failed', payload: {
  in?: any; out?: any; tokens?: any; timings?: any; error_text?: string;
}) {
  await exec(
    'INSERT INTO run_steps (run_id, node, status, in_json, out_json, tokens_json, timings_json, error_text) VALUES (?,?,?,?,?,?,?,?)',
    [
      run_id, node, status,
      JSON.stringify(payload.in ?? null),
      JSON.stringify(payload.out ?? null),
      JSON.stringify(payload.tokens ?? null),
      JSON.stringify(payload.timings ?? null),
      payload.error_text ?? null
    ]
  );
}

export async function finishRun(run_id: number, status: 'succeeded'|'failed', output?: any, error_text?: string) {
  await exec(
    'UPDATE runs SET status=?, output_json=?, error_text=?, finished_at=NOW() WHERE id=?',
    [status, JSON.stringify(output ?? null), error_text ?? null, run_id]
  );
}

export async function getRun(id: number) {
  const [run] = await q<any>('SELECT * FROM runs WHERE id=?', [id]);
  const steps = await q<any>('SELECT * FROM run_steps WHERE run_id=? ORDER BY id', [id]);
  return { run, steps };
}
