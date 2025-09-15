import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_EMBED_API_KEY! });

export async function embedTexts(texts: string[], model = process.env.EMBEDDING_MODEL || 'text-embedding-3-large') {
  const res = await client.embeddings.create({ model, input: texts });
  return res.data.map(d => d.embedding);
}

export async function embedQuery(text: string, model = process.env.EMBEDDING_MODEL || 'text-embedding-3-large') {
  const [v] = await embedTexts([text], model);
  return v;
}
