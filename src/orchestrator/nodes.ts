import type { State } from "./state";
import { chat } from "../graph/llmChat";                 // Kimi wrapper you already have
import { embedTexts } from "../lib/embeddings";           // OpenAI embeddings
import { exec, q, toVectorLiteral } from "../lib/db";     // fixed exports
import { tavilySearch, tavilyExtract, tavilyMap } from "../web/tavily";

// helper to push error into state
function pushErr(s: State, e: any): Partial<State> {
  const msg = e?.message || String(e);
  return { errors: [...(s.errors || []), msg] };
}

// 1) QueryPlanner
export async function QueryPlanner(s: State): Promise<Partial<State>> {
  if (!s.topic) return pushErr(s, new Error("topic missing"));
  const { text } = await chat([
    { role: "system", content: "Expand a topic into diverse web search queries. JSON array only." },
    { role: "user", content: `Topic: ${s.topic}. Include overview, tutorial, pitfalls, latest, alternatives, case studies.` },
  ]);
  let queries: string[] = [];
  try {
    const a = JSON.parse(text);
    if (Array.isArray(a)) queries = a.slice(0, 10);
  } catch {}
  if (!queries.length) {
    queries = [
      `${s.topic} overview`,
      `${s.topic} tutorial`,
      `${s.topic} pitfalls`,
      `${s.topic} latest`,
      `${s.topic} prerequisites`,
      `${s.topic} case studies`,
    ];
  }
  return { queries };
}

// 2) WebIntel via Tavily (search + extract + store into sources/source_chunks)
export async function WebIntel(s: State): Promise<Partial<State>> {
  if (!s.queries?.length) return pushErr(s, new Error("queries missing"));

  const results = await tavilySearch(s.queries, 5);
  const pages = await tavilyExtract(results.map((r) => r.url).slice(0, 12));

  const texts = pages
    .map((p) => p.content || "")
    .filter((t) => t.length > 400)
    .map((t) => t.slice(0, 6000));

  const titles = pages.map((p) => p.title || "").filter(Boolean);

  if (!texts.length) return { intelTitles: s.queries.map((q) => `Intent: ${q}`) };

  const emb = await embedTexts(texts);

  for (let i = 0; i < texts.length; i++) {
    const url = pages[i].url;
    const title = pages[i].title ?? results.find((r) => r.url === url)?.title ?? url;
    const meta = JSON.stringify({ url, title });
    const sRes = await exec(
      "INSERT INTO sources (url, title, domain, score, meta_json) VALUES (?,?,?,?,?)",
      [url, title, new URL(url).hostname, 0.6, meta]
    );
    // store the raw text and a JSON vector string (TiDB Vector)
    await exec(
      "INSERT INTO source_chunks (source_id, ord, text, embedding) VALUES (?,?,?, ?)",
      [sRes.insertId, 0, texts[i], toVectorLiteral(emb[i])]
    );
  }

  return { intelTitles: titles.slice(0, 12) };
}

// 3) Optional site map
export async function SiteMap(s: State): Promise<Partial<State>> {
  if (!s.seedUrl) return pushErr(s, new Error("seedUrl missing"));
  const map = await tavilyMap(s.seedUrl, 1, 15);
  return { map };
}

// 4) Outline synthesizer
export async function OutlineSynth(s: State): Promise<Partial<State>> {
  if (!s.topic) return pushErr(s, new Error("topic missing"));
  const hints = s.intelTitles?.join("\n") || "";
  const { text } = await chat([
    { role: "system", content: 'Return strict JSON: { "modules": [ { "title":..., "lessons":[{ "title":... }] } ] }' },
    { role: "user", content: `Create a 4–6 module outline on "${s.topic}". Consider:\n${hints}\nEach module has 3–5 lessons.` },
  ]);
  try {
    const outline = JSON.parse(text);
    if (!outline?.modules?.length) throw new Error("no modules");
    return { outline };
  } catch {
    return {
      outline: { modules: [{ title: `${s.topic} Basics`, lessons: [{ title: "Intro" }, { title: "Key Ideas" }, { title: "First Project" }] }] },
    };
  }
}

// 5) Retrieve with TiDB Vector (cosine distance) + fallback LIKE
export async function Retrieve(s: State): Promise<Partial<State>> {
  const query = s.question ?? `${s.topic ?? ""} ${s.lessonTitle ?? ""}`.trim();
  if (!query) return pushErr(s, new Error("query missing"));

  try {
    const [qvec] = await embedTexts([query]);
    const jsonVec = toVectorLiteral(qvec); // '[..]' for VEC_COSINE_DISTANCE
    const rows = await q<any>(
      `SELECT id, text
       FROM source_chunks
       ORDER BY VEC_COSINE_DISTANCE(embedding, ?) ASC
       LIMIT 10`,
      [jsonVec]
    );
    if (rows?.length) return { retrieved: rows.map((r: any) => ({ id: r.id, text: r.text })) };
  } catch (e) {
    // ignore and fallback
  }

  const like = `%${query.split(/\s+/).slice(0, 3).join("%")}%`;
  const rows = await q<any>(`SELECT id, text FROM source_chunks WHERE text LIKE ? LIMIT 10`, [like]);
  return { retrieved: rows.map((r: any) => ({ id: r.id, text: r.text })) };
}

// 6) Rerank (MMR-lite with embeddings)
function cos(a: number[], b: number[]) {
  let d = 0,
    na = 0,
    nb = 0;
  for (let i = 0; i < a.length; i++) {
    d += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return d / (Math.sqrt(na) * Math.sqrt(nb) + 1e-8);
}
export async function Rerank(s: State): Promise<Partial<State>> {
  const docs = s.retrieved ?? [];
  if (!docs.length) return { reranked: [] };
  const query = s.question ?? `${s.topic ?? ""} ${s.lessonTitle ?? ""}`.trim();
  const [qv] = await embedTexts([query]);
  const dv = await embedTexts(docs.map((d) => d.text));
  const selected: number[] = [];
  const cand = new Set(dv.map((_, i) => i));
  while (selected.length < Math.min(8, dv.length)) {
    let best = -Infinity,
      idx = -1;
    for (const i of cand) {
      const rel = cos(qv, dv[i]);
      let div = 0;
      for (const sidx of selected) div = Math.max(div, cos(dv[i], dv[sidx]));
      const score = 0.7 * rel - 0.3 * div;
      if (score > best) {
        best = score;
        idx = i;
      }
    }
    selected.push(idx);
    cand.delete(idx);
  }
  return { reranked: selected.map((i) => docs[i]) };
}

// 7) ComposeLesson (also used for Chat answers if lessonTitle is missing)
export async function ComposeLesson(s: State): Promise<Partial<State>> {
  const ctx = (s.reranked ?? s.retrieved ?? []).map((c, i) => `[S${i + 1}] ${c.text}`).join("\n\n");

  if (s.lessonTitle && s.topic) {
    const { text } = await chat([
      { role: "system", content: "Write a clear lesson with citations like [S1]. Sections: Overview, Key Concepts, Worked Example, 3 Quiz Qs." },
      { role: "user", content: `Topic: ${s.topic}\nLesson: ${s.lessonTitle}\nContext:\n${ctx}` },
    ]);
    return { lesson: text };
  }

  // Chat mode: answer the user's question using context
  const question = s.question ?? "Explain:";
  const { text } = await chat([
    { role: "system", content: "Answer clearly using the context. Cite as [S1], [S2] etc. If unknown, say so." },
    { role: "user", content: `Question: ${question}\nContext:\n${ctx}` },
  ]);
  return { lesson: text };
}

// 8) CitationCheck (embedding support check)
export async function CitationCheck(s: State): Promise<Partial<State>> {
  const lesson = s.lesson ?? "";
  const contexts = (s.reranked ?? s.retrieved ?? []).map((c) => c.text);
  if (!lesson || !contexts.length) return { audit: { unsupported: [], supported: [] } };
  const sentences = lesson.replace(/\n+/g, " ").split(/(?<=[.!?])\s+/).map((x) => x.trim()).filter(Boolean);
  const sentEmb = await embedTexts(sentences);
  const ctxEmb = await embedTexts(contexts);
  const unsupported: string[] = [];
  const supported: string[] = [];
  for (let i = 0; i < sentEmb.length; i++) {
    let best = -1;
    for (let j = 0; j < ctxEmb.length; j++) best = Math.max(best, cos(sentEmb[i], ctxEmb[j]));
    (best >= 0.23 ? supported : unsupported).push(sentences[i]);
  }
  return { audit: { unsupported, supported } };
}

// 9) SaveLesson (safe shim—wire to your schema later)
export async function SaveLesson(s: State): Promise<Partial<State>> {
  if (!s.lessonTitle || !s.lesson) return pushErr(s, new Error("lesson missing"));
  await exec(
    "CREATE TABLE IF NOT EXISTS lessons (id BIGINT PRIMARY KEY AUTO_INCREMENT, title VARCHAR(512), content MEDIUMTEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"
  ).catch(() => {});
  await exec("INSERT INTO lessons (title, content) VALUES (?,?)", [s.lessonTitle, s.lesson]);
  return {};
}
