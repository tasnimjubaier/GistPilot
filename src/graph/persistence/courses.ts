/**
 * Map these functions to your real tables.
 * For now they just no-op insert and return fake ids
 * so the pipeline runs end-to-end.
 */
import { exec } from '@/src/lib/db';

export async function saveLesson(input: {
  moduleTitle: string;
  lessonTitle: string;
  content: string;
  sources: { label: string }[];
}) {
  // Example: write to a generic lessons table if you have one
  const res = await exec(
    'INSERT INTO lessons (title, content, sources_json) VALUES (?, ?, ?)',
    [input.lessonTitle, input.content, JSON.stringify(input.sources)]
  ).catch(() => ({ insertId: Math.floor(Math.random()*1e9) } as any)); // fallback if table doesn't exist yet

  return { lessonId: (res as any).insertId as number };
}
