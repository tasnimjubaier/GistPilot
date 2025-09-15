type TavilySearchItem = { url: string; title: string; content?: string };
type TavilySearchResp = { query: string; results: TavilySearchItem[] };

export type TavilyExtractItem = { url: string; title?: string; content?: string };
type TavilyExtractResp = { results: TavilyExtractItem[] };

type TavilyCrawlPage = { url: string; title?: string; content?: string };
type TavilyCrawlResp = { status: string; results: TavilyCrawlPage[] };

const BASE = "https://api.tavily.com";
const KEY = process.env.TAVILY_API_KEY!;

async function jpost<T>(path: string, body: any): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${KEY}`, // Tavily uses Bearer auth
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Tavily ${path} ${res.status} ${await res.text()}`);
  return res.json();
}

export async function tavilySearch(queries: string[], maxPerQuery = 5) {
  const out: TavilySearchItem[] = [];
  for (const q of queries) {
    const data = await jpost<TavilySearchResp>("/search", {
      query: q,
      search_depth: "basic",
      max_results: maxPerQuery,
    });
    for (const r of data.results) {
      if (!out.find((o) => o.url === r.url)) out.push(r);
      if (out.length >= 20) break;
    }
    if (out.length >= 20) break;
  }
  return out;
}

export async function tavilyExtract(urls: string[]) {
  if (!urls.length) return [] as TavilyExtractItem[];
  const data = await jpost<TavilyExtractResp>("/extract", { urls });
  return data.results || [];
}

export async function tavilyCrawl(seedUrl: string, maxDepth = 1, maxPages = 10) {
  const data = await jpost<TavilyCrawlResp>("/crawl", {
    url: seedUrl,
    max_depth: Math.max(0, Math.min(3, maxDepth)),
    max_pages: Math.max(1, Math.min(50, maxPages)),
  });
  return data.results || [];
}

export async function tavilyMap(seedUrl: string, maxDepth = 1, maxPages = 15) {
  const pages = await tavilyCrawl(seedUrl, maxDepth, maxPages);
  return pages.map((p) => ({ url: p.url, title: p.title ?? p.url }));
}
