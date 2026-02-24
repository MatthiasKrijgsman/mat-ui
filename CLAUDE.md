# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

mat-ui (`@matthiaskrijgsman/mat-ui`) is a React component library published to npm. It provides UI primitives (buttons, inputs, selects, modals, tooltips, dropdowns, tables, etc.) built with React 19, Tailwind CSS v4, and Floating UI for positioning.

## Commands

- **Build:** `pnpm build` (Vite library build + TypeScript declaration emit)
- **Lint:** `pnpm lint` (ESLint with typescript-eslint, react-hooks, react-refresh)
- **Storybook:** `pnpm storybook` (dev server on port 6006)
- **Tests:** `pnpm vitest` (Storybook-based browser tests via Playwright/Chromium)

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
- Design tokens (CSS custom properties) for button variants live in `src/styles/tokens.css`
- Component-specific CSS in co-located files (e.g., `src/components/button/Button.css`)
- Global styles entry: `src/style.css` (imports Tailwind, tokens, and component CSS)

### Component organization

- `src/components/` — most UI components; some grouped in subdirectories (`button/`, `inputs/`, `dropdown-menu/`, etc.)
- `src/popover/` — popover system using Floating UI (`usePopover` hook + `PopoverBase`)
- `src/hooks/` — shared hooks (`use-debounce`, `use-dismiss`, `use-drag-x`)
- `src/spinner/`, `src/table/` — standalone component modules
- `src/util/classnames.util.ts` — className merging utility

### Storybook

- Stories live in `stories/` (not co-located with components)
- Storybook 9 with `@storybook/react-vite`
- Vitest integration via `@storybook/addon-vitest` runs story-based tests in a headless Chromium browser

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

Used for components that consumers need to attach refs to (Button, ButtonIconSquare, ButtonIconRound, Badge, Panel):

```typescript
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => { ... });
```

Not used for simpler/composite components (Input, Modal, Tooltip, etc.).

### className merging

`classNames()` from `@/util/classnames.util.ts` — a simple filter-and-join:

```typescript
export const classNames = (...classes: any[]) => classes.filter(Boolean).join(' ')
```

Components build class strings from `base` + `variantClasses[variant]` + `sizeClasses[size]` + user `className`:

```typescript
const base = `inline-flex flex-row items-center ...`;
const variantClasses: Record<Variant, string> = { primary: 'border button-primary shadow-sm', ... };
className={classNames(base, variantClasses[variant], sizeClasses[size], className)}
```

### Styling layers

Three-tier approach for theming components like buttons:

1. **CSS custom properties** in `src/styles/tokens.css` — colors per variant/state (uses OKLCH color format)
2. **Component CSS** in co-located `.css` files — maps tokens to CSS classes using `@apply` with `var()` references
3. **Tailwind utility classes** inline in JSX — layout, spacing, typography, transitions

For simpler components (inputs, modals, panels), Tailwind classes are used directly without a CSS file.

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

Select components manage their own `open` state and use `usePopover` for positioning:
- `useDismiss(open, () => setOpen(false))` for Escape key handling
- `usePopover({ placement: 'bottom', fullWidth: true, onOutsideClick: ... })` for the dropdown
- Options render inside `<Popover open={open}><DropdownPanel>...</DropdownPanel></Popover>`
- Generic `<T>` type parameter flows through `Option<T>` to `onChange: (value: T | null) => void`

### Dropdown menu system

- `DropdownMenu` — orchestrator component managing open state
- `DropdownPanel` — styled container for dropdown content
- `DropdownButton` / `DropdownButtonGroup` — menu items
- `DropdownDismissContext` — React context that provides a dismiss callback to child buttons

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
| `storybook` + `@storybook/react-vite` | Component development and documentation |
| `@storybook/addon-vitest` + `vitest` + `@vitest/browser` + `playwright` | Story-based browser testing |
| `eslint` + `typescript-eslint` + `eslint-plugin-react-hooks` + `eslint-plugin-react-refresh` | Linting |
| `use-resize-observer` | Used internally for resize-aware components |
