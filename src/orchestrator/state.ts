import { z } from "zod";

export const StateSchema = z.object({
  // inputs / shared
  topic: z.string().optional(),
  queries: z.array(z.string()).default([]),
  intelTitles: z.array(z.string()).default([]),
  outline: z
    .object({
      modules: z.array(
        z.object({
          title: z.string(),
          lessons: z.array(z.object({ title: z.string() })),
        })
      ),
    })
    .optional(),

  // web map
  seedUrl: z.string().optional(),
  map: z.array(z.object({ url: z.string(), title: z.string() })).default([]),

  // retrieval
  question: z.string().optional(),
  retrieved: z.array(z.object({ id: z.number().optional(), text: z.string() })).default([]),
  reranked: z.array(z.object({ id: z.number().optional(), text: z.string() })).default([]),

  // generation + audit
  lessonTitle: z.string().optional(),
  lesson: z.string().optional(),
  audit: z
    .object({
      unsupported: z.array(z.string()),
      supported: z.array(z.string()),
    })
    .optional(),

  // errors
  errors: z.array(z.string()).default([]),
});

export type State = z.infer<typeof StateSchema>;
