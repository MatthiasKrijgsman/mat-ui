#!/usr/bin/env node
/*
 * Guards the stylesheet's promises. Run by `pnpm check:css`, and by
 * `pnpm build` so a broken stylesheet cannot be published.
 *
 *   1. `dist/style.css` reaches nothing outside our own classes — no global
 *      element resets, which would restyle the host application's whole app.
 *   2. `styles/scoped-reset.css` covers every class our components author, so
 *      a new component does not silently lose `box-sizing: border-box`.
 *   3. Every Tailwind utility in `dist/style.css` carries the `mat:` prefix,
 *      so no class of ours can collide with a host's own Tailwind (style.css).
 *   4. `dist/style-flat.css` has no cascade layers and every rule is scoped
 *      (scripts/build-style-flat.mjs) — the entry a Tailwind v3 host imports.
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

/* ── 3. every utility is prefixed ──────────────────────────────────── */

/** The body of the top-level `@layer utilities { … }` block, brace-matched. */
function layerBody(css, name) {
    const at = css.indexOf(`@layer ${name} {`);
    if (at === -1) return "";
    let depth = 0;
    for (let i = css.indexOf("{", at); i < css.length; i++) {
        if (css[i] === "{") depth++;
        else if (css[i] === "}" && --depth === 0) return css.slice(at, i);
    }
    return css.slice(at);
}

const utilities = layerBody(dist, "utilities");
const unprefixed = [...new Set([...utilities.matchAll(/^\s*\.((?:\\.|[^\s{,:>+~])+)/gm)].map((m) => m[1]))]
    // Authored utilities live in the same layer under our own name prefix
    .filter((cls) => !cls.startsWith("mat\\:") && !cls.startsWith("mat-ui-"));
if (unprefixed.length > 0) {
    fail.push(
        `dist/style.css ships ${unprefixed.length} unprefixed utilit${unprefixed.length === 1 ? "y" : "ies"}: ${unprefixed.slice(0, 8).join(", ")}${unprefixed.length > 8 ? ", …" : ""}\n` +
            "  Author it as `mat:…` (see style.css) or it can collide with the host's own Tailwind.",
    );
}

/* ── 4. the flat entry is unlayered and scoped ─────────────────────── */

let flat;
try {
    flat = readFileSync(join(repo, "dist/style-flat.css"), "utf8");
} catch {
    fail.push("dist/style-flat.css not found — scripts/build-style-flat.mjs did not run.");
}
if (flat) {
    if (/@layer\b/.test(flat)) fail.push("dist/style-flat.css still contains an @layer — flattening failed.");
    // Every selector outside keyframes must carry the scope (or be a zero-
    // specificity token root). Cheap approximation: strip at-rule preludes and
    // nested `&` rules, then look for a `{` whose selector has no `:where(`.
    const bare = flat
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/@keyframes[^{]*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g, "")
        .replace(/@(?:property|font-face)[^{]*\{[^{}]*\}/g, "");
    const unscoped = [...bare.matchAll(/(?:^|[}{;])\s*([^@{};][^{}]*?)\s*\{/g)]
        .map((m) => m[1].trim())
        // At-rule preludes (`@media …`, `@supports …`) open blocks too; their rules are checked inside
        .filter((sel) => sel && !sel.startsWith("@") && !/(^|[^\\])&/.test(sel) && !sel.includes(":where("));
    if (unscoped.length > 0) {
        fail.push(`dist/style-flat.css has ${unscoped.length} unscoped selector(s): ${unscoped.slice(0, 5).join(" | ")}`);
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
console.log(`css check passed — no global resets shipped; every utility prefixed; flat entry scoped; ${authored.size} authored classes covered`);
