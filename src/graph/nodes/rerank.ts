import { embedTexts } from '@/src/lib/embeddings';

type Doc = { id: number; text: string; score?: number };

/** Cosine similarity over raw vectors */
function cos(a: number[], b: number[]) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) { dot += a[i]*b[i]; na += a[i]*a[i]; nb += b[i]*b[i]; }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-8);
}

/** Maximal Marginal Relevance reranking (diversity vs relevance) */
export async function mmrRerank(query: string, docs: Doc[], lambda = 0.7, k = 6): Promise<Doc[]> {
  if (docs.length === 0) return [];
  const [qv] = await embedTexts([query]);
  const dv = await embedTexts(docs.map(d => d.text));
  const selected: number[] = [];
  const cand = new Set(docs.map((_, i) => i));

  while (selected.length < Math.min(k, docs.length)) {
    let best = -Infinity;
    let bestIdx = -1;
    for (const i of cand) {
      const rel = cos(qv, dv[i]);
      let div = 0;
      for (const s of selected) div = Math.max(div, cos(dv[i], dv[s]));
      const score = lambda * rel - (1 - lambda) * div;
      if (score > best) { best = score; bestIdx = i; }
    }
    selected.push(bestIdx);
    cand.delete(bestIdx);
  }

  return selected.map(i => ({ ...docs[i], score: undefined }));
}
