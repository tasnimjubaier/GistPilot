import { embedQuery } from '@/src/lib/embeddings';
import { floatsToVectorBuffer, q } from '@/src/lib/db';

export async function retrieveRelevant(query: string, k = 6) {
  const v = await embedQuery(query);
  const buf = floatsToVectorBuffer(v);
  try {
    const rows = await q<any>(
      `SELECT id, document_id, ord, text,
          vector_distance_cosine(embedding, ?) AS score
       FROM document_chunks
       ORDER BY score ASC
       LIMIT ?`,
      [buf, k]
    );
    return rows;
  } catch {
    // worst-case fallback
    const like = `%${query.split(/\s+/).slice(0,3).join('%')}%`;
    return await q<any>(
      `SELECT id, document_id, ord, text, 0 AS score
       FROM document_chunks
       WHERE text LIKE ?
       LIMIT ?`,
      [like, k]
    );
  }
}
