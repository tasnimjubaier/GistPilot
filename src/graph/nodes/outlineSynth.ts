import { chat } from '@/src/graph/llmChat';

export type Outline = { modules: { title: string; lessons: { title: string }[] }[] };

export async function outlineSynth(topic: string, hints: string[]): Promise<Outline> {
  const { text } = await chat([
    { role: 'system', content: 'Design a course outline. Return strict JSON: { "modules": [ { "title": ..., "lessons": [ { "title": ... } ] } ] }' },
    { role: 'user', content: `Create a 4–6 module outline on "${topic}". Use/consider these hints:\n${hints.join('\n')}\nEach module has 3–5 lessons.` }
  ]);
  try { return JSON.parse(text) as Outline; } catch {
    return { modules: [{ title: `${topic} Basics`, lessons:[{title:'Intro'},{title:'Core Ideas'},{title:'First Project'}]}] };
  }
}
