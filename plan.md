# Dark Theme Implementation Plan

## Analysis

The codebase is already well-architected for theming. All color values flow through CSS custom properties defined in `src/styles/tokens.css`, and all component CSS files (`Button.css`, `Input.css`, `Modal.css`, etc.) reference these tokens exclusively via `var(--color-*)`. This means **dark mode can be implemented by redefining the token values alone** — no changes needed to any component CSS or TSX files.

There is one exception: `BadgeColors.tsx` uses hardcoded Tailwind color classes (`bg-red-100 text-red-700 ring-red-200`, etc.) rather than tokens. This needs a separate approach.

## Strategy: CSS Custom Property Override via `.dark` Selector

### Why `.dark` class (not `prefers-color-scheme` media query)

Since this is a **component library**, not an application, we should not dictate how the consumer activates dark mode. A `.dark` class-based approach gives consumers full control:

- They can toggle it manually via JavaScript
- They can wire it to `prefers-color-scheme` themselves
- They can scope dark mode to a subtree (e.g., dark sidebar in a light app)
- It's the standard convention (used by Tailwind, Radix, shadcn/ui, etc.)

### Tailwind v4 Configuration

Add a `@variant` rule in `src/style.css` so Tailwind's `dark:` utilities also use the class strategy (needed for BadgeColors):

```css
@variant dark (&:where(.dark, .dark *));
```

## Implementation Steps

### Step 1: Define dark token values in `tokens.css`

Add a `.dark` block after the existing `:root` block that redefines every token. The light values stay on `:root` (unchanged), dark overrides live under `.dark`:

```css
:root { /* existing light tokens — untouched */ }

.dark {
    /* All tokens redefined with dark-appropriate values */
}
```

#### Dark Color Palette Mapping

The light theme uses a **white-surface / dark-text** scheme built from Tailwind's gray scale. The dark theme inverts this:

| Role | Light Value | Dark Value | Notes |
|------|------------|------------|-------|
| Surface / bg | `#ffffff` | `#111827` (gray-900) | Main backgrounds |
| Elevated surface | `#f9fafb` (gray-50) | `#1f2937` (gray-800) | Table headers, subtle fills |
| Subtle hover | `#f3f4f6` (gray-100) | `#1f2937` (gray-800) | Hover states |
| Active press | `#e5e7eb` (gray-200) | `#374151` (gray-700) | Active/pressed states |
| Border | `#e5e7eb` (gray-200) | `#374151` (gray-700) | All borders |
| Softer border | `#d1d5db` (gray-300) | `#4b5563` (gray-600) | Toggle off, checkbox |
| Secondary text | `#6b7280` (gray-500) | `#9ca3af` (gray-400) | Descriptions, icons |
| Disabled text | `#9ca3af` (gray-400) | `#4b5563` (gray-600) | Disabled states |
| Primary text | `#111827` (gray-900) | `#f3f4f6` (gray-100) | Body text, labels |
| Heading text | `#1f2937` (gray-800) | `#e5e7eb` (gray-200) | Table headers |
| Disabled bg | `#e5e7eb` (gray-200) | `#1f2937` (gray-800) | Disabled button backgrounds |

#### Accent / Brand Colors

The primary (purple), secondary (amber), and tertiary (green) button variants use OKLCH colors. On dark backgrounds, these can stay largely the same since they're already vivid — they have sufficient contrast against a dark surface. Minor adjustments:

| Token | Light OKLCH | Dark OKLCH | Rationale |
|-------|------------|------------|-----------|
| primary bg | `oklch(54.6% 0.245 262.881)` | Keep same | Purple on dark bg has better contrast than on white |
| primary active | `oklch(48.8% 0.243 264.376)` | `oklch(45% 0.243 264.376)` | Slightly darker press state |
| secondary bg | `oklch(76.9% 0.188 70.08)` | `oklch(70% 0.188 70.08)` | Slightly reduced lightness so it doesn't glare |
| tertiary bg | `oklch(64.8% 0.2 131.684)` | Keep same | Already mid-range lightness |

The white button variant becomes the "surface" button in dark mode (dark bg, light text, subtle border) — essentially an inversion. The black button inverts symmetrically.

#### Transparent Button

In dark mode, `--color-button-transparent-text` flips from `#111827` to `#f3f4f6` so text remains visible on dark backgrounds.

#### Focus Rings

The focus ring uses `rgb(17 24 39 / 0.15)` — this is a dark-tinted semi-transparent ring that's visible on white backgrounds. In dark mode, switch to a lighter semi-transparent ring: `rgb(243 244 246 / 0.2)`.

Similarly, `--color-input-ring` changes from `rgb(17 24 39 / 0.1)` to `rgb(243 244 246 / 0.15)`.

#### Error Colors

Red error colors (`#dc2626`) can remain the same — red has sufficient contrast on both light and dark surfaces. The error ring opacity may need a slight bump: `rgb(220 38 38 / 0.3)` (from 0.2).

#### Toggle & Checkbox

- Toggle "on" blue (`#2563eb`) stays the same — works well on dark
- Toggle "off" track changes from gray-300 to gray-600
- Toggle thumb stays `#ffffff` (white dot on dark track)
- Check border from gray-300 to gray-600

#### Select Options (selected state)

The selected option uses blue-50/blue-100 backgrounds. In dark mode:
- `--color-option-bg-selected`: `#1e3a5f` (dark blue tint)
- `--color-option-bg-selected-hover`: `#1e40af` (slightly lighter dark blue)

#### Modal Overlay

The overlay uses `rgb(156 163 175 / 0.3)` (light gray tint). In dark mode, a darker overlay is more appropriate: `rgb(0 0 0 / 0.5)`.

#### Tab Buttons

The tab container background (`#f3f4f6`) becomes a darker recessed surface (`#0f172a` or `#1f2937`). The active tab surface (`#ffffff`) becomes the standard dark surface (`#111827`).

#### Shadows

Tailwind's shadow utilities (`shadow-sm`, `shadow-md`, `shadow-xl`) use a black-based shadow that's subtle on light backgrounds but invisible on dark backgrounds. This is a known issue. Two options:

- **Option A (recommended):** Accept that shadows are less visible in dark mode — this is normal UX behavior. The borders provide enough visual separation.
- **Option B:** Override Tailwind's shadow color variables inside `.dark` to use a slightly more opaque shadow, or add a faint light glow. This adds complexity for minimal benefit.

### Step 2: Handle BadgeColors

`BadgeColors.tsx` is the only file using hardcoded Tailwind color classes. Two options:

**Option A: Add `dark:` variant classes** (recommended)

Since we're configuring `@variant dark` for the class strategy, we can append dark variants directly:

```typescript
red: 'bg-red-100 text-red-700 ring-red-200 dark:bg-red-950 dark:text-red-300 dark:ring-red-800',
```

This is a single-file change, keeps the pattern readable, and works with Tailwind's built-in dark mode support.

**Option B: Convert to CSS tokens**

Move all 22 badge color definitions to tokens. This is "purer" but adds ~66 new CSS variables (3 per color) and isn't necessary since the Tailwind classes already support dark mode natively.

### Step 3: Configure Tailwind v4 dark variant

In `src/style.css`, add after the `@import "tailwindcss"` line:

```css
@variant dark (&:where(.dark, .dark *));
```

This ensures Tailwind's `dark:` utilities match when a `.dark` class is present on any ancestor element. This is needed for the BadgeColors dark variants to work.

### Step 4: Storybook dark mode preview

Add a Storybook toolbar toggle (via `@storybook/addon-themes` or a simple decorator) that adds/removes the `.dark` class on the story root. This enables visual testing of both themes during development.

## Files to Modify

| File | Change |
|------|--------|
| `src/styles/tokens.css` | Add `.dark { }` block with all dark token values |
| `src/style.css` | Add `@variant dark` configuration line |
| `src/components/BadgeColors.tsx` | Add `dark:` Tailwind classes for each color |
| `.storybook/preview.*` | Add dark mode toggle decorator (optional, for dev) |

**No changes needed to:**
- Any component `.tsx` files (except BadgeColors)
- Any component `.css` files
- `vite.config.ts`
- `package.json`

## Consumer Usage

After implementation, consumers activate dark mode by adding `class="dark"` to any ancestor element:

```html
<!-- Whole-page dark mode -->
<html class="dark">

<!-- Or scoped to a section -->
<div class="dark">
  <Panel>This panel is dark</Panel>
</div>
```

To wire it to OS preference:

```javascript
// In consumer's app
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
document.documentElement.classList.toggle('dark', prefersDark);
```

## Complexity Assessment

This implementation is **low-risk and low-effort** because:

1. The token architecture was designed for exactly this kind of override
2. Only 3-4 files need changes
3. Zero breaking changes — light mode is completely untouched
4. The dark values are a mechanical mapping of the existing gray scale
5. No new dependencies required
