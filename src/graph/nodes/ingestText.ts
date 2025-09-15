import { splitIntoChunks } from '@/src/lib/chunk';
import { embedTexts } from '@/src/lib/embeddings';
import { exec, floatsToVectorBuffer } from '@/src/lib/db';

export async function ingestText({ title, text }: { title: string; text: string }) {
  const dRes = await exec('INSERT INTO documents (title) VALUES (?)', [title || 'Untitled']);
  const document_id = dRes.insertId as number;

  const chunks = splitIntoChunks(text);
  const embeddings = await embedTexts(chunks.map(c => c.text));

  for (let i = 0; i < chunks.length; i++) {
    const buf = floatsToVectorBuffer(embeddings[i]);
    await exec(
      'INSERT INTO document_chunks (document_id, ord, text, embedding) VALUES (?,?,?,?)',
      [document_id, chunks[i].ord, chunks[i].text, buf]
    );
  }
  return { document_id, chunks: chunks.length };
}
