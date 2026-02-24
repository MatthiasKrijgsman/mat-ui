# mat-ui

A React component library providing UI primitives built with React 19, Tailwind CSS v4, and Floating UI.

## Storybook
[View the components here](https://matthiaskrijgsman.github.io/mat-ui/?path=/docs/index--docs)

## Installation

```bash
pnpm install @matthiaskrijgsman/mat-ui
```

### Styles

Import the mat-ui stylesheet in your CSS entry file:

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

## CSS Design Tokens

mat-ui uses CSS custom properties (design tokens) for all component colors. These are defined on `:root` for light mode and overridden under `.dark` for dark mode. You can customize the look of any component by overriding these tokens in your own CSS.

### Overriding tokens

Define your overrides after importing the mat-ui stylesheet:

```css
@import "@matthiaskrijgsman/mat-ui/style";

:root {
  /* Change the primary button to your brand color */
  --color-button-primary-bg: #0ea5e9;
  --color-button-primary-border: #0ea5e9;
  --color-button-primary-bg-active: #0284c7;
  --color-button-primary-border-active: #0284c7;
}

/* Override dark theme values too */
.dark {
  --color-button-primary-bg: #38bdf8;
  --color-button-primary-border: #38bdf8;
  --color-button-primary-bg-active: #0ea5e9;
  --color-button-primary-border-active: #0ea5e9;
}
```

### Token reference

#### General

| Token | Description | Light default |
|-------|-------------|---------------|
| `--color-input-focus-ring` | Focus ring color for buttons and inputs | `rgb(17 24 39 / 0.15)` |
| `--border-radius-input` | Border radius for inputs and selects | `var(--radius-xl)` |

#### Buttons

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

#### Inputs

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

#### Input labels, descriptions & errors

| Token | Description | Light default |
|-------|-------------|---------------|
| `--color-input-label-text` | Label text color | `#111827` |
| `--color-input-description-text` | Description text color | `#6b7280` |
| `--color-input-error-text` | Error message text color | `#dc2626` |

#### Input icon buttons

| Token | Description | Light default |
|-------|-------------|---------------|
| `--color-input-icon-button-ring` | Ring color for icon buttons inside inputs | `#e5e7eb` |
| `--color-input-icon-button-icon` | Icon color for icon buttons inside inputs | `#6b7280` |

#### Select options

| Token | Description | Light default |
|-------|-------------|---------------|
| `--color-option-bg-hover` | Option background on hover | `#f3f4f6` |
| `--color-option-bg-active` | Option background on press | `#e5e7eb` |
| `--color-option-bg-selected` | Selected option background | `#eff6ff` |
| `--color-option-bg-selected-hover` | Selected option background on hover | `#dbeafe` |
| `--color-option-bg-selected-active` | Selected option background on press | `#dbeafe` |
| `--color-option-text-disabled` | Disabled option text color | `#9ca3af` |
| `--color-input-select-placeholder` | Select placeholder text color | `#6b7280` |

#### Select search bar

| Token | Description | Light default |
|-------|-------------|---------------|
| `--color-select-search-border` | Search input border | `#e5e7eb` |
| `--color-select-search-bg` | Search input background | `rgb(255 255 255 / 0.5)` |
| `--color-select-search-icon` | Search icon color | `#6b7280` |

#### Toggle

| Token | Description | Light default |
|-------|-------------|---------------|
| `--color-toggle-track-on-bg` | Track background when on | `#2563eb` |
| `--color-toggle-track-on-border` | Track border when on | `#2563eb` |
| `--color-toggle-track-off-bg` | Track background when off | `#d1d5db` |
| `--color-toggle-track-off-border` | Track border when off | `#d1d5db` |
| `--color-toggle-thumb-bg` | Thumb background | `#ffffff` |

#### Checkbox & Radio

| Token | Description | Light default |
|-------|-------------|---------------|
| `--color-check-border` | Checkbox/radio border | `#d1d5db` |
| `--color-check-ring` | Checkbox/radio focus ring | `rgb(17 24 39 / 0.1)` |

#### Dropdown menu

| Token | Description | Light default |
|-------|-------------|---------------|
| `--color-dropdown-bg` | Dropdown panel background | `#ffffff` |
| `--color-dropdown-border` | Dropdown panel border | `#e5e7eb` |
| `--color-dropdown-item-bg-hover` | Item background on hover | `#f3f4f6` |
| `--color-dropdown-item-bg-active` | Item background on press | `#e5e7eb` |
| `--color-dropdown-item-text` | Item text color | `#111827` |
| `--color-dropdown-item-ring` | Item focus ring | `rgb(17 24 39 / 0.1)` |
| `--color-dropdown-group-label` | Group label text color | `#6b7280` |

#### Tab buttons

| Token | Description | Light default |
|-------|-------------|---------------|
| `--color-tab-text` | Tab text and icon color | `#111827` |
| `--color-tab-container-bg` | Tab bar background | `#f3f4f6` |
| `--color-tab-bg-hover` | Tab background on hover | `#e5e7eb` |
| `--color-tab-bg-active` | Tab background on press | `rgb(209 213 219 / 0.8)` |
| `--color-tab-active-bg` | Active tab background | `#ffffff` |
| `--color-tab-active-border` | Active tab border | `#e5e7eb` |

#### Panel

| Token | Description | Light default |
|-------|-------------|---------------|
| `--color-panel-bg` | Panel background | `#ffffff` |
| `--color-panel-border` | Panel border | `#e5e7eb` |

#### Modal & Sidebar modal

| Token | Description | Light default |
|-------|-------------|---------------|
| `--color-modal-overlay` | Backdrop overlay color | `rgb(156 163 175 / 0.3)` |
| `--color-modal-bg` | Modal content background | `#ffffff` |

#### Table

| Token | Description | Light default |
|-------|-------------|---------------|
| `--color-table-header-text` | Header text color | `#1f2937` |
| `--color-table-header-bg` | Header background | `#f9fafb` |
| `--color-table-header-bg-hover` | Header background on hover | `#f3f4f6` |
| `--color-table-header-bg-active` | Header background on press | `#e5e7eb` |
| `--color-table-border` | Table border color | `#e5e7eb` |
| `--color-table-row-bg` | Row background | `#ffffff` |
| `--color-table-row-bg-hover` | Row background on hover | `#f9fafb` |
| `--color-table-resize-handle` | Column resize handle | `#e5e7eb` |
| `--color-table-resize-handle-hover` | Resize handle on hover | `#d1d5db` |
| `--color-table-resize-handle-active` | Resize handle while dragging | `#2563eb` |

#### Divider

| Token | Description | Light default |
|-------|-------------|---------------|
| `--color-divider` | Divider line color | `#e5e7eb` |

#### Badge

| Token | Description | Light default |
|-------|-------------|---------------|
| `--color-badge-white-bg` | White badge background | `#ffffff` |
| `--color-badge-white-text` | White badge text | `#111827` |
| `--color-badge-white-ring` | White badge ring | `#d6d3d1` |
| `--color-badge-black-bg` | Black badge background | `#000000` |
| `--color-badge-black-text` | Black badge text | `#ffffff` |
| `--color-badge-black-ring` | Black badge ring | `#d6d3d1` |

> Colored badges (red, blue, green, etc.) use Tailwind color utility classes and are not token-based. They adapt to dark mode automatically via Tailwind's `dark:` variants.
