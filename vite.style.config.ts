import { defineConfig } from 'vite';
import tailwind from '@tailwindcss/vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// Dedicated build to emit an optional CSS artifact for non‑Tailwind consumers.
export default defineConfig({
  plugins: [tailwind()],
  build: {
    outDir: path.resolve(dirname, 'dist'),
    lib: {
      entry: path.resolve(dirname, 'src/style.ts'),
      formats: ['es'],
      // No UMD for CSS entry
      fileName: () => 'style.js',
    },
    rollupOptions: {
      // Force the emitted CSS artifact name to style.css
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) return 'style.css';
          return assetInfo.name ?? '[name][extname]';
        },
      },
    },
    sourcemap: false,
    emptyOutDir: false,
  },
});
