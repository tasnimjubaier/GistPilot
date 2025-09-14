import type { LLMProvider, Outline } from './types'

export function createMockProvider(): LLMProvider {
  return {
    async generateOutline(topic: string) {
      const outline: Outline = {
        title: `Intro to ${topic}`,
        modules: Array.from({length: 4}).map((_, i) => ({
          title: `Module ${i+1}: ${topic} – Part ${i+1}`,
          description: `Overview of ${topic} (part ${i+1}).`,
          lessons: Array.from({length: 3}).map((__, j) => ({ title: `${topic} Lesson ${i+1}.${j+1}` }))
        }))
      }
      return outline
    },
    async generateLesson(moduleTitle: string, lessonTitle: string, topic: string) {
      return `# ${lessonTitle}\n\nThis is a mock lesson for **${topic}** under _${moduleTitle}_.\n\n- Key idea 1\n- Key idea 2\n- Key idea 3\n\n> Replace mock with real Kimi by setting env.`
    },
    async embed(text: string) {
      // Return a small deterministic vector (not used by DB yet)
      return Array.from({length: 16}).map((_, i) => (i + text.length % 7) / 100)
    },
    chat: async (messages) => {
      const last = messages.filter(m => m.role === 'user').slice(-1)[0]?.content || ''
      return `Mock: ${last.slice(0, 400)}`
    },
  }
}