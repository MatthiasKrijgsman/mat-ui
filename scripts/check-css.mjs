#!/usr/bin/env node
/*
 * Guards the stylesheet's two promises. Run by `pnpm check:css`, and by
 * `pnpm build` so a broken stylesheet cannot be published.
 *
 *   1. `dist/style.css` reaches nothing outside our own classes — no global
 *      element resets, which would restyle the host application's whole app.
 *   2. `styles/scoped-reset.css` covers every class our components author, so
 *      a new component does not silently lose `box-sizing: border-box`.
 *
 * There is no test runner in this repo; this is a plain script on purpose.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repo = resolve(fileURLToPath(new URL("..", import.meta.url)));
const fail = [];

/* ── 1. no global element selectors in the shipped CSS ─────────────── */

const distPath = join(repo, "dist/style.css");
let dist;
try {
    dist = readFileSync(distPath, "utf8");
} catch {
    console.error("dist/style.css not found — run `pnpm build` first.");
    process.exit(1);
}

// Preflight's most damaging rules, by the selector text they ship as.
const GLOBAL_RESETS = [
    "h1, h2, h3, h4, h5, h6 {",
    "ol, ul, menu {",
    "img, video {",
    "button, input, select, optgroup, textarea {",
    "abbr:where([title])",
    "\na {",
];
for (const selector of GLOBAL_RESETS) {
    if (dist.includes(selector)) {
        fail.push(`dist/style.css ships a GLOBAL reset for \`${selector.trim()}\` — it would restyle the host's app.`);
    }
}

/* ── 2. the scoped reset covers every authored class ───────────────── */

const cssFiles = [];
(function walk(dir) {
    for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) walk(full);
        else if (entry.endsWith(".css")) cssFiles.push(full);
    }
})(join(repo, "src"));

const EXCLUDED = new Set(["tokens.css", "style.css", "scoped-reset.css"]);
const authored = new Set();
for (const file of cssFiles) {
    if (EXCLUDED.has(file.split("/").pop())) continue;
    const body = readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
    for (const m of body.matchAll(/^\s*\.([a-z][a-z0-9-]*)/gm)) authored.add(m[1]);
}

// Comments mention filenames like `scoped-reset.css`, which look like class
// selectors to a naive scan — strip them before extracting.
const scoped = readFileSync(join(repo, "src/styles/scoped-reset.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
const covered = new Set([...scoped.matchAll(/\.([a-z][a-z0-9-]*)/g)].map((m) => m[1]));

const uncovered = [...authored].filter((c) => !covered.has(c)).sort();
if (uncovered.length > 0) {
    fail.push(
        `styles/scoped-reset.css misses ${uncovered.length} authored class(es): ${uncovered.join(", ")}\n` +
            "  Add them, or those components lose `box-sizing: border-box` in a non-Tailwind host.",
    );
}

// The other direction: a stale name left behind after a rename.
const stale = [...covered].filter((c) => !authored.has(c)).sort();
if (stale.length > 0) {
    fail.push(`styles/scoped-reset.css lists ${stale.length} class(es) nothing authors: ${stale.join(", ")}`);
}

/* ── report ────────────────────────────────────────────────────────── */

if (fail.length > 0) {
    console.error("\nCSS CHECK FAILED\n");
    for (const f of fail) console.error("  ✗ " + f);
    console.error("");
    process.exit(1);
}
console.log(`css check passed — no global resets shipped; ${authored.size} authored classes covered`);
