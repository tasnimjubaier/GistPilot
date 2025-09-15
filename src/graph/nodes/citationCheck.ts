import { embedTexts } from '@/src/lib/embeddings';

/**
 * Very lightweight support checker:
 *  - split answer into sentences
 *  - for each sentence, compute max cosine similarity to any context chunk
 *  - flag if below threshold
 */
export async function checkCitations(answer: string, contexts: { text: string }[], threshold = 0.23) {
  const sents = answer
    .replace(/\n+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(Boolean);

  if (sents.length === 0 || contexts.length === 0) return { unsupported: [], supported: sents };

  const sentEmb = await embedTexts(sents);
  const ctxEmb = await embedTexts(contexts.map(c => c.text));

  const unsupported: string[] = [];
  const supported: string[] = [];

  function cos(a: number[], b: number[]) {
    let dot = 0, na = 0, nb = 0;
    for (let i = 0; i < a.length; i++) { dot += a[i]*b[i]; na += a[i]*a[i]; nb += b[i]*b[i]; }
    return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-8);
  }

  for (let i = 0; i < sents.length; i++) {
    let best = -1;
    for (let j = 0; j < ctxEmb.length; j++) {
      const c = cos(sentEmb[i], ctxEmb[j]);
      if (c > best) best = c;
    }
    (best >= threshold ? supported : unsupported).push(sents[i]);
  }

  return { unsupported, supported };
}
