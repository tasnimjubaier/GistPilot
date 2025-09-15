import { NextResponse } from "next/server";
import { z } from "zod";
import { ChatRagGraph } from "../../../../src/orchestrator/graphs";

const Body = z.object({ message: z.string().min(1) });

export async function POST(req: Request) {
  const data = await req.json().catch(() => ({}));
  const P = Body.safeParse(data);
  if (!P.success) return NextResponse.json({ error: P.error.flatten() }, { status: 400 });

  const initial = { question: P.data.message };
  const final: any = await ChatRagGraph.invoke(initial as any);
  return NextResponse.json({ text: final.lesson ?? "" });
}
