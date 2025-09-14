'use client';

import { useState } from 'react';

/** High-contrast palette (no Tailwind/shadcn required) */
const COLORS = {
  bg: '#0b0f14',
  fg: '#e5e7eb',
  muted: '#9ca3af',
  card: '#111827',
  border: '#1f2937',
  primary: '#60a5fa',
};

type NodeT = {
  id: string; x: number; y: number; w: number; h: number;
  title: string; note?: string; variant?: 'primary' | 'optional' | 'faint';
};
type EdgeT = { from: string; to: string; kind: 'solid' | 'dashed' | 'alt'; label?: string };

function center(n: NodeT) { return { cx: n.x + n.w / 2, cy: n.y + n.h / 2 }; }
function pathCubic(a: NodeT, b: NodeT) {
  const A = center(a), B = center(b);
  const midX = A.cx + (B.cx - A.cx) / 2;
  return `M ${A.cx} ${A.cy} C ${midX} ${A.cy}, ${midX} ${B.cy}, ${B.cx} ${B.cy}`;
}

function NodeBox({ n }: { n: NodeT }) {
  const base: React.CSSProperties = {
    position: 'absolute',
    left: n.x, top: n.y, width: n.w, height: n.h,
    borderRadius: 16, padding: 12,
    background: COLORS.card, color: COLORS.fg,
    border: `1px solid ${COLORS.border}`, boxShadow: '0 6px 24px rgba(0,0,0,.35)',
    display: 'flex', flexDirection: 'column', justifyContent: 'center',
  };
  if (n.variant === 'optional') base.border = `2px dashed ${COLORS.muted}`;
  if (n.variant === 'faint') {
    base.background = '#0f172a';
    base.color = COLORS.muted;
  }
  return (
    <div style={base}>
      <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.1 }}>{n.title}</div>
      {n.note && <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 4 }}>{n.note}</div>}
    </div>
  );
}

function GraphCanvas({ title, W, H, nodes, edges, legend }: {
  title: string; W: number; H: number; nodes: NodeT[]; edges: EdgeT[]; legend: React.ReactNode;
}) {
  const map: Record<string, NodeT> = Object.fromEntries(nodes.map(n => [n.id, n]));

  return (
    <div style={{
      width: '100%', maxWidth: 1200, height: 720, margin: '0 auto',
      position: 'relative', borderRadius: 24, border: `1px solid ${COLORS.border}`,
      background: COLORS.bg, color: COLORS.fg, overflow: 'hidden'
    }}>
      {/* edges */}
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" style={{ fill: COLORS.fg }} />
          </marker>
          <marker id="arrow-alt" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" style={{ fill: COLORS.primary }} />
          </marker>
        </defs>
        {edges.map((e, i) => {
          const a = map[e.from], b = map[e.to];
          if (!a || !b) return null;
          const d = pathCubic(a, b);
          const stroke = e.kind === 'alt' ? COLORS.primary : COLORS.fg;
          const dash = e.kind === 'dashed' ? '6 6' : undefined;
          const markerEnd = e.kind === 'alt' ? 'url(#arrow-alt)' : 'url(#arrow)';
          return (
            <g key={i}>
              <path id={`edge-${i}`} d={d} fill="none" stroke={stroke} strokeWidth={2} strokeDasharray={dash} markerEnd={markerEnd}/>
              {e.label && (
                <text fill={COLORS.muted} fontSize={10}>
                  <textPath href={`#edge-${i}`} startOffset="50%" textAnchor="middle">{e.label}</textPath>
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* nodes */}
      {nodes.map(n => <NodeBox key={n.id} n={n} />)}

      {/* header & legend */}
      <div style={{
        position: 'absolute', top: 12, left: 12, fontSize: 13, fontWeight: 600,
        background: 'rgba(17,24,39,.75)', border: `1px solid ${COLORS.border}`,
        borderRadius: 12, padding: '6px 10px', backdropFilter: 'blur(6px)'
      }}>{title}</div>

      <div style={{
        position: 'absolute', bottom: 12, left: 12, display: 'flex', gap: 16, flexWrap: 'wrap',
        fontSize: 12, background: 'rgba(17,24,39,.65)', border: `1px solid ${COLORS.border}`,
        borderRadius: 12, padding: '8px 10px', backdropFilter: 'blur(6px)', color: COLORS.fg
      }}>
        {legend}
      </div>
    </div>
  );
}

/* ------------------------ Graph Data (7 views) ------------------------ */

// 1) Mini Agent (MP1)
const MINI_W = 1200, MINI_H = 680;
const miniNodes: NodeT[] = [
  { id: 'topic', x: 40, y: 80, w: 160, h: 72, title: 'Topic Input', note: 'User enters topic', variant: 'primary' },
  { id: 'planner', x: 230, y: 80, w: 180, h: 78, title: 'Query Planner', note: 'Expand intents & terms', variant: 'primary' },
  { id: 'intel', x: 430, y: 80, w: 220, h: 96, title: 'Web Intel', note: 'Search → Fetch → Clean → Embed', variant: 'primary' },
  { id: 'synth', x: 690, y: 80, w: 240, h: 88, title: 'Outline Synthesizer', note: 'Modules & citations', variant: 'primary' },
  { id: 'gate', x: 690, y: 260, w: 240, h: 88, title: 'Human Gate', note: 'Approve or Iterate', variant: 'primary' },
  { id: 'course', x: 690, y: 440, w: 240, h: 88, title: 'CourseGen (fan-out)', note: 'Compose lessons & save', variant: 'faint' },
  { id: 'files', x: 430, y: 260, w: 220, h: 96, title: 'Files Ingest & Index', note: 'Chunk + TiDB Vector', variant: 'optional' },
];
const miniEdges: EdgeT[] = [
  { from: 'topic', to: 'planner', kind: 'solid' },
  { from: 'planner', to: 'intel', kind: 'solid' },
  { from: 'intel', to: 'synth', kind: 'solid' },
  { from: 'files', to: 'synth', kind: 'solid' },
  { from: 'synth', to: 'gate', kind: 'solid' },
  { from: 'gate', to: 'course', kind: 'solid', label: 'Approve' },
  { from: 'gate', to: 'planner', kind: 'dashed', label: 'Edit → Re-plan' },
];

// 2) Web Intel
const WEB_W = 1200, WEB_H = 720;
const webNodes: NodeT[] = [
  { id: 'seed', x: 30, y: 80, w: 200, h: 72, title: 'Seed Topic / Queries', note: 'topic + heuristics', variant: 'primary' },
  { id: 'qplan', x: 250, y: 80, w: 200, h: 80, title: 'Search Planner', note: 'intents • synonyms • prereqs', variant: 'primary' },
  { id: 'search', x: 480, y: 80, w: 200, h: 88, title: 'Search API', note: 'multi-engine; recency', variant: 'primary' },
  { id: 'fetch', x: 120, y: 250, w: 220, h: 96, title: 'Fetcher / Renderer', note: 'HTTP + JS render', variant: 'primary' },
  { id: 'clean', x: 380, y: 250, w: 220, h: 96, title: 'Cleaner', note: 'boilerplate strip', variant: 'primary' },
  { id: 'dedupe', x: 640, y: 250, w: 220, h: 96, title: 'Deduper / Clusterer', note: 'SimHash • canon', variant: 'primary' },
  { id: 'score', x: 120, y: 430, w: 220, h: 96, title: 'Source Scorer', note: 'authority • freshness', variant: 'primary' },
  { id: 'embed', x: 380, y: 430, w: 220, h: 96, title: 'Chunk & Embed', note: '700–1000t • overlap', variant: 'primary' },
  { id: 'upsert', x: 640, y: 430, w: 220, h: 96, title: 'Upsert → TiDB Vector', note: 'chunks + meta', variant: 'primary' },
  { id: 'evidence', x: 900, y: 430, w: 220, h: 96, title: 'Evidence Set', note: 'ready for Synth/RAG', variant: 'faint' },
];
const webEdges: EdgeT[] = [
  { from: 'seed', to: 'qplan', kind: 'solid' },
  { from: 'qplan', to: 'search', kind: 'solid' },
  { from: 'search', to: 'fetch', kind: 'solid' },
  { from: 'fetch', to: 'clean', kind: 'solid' },
  { from: 'clean', to: 'dedupe', kind: 'solid' },
  { from: 'dedupe', to: 'score', kind: 'solid' },
  { from: 'score', to: 'embed', kind: 'solid' },
  { from: 'embed', to: 'upsert', kind: 'solid' },
  { from: 'upsert', to: 'evidence', kind: 'solid' },
  { from: 'clean', to: 'fetch', kind: 'dashed', label: 'retry JS render' },
  { from: 'dedupe', to: 'search', kind: 'dashed', label: 'broaden intents' },
  { from: 'score', to: 'qplan', kind: 'dashed', label: 'fill gaps' },
];

// 3) Ingest & Index
const ING_W = 1200, ING_H = 720;
const ingestNodes: NodeT[] = [
  { id: 'upload', x: 40, y: 80, w: 200, h: 80, title: 'File Upload', note: 'PDF • DOCX • Images', variant: 'primary' },
  { id: 'mime', x: 260, y: 80, w: 200, h: 72, title: 'MIME Detect', note: 'router', variant: 'primary' },
  { id: 'extract', x: 480, y: 80, w: 220, h: 96, title: 'Extract Text', note: 'pdf-parse • mammoth • OCR', variant: 'primary' },
  { id: 'section', x: 120, y: 250, w: 220, h: 96, title: 'Section Splitter', note: 'headings/pages', variant: 'primary' },
  { id: 'chunk', x: 380, y: 250, w: 220, h: 96, title: 'Chunker', note: '700–1000t • 200 overlap', variant: 'primary' },
  { id: 'embed', x: 640, y: 250, w: 220, h: 96, title: 'Embedder', note: 'VECTOR(1536)', variant: 'primary' },
  { id: 'upsert', x: 900, y: 250, w: 220, h: 96, title: 'Upsert TiDB Vector', note: 'chunks + meta', variant: 'primary' },
  { id: 'index', x: 640, y: 430, w: 220, h: 96, title: 'Keyword Index', note: 'search fields', variant: 'optional' },
  { id: 'done', x: 900, y: 430, w: 220, h: 96, title: 'Ingested', note: 'ready for RAG', variant: 'faint' },
];
const ingestEdges: EdgeT[] = [
  { from: 'upload', to: 'mime', kind: 'solid' },
  { from: 'mime', to: 'extract', kind: 'solid' },
  { from: 'extract', to: 'section', kind: 'solid' },
  { from: 'section', to: 'chunk', kind: 'solid' },
  { from: 'chunk', to: 'embed', kind: 'solid' },
  { from: 'embed', to: 'upsert', kind: 'solid' },
  { from: 'upsert', to: 'done', kind: 'solid' },
  { from: 'chunk', to: 'index', kind: 'alt', label: 'text fields' },
];

// 4) Iteration / Feedback
const ITR_W = 1200, ITR_H = 720;
const iterateNodes: NodeT[] = [
  { id: 'notes', x: 40, y: 80, w: 220, h: 80, title: 'Human Notes', note: 'edits & prefs', variant: 'primary' },
  { id: 'intent', x: 290, y: 80, w: 220, h: 96, title: 'Intent Classifier', note: 'coverage • style • gaps', variant: 'primary' },
  { id: 'edit', x: 560, y: 80, w: 220, h: 96, title: 'Outline Editor', note: 'LLM proposes diffs', variant: 'primary' },
  { id: 'qtune', x: 820, y: 80, w: 220, h: 96, title: 'Query Tuner', note: 'expand/limit intents', variant: 'primary' },
  { id: 'refresh', x: 560, y: 260, w: 220, h: 96, title: 'Source Refresh', note: 'search→fetch→embed', variant: 'optional' },
  { id: 'delta', x: 820, y: 260, w: 220, h: 96, title: 'Outline Delta', note: 'diff + rationale', variant: 'faint' },
];
const iterateEdges: EdgeT[] = [
  { from: 'notes', to: 'intent', kind: 'solid' },
  { from: 'intent', to: 'edit', kind: 'solid' },
  { from: 'intent', to: 'qtune', kind: 'solid', label: 'if gaps' },
  { from: 'qtune', to: 'refresh', kind: 'solid' },
  { from: 'refresh', to: 'edit', kind: 'solid' },
  { from: 'edit', to: 'delta', kind: 'solid' },
];

// 5) CourseGen
const CG_W = 1200, CG_H = 720;
const courseNodes: NodeT[] = [
  { id: 'planM', x: 40, y: 80, w: 220, h: 96, title: 'Module Planner', note: 'objectives & scope', variant: 'primary' },
  { id: 'planL', x: 300, y: 80, w: 220, h: 96, title: 'Lesson Planner', note: 'per-lesson prompts', variant: 'primary' },
  { id: 'retr', x: 560, y: 80, w: 220, h: 96, title: 'Retriever', note: 'hybrid vector+keyword', variant: 'primary' },
  { id: 'rank', x: 820, y: 80, w: 220, h: 96, title: 'Reranker (opt)', note: 'MMR / judge', variant: 'optional' },
  { id: 'compose', x: 560, y: 260, w: 220, h: 96, title: 'Composer', note: 'lesson + citations', variant: 'primary' },
  { id: 'check', x: 820, y: 260, w: 220, h: 96, title: 'Claim Checker', note: 'evidence-backed', variant: 'primary' },
  { id: 'style', x: 560, y: 440, w: 220, h: 96, title: 'Style Harmonizer', note: 'reading level & tone', variant: 'primary' },
  { id: 'save', x: 820, y: 440, w: 220, h: 96, title: 'Saver', note: 'persist → lessons', variant: 'faint' },
];
const courseEdges: EdgeT[] = [
  { from: 'planM', to: 'planL', kind: 'solid' },
  { from: 'planL', to: 'retr', kind: 'solid' },
  { from: 'retr', to: 'rank', kind: 'solid' },
  { from: 'retr', to: 'compose', kind: 'alt', label: 'if no rerank' },
  { from: 'rank', to: 'compose', kind: 'solid' },
  { from: 'compose', to: 'check', kind: 'solid' },
  { from: 'check', to: 'style', kind: 'solid' },
  { from: 'style', to: 'save', kind: 'solid' },
];

// 6) Runtime Chat
const CHAT_W = 1200, CHAT_H = 720;
const chatNodes: NodeT[] = [
  { id: 'umsg', x: 40, y: 80, w: 220, h: 80, title: 'User Message', note: 'question/task', variant: 'primary' },
  { id: 'irouter', x: 300, y: 80, w: 220, h: 96, title: 'Intent Router', note: 'answer • explain • drill • fetch', variant: 'primary' },
  { id: 'ctx', x: 560, y: 80, w: 220, h: 96, title: 'Context Assembler', note: 'lesson + chunks + files', variant: 'primary' },
  { id: 'tools', x: 820, y: 80, w: 220, h: 96, title: 'Tool Router', note: 'web • calc • diagrams', variant: 'optional' },
  { id: 'answer', x: 560, y: 260, w: 220, h: 96, title: 'Answerer', note: 'LLM compose + cites', variant: 'primary' },
  { id: 'stream', x: 820, y: 260, w: 220, h: 96, title: 'Streamer', note: 'SSE → UI', variant: 'faint' },
  { id: 'log', x: 820, y: 440, w: 220, h: 96, title: 'Trace Logger', note: 'chunks • tokens', variant: 'faint' },
];
const chatEdges: EdgeT[] = [
  { from: 'umsg', to: 'irouter', kind: 'solid' },
  { from: 'irouter', to: 'ctx', kind: 'solid' },
  { from: 'irouter', to: 'tools', kind: 'solid', label: 'if external' },
  { from: 'ctx', to: 'answer', kind: 'solid' },
  { from: 'tools', to: 'ctx', kind: 'solid', label: 'add evidence' },
  { from: 'answer', to: 'stream', kind: 'solid' },
  { from: 'answer', to: 'log', kind: 'solid' },
];

// 7) Quiz Engine
const QUIZ_W = 1200, QUIZ_H = 720;
const quizNodes: NodeT[] = [
  { id: 'cpex', x: 40, y: 80, w: 240, h: 96, title: 'Concept Extractor', note: 'from lessons', variant: 'primary' },
  { id: 'blue', x: 320, y: 80, w: 240, h: 96, title: 'Blueprint Planner', note: 'Bloom • coverage', variant: 'primary' },
  { id: 'writer', x: 600, y: 80, w: 240, h: 96, title: 'Item Writer', note: 'MCQ + short, distractors', variant: 'primary' },
  { id: 'verify', x: 880, y: 80, w: 240, h: 96, title: 'Answerability Verifier', note: 'RAG-check', variant: 'primary' },
  { id: 'calib', x: 600, y: 260, w: 240, h: 96, title: 'Difficulty Calibrator', note: 'steps • similarity', variant: 'primary' },
  { id: 'adv', x: 880, y: 260, w: 240, h: 96, title: 'Adversarial Reviewer', note: 'try to break items', variant: 'optional' },
  { id: 'save', x: 880, y: 440, w: 240, h: 96, title: 'Save to Bank', note: 'questions + rationales', variant: 'faint' },
];
const quizEdges: EdgeT[] = [
  { from: 'cpex', to: 'blue', kind: 'solid' },
  { from: 'blue', to: 'writer', kind: 'solid' },
  { from: 'writer', to: 'verify', kind: 'solid' },
  { from: 'verify', to: 'calib', kind: 'solid' },
  { from: 'calib', to: 'adv', kind: 'solid' },
  { from: 'calib', to: 'save', kind: 'alt', label: 'if stable' },
  { from: 'adv', to: 'writer', kind: 'dashed', label: 'revise' },
  { from: 'adv', to: 'save', kind: 'solid', label: 'pass' },
];

export default function GistPilotGraphs() {
  const [view, setView] =
    useState<'mini' | 'webintel' | 'ingest' | 'iterate' | 'coursegen' | 'chat' | 'quiz'>('mini');

  const views: Record<string, any> = {
    mini: { title: 'Mini Agent Graph (MP1)', W: MINI_W, H: MINI_H, nodes: miniNodes, edges: miniEdges },
    webintel: { title: 'Web Intel — Node Internals', W: WEB_W, H: WEB_H, nodes: webNodes, edges: webEdges },
    ingest: { title: 'Ingest & Index — Node Internals', W: ING_W, H: ING_H, nodes: ingestNodes, edges: ingestEdges },
    iterate: { title: 'Iteration / Feedback Router', W: ITR_W, H: ITR_H, nodes: iterateNodes, edges: iterateEdges },
    coursegen: { title: 'CourseGen — Lesson Fan-out', W: CG_W, H: CG_H, nodes: courseNodes, edges: courseEdges },
    chat: { title: 'Runtime Chat — Course Viewer', W: CHAT_W, H: CHAT_H, nodes: chatNodes, edges: chatEdges },
    quiz: { title: 'Quiz Engine', W: QUIZ_W, H: QUIZ_H, nodes: quizNodes, edges: quizEdges },
  };

  const order = ['mini','webintel','ingest','iterate','coursegen','chat','quiz'] as const;

  return (
    <div style={{ background: COLORS.bg, color: COLORS.fg, width: '100%', height: '100%', minHeight: 860, padding: 16 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto 12px', display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ fontSize: 16, fontWeight: 600 }}>GistPilot — Graphs</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {order.map(k => (
            <button key={k}
              onClick={() => setView(k as any)}
              style={{
                height: 32, padding: '0 12px', borderRadius: 8,
                border: `1px solid ${COLORS.border}`,
                background: view === k ? COLORS.primary : COLORS.card,
                color: view === k ? '#0b1220' : COLORS.fg, cursor: 'pointer'
              }}>
              {views[k].title.split(' — ')[0]}
            </button>
          ))}
        </div>
      </div>

      <GraphCanvas
        title={views[view].title}
        W={views[view].W}
        H={views[view].H}
        nodes={views[view].nodes}
        edges={views[view].edges}
        legend={
          <>
            <span>— Main flow</span>
            <span style={{ color: COLORS.muted }}>— Feedback</span>
            <span style={{ color: COLORS.primary }}>— Alternate path</span>
            <span style={{ border: `2px dashed ${COLORS.muted}`, padding: '0 6px', borderRadius: 4, marginLeft: 8 }}>Optional node</span>
          </>
        }
      />
    </div>
  );
}
