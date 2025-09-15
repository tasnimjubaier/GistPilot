export type Chunk = { ord: number; text: string };

export function splitIntoChunks(text: string, targetTokens = 900, overlap = 200): Chunk[] {
  // crude token approximation (4 chars ~ 1 token)
  const approx = (n: number) => n * 4;
  const maxChars = approx(targetTokens);
  const step = maxChars - approx(overlap);
  const out: Chunk[] = [];
  let i = 0, ord = 0;
  while (i < text.length) {
    const slice = text.slice(i, i + maxChars);
    out.push({ ord: ord++, text: slice });
    i += Math.max(step, 1);
  }
  return out;
}
