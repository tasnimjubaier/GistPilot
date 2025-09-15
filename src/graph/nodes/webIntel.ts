import { CheerioAPI, load as loadHtml } from 'cheerio';
import { embedTexts } from '@/src/lib/embeddings';
import { exec, floatsToVectorBuffer } from '@/src/lib/db';
import { searchWeb } from '@/src/graph/providers/search';

function cleanHtml($: CheerioAPI) {
  $('script, style, nav, header, footer, noscript, iframe, svg').remove();
  const title = $('title').first().text().trim();
  const text = $('body').text().replace(/\s+/g, ' ').trim();
  return { title, text };
}

export async function webIntel(queries: string[]) {
  const results = await searchWeb(queries); // may be empty if provider=none
  const texts: string[] = [];
  const meta: { url: string; title: string }[] = [];

  for (const r of results.slice(0, 10)) {
    try {
      const res = await fetch(r.url, { headers: { 'User-Agent': 'Mozilla/5.0' }});
      const html = await res.text();
      const $ = loadHtml(html);
      const { title, text } = cleanHtml($);
      if (text && text.length > 400) {
        texts.push(text.slice(0, 5000));
        meta.push({ url: r.url, title: title || r.title });
      }
    } catch { /* ignore single fetch errors */ }
  }

  if (texts.length === 0) {
    return { evidence: [], titles: queries.map(q => `Intent: ${q}`) };
  }

  const embeddings = await embedTexts(texts);
  const sourceIds: number[] = [];
  for (let i = 0; i < texts.length; i++) {
    const sRes = await exec(
      'INSERT INTO sources (url, title, domain, score, meta_json) VALUES (?, ?, ?, ?, ?)',
      [meta[i].url, meta[i].title, new URL(meta[i].url).hostname, 0.5, JSON.stringify(meta[i])]
    );
    const sourceId = sRes.insertId as number;
    sourceIds.push(sourceId);

    const buf = floatsToVectorBuffer(embeddings[i]);
    await exec(
      'INSERT INTO source_chunks (source_id, ord, text, embedding) VALUES (?,?,?,?)',
      [sourceId, 0, texts[i], buf]
    );
  }

  return {
    evidence: sourceIds.map((id) => ({ sourceId: id, chunkIds: [0] })),
    titles: meta.map(m => m.title),
  };
}
