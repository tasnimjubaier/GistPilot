export type Outline = {
  title: string
  modules: { title: string; description?: string; lessons: { title: string }[] }[]
}

export type GeneratedCourse = {
  outline: Outline
  lessons: { moduleIndex: number; title: string; content: string }[]
}

export type LLMProvider = {
  generateOutline(topic: string): Promise<Outline>
  generateLesson(moduleTitle: string, lessonTitle: string, topic: string): Promise<string>
  embed?(text: string): Promise<number[]>
}