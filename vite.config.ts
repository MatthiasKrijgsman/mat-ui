import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwind from "@tailwindcss/vite";

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// Externalize every dependency AND peer dependency (plus their subpath
// imports, e.g. "@lexical/react/LexicalComposer") so consumers resolve a
// single shared copy. Bundling them — lexical in particular — produces
// duplicate module instances and runtime failures like Lexical error #290
// when a consumer passes nodes built against their own copy.
//
// `dependencies` matters as much as `peerDependencies` here: a package moved
// out of the peer list to spare consumers an install must still be external,
// or the move silently starts bundling it.
const pkg = createRequire(import.meta.url)('./package.json');
const externalDeps = [
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
];
const isExternal = (id: string) => {
  if (externalDeps.some((dep) => id === dep || id.startsWith(`${ dep }/`))) return true;
  // Any other bare specifier is a package we would silently BUNDLE — exactly
  // the duplicate-instance failure described above. Fail the build instead;
  // this also means dev:watch must be restarted after editing dependencies.
  const isBare = !id.startsWith('.') && !id.startsWith('\0') && !id.startsWith('@/') && !path.isAbsolute(id);
  if (isBare) {
    throw new Error(
      `"${ id }" is imported but not declared in dependencies/peerDependencies — ` +
      'bundling it would create a duplicate module instance. Declare it (and restart dev:watch).',
    );
  }
  return false;
};

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
    // Ship readable output — consumers' bundlers minify and tree-shake on their
    // side, so minifying here only obscures stack traces and source reading.
    minify: false,
    sourcemap: true,
    emptyOutDir: true,
  },
});
