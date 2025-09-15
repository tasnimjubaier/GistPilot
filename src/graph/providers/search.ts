import type { RequestInit } from 'node-fetch';

export type SearchResult = { url: string; title: string; snippet?: string };

const provider = (process.env.SEARCH_PROVIDER || 'none').toLowerCase();

async function fetchJSON(url: string, init: RequestInit = {}) {
  const res = await fetch(url, init as any);
  if (!res.ok) throw new Error(`search fetch ${res.status}`);
  return res.json();
}

/** Tavily: https://docs.tavily.com */
async function searchTavily(q: string): Promise<SearchResult[]> {
  const key = process.env.TAVILY_API_KEY!;
  const res = await fetchJSON('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
    body: JSON.stringify({
      query: q,
      search_depth: 'basic',   // or 'advanced'
      include_domains: [],
      exclude_domains: [],
      max_results: 5
    })
  });
  const items = res?.results || [];
  return items.map((r: any) => ({ url: r.url, title: r.title, snippet: r.content }));
}

/** Brave: https://brave.com/search/api/ */
async function searchBrave(q: string): Promise<SearchResult[]> {
  const key = process.env.BRAVE_API_KEY!;
  const params = new URLSearchParams({ q, count: '10', country: 'us' });
  const res = await fetchJSON(`https://api.search.brave.com/res/v1/web/search?${params}`, {
    headers: { 'Accept': 'application/json', 'X-Subscription-Token': key }
  });
  const items = res?.web?.results || [];
  return items.map((r: any) => ({ url: r.url, title: r.title, snippet: r.description }));
}

/** Serper.dev: https://serper.dev */
async function searchSerper(q: string): Promise<SearchResult[]> {
  const key = process.env.SERPER_API_KEY!;
  const res = await fetchJSON('https://google.serper.dev/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-API-KEY': key },
    body: JSON.stringify({ q, num: 10 })
  });
  const items = res?.organic || [];
  return items.map((r: any) => ({ url: r.link, title: r.title, snippet: r.snippet }));
}

export async function searchWeb(queries: string[]): Promise<SearchResult[]> {
  const out: SearchResult[] = [];
  for (const q of queries) {
    let items: SearchResult[] = [];
    if (provider === 'tavily') items = await searchTavily(q);
    else if (provider === 'brave') items = await searchBrave(q);
    else if (provider === 'serper') items = await searchSerper(q);
    else items = []; // none
    for (const it of items) {
      // dedupe by URL
      if (!out.find(o => o.url === it.url)) out.push(it);
      if (out.length >= 20) break;
    }
    if (out.length >= 20) break;
  }
  return out;
}
