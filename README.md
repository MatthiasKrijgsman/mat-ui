# Mat UI

Reusable React UI components built with TypeScript, Vite, and Tailwind.

## Installation

```
pnpm add mat-ui
```

## Using with Tailwind

This library uses Tailwind utility classes inside its components. When you consume it in another project, make sure your Tailwind build scans the library so those classes are included in your consumer’s CSS output.

- Tailwind v4 (with `@tailwindcss/vite`): add an `@source` directive in your Tailwind entry CSS (the file that contains `@import "tailwindcss";`). Adjust the path if your setup differs.

  ```css
  /* e.g. src/styles/tailwind.css in your app */
  @import "tailwindcss";
  @source "./node_modules/mat-ui/dist/**/*.{js,jsx,ts,tsx}";
  ```

- Tailwind v3 (classic config): include `mat-ui` in your `content` globs so the scanner sees class names inside the library.

  ```ts
  // tailwind.config.{js,ts}
  export default {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
      "./node_modules/mat-ui/dist/**/*.{js,jsx,ts,tsx}",
    ],
    // ...rest
  }
  ```

Notes

- The classes in this library are static strings (no dynamic `pl-${n}` patterns), so Tailwind will pick them up as long as your scanner points at the files.
- If your app does NOT use Tailwind but you still want to use these components, open an issue. We can expose an optional compiled CSS you can import, but see the theming note below.

## Theming (future-friendly)

To support consumer-driven theming, prefer the scanning approach above so the consumer’s Tailwind config remains the source of truth for tokens (colors, spacing, etc.). This allows:

- Tailwind v4 tokens via `@theme` in the consumer’s CSS to affect all utilities (including those used by `mat-ui`).
- Tailwind v3 theme customization via the consumer’s `tailwind.config`.

Why CSS isn’t auto-shipped by default: bundling compiled Tailwind CSS inside the library locks in the generated values and can conflict with the consumer’s theme. By letting the consumer generate the utilities, they stay in control of colors, spacing, radii, etc.

Optional path (on request): we can add an opt-in CSS artifact (e.g., `mat-ui/dist/style.css`) for non-Tailwind consumers to import:

```ts
// Consumer app
import '@matthiaskrijgsman/mat-ui/style.css';
```

This is convenient but won’t reflect the consumer’s Tailwind theme tokens.

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
