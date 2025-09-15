import { NextResponse } from 'next/server';
import { getRun } from '@/src/graph/run';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!id) return NextResponse.json({ error: 'bad id' }, { status: 400 });
  const data = await getRun(id);
  return NextResponse.json(data);
}
