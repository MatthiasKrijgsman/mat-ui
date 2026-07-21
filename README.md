# mat-ui

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A React component library providing UI primitives built with React 19, Tailwind CSS v4, and Floating UI.

## Showcase
[View the components here](https://matthiaskrijgsman.github.io/mat-ui/)

## Development

The repo is a pnpm workspace with two packages: the library at the repository root and the showcase Next.js app in [`site/`](site).

```bash
# install workspace deps
pnpm install

# run the showcase against the local library
pnpm site            # → http://localhost:6006

# build the library
pnpm build

# build the showcase as a static site (outputs to site/out)
pnpm site:build
```

The showcase pulls in the library via the workspace alias (`workspace:*`), so edits under `src/` are reflected on the next dev rebuild. Deployments to GitHub Pages happen via [.github/workflows/deploy-site.yml](.github/workflows/deploy-site.yml).

## Installation

```bash
pnpm install @matthiaskrijgsman/mat-ui
```

### Styles

Import the mat-ui stylesheet in your CSS entry file. Be sure to do this **after** the Tailwind import.

```css
@import "@matthiaskrijgsman/mat-ui/style";
```

## Usage

```tsx
import { Button } from "@matthiaskrijgsman/mat-ui";

function App() {
  return <Button variant={'primary'}>Click me</Button>;
}
```

## Dark Theme

mat-ui ships with built-in dark theme support. Add the `dark` class to the `<html>` element to activate it:

```html
<html class="dark">
```

Toggle it with JavaScript:

```ts
// Manual toggle
document.documentElement.classList.toggle('dark');

// Follow OS preference
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
document.documentElement.classList.toggle('dark', prefersDark);
```

All components adapt automatically — no additional props or configuration needed.

## Theming with design tokens

Every visual property in mat-ui — color, shape, type, elevation and size — is driven by CSS custom properties (design tokens) defined on `:root`. There is no Tailwind config to fork and no component props to thread: you retheme the whole kit by overriding tokens in your own CSS, after importing the stylesheet.

```css
@import "@matthiaskrijgsman/mat-ui/style";

:root {
  --color-button-primary-bg: #0ea5e9;   /* brand color */
  --border-radius-input: 0px;            /* square corners everywhere */
  --font-weight-button: 700;             /* bolder buttons */
}
```

### How the tokens are organised

Tokens fall into three families:

- **Structure** — typography (family, weight, size), border radius, border width, shadow, ring (focus/hover) width and transition timing. Theme-independent.
- **Sizing** — the shared `sm | md | lg` control scale (height, padding, gap, icon size).
- **Color** — every surface, border, text and state color. Defined on `:root` (light) and overridden under `.dark`.

**Structure** and **color** tokens use a two-tier model:

1. **Base scales** — a small set of primitives (e.g. `--font-weight-strong`, `--radius-xl`). Change one to shift the whole kit at once.
2. **Semantic aliases** — per-component tokens that point at the base scale by default (e.g. `--font-weight-button: var(--font-weight-strong)`, `--border-radius-dropdown: var(--radius-xl)`). Override one to retheme a single component without touching anything else.

So `--font-weight-strong: 700` makes every emphasised element heavier, while `--font-weight-button: 700` changes only buttons. Pick the tier that matches how broad your change is.

> Dark mode: add the `dark` class to `<html>` (see [Dark Theme](#dark-theme)). Only **color** tokens differ between themes — structure and sizing are shared, so you never duplicate them under `.dark`.

### Worked examples

Square, flat, heavier — in four tokens:

```css
:root {
  --border-radius-input: 0px;       /* inputs, selects, buttons */
  --border-radius-panel: 0.25rem;   /* panels, modals */
  --border-width-input: 2px;        /* all control & surface borders */
  --font-weight-strong: 700;        /* buttons, badges, tabs, dropdown items… */
}
```

Set the kit's typeface in one place:

```css
:root {
  --font-family-base: "Inter", system-ui, sans-serif;
}
```

---

## Token reference

### Structure — typography

Font weights resolve through a three-step base scale; the semantic tokens below point at it by default.

| Base token | Default |
|------------|---------|
| `--font-weight-normal` | `400` |
| `--font-weight-medium` | `500` |
| `--font-weight-strong` | `600` |

| Semantic token | Applies to | Default |
|----------------|-----------|---------|
| `--font-weight-input-text` | Text typed into inputs, selects, textareas | `--font-weight-normal` |
| `--font-weight-button` | `Button`, `ButtonIconSquare`, `ButtonIconRound`, file-input action text | `--font-weight-strong` |
| `--font-weight-badge` | `Badge` | `--font-weight-strong` |
| `--font-weight-tab` | `TabButtons` | `--font-weight-strong` |
| `--font-weight-tab-count` | `TabButtons` / `Tabs` count chip | `--font-weight-strong` |
| `--font-weight-tabs` | `Tabs` (underline) tab labels | `--font-weight-strong` |
| `--font-weight-input-label` | `InputLabel` (label above inputs) | `--font-weight-medium` |
| `--font-weight-input-description` | `InputDescription` | `--font-weight-medium` |
| `--font-weight-input-error` | `InputError` | `--font-weight-medium` |
| `--font-weight-input-option-label` | Inline labels on `InputCheck` / `InputRadio` / `InputToggle`, file tile names | `--font-weight-medium` |
| `--font-weight-dropdown-item` | `DropdownButton`, `PanelLink` | `--font-weight-strong` |
| `--font-weight-group-header` | Dropdown group labels, select group headers | `--font-weight-strong` |
| `--font-weight-panel-field` | `PanelField` label | `--font-weight-medium` |
| `--font-weight-panel-link` | `PanelLink` | `--font-weight-strong` |
| `--font-weight-table-header` | `Table` header cells, `TableEmpty` title | `--font-weight-medium` |
| `--font-weight-table-cell` | `Table` body cells | `--font-weight-normal` |

| Token | Description | Default |
|-------|-------------|---------|
| `--font-family-base` | Typeface for all kit text (defaults to the host font) | `inherit` |
| `--font-size-label` | Dropdown / select group label size | `var(--text-sm)` |
| `--font-size-description` | `InputDescription` and `PanelField` label size | `var(--text-sm)` |
| `--font-size-error` | `InputError` size | `var(--text-sm)` |
| `--font-size-tab-count` | `TabButtons` / `Tabs` count chip size | `var(--text-xs)` |

> The text size of the input/button itself comes from the **control sizing** scale below (`--control-size-{size}-font-size`), not from these tokens.

### Structure — border radius

Semantic radius tokens map onto Tailwind's radius scale. Override a token to change one group; override the underlying `--radius-*` to change several at once.

| Token | Applies to | Default |
|-------|-----------|---------|
| `--border-radius-input` | Text inputs, selects, textareas, file inputs, the Lexical editor box | `var(--radius-xl)` |
| `--border-radius-button` | `Button`, `ButtonIconSquare` (and the file-input "Choose" button) | `var(--border-radius-input)` |
| `--border-radius-panel` | `Panel`, `PanelStack`, `Modal`, `TableEmpty` icon frame | `var(--radius-2xl)` |
| `--border-radius-dropdown` | `DropdownPanel`, Lexical floating toolbar | `var(--radius-xl)` |
| `--border-radius-option` | Select option rows | `var(--radius-xl)` |
| `--border-radius-menu-item` | `DropdownButton`, `PanelLink`, Lexical toolbar buttons | `var(--radius-lg)` |
| `--border-radius-badge` | `Badge` | `var(--radius-lg)` |
| `--border-radius-tab` | `TabButtons` container and pills | `var(--radius-xl)` |
| `--border-radius-checkbox` | `InputCheck` box | `var(--radius-lg)` |
| `--border-radius-control-inner` | Color swatch and picker bars in `InputColor` | `var(--radius-md)` |

> `ButtonIconRound`, the toggle track/thumb, and radio dots are intentionally fully round (`rounded-full`) and are not tokenized.

### Structure — border width & shadow

| Token | Applies to | Default |
|-------|-----------|---------|
| `--border-width-input` | Border width of inputs, selects, buttons, panels, dropdowns, modals, check/radio, the `Tabs` bottom rule | `1px` |
| `--border-width-tabs-indicator` | Active-tab underline in `Tabs` | `2px` |
| `--shadow-control` | Resting elevation of buttons, inputs, panels, tabs | `var(--shadow-sm)` |
| `--shadow-dropdown` | `DropdownPanel` and the Lexical floating toolbar | `var(--shadow-lg)` |
| `--shadow-overlay` | `Modal` and `SidebarModal` | `var(--shadow-xl)` |

### Structure — ring & transition

Controls share a consistent interaction model: a focus/hover "glow" ring, a thinner inset ring on press, and a single transition duration. The ring **color** comes from the per-component `--color-*-ring` tokens (see the color sections); these set its **width** and the animation timing.

| Token | Applies to | Default |
|-------|-----------|---------|
| `--control-ring-width` | Ring width on hover, focus, focus-within, and the select/dropzone open state | `4px` |
| `--control-ring-width-active` | Ring width on press (`:active`) | `1px` |
| `--control-transition-duration` | Duration of hover/focus/press transitions on buttons, inputs, selects, the icon-button press scale, etc. | `150ms` |
| `--control-transition-duration-fast` | Quicker color-only transitions (table row/header hover, clickable `Badge`) | `100ms` |

> The resting state is always ringless (`ring-0`) and a few elements opt out of a focus ring entirely (dropdown items, tabs) — these are intentional and not tokenized.

### Control sizing

`Button`, `ButtonIconSquare`, `ButtonIconRound`, `Input`, `InputColor`, `InputRange`, `InputTextArea`, `InputSelectNative`, `InputSelect`, `InputSelectSearchable`, and `InputSelectSearchableAsync` accept a `size?: 'sm' | 'md' | 'lg'` prop (default `'md'`) and read their dimensions from a single shared scale. Override these to adjust heights, padding, font size, and icon sizing consistently across all controls. Replace `{size}` with `sm`, `md`, or `lg`.

| Token | Description | sm · md · lg defaults |
|-------|-------------|------------------------|
| `--control-size-{size}-height` | Control height (also width for square/round icon buttons) | `2.5rem` · `3rem` · `3.5rem` |
| `--control-size-{size}-px` | Horizontal padding | `1rem` · `1rem` · `1.25rem` |
| `--control-size-{size}-gap` | Gap between icon and label inside buttons | `0.5rem` · `0.5rem` · `0.75rem` |
| `--control-size-{size}-font-size` | Text size | `1rem` · `1rem` · `1rem` |
| `--control-size-{size}-icon` | Icon glyph size inside controls (also the `InputRange` thumb size) | `1rem` · `1.25rem` · `1.5rem` |
| `--control-size-{size}-icon-offset` | Distance from the input edge to a leading icon (used when an `Icon` prop is set on `Input`) | `1rem` · `1rem` · `1.25rem` |
| `--control-size-{size}-range-track` | `InputRange` track thickness | `0.375rem` · `0.5rem` · `0.625rem` |

### Color — focus ring

| Token | Description | Light default |
|-------|-------------|---------------|
| `--color-input-focus-ring` | Focus ring color for buttons and inputs | `rgb(17 24 39 / 0.15)` |

### Color — buttons

Each button variant (`primary`, `white`, `black`, `transparent`, `secondary`, `tertiary`) uses the same set of tokens. Replace `{variant}` with the variant name.

| Token | Description |
|-------|-------------|
| `--color-button-{variant}-bg` | Background color |
| `--color-button-{variant}-bg-hover` | Background on hover |
| `--color-button-{variant}-bg-active` | Background on press |
| `--color-button-{variant}-border` | Border color |
| `--color-button-{variant}-border-hover` | Border on hover |
| `--color-button-{variant}-border-active` | Border on press |
| `--color-button-{variant}-text` | Text color |
| `--color-button-{variant}-text-active` | Text color on press |
| `--color-button-{variant}-bg-disabled` | Background when disabled |
| `--color-button-{variant}-border-disabled` | Border when disabled |
| `--color-button-{variant}-text-disabled` | Text color when disabled |

### Color — inputs

| Token | Description | Light default |
|-------|-------------|---------------|
| `--color-input-bg` | Input background | `#ffffff` |
| `--color-input-border` | Input border | `#e5e7eb` |
| `--color-input-text` | Input text color | `#111827` |
| `--color-input-placeholder` | Placeholder text color | `#9ca3af` |
| `--color-input-ring` | Ring color on hover | `rgb(17 24 39 / 0.1)` |
| `--color-input-border-error` | Border color in error state | `#dc2626` |
| `--color-input-ring-error` | Ring color in error state | `rgb(220 38 38 / 0.2)` |
| `--color-input-icon` | Leading icon color | `rgb(17 24 39 / 0.6)` |

Field-like inputs (`Input`, `InputPassword`, `InputTextArea`, `InputColor`, `InputLexical`, `InputFileSingle`, and the whole select family) also accept `variant?: 'default' | 'flat'`. The `flat` variant drops the control shadow and swaps in a soft fill whose border matches the background:

| Token | Description | Light default |
|-------|-------------|---------------|
| `--color-input-flat-bg` | Flat-variant input background | `#f3f4f6` |
| `--color-input-flat-border` | Flat-variant input border (defaults to the flat background) | `var(--color-input-flat-bg)` |

(`InputCheck`, `InputRadio`, `InputToggle`, and the `InputFileMultiple` dropzone have no box chrome to flatten, so they don't take the variant.)

### Color — input labels, descriptions & errors

| Token | Description | Light default |
|-------|-------------|---------------|
| `--color-input-label-text` | Label text color | `#111827` |
| `--color-input-description-text` | Description text color | `#6b7280` |
| `--color-input-error-text` | Error message text color | `#dc2626` |

### Color — input icon buttons

| Token | Description | Light default |
|-------|-------------|---------------|
| `--color-input-icon-button-ring` | Ring color for icon buttons inside inputs | `#e5e7eb` |
| `--color-input-icon-button-icon` | Icon color for icon buttons inside inputs | `#6b7280` |

### Color — file inputs

`InputFileSingle` and `UploadFileTile` are composed from existing primitives (input tokens, `Button` for the inset "Choose" button, `ButtonIconSquare` for the remove (X) button) — no dedicated color tokens of their own. `InputFileMultiple` adds:

| Token | Description | Light default |
|-------|-------------|---------------|
| `--color-input-file-icon-bg` | Background of the central icon frame inside `InputFileMultiple`'s dropzone | `#f3f4f6` |

All three components also rely on the shared `--color-status-success` / `--color-status-error` tokens for the green check / red error icons in their upload-state slots.

### Color — color input

`InputColor` reuses the standard input tokens — the color swatch in the field and the outline of the picker's saturation/value plane both derive from `--color-input-border`, and the field itself uses the same `--color-input-*` tokens as `Input`. The picker's hue/brightness gradients and indicator rings are intrinsic to the color-picking UI (not theme-based) and are intentionally not tokenized.

Both halves of `InputColor` are also exported standalone: `ColorPicker` (the HSV panel — drop it into your own popover or panel) and `ColorSwatch` (the small rounded color tile, sized via the `size` prop or the surrounding `ControlSizeContext`).

### Color — select options

| Token | Description | Light default |
|-------|-------------|---------------|
| `--color-option-bg-hover` | Option background on hover | `#f3f4f6` |
| `--color-option-bg-active` | Option background on press | `#e5e7eb` |
| `--color-option-bg-selected` | Selected option background | `#eff6ff` |
| `--color-option-bg-selected-hover` | Selected option background on hover | `#dbeafe` |
| `--color-option-bg-selected-active` | Selected option background on press | `#dbeafe` |
| `--color-option-text-disabled` | Disabled option text color | `#9ca3af` |
| `--color-input-select-placeholder` | Select placeholder text color | `#6b7280` |

### Color — select search bar

| Token | Description | Light default |
|-------|-------------|---------------|
| `--color-select-search-border` | Search input border | `#e5e7eb` |
| `--color-select-search-bg` | Search input background | `rgb(255 255 255 / 0.5)` |
| `--color-select-search-icon` | Search icon color | `#6b7280` |

### Color — toggle

| Token | Description | Light default |
|-------|-------------|---------------|
| `--color-toggle-track-on-bg` | Track background when on | `#2563eb` |
| `--color-toggle-track-on-border` | Track border when on | `#2563eb` |
| `--color-toggle-track-off-bg` | Track background when off | `#d1d5db` |
| `--color-toggle-track-off-border` | Track border when off | `#d1d5db` |
| `--color-toggle-thumb-bg` | Thumb background | `#ffffff` |

### Color — checkbox & radio

| Token | Description | Light default |
|-------|-------------|---------------|
| `--color-check-border` | Checkbox/radio border | `#d1d5db` |
| `--color-check-ring` | Checkbox/radio focus ring | `rgb(17 24 39 / 0.1)` |
| `--color-check-checked-bg` | Checkbox/radio fill when checked | `#2563eb` |

### Color — range (slider)

| Token | Description | Light default |
|-------|-------------|---------------|
| `--color-range-track-bg` | `InputRange` track background | `#e5e7eb` |
| `--color-range-fill-bg` | Filled portion of the track | `#2563eb` |
| `--color-range-thumb-bg` | Thumb background | `#ffffff` |
| `--color-range-thumb-border` | Thumb border | `#d1d5db` |
| `--color-range-ring` | Thumb focus ring | `rgb(17 24 39 / 0.1)` |

### Color — dropdown menu

| Token | Description | Light default |
|-------|-------------|---------------|
| `--color-dropdown-bg` | Dropdown panel background | `#ffffff` |
| `--color-dropdown-border` | Dropdown panel border | `#e5e7eb` |
| `--color-dropdown-item-bg-hover` | Item background on hover | `#f3f4f6` |
| `--color-dropdown-item-bg-active` | Item background on press | `#e5e7eb` |
| `--color-dropdown-item-text` | Item text color | `#111827` |
| `--color-dropdown-item-ring` | Item focus ring | `rgb(17 24 39 / 0.1)` |
| `--color-dropdown-group-label` | Group label text color | `#6b7280` |

### Color — tab buttons

| Token | Description | Light default |
|-------|-------------|---------------|
| `--color-tab-text` | Tab text and icon color | `#111827` |
| `--color-tab-container-bg` | Tab bar background | `#f3f4f6` |
| `--color-tab-bg-hover` | Tab background on hover | `#e5e7eb` |
| `--color-tab-bg-active` | Tab background on press | `rgb(209 213 219 / 0.8)` |
| `--color-tab-active-bg` | Active tab background | `#ffffff` |
| `--color-tab-active-border` | Active tab border | `#e5e7eb` |
| `--color-tab-count-bg` | Count chip background (inactive tab) | `#e5e7eb` |
| `--color-tab-count-text` | Count chip text (inactive tab) | `#374151` |
| `--color-tab-active-count-bg` | Count chip background (active tab) | `#111827` |
| `--color-tab-active-count-text` | Count chip text (active tab) | `#ffffff` |

### Color — tabs (underline)

| Token | Description | Light default |
|-------|-------------|---------------|
| `--color-tabs-text` | Inactive tab text and icon color | `#6b7280` |
| `--color-tabs-text-hover` | Inactive tab text on hover | `#374151` |
| `--color-tabs-active-text` | Active tab text and icon color | `#111827` |
| `--color-tabs-border` | Bottom rule under the tab list | `#e5e7eb` |
| `--color-tabs-active-indicator` | Active tab underline | `#111827` |
| `--color-tabs-count-bg` | Count chip background | `#f3f4f6` |
| `--color-tabs-count-text` | Count chip text | `#4b5563` |
| `--color-tabs-active-count-bg` | Count chip background (active tab) | `var(--color-tabs-count-bg)` |
| `--color-tabs-active-count-text` | Count chip text (active tab) | `var(--color-tabs-count-text)` |

### Color — panel

| Token | Description | Light default |
|-------|-------------|---------------|
| `--color-panel-bg` | Panel background | `#ffffff` |
| `--color-panel-border` | Panel border | `#e5e7eb` |
| `--color-panel-text` | Panel default text color (inherited by `PanelField`) | `#111827` |

### Color — modal & sidebar modal

| Token | Description | Light default |
|-------|-------------|---------------|
| `--color-modal-overlay` | Backdrop overlay color | `rgb(156 163 175 / 0.3)` |
| `--color-modal-bg` | Modal content background | `#ffffff` |

### Color — table

| Token | Description | Light default |
|-------|-------------|---------------|
| `--color-table-header-text` | Header text color | `#1f2937` |
| `--color-table-header-bg` | Header background | `#f9fafb` |
| `--color-table-header-bg-hover` | Header background on hover | `#f3f4f6` |
| `--color-table-header-bg-active` | Header background on press | `#e5e7eb` |
| `--color-table-border` | Table border color | `#e5e7eb` |
| `--color-table-row-bg` | Row background | `#ffffff` |
| `--color-table-row-bg-hover` | Row background on hover | `#f9fafb` |
| `--color-table-row-text` | Row text color | `#111827` |
| `--color-table-resize-handle` | Column resize handle | `#e5e7eb` |
| `--color-table-resize-handle-hover` | Resize handle on hover | `#d1d5db` |
| `--color-table-resize-handle-active` | Resize handle while dragging | `#2563eb` |

### Color — divider

| Token | Description | Light default |
|-------|-------------|---------------|
| `--color-divider` | Divider line color | `#e5e7eb` |

### Color — badge

| Token | Description | Light default |
|-------|-------------|---------------|
| `--color-badge-white-bg` | White badge background | `#ffffff` |
| `--color-badge-white-text` | White badge text | `#111827` |
| `--color-badge-white-ring` | White badge ring | `#d6d3d1` |
| `--color-badge-black-bg` | Black badge background | `#000000` |
| `--color-badge-black-text` | Black badge text | `#ffffff` |
| `--color-badge-black-ring` | Black badge ring | `#d6d3d1` |

> Colored badges (red, blue, green, etc.) use Tailwind color utility classes and are not token-based. They adapt to dark mode automatically via Tailwind's `dark:` variants.

### Color — status

Shared color tokens for status/notification indicators. Currently used by `PanelLink`'s `status` prop, but available for any component.

| Token | Description | Light default |
|-------|-------------|---------------|
| `--color-status-error` | Error / destructive state | `#dc2626` |
| `--color-status-warning` | Warning state | `#f59e0b` |
| `--color-status-success` | Success state | `#16a34a` |
| `--color-status-info` | Informational state | `#2563eb` |

## Rich text editor (`InputLexical`)

`InputLexical` is a [Lexical](https://lexical.dev)-powered rich text editor styled like the rest of the kit. It ships with two toolbar variants that share the exact same controls:

- **`static`** (default) — a light toolbar fixed at the top of the editor.
- **`floating`** — a dark bar that appears above the editor while it is focused, matching the editor width.

Lexical and its plugins are **peer dependencies** — install them alongside the library:

```bash
pnpm add lexical @lexical/react @lexical/rich-text @lexical/list @lexical/link @lexical/selection @lexical/utils
```

### Basic usage

The value is a **serialized Lexical editor state** (a JSON string). Pass the last `onChange` value back as `value` to restore content.

```tsx
import { useState } from "react";
import { InputLexical } from "@matthiaskrijgsman/mat-ui";

function Editor() {
  const [value, setValue] = useState<string>();

  return (
    <InputLexical
      label={"Description"}
      placeholder={"Write something…"}
      toolbar={"floating"}     // or "static" (default), or "none" to hide it
      value={value}
      onChange={setValue}
      autogrow                 // grow with content…
      minRows={4}              // …from a 4-row floor…
      maxRows={12}             // …up to 12 rows, then scroll
    />
  );
}
```

Sizing mirrors `InputTextArea`: `minRows` sets a height floor, `maxRows` caps the height (content beyond it scrolls), and `autogrow` lets the editor grow with its content between the two. Without `autogrow` the editor is fixed at `minRows`.

### Extending the toolbar

The toolbar is assembled from exported **building blocks**, so you can reorder, drop, or add controls via the `renderToolbar` slot. It receives `{ editor, state, tone }` and renders into whichever variant is active — the same render function drives both the static and floating bars.

```tsx
import {
  InputLexical,
  LexicalBlockTypeSelect,
  LexicalFormatButtons,
  LexicalListButtons,
  LexicalLinkButton,
  LexicalHistoryButtons,
  LexicalToolbarDivider,
} from "@matthiaskrijgsman/mat-ui";

<InputLexical
  renderToolbar={() => (
    <>
      <LexicalFormatButtons/>
      <LexicalToolbarDivider/>
      <LexicalListButtons/>
      <LexicalLinkButton/>
      <LexicalToolbarDivider/>
      <LexicalHistoryButtons/>
    </>
  )}
/>;
```

Building blocks read the active editor and formatting `state`/`tone` from context, so they work in either variant with no extra wiring. Dividers automatically flip orientation (and the whole toolbar collapses overflowing controls into a vertical `⋮` dropdown) when space runs out — return each control as a top-level child so it stays individually measurable.

#### Second row & non-collapsible toolbars

Two more layout knobs on `InputLexical` (and on `LexicalFloatingToolbar` / `FloatingToolbarShell` as `renderSecondRow` / `secondRow` and `collapsible`):

- `renderToolbarSecondRow` — a second row of building blocks for the floating toolbar, rendered below a divider (`LexicalToolbarRowDivider`).
- `toolbarCollapsible={false}` — disables the `⋮` overflow dropdown; controls that no longer fit wrap onto extra rows instead, each separated by a divider. Works for both the static and floating toolbar.

```tsx
<InputLexical
  toolbar={"floating"}
  toolbarCollapsible={false}
  renderToolbarSecondRow={() => (
    <>
      <LexicalAlignButtons/>
      <LexicalToolbarDivider/>
      <LexicalHistoryButtons/>
    </>
  )}
/>;
```

#### Custom controls

Build your own control with `LexicalToolbarButton` plus Lexical's editor context. `useLexicalToolbar()` exposes the current `{ state, tone }`:

```tsx
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_TEXT_COMMAND } from "lexical";
import { IconStrikethrough } from "@tabler/icons-react";
import { LexicalToolbarButton, useLexicalToolbar } from "@matthiaskrijgsman/mat-ui";

const StrikethroughButton = () => {
  const [editor] = useLexicalComposerContext();
  const { tone } = useLexicalToolbar();
  return (
    <LexicalToolbarButton
      Icon={IconStrikethrough}
      tone={tone}
      aria-label={"Strikethrough"}
      onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")}
    />
  );
};
```

#### Registering extra Lexical nodes

The built-in set covers headings, lists, links, and quotes. For anything else (tables, mentions, code blocks, …) install the node's package yourself and pass the node via the `nodes` prop — it is registered alongside the built-in set:

```bash
pnpm add @lexical/code
```

```tsx
import { CodeNode } from "@lexical/code";

<InputLexical nodes={[CodeNode]} renderToolbar={/* … */} />;
```

> mat-ui does not bundle `lexical` or any `@lexical/*` package — they are peer dependencies, so a single shared copy is used. Only register a given node type once: don't pass a node that is already in the built-in set, or Lexical throws a duplicate-type error.

#### Adding plugins (the `children` slot)

A Lexical feature is usually a **node *plus* a plugin**. Register the node with `nodes`, then mount the plugin(s) as **children** — they run inside the editor alongside the built-ins (history, lists, links). Any `@lexical/react` plugin or your own works:

```tsx
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { CodeHighlightPlugin } from "@lexical/react/LexicalCodeHighlightPlugin";

<InputLexical nodes={[CodeNode]}>
  <CodeHighlightPlugin />
  <TabIndentationPlugin />
  {/* …or your own plugin using useLexicalComposerContext() */}
</InputLexical>;
```

Style custom nodes by merging theme classes over the defaults with the `theme` prop:

```tsx
<InputLexical nodes={[CodeNode]} theme={{ code: "my-code-block" }}>
  <CodeHighlightPlugin />
</InputLexical>;
```

