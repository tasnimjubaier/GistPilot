
export type DraftLesson = { title: string }
export type DraftModule = { title: string; description?: string; lessons: DraftLesson[] }
export type DraftOutline = { title: string; modules: DraftModule[] }

export function draftFromTopic(topic: string, modules = 4, lessons = 3): DraftOutline {
  const ms = Array.from({ length: modules }).map((_, i) => ({
    title: `Module ${i+1}: ${topic} – Part ${i+1}`,
    description: `Overview of ${topic} (part ${i+1}).`,
    lessons: Array.from({ length: lessons }).map((__, j) => ({ title: `${topic} ${i+1}.${j+1}` })),
  }))
  return { title: `Intro to ${topic}`, modules: ms }
}
