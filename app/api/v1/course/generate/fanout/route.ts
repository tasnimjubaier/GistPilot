import { NextResponse } from "next/server";
import { z } from "zod";
import { LessonPipelineGraph } from "../../../../../../src/orchestrator/graphs";

const Body = z.object({
  topic: z.string().min(3),
  outline: z.object({
    modules: z.array(z.object({ title: z.string(), lessons: z.array(z.object({ title: z.string() })) })),
  }),
  maxModules: z.number().optional(),
  maxLessonsPerModule: z.number().optional(),
});

export async function POST(req: Request) {
  const data = await req.json().catch(() => ({}));
  const P = Body.safeParse(data);
  if (!P.success) return NextResponse.json({ error: P.error.flatten() }, { status: 400 });

  const { topic, outline } = P.data;
  const maxM = P.data.maxModules ?? 4;
  const maxL = P.data.maxLessonsPerModule ?? 3;

  const items: any[] = [];
  for (const mod of outline.modules.slice(0, maxM)) {
    for (const lesson of mod.lessons.slice(0, maxL)) {
      const initial = { topic, lessonTitle: lesson.title, question: `${topic} ${lesson.title}` };
      const state: any = await LessonPipelineGraph.invoke(initial as any);
      items.push({
        moduleTitle: mod.title,
        lessonTitle: lesson.title,
        content: state.lesson,
        unsupported: state.audit?.unsupported?.length ?? 0,
      });
    }
  }

  return NextResponse.json({ generated: items.length, items });
}
