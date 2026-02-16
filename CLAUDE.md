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
