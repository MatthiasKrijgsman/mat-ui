# Theming Plan: CSS Custom Properties for All Components

## Pattern (established by Button)

The Button component demonstrates a three-tier theming approach:

1. **`tokens.css`** — CSS custom properties (`:root`) defining every color/shadow value per state
2. **`Component.css`** — CSS classes that map tokens to Tailwind `@apply` rules per state (`:hover`, `:active`, `:disabled`, etc.)
3. **`Component.tsx`** — References the CSS class names instead of hardcoded Tailwind color utilities

This plan applies that same pattern to every remaining component.

---

## Shared Tokens (used across many components)

Before tackling individual components, define shared tokens that multiple components reference:

```css
/* tokens.css — shared */
--color-focus-ring: rgb(17 24 39 / 0.15);           /* already exists as --color-input-focus-ring */
--color-border: #e5e7eb;                              /* gray-200 — used by Panel, Input, Table, Dropdown, Tabs */
--color-bg-surface: #ffffff;                           /* white — primary surface bg */
--color-bg-surface-hover: #f9fafb;                     /* gray-50 */
--color-bg-surface-active: #f3f4f6;                    /* gray-100 */
--color-text-primary: #111827;                         /* gray-900 */
--color-text-secondary: #6b7280;                       /* gray-500 */
--color-text-placeholder: #9ca3af;                     /* gray-400 */
--color-text-disabled: #9ca3af;                        /* gray-400 */
--color-error: #dc2626;                                /* red-600 */
--color-error-ring: rgb(220 38 38 / 0.2);             /* red-600/20 */
--color-accent: #2563eb;                               /* blue-600 — toggles, selected options */
--color-accent-subtle: #eff6ff;                        /* blue-50 — selected option bg */
--color-accent-subtle-hover: #dbeafe;                  /* blue-100 */
--color-shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);    /* shadow-sm equivalent */
--color-shadow-lg: ...;                                /* shadow-lg equivalent */
--color-shadow-xl: ...;                                /* shadow-xl equivalent */
--color-overlay: rgb(156 163 175 / 0.3);              /* gray-400/30 */
```

> **Note:** Shadow tokens may need to use `--shadow-*` naming since they're not colors. The `shadow-sm`/`shadow-lg`/`shadow-xl` Tailwind values can be referenced via `var()` in custom CSS or kept as Tailwind utilities if shadow theming isn't needed.

---

## Component-by-Component Plan

### Priority 1 — High-impact, many hardcoded colors

#### 1. Input / InputTextArea / InputSelectNative

**New file:** `src/components/inputs/Input.css`
**Tokens needed:**

| Token | Default | Used for |
|-------|---------|----------|
| `--color-input-bg` | `#ffffff` | Input background |
| `--color-input-border` | `#e5e7eb` | Input border |
| `--color-input-text` | `#111827` | Input text color |
| `--color-input-placeholder` | `#9ca3af` | Placeholder text |
| `--color-input-shadow` | shadow-sm | Box shadow |
| `--color-input-ring` | `rgb(17 24 39 / 0.1)` | Focus ring color |
| `--color-input-border-error` | `#dc2626` | Error border |
| `--color-input-ring-error` | `rgb(220 38 38 / 0.2)` | Error focus ring |
| `--color-input-icon` | `rgb(17 24 39 / 0.6)` | Left icon color |

**CSS classes to create:**

```
.input-base        → bg, border, text, placeholder, shadow, ring color
.input-base:focus  → ring-4 with ring color
.input-error       → border-red, ring-red
.input-icon        → text color for left icon
```

**TSX changes:** Replace hardcoded `border-gray-200 text-gray-900 placeholder:text-gray-400 bg-white ring-gray-900/10 shadow-sm` and error classes with `.input-base` / `.input-error`.

**Applies to:** `Input.tsx`, `InputTextArea.tsx`, `InputSelectNative.tsx` (all share the same input styling).

---

#### 2. InputSelect / InputSelectSearchable / InputSelectSearchableAsync

**New file:** `src/components/inputs/InputSelect.css`
**Tokens needed:** Same as Input above (trigger div matches Input styling), plus:

| Token | Default | Used for |
|-------|---------|----------|
| `--color-select-search-border` | `#e5e7eb` | Search bar bottom border |
| `--color-select-search-bg` | `rgb(255 255 255 / 0.5)` | Search bar backdrop |
| `--color-select-search-icon` | `#6b7280` | Search icon |

**CSS classes:**

```
.select-trigger         → same as .input-base
.select-trigger-open    → ring-4
.select-trigger-error   → same as .input-error
.select-search-bar      → border-b, bg, backdrop-blur
.select-search-icon     → text color
```

**TSX changes:** Replace hardcoded Tailwind color classes in trigger div and search bar.

---

#### 3. InputSelectOption

**New file:** Could share `InputSelect.css` or be in its own file.
**Tokens needed:**

| Token | Default | Used for |
|-------|---------|----------|
| `--color-option-bg-hover` | `#f3f4f6` | Option hover bg (gray-100) |
| `--color-option-bg-active` | `#e5e7eb` | Option active bg (gray-200) |
| `--color-option-bg-selected` | `#eff6ff` | Selected option bg (blue-50) |
| `--color-option-bg-selected-hover` | `#dbeafe` | Selected hover (blue-100) |
| `--color-option-bg-selected-active` | `#dbeafe` | Selected active (blue-100) |
| `--color-option-text-disabled` | `#9ca3af` | Disabled text |

**CSS classes:**

```
.option-base             → hover/active bg
.option-selected         → selected bg + hover/active
.option-disabled         → text color, cursor
```

---

#### 4. InputToggle

**Tokens needed:**

| Token | Default | Used for |
|-------|---------|----------|
| `--color-toggle-track-on` | `#2563eb` | Checked track bg (blue-600) |
| `--color-toggle-track-on-border` | `#2563eb` | Checked track border |
| `--color-toggle-track-off` | `#d1d5db` | Unchecked track bg (gray-300) |
| `--color-toggle-track-off-border` | `#d1d5db` | Unchecked track border |
| `--color-toggle-thumb` | `#ffffff` | Thumb bg |
| `--color-toggle-ring` | `rgb(17 24 39 / 0.1)` | Focus ring |

**New file:** `src/components/inputs/InputToggle.css`

**CSS classes:**

```
.toggle-track-on    → bg, border
.toggle-track-off   → bg, border
.toggle-thumb       → bg, shadow
.toggle-ring        → ring color
```

---

#### 5. InputRadio / InputCheck

**Tokens needed:**

| Token | Default | Used for |
|-------|---------|----------|
| `--color-check-border` | `#d1d5db` | Border (gray-300) |
| `--color-check-ring` | `rgb(17 24 39 / 0.1)` | Focus/hover ring |
| `--color-check-shadow` | shadow-sm | Box shadow |

**New file:** `src/components/inputs/InputCheck.css` (shared by both)

**CSS classes:**

```
.check-base → border, ring color, shadow
```

---

#### 6. InputLabel / InputDescription / InputError / InputErrorIcon / InputIconButton

**Tokens needed:**

| Token | Default | Used for |
|-------|---------|----------|
| `--color-label-text` | `#111827` | Label text (gray-900) |
| `--color-description-text` | `#6b7280` | Description text (gray-500) |
| `--color-error-text` | `#dc2626` | Error text (red-600) |
| `--color-icon-button-ring` | `#e5e7eb` | IconButton ring (gray-200) |
| `--color-icon-button-icon` | `#6b7280` | IconButton icon (gray-500) |

These are small — could go in a shared `src/components/inputs/InputShared.css` or individual files per component.

**CSS classes:**

```
.input-label        → text color, font-weight
.input-description  → text color
.input-error-text   → text color
.input-error-icon   → text color
.input-icon-button  → ring color, icon color
```

---

### Priority 2 — Medium complexity

#### 7. Table / TableColumnHead

**New file:** `src/table/Table.css`
**Tokens needed:**

| Token | Default | Used for |
|-------|---------|----------|
| `--color-table-header-text` | `#1f2937` | Header text (gray-800) |
| `--color-table-header-bg` | `#f9fafb` | Header cell bg (gray-50) |
| `--color-table-header-bg-hover` | `#f3f4f6` | Header hover (gray-100) |
| `--color-table-header-bg-active` | `#e5e7eb` | Header active (gray-200) |
| `--color-table-border` | `#e5e7eb` | Row borders (gray-200) |
| `--color-table-row-bg` | `#ffffff` | Row bg |
| `--color-table-row-bg-hover` | `#f9fafb` | Row hover (gray-50) |
| `--color-table-resize-handle` | `#e5e7eb` | Resize divider (gray-200) |
| `--color-table-resize-handle-hover` | `#d1d5db` | Resize hover (gray-300) |
| `--color-table-resize-handle-active` | `#2563eb` | Resize active (blue-600) |

**CSS classes:**

```
.table-header      → text, border-b
.table-header-cell → bg, hover bg, active bg
.table-row         → bg, hover bg, border-b
.table-resize      → bg, hover bg, active bg
```

---

#### 8. TabButtons

**New file:** `src/components/TabButtons.css`
**Tokens needed:**

| Token | Default | Used for |
|-------|---------|----------|
| `--color-tab-container-bg` | `#f3f4f6` | Container bg (gray-100) |
| `--color-tab-bg-hover` | `#e5e7eb` | Tab hover (gray-200) |
| `--color-tab-bg-active` | `rgb(209 213 219 / 0.8)` | Tab press (gray-300/80) |
| `--color-tab-active-bg` | `#ffffff` | Active tab bg |
| `--color-tab-active-border` | `#e5e7eb` | Active tab border |
| `--color-tab-active-shadow` | shadow-sm | Active tab shadow |

**CSS classes:**

```
.tab-container    → bg
.tab-button       → hover bg, active bg
.tab-button-active → bg, border, shadow
```

---

#### 9. DropdownPanel / DropdownButton / DropdownButtonGroup

**New file:** `src/components/dropdown-menu/Dropdown.css`
**Tokens needed:**

| Token | Default | Used for |
|-------|---------|----------|
| `--color-dropdown-bg` | `#ffffff` | Panel bg |
| `--color-dropdown-border` | `#e5e7eb` | Panel border |
| `--color-dropdown-shadow` | shadow-lg | Panel shadow |
| `--color-dropdown-item-bg-hover` | `#f3f4f6` | Item hover (gray-100) |
| `--color-dropdown-item-bg-active` | `#e5e7eb` | Item active (gray-200) |
| `--color-dropdown-item-text` | `#111827` | Item text (gray-900) |
| `--color-dropdown-group-label` | `#6b7280` | Group label (gray-500) |

**CSS classes:**

```
.dropdown-panel       → bg, border, shadow
.dropdown-item        → text, hover bg, active bg
.dropdown-group-label → text color
```

---

#### 10. Panel

**New file:** `src/components/Panel.css`
**Tokens needed:**

| Token | Default | Used for |
|-------|---------|----------|
| `--color-panel-bg` | `#ffffff` | Panel bg |
| `--color-panel-border` | `#e5e7eb` | Panel border |
| `--color-panel-shadow` | shadow-sm | Panel shadow |

**CSS classes:**

```
.panel-base → bg, border, shadow
```

---

#### 11. Modal / SidebarModal

**New file:** `src/components/Modal.css`
**Tokens needed:**

| Token | Default | Used for |
|-------|---------|----------|
| `--color-modal-overlay` | `rgb(156 163 175 / 0.3)` | Backdrop bg (gray-400/30) |
| `--color-modal-bg` | `#ffffff` | Content bg |
| `--color-modal-shadow` | shadow-xl | Content shadow |

**CSS classes:**

```
.modal-overlay → bg
.modal-content → bg, shadow
```

Both Modal and SidebarModal share the same overlay and content surface styling.

---

#### 12. Divider

**Tokens needed:**

| Token | Default | Used for |
|-------|---------|----------|
| `--color-divider` | `#e5e7eb` | Divider bg (gray-200) |

Simplest change — replace `bg-gray-200` with `bg-[var(--color-divider)]` inline, or create a `.divider` class. Given it's a single property, inline `var()` is sufficient (no separate CSS file needed).

---

#### 13. BadgeColor

**Approach decision needed:** The badge has 24 color variants using Tailwind color utilities (`bg-red-100 text-red-700 ring-red-200`, etc.). Two options:

**Option A — Token per badge color (comprehensive but verbose):**
Define `--color-badge-{color}-bg`, `--color-badge-{color}-text`, `--color-badge-{color}-ring` for all 24 colors. Very verbose (72 tokens) but fully themeable.

**Option B — Keep Tailwind colors, tokenize only white/black:**
The color palette badges (red, blue, green, etc.) are inherently fixed semantic colors. Only tokenize `white` and `black` badge variants since those map to surface/text colors that change in dark mode or themes.

**Recommendation:** Option B. Badge colors are semantic — a "red" badge should always be red. Only `white` and `black` need theming.

---

### Priority 3 — No changes needed

#### Spinner

Already uses `currentColor` — fully themeable by parent context. No changes needed.

#### PopoverBase

No color styling — just positioning. No changes needed.

#### Hooks (useDismiss, useDebounce, useDragX)

No visual styling. No changes needed.

---

## Implementation Order

1. **Add shared tokens to `tokens.css`** — the common values used across multiple components
2. **Input family** (Input, InputTextArea, InputSelectNative, InputSelect*, InputRadio, InputCheck, InputToggle + sub-components) — largest group, most impact
3. **Dropdown system** (DropdownPanel, DropdownButton, DropdownButtonGroup)
4. **Table** (Table, TableColumnHead)
5. **TabButtons**
6. **Panel**
7. **Modal / SidebarModal**
8. **Divider** (inline var, no CSS file)
9. **BadgeColor** (white/black variants only)

## File Changes Summary

| New CSS file | Components it serves |
|---|---|
| `src/components/inputs/Input.css` | Input, InputTextArea, InputSelectNative |
| `src/components/inputs/InputSelect.css` | InputSelect, InputSelectSearchable, InputSelectSearchableAsync, InputSelectOption |
| `src/components/inputs/InputToggle.css` | InputToggle |
| `src/components/inputs/InputCheck.css` | InputRadio, InputCheck |
| `src/components/inputs/InputShared.css` | InputLabel, InputDescription, InputError, InputErrorIcon, InputIconButton |
| `src/components/dropdown-menu/Dropdown.css` | DropdownPanel, DropdownButton, DropdownButtonGroup |
| `src/components/TabButtons.css` | TabButtons |
| `src/components/Panel.css` | Panel |
| `src/components/Modal.css` | Modal, SidebarModal |
| `src/table/Table.css` | Table, TableColumnHead |

**Modified files:**
- `src/styles/tokens.css` — all new tokens added here
- `src/style.css` — import all new CSS files
- Every component `.tsx` file listed above — swap hardcoded Tailwind color classes for CSS class names

**Total:** ~10 new CSS files, ~1 modified CSS token file, ~1 modified style entry, ~25 modified TSX files.
