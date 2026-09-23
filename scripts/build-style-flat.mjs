#!/usr/bin/env node
/*
 * Builds `dist/style-flat.css` from `dist/style.css`: the same rules with the
 * cascade layers flattened and every selector scoped to the library's own
 * roots — the stylesheet for a host that is not on Tailwind v4.
 *
 * WHY. `dist/style.css` is Tailwind v4 output: native `@layer` blocks. A host
 * whose own CSS is unlayered (Tailwind v3, or no Tailwind) beats every layered
 * rule regardless of specificity — that is how cascade layers work — so its
 * preflight wins over our utilities and the components render wrong. And a
 * Tailwind v3 PostCSS pipeline refuses to import the file at all. Flattening
 * the layers fixes both, but an unlayered copy of Tailwind's `*` resets and
 * theme variables would then reach the host's own elements. So every rule is
 * also scoped to our roots, at zero extra specificity (`:where()`), and the
 * `:root`/`.dark` token rules drop to zero specificity so a same-named host
 * variable always wins over ours.
 *
 * Run by `pnpm build` after vite, so the two entries can never drift.
 */
import { readFileSync, writeFileSync } from "node:fs";
import postcss from "postcss";

export function buildFlat(css, { roots, keepGlobal }) {
    const scope = `:is(${roots.join(", ")})`;
    const within = `:where(${scope}, ${scope} *)`;
    const root = postcss.parse(css);

    // 1. Flatten: unwrap every @layer block, drop every @layer statement.
    //    Repeat until none are left — Tailwind nests `@layer` inside @supports.
    let found = true;
    while (found) {
        found = false;
        root.walkAtRules("layer", (at) => {
            found = true;
            if (at.nodes) at.replaceWith(...at.nodes);
            else at.remove();
        });
    }

    // 2. Scope every selector.
    root.walkRules((rule) => {
        // Keyframe steps and nested `&` rules take their parent's scope. (An
        // escaped `\&` inside a class name is not nesting.)
        if (rule.parent?.type === "atrule" && /keyframes$/.test(rule.parent.name)) return;
        if (/(^|[^\\])&/.test(rule.selector)) return;
        rule.selectors = rule.selectors.map((selector) => {
            const s = selector.trim();
            // Token roots stay global but drop to zero specificity: a host's own
            // declaration of the same custom property always wins.
            if (keepGlobal.some((prefix) => s.startsWith(prefix))) return `:where(${s})`;
            // Split off a leading type selector or `*` — `:where()` cannot precede it.
            const match = /^(\*|[a-zA-Z][\w-]*)?(.*)$/s.exec(s);
            const type = match[1] === "*" ? "" : (match[1] ?? "");
            return `${type}${within}${match[2]}`;
        });
    });

    return root.toString();
}

export function run({ input, output, roots, keepGlobal }) {
    const css = readFileSync(input, "utf8");
    const flat = buildFlat(css, { roots, keepGlobal });
    if (/@layer/.test(flat)) throw new Error(`${output}: a @layer survived flattening`);
    writeFileSync(output, flat);
    const rules = (flat.match(/\{/g) ?? []).length;
    console.log(`wrote ${output} — ${rules} blocks, scoped to ${roots.join(", ")}`);
}

/*
 * mat-ui's roots. The library has no single root element — components render
 * wherever the host puts them — so a host on the flat stylesheet wraps the
 * subtree that uses mat-ui (its app root, typically) in `.mat-ui` or
 * `[data-mat-ui]`. Menus, tooltips and modals render through Floating UI's
 * portal into <body>, outside any wrapper, hence the portal attribute.
 */
run({
    input: new URL("../dist/style.css", import.meta.url).pathname,
    output: new URL("../dist/style-flat.css", import.meta.url).pathname,
    roots: [".mat-ui", "[data-mat-ui]", "[data-floating-ui-portal]"],
    keepGlobal: [":root", ":host", ".dark", "[data-mat-ui-color-scheme"],
});
