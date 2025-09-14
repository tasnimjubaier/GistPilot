#!/usr/bin/env node
// make-llm-bundle.mjs — create a single Markdown snapshot of your codebase for LLM review.
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const repoRoot = process.cwd();
const outDir = path.join(repoRoot, "llm_bundle");
const outFile = path.join(outDir, "repo-context.md");
const metaFile = path.join(outDir, "meta.json");

// --- settings ---
const MAX_TOTAL_BYTES = parseInt((process.argv.find(a => a.startsWith("--max-total=")) || "").split("=")[1] || "", 10) || 6 * 1024 * 1024; // ~6MB
const PER_FILE_MAX = 350 * 1024; // 350KB per file cap
const includeTests = process.argv.includes("--include-tests");
const full = process.argv.includes("--full"); // less aggressive exclude

const exts = new Set([
  ".ts",".tsx",".js",".jsx",".mjs",".cjs",
  ".css",".scss",".sass",".less",
  ".md",".mdx",".txt",
  ".json",".yaml",".yml",".toml",".ini",
  ".sql",".prisma",
  ".sh",".bash",".zsh",".ps1",".bat",
]);
const configAllow = [
  "package.json","pnpm-workspace.yaml","turbo.json",
  "next.config.js","next.config.mjs","next.config.ts",
  "tailwind.config.js","tailwind.config.ts","postcss.config.js","postcss.config.ts",
  "tsconfig.json","tsconfig.base.json","eslint.config.js",".eslintrc.js",".eslintrc.cjs",".eslintrc.json",
  "prettier.config.js",".prettierrc",".prettierrc.cjs",".prettierrc.json",
  "vite.config.ts","vite.config.js","vitest.config.ts","vitest.config.js",
  "astro.config.mjs","svelte.config.js",
];
const dirExcludes = [
  "node_modules",".git",".next","dist","build","out","coverage",".turbo",".vercel",".cache",".vscode",".idea",
  ".pytest_cache",".venv","venv","__pycache__",".gradle",".parcel-cache",".pnpm-store",
  "public","assets","static","media","img","fonts"
];
const fileExcludes = [
  ".DS_Store",".env",".env.local",".env.production",".env.development",".env.test",".env.ci",
  "yarn.lock","pnpm-lock.yaml","package-lock.json",
  "*.log","*.map","*.min.*","*.lockb","*.lock",
];
const binaryExts = new Set([".png",".jpg",".jpeg",".gif",".svg",".webp",".avif",".ico",".pdf",".wasm",".zip",".mp4",".mp3",".wav",".mov",".heic",".rar",".7z"]);

// util
const rel = p => path.relative(repoRoot, p).replaceAll("\\","/");
const isHidden = name => name.startsWith(".");
const mm = (s, pat) => new RegExp("^" + pat.replace(/\./g,"\\.").replace(/\*/g,".*") + "$").test(s);
const shouldSkipFile = (rp) => {
  const name = path.basename(rp);
  if (!includeTests && /(^|\/|\\)(tests?|__tests__|\.test\.|\.spec\.)/i.test(rp)) return true;
  for (const pat of fileExcludes) if (mm(name, pat)) return true;
  if (!full && rp.split("/").some(seg => dirExcludes.includes(seg))) return true;
  const ext = path.extname(rp).toLowerCase();
  if (binaryExts.has(ext)) return true;
  if (!exts.has(ext) && !configAllow.includes(name)) return true;
  return false;
};

// get files (prefer git for .gitignore fidelity)
function gitLs(args) {
  try { return execSync(`git ${args}`, {cwd: repoRoot, stdio:["ignore","pipe","ignore"]}).toString().split("\n").filter(Boolean); }
  catch { return []; }
}
let files = [];
const tracked = gitLs("ls-files");
const untracked = gitLs("ls-files --others --exclude-standard");
if (tracked.length || untracked.length) {
  files = [...new Set([...tracked, ...untracked])].map(p => path.join(repoRoot, p));
} else {
  // fallback: manual walk
  const stack = [repoRoot];
  while (stack.length) {
    const dir = stack.pop();
    const ents = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of ents) {
      const p = path.join(dir, e.name);
      const rp = rel(p);
      if (e.isDirectory()) {
        if (!full && (dirExcludes.includes(e.name) || isHidden(e.name))) continue;
        stack.push(p);
      } else if (e.isFile()) {
        // skip hidden files at root unless in allowlist
        if (isHidden(e.name) && !configAllow.includes(e.name)) continue;
        if (!shouldSkipFile(rp)) files.push(p);
      }
    }
  }
}

// final filter pass
files = files.filter(f => !shouldSkipFile(rel(f)));

// small helper: detect language fence
const langOf = (rp) => {
  const ext = path.extname(rp).toLowerCase();
  const map = { ".ts":"ts", ".tsx":"tsx", ".js":"js", ".jsx":"jsx", ".mjs":"js", ".cjs":"js",
    ".css":"css",".scss":"scss",".sass":"sass",".less":"less",
    ".md":"md",".mdx":"mdx",".json":"json",".yaml":"yaml",".yml":"yaml",
    ".sql":"sql",".prisma":"prisma",".sh":"bash",".bash":"bash",".zsh":"bash",".ps1":"powershell",".bat":"bat",
    ".toml":"toml",".ini":"ini"
  };
  return map[ext] || "";
};

// build route map heuristics for Next.js
function buildRoutes() {
  const routeFiles = files
    .map(rel)
    .filter(p => p.startsWith("app/") || p.startsWith("pages/"));
  const routes = [];
  for (const p of routeFiles) {
    if (p.startsWith("app/") && /\/page\.(tsx|ts|js|jsx|mdx)$/.test(p)) {
      let r = p.replace(/^app\//,"").replace(/\/page\.(tsx|ts|js|jsx|mdx)$/,"");
      r = r.replace(/\/\([^)]+\)/g,""); // drop route groups
      routes.push("/" + (r === "" ? "" : r));
    }
    if (p.startsWith("pages/")) {
      if (/\/index\.(tsx|ts|js|jsx|mdx)$/.test(p)) {
        const base = p.replace(/^pages\//,"").replace(/\/index\.(tsx|ts|js|jsx|mdx)$/,"");
        routes.push("/" + base);
      } else if (/\.(tsx|ts|js|jsx|mdx)$/.test(p) && !/(_app|_document|_error)\./.test(p)) {
        const base = p.replace(/^pages\//,"").replace(/\.(tsx|ts|js|jsx|mdx)$/,"");
        routes.push("/" + base);
      }
    }
  }
  return [...new Set(routes)].sort();
}

// meta
function safeExec(cmd) { try { return execSync(cmd, {cwd: repoRoot, stdio:["ignore","pipe","ignore"]}).toString().trim(); } catch { return null; } }
const meta = {
  generatedAt: new Date().toISOString(),
  node: process.version,
  repo: {
    branch: safeExec("git rev-parse --abbrev-ref HEAD"),
    commit: safeExec("git rev-parse --short HEAD"),
    remote: safeExec("git config --get remote.origin.url")
  },
  counts: { files: files.length },
  routes: buildRoutes(),
};

// ensure out
fs.mkdirSync(outDir, { recursive: true });

// write meta.json
fs.writeFileSync(metaFile, JSON.stringify(meta, null, 2));

// tree txt (lightweight)
function makeTreeList() {
  const list = files.map(rel).sort();
  return list.join("\n");
}

// write markdown bundle
let written = 0;
let md = `# Repo Context Bundle\n\n`;
md += `- Generated: ${meta.generatedAt}\n- Node: ${meta.node}\n- Branch: ${meta.repo.branch || "n/a"}  Commit: ${meta.repo.commit || "n/a"}\n- Files included: ${meta.counts.files}\n\n`;
if (meta.routes?.length) {
  md += `## Routes (heuristic)\n`;
  md += meta.routes.map(r => `- \`${r || "/"}\``).join("\n") + "\n\n";
}
md += `## File list\n`;
md += "```\n" + makeTreeList() + "\n```\n\n";

for (const abs of files.sort()) {
  const rp = rel(abs);
  try {
    const stat = fs.statSync(abs);
    if (stat.size > PER_FILE_MAX && !full) continue; // skip huge files unless --full
    const buf = fs.readFileSync(abs);
    if (written + buf.length > MAX_TOTAL_BYTES) break;
    const lang = langOf(rp);
    md += `\n\n===== FILE: ${rp} (${stat.size} bytes) =====\n\`\`\`${lang}\n${buf.toString("utf8")}\n\`\`\`\n`;
    written += buf.length;
  } catch {}
}

fs.writeFileSync(outFile, md, "utf8");

console.log(`\n✅ Bundle ready:\n  ${rel(outFile)}  (${written} code bytes)\n  ${rel(metaFile)}\n`);
console.log(`\nUpload 'repo-context.md' here and I’ll dive in.`);
