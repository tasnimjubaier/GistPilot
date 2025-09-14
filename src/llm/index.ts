import { createMockProvider } from './mock'
import { createKimiProvider } from './kimi'
import type { LLMProvider } from './types'

export function getProvider(): LLMProvider {
  const p = (process.env.LLM_PROVIDER || 'mock').toLowerCase()
  if (p === 'kimi') return createKimiProvider()
  return createMockProvider()
}