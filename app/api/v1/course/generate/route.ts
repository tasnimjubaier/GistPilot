import { NextResponse } from 'next/server';
import { z } from 'zod';
import { runCourseGen } from '@/src/graph/flows/courseGen';

const Body = z.object({
  topic: z.string().min(3),
  moduleTitle: z.string().min(1),
  lessonTitle: z.string().min(1),
});

export async function POST(req: Request) {
  const data = await req.json().catch(()=> ({}));
  const P = Body.safeParse(data);
  if (!P.success) return NextResponse.json({ error: P.error.flatten() }, { status: 400 });
  const out = await runCourseGen(P.data);
  return NextResponse.json(out);
}
