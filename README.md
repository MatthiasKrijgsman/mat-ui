# mat-ui

A React component library providing UI primitives built with React 19, Tailwind CSS v4, and Floating UI.

## Installation

```bash
npm install @matthiaskrijgsman/mat-ui
```

### Peer dependencies

mat-ui requires the following peer dependencies:

```bash
npm install react react-dom @floating-ui/react @tabler/icons-react motion react-merge-refs
```

### Styles

Import the mat-ui stylesheet in your CSS entry file:

```css
@import "@matthiaskrijgsman/mat-ui/style";
```

## Usage

```tsx
import { Button, Input, Modal } from "@matthiaskrijgsman/mat-ui";

function App() {
  return <Button variant="primary">Click me</Button>;
}
```

## Components

**Buttons** — `Button`, `ButtonIconSquare`, `ButtonIconRound`

**Inputs** — `Input`, `InputPassword`, `InputTextArea`, `InputRadio`, `InputToggle`, `InputCheck`, `InputLabel`, `InputDescription`, `InputError`, `InputErrorIcon`, `InputIconButton`, `InputIconButtonTray`

**Selects** — `InputSelectNative`, `InputSelect`, `InputSelectSearchable`, `InputSelectSearchableAsync`, `InputSelectOption`

**Layout & feedback** — `Panel`, `Divider`, `Tooltip`, `Modal`, `Badge`, `BadgeColor`, `TabButtons`, `Spinner`

**Dropdown** — `DropdownButton`, `DropdownButtonGroup`, `DropdownPanel`, `DropdownMenu`

**Popover** — `usePopover`, `PopoverBase`

## Types

All public types are available via the main import or the dedicated types path:

```ts
import type { ButtonVariant } from "@matthiaskrijgsman/mat-ui";
// or
import type { ButtonVariant } from "@matthiaskrijgsman/mat-ui/types";
```

## License

MIT