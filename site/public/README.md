# preflight-check.html

A host that is **not** on Tailwind. Two questions in one page:

1. does the host's own content survive our stylesheet? (it must be untouched)
2. do our components still render correctly without a global reset?

```bash
cp dist/style.css site/public/_mat-ui-style.css
```

Then open `/preflight-check.html`. `window.__probe()` returns the computed
properties preflight would change on both sides, so the answer is a diff rather
than an eyeball.

`_mat-ui-style.css` is a build output, copied in on demand and gitignored. The
invariant itself is asserted by `pnpm check:css`.
