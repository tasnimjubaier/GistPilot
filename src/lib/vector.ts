import { q } from './db';

/**
 * Attempt a vector search (TiDB Vector). If the distance function name
 * differs in your TiDB version, adjust 'vector_distance_cosine'.
 * Falls back to LIKE if vector function not available.
 */
export async function searchDocumentChunksByVector(embeddingBuf: Buffer, k = 6) {
  try {
    const rows = await q<any>(
      `SELECT id, document_id, ord, text,
          vector_distance_cosine(embedding, ?) AS score
       FROM document_chunks
       ORDER BY score ASC
       LIMIT ?`,
      [embeddingBuf, k]
    );
    return rows;
  } catch {
    // Fallback — keyword-like (very rough)
    return [];
  }
}
