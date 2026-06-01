import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwind from "@tailwindcss/vite";

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// Externalize every peer dependency (and its subpath imports, e.g.
// "@lexical/react/LexicalComposer") so consumers resolve a single shared copy.
// Bundling them — lexical in particular — produces duplicate module instances
// and runtime failures like Lexical error #290 when a consumer passes nodes
// built against their own copy.
const pkg = createRequire(import.meta.url)('./package.json');
const peerDeps = Object.keys(pkg.peerDependencies ?? {});
const isExternal = (id: string) =>
  peerDeps.some((dep) => id === dep || id.startsWith(`${ dep }/`));

export default defineConfig({
  plugins: [react(), tailwind()],
  resolve: {
    alias: {
      '@': path.resolve(dirname, 'src'),
    },
  },

  // Library build — ESM only (consumed through bundlers; not as a <script> global)
  build: {
    lib: {
      entry: path.resolve(dirname, 'src/index.tsx'),
      formats: ['es'],
      fileName: () => 'index.js',
    },
    rollupOptions: {
      external: isExternal,
      output: {
        banner: '"use client";',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'style.css';
          }
          return '[name][extname]';
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
});
