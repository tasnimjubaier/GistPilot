import { NextResponse } from "next/server";
import { z } from "zod";
import { OutlineDraftGraph } from "@/src/orchestrator/graphs";

const Body = z.object({ topic: z.string().min(3) });

export async function POST(req: Request) {
  const data = await req.json().catch(() => ({}));
  const P = Body.safeParse(data);
  if (!P.success) return NextResponse.json({ error: P.error.flatten() }, { status: 400 });

  const initial = { topic: P.data.topic };
  const final: any = await OutlineDraftGraph.invoke(initial as any);
  return NextResponse.json({ outline: final.outline, intelTitles: final.intelTitles ?? [] });
}
