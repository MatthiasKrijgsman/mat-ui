# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

mat-ui (`@matthiaskrijgsman/mat-ui`) is a React component library published to npm. It provides UI primitives (buttons, inputs, selects, modals, tooltips, dropdowns, tables, etc.) built with React 19, Tailwind CSS v4, and Floating UI for positioning.

## Repository layout

This is a pnpm workspace (`pnpm-workspace.yaml`) with two packages:
- **Root** (`@matthiaskrijgsman/mat-ui`) — the published component library, built with Vite from `src/`
- **`site/`** (`@matthiaskrijgsman/mat-ui-site`, private) — the Next.js showcase app deployed to GitHub Pages, depends on the library via `workspace:*`

## Commands

- **Build (library):** `pnpm build` (Vite library build + TypeScript declaration emit)
- **Lint:** `pnpm lint` (ESLint with typescript-eslint, react-hooks, react-refresh)
- **Showcase dev:** `pnpm site` (Next.js dev server on port 6006)
- **Showcase build:** `pnpm site:build` (static export to `site/out`)

## Architecture

### Library build

- Entry point: `src/index.tsx` — exports all public components and re-exports all types from `src/types.ts`
- Types-only export path: `@matthiaskrijgsman/mat-ui/types` (from `src/types.ts`)
- CSS export path: `@matthiaskrijgsman/mat-ui/style` — consumers must import this for styles to work
- Vite builds ES + UMD formats; React/ReactDOM are externalized (peer deps)
- Type declarations are emitted separately via `tsconfig.build.json`

### Path alias

`@/` maps to `src/` (configured in both `tsconfig.json` and `vite.config.ts`).

### Styling

- Tailwind CSS v4 with `@tailwindcss/forms` plugin, integrated via `@tailwindcss/vite`
- Design tokens (CSS custom properties) for **all** colors and structure (typography, radius, border, shadow, ring, transition) live in `src/styles/tokens.css` — see the Design tokens section under Code Style
- Component-specific CSS in co-located files (e.g., `src/components/button/Button.css`)
- Global styles entry: `src/style.css` (imports Tailwind, tokens, and component CSS)

### Component organization

- `src/components/` — most UI components; some grouped in subdirectories (`button/`, `inputs/`, `dropdown-menu/`, `panel/`, `inputs/input-file/`, `inputs/input-lexical/`, etc.)
- `src/control-size/` — the shared `sm | md | lg` control sizing system (`control-size.util.ts` class maps + `use-control-size.ts` `ControlSizeContext`)
- `src/popover/` — popover system using Floating UI (`use-popover.tsx` for generic popovers/`PopoverBase`, `use-select-popover.tsx` for keyboard-navigable select lists)
- `src/hooks/` — shared hooks (`use-debounce`, `use-dismiss`, `use-drag-x`, `use-pointer-drag`, `use-overflow-fit`)
- `src/spinner/`, `src/table/` — standalone component modules
- `src/util/classnames.util.ts` — className merging utility

### Showcase site

- Lives in `site/` as a separate workspace package
- Next.js 15 App Router with static export (`output: 'export'`)
- Tailwind v4 via `@tailwindcss/postcss`, imports the lib stylesheet from `@matthiaskrijgsman/mat-ui/style`
- Pages: `site/app/page.tsx` (Showcase); demo/layout components in `site/app/_components/`
- **Version display is automated** — do NOT hardcode it. `site/next.config.ts` reads `version` from the root `package.json` at build time and injects it as `NEXT_PUBLIC_LIB_VERSION`, which `site/app/_components/Nav.tsx` renders. Bump the root `package.json` only; the showcase follows automatically. (Read at build time, so a running dev server needs a restart to pick up a bump.)
- Deployed to GitHub Pages under `/mat-ui/` via [.github/workflows/deploy-site.yml](.github/workflows/deploy-site.yml)

### Key peer dependencies

`@floating-ui/react`, `@tabler/icons-react`, `motion` (Framer Motion), `react-merge-refs` — these are not bundled and must be installed by consumers.

## Code Style & Conventions

### General

- **Named exports only** — no default exports anywhere in the codebase
- **Arrow functions** for components: `export const Button = (props: ButtonProps) => { ... }`
- **`import * as React from "react"`** as the standard React import; specific hooks imported separately from `"react"` when needed
- **Path alias** `@/` for all internal imports (e.g., `@/util/classnames.util.ts`, `@/components/inputs/Input.tsx`)
- **Strict TypeScript** — `strict: true`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `noUncheckedSideEffectImports`

### Naming

| What | Convention | Example |
|------|-----------|---------|
| Component files | PascalCase | `Button.tsx`, `InputSelect.tsx` |
| Component directories | kebab-case | `button/`, `button-icon-square/`, `dropdown-menu/` |
| Hook files | kebab-case with `use-` prefix | `use-dismiss.ts`, `use-popover.tsx` |
| Utility files | kebab-case with `.util.ts` suffix | `classnames.util.ts` |
| CSS files | PascalCase matching component | `Button.css` |
| Types | PascalCase, `ComponentNameProps` | `ButtonProps`, `InputSelectProps<T>` |
| Variant/size unions | PascalCase short names | `type Variant = 'primary' \| 'secondary' \| ...` |
| Event handlers (internal) | `handle` + action | `handleToggleShowPassword`, `handleOnClick` |
| Callbacks (props) | `on` + action | `onDismiss`, `onChange`, `onSearch` |
| State variables | camelCase | `open`, `filteredOptions`, `selectedOption` |
| Refs | camelCase, sometimes `Ref` suffix | `ref`, `startXRef`, `inputSearchRef` |

### Props pattern

Components compose their props by extending native HTML element attributes with custom fields:

```typescript
export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  Icon?: TablerIcon;
}
```

- `Omit<>` is used to exclude conflicting HTML attributes (e.g., `Omit<..., 'type'>` for InputCheck)
- Generics for data-driven components: `export const InputSelect = <T, >(props: InputSelectProps<T>) => { ... }`
- Props are destructured at the top of the component body with defaults inline: `const { variant = 'white', size = 'md', ...rest } = props;`
- Remaining HTML attributes are spread onto the root element via `{ ...rest }`

### Type organization

- **Props types are defined inline** in the component file, not in a central types file
- `src/types.ts` is purely re-exports — it imports from component files and aliases for consumers (e.g., `Variant as ButtonVariant`)
- **Union types** for variants/sizes (no enums): `type Size = 'sm' | 'md' | 'lg'`
- Variant/size class mappings use `Record<Variant, string>` and `Record<Size, string>`

### forwardRef

Used for components that consumers need to attach refs to — e.g. `Button`, `ButtonIconSquare`, `ButtonIconRound`, `Badge`, `Panel`, `PanelStack`, `DropdownButton`, and several select sub-components (`InputSelectOption`, `InputSelectGroupHeader`, `InputSelectDivider`, `InputIconButtonTray`):

```typescript
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => { ... });
```

Not used for the larger composite components (Input, Modal, Tooltip, etc.). Note: some newer components instead accept a `ref` prop directly (React 19 style, e.g. `InputTextArea`).

### className merging

`classNames()` from `@/util/classnames.util.ts` — a simple filter-and-join:

```typescript
export const classNames = (...classes: any[]) => classes.filter(Boolean).join(' ')
```

Components build class strings from `base` + `variantClasses[variant]` + size maps (from `control-size.util.ts`) + user `className`. Structural values are token-bound arbitrary classes (see Design tokens), not hardcoded utilities:

```typescript
const base = `inline-flex flex-row items-center ... rounded-[var(--border-radius-button)] font-[number:var(--font-weight-button)]`;
const variantClasses: Record<Variant, string> = { primary: 'border-[length:var(--border-width-input)] button-primary shadow-[var(--shadow-control)]', ... };
className={classNames(base, variantClasses[variant], sizeHeightClasses[size], sizePaddingXClasses[size], className)}
```

### Styling layers

Three-tier approach for theming components like buttons:

1. **CSS custom properties (design tokens)** in `src/styles/tokens.css` — colors *and* structure (typography, radius, border, shadow, ring, transition). See the Design tokens section below.
2. **Component CSS** in co-located `.css` files — maps tokens to CSS classes using `@apply` with `var()` references (mainly for color/state variants).
3. **Tailwind utility classes** inline in JSX — layout and spacing, plus token-bound arbitrary values for everything themeable.

For simpler components (inputs, modals, panels), Tailwind classes are used directly without a CSS file.

### Design tokens (how to tokenize a new component)

**The goal:** a consumer can completely retheme the kit by overriding CSS variables — they never fork Tailwind config or pass styling props. So **nothing visual is hardcoded**. When you build a component, every color, weight, radius, border width, shadow, ring and transition must resolve to a token.

All tokens live in [`src/styles/tokens.css`](src/styles/tokens.css). They split into three families:

- **Structure** (typography, radius, border width, shadow, ring width, transition duration) — defined **once** under `:root`. Theme-independent; do **not** duplicate under `.dark`.
- **Sizing** — the shared `sm | md | lg` control scale (`--control-size-{size}-*`).
- **Color** — defined under `:root` (light) **and** overridden under `.dark`. Every color needs both.

**Two-tier model.** Structure and color tokens come in:
1. **Base scales** — primitives (`--font-weight-strong`, `--radius-xl`, Tailwind's `--shadow-*`).
2. **Semantic aliases** — per-component tokens that point at a base scale by default, e.g. `--font-weight-button: var(--font-weight-strong)`, `--border-radius-dropdown: var(--radius-xl)`.

When adding a component, **reuse an existing semantic token if one fits the category**; otherwise **add a new semantic alias that defaults to a base scale** (so global theming still cascades). Pick a default that exactly matches the current visual — never change appearance while tokenizing.

**How to apply tokens** — Tailwind arbitrary values bound to vars, in JSX. **The type hints are mandatory** — without them Tailwind misreads a `var()` (e.g. `font-[var(...)]` becomes font-*family*, `border-[var(...)]` becomes border-*color*):

| Property | Pattern | Example token |
|----------|---------|---------------|
| font-weight | `font-[number:var(--…)]` | `--font-weight-button` |
| font-family | `font-[family-name:var(--font-family-base)]` | `--font-family-base` |
| font-size (secondary text) | `text-[length:var(--…)]` | `--font-size-description` |
| border-radius | `rounded-[var(--…)]` | `--border-radius-input` |
| border-width | `border-[length:var(--…)]` | `--border-width-input` |
| shadow | `shadow-[var(--…)]` | `--shadow-control` |
| ring width | `ring-[length:var(--…)]` (with `hover:`/`focus:`/`active:`) | `--control-ring-width` |
| transition duration | `duration-[var(--…)]` | `--control-transition-duration` |
| color | component CSS class `@apply …-[var(--color-…)]`, or inline `bg-[var(--color-…)]` / `text-[…]` / `ring-[…]` | `--color-input-border` |

**Sizing:** if the component is a sizable control, import the maps from [`src/control-size/control-size.util.ts`](src/control-size/control-size.util.ts) (`sizeHeightClasses`, `sizePaddingXClasses`, `sizeFontClasses`, `sizeIconClasses`, …) keyed by the `size` prop, and wrap children in `ControlSizeContext.Provider`. The control's own text size comes from `--control-size-{size}-font-size`, **not** the `--font-size-*` tokens (those are for labels/descriptions/errors).

**Color tokens:** add `--color-<component>-<part>` entries under **both** `:root` and `.dark`, defaulting to the Tailwind palette vars (`var(--color-gray-200)`, etc.). Reference them via a co-located `.css` class (`@apply text-[var(--color-…)]`) or inline arbitrary classes.

**Checklist for a new component:**
1. No raw `font-semibold` / `rounded-xl` / `shadow-sm` / `border` / `ring-4` / `duration-150` / hardcoded hex — each maps to a token.
2. New semantic tokens default to a base scale or Tailwind theme var, and preserve current visuals.
3. Color tokens added under both `:root` and `.dark`.
4. Document new tokens in the README "Token reference" section.

**Intentional exceptions (leave hardcoded):** fully-round shapes (`rounded-full` on avatars, toggle/radio dots, round icon buttons), the resting `ring-0`, deliberate focus-ring opt-outs (`focus:ring-0` on dropdown items/tabs), transparent layout borders, rich-text semantics (`font-bold` on Lexical headings/bold), and the toggle thumb's internal `shadow-md`.

### Animations

- `motion` package (Framer Motion) for mount/unmount and transition animations
- Import from `"motion/react"`: `AnimatePresence`, `motion.div`
- Standard animation config: `{ duration: 0.15, ease: "easeInOut" }`
- `AnimatePresence` wraps conditional renders; `motion.div` for animated containers

### Popover/floating positioning

- `@floating-ui/react` handles positioning, portals, and overlays
- `usePopover` hook returns `{ anchorRef, Popover }` — attach `anchorRef` to the trigger, render `<Popover open={...}>` inline
- `FloatingPortal` renders modals/popovers outside the DOM tree
- `FloatingOverlay` provides backdrop overlays with scroll locking

## Component Structure Patterns

### Composite input components

Input components follow a composition pattern with shared sub-components:

```
<div className="flex flex-col">
  <InputLabel>{label}</InputLabel>
  <div className="relative">
    {/* main input element */}
    <InputIconButtonTray>
      <InputErrorIcon />      {/* shown when error */}
      {buttonTray}             {/* custom action buttons */}
    </InputIconButtonTray>
  </div>
  <InputDescription>{description}</InputDescription>
  <InputError>{error}</InputError>
</div>
```

These sub-components (`InputLabel`, `InputDescription`, `InputError`, `InputIconButtonTray`, `InputIconButton`, `InputErrorIcon`) are individually exported and reused by `Input`, `InputPassword`, `InputSelect`, `InputSelectSearchable`, etc.

### Select/dropdown components

Select components manage their own `open` state and use `useSelectPopover` (in `src/popover/`) for positioning + keyboard list navigation:
- `useDismiss(open, () => setOpen(false))` for Escape key handling
- `useSelectPopover({ placement: 'bottom', fullWidth: true, minWidth, open, onOpenChange, listRef, activeIndex, onNavigate, disabledIndices })` returns `{ anchorRef, Popover, getReferenceProps, getItemProps }`
- Options render inside `<Popover open={open}><DropdownPanel>...</DropdownPanel></Popover>`, sized via `ControlSizeContext`
- Generic `<T>` type parameter flows through `Option<T>` to `onChange: (value: T | null) => void`
- (Simpler popovers — `InputColor`, tooltips — use `usePopover` instead, which returns `{ anchorRef, Popover }`.)

### Dropdown menu system

- `DropdownMenu` — orchestrator component managing open state
- `DropdownPanel` — styled container for dropdown content
- `DropdownButton` / `DropdownButtonGroup` — menu items
- `DropdownDismissContext` (in `use-dropdown-dismiss.ts`) — React context providing a dismiss callback to child buttons, consumed via the `useDropdownDismiss()` hook

### Modal

Portal-based with two animation layers:
- Backdrop: `FloatingOverlay` with blur, animated opacity via `motion.div`
- Content: `motion.div` with scale + translate animation, scroll-locked body

### Hook conventions

- Small hooks are arrow functions: `export const useDismiss = (active, onDismiss) => { ... }`
- Complex hooks use function declarations: `export function useDragX(options) { ... }`
- Hooks return either nothing (side-effect only, like `useDismiss`), a value (`useDebounce`), or a structured object (`useDragX` returns `{ isDragging, bind }`, `usePopover` returns `{ anchorRef, Popover }`)
- Proper cleanup in `useEffect` returns; `useRef` for mutable state that shouldn't trigger re-renders

## Dependencies & Their Roles

### Peer dependencies (required by consumers)

| Package | Purpose |
|---------|---------|
| `react`, `react-dom` | React 19 core |
| `@floating-ui/react` | Popover/tooltip/dropdown positioning, portals, overlays |
| `@tabler/icons-react` | Icon components (`TablerIcon` type used in button/input Icon props) |
| `motion` | Animations (mount/unmount transitions, modals, popovers) |
| `react-merge-refs` | Combining multiple refs on a single element |

### Key dev dependencies

| Package | Purpose |
|---------|---------|
| `vite` + `@vitejs/plugin-react` | Build tooling (ES + UMD library output) |
| `tailwindcss` + `@tailwindcss/vite` + `@tailwindcss/forms` | Tailwind CSS v4 with form reset plugin |
| `typescript ~5.8` | Type checking and declaration emit |
| `next` (in `site/`) | Showcase app — static export to GitHub Pages |
| `eslint` + `typescript-eslint` + `eslint-plugin-react-hooks` + `eslint-plugin-react-refresh` | Linting |
| `use-resize-observer` | Only used by the internal `ScrollbarTest` scratch component; production resize logic (`use-overflow-fit`) uses the native `ResizeObserver` |
