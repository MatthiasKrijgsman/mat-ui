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