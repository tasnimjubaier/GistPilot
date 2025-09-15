import { NextResponse } from "next/server";
import { z } from "zod";
import { SiteMap } from "../../../../../src/orchestrator/nodes";

const Body = z.object({ url: z.string().url(), depth: z.number().optional(), pages: z.number().optional() });

export async function POST(req: Request) {
  const data = await req.json().catch(() => ({}));
  const P = Body.safeParse(data);
  if (!P.success) return NextResponse.json({ error: P.error.flatten() }, { status: 400 });

  const state = await SiteMap({ seedUrl: P.data.url, errors: [] } as any);
  return NextResponse.json({ map: state.map ?? [] });
}
