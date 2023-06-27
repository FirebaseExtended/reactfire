/// <reference types="vitest" />
/// <reference types="vite/client" />

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { resolve } from 'path';
import { version } from './package.json';
import { visualizer } from 'rollup-plugin-visualizer';
import typescript from '@rollup/plugin-typescript';

console.log(`ReactFire v${version}`);

const externals = [
  'react',
  'firebase',
  'firebase/app',
  'firebase/firestore',
  'firebase/firestore/lite',
  'firebase/auth',
  'firebase/functions',
  'firebase/storage',
  'firebase/database',
  'firebase/remote-config',
  'firebase/performance',
  '@firebase/app',
  '@firebase/firestore',
  '@firebase/firestore/lite',
  '@firebase/auth',
  '@firebase/functions',
  '@firebase/storage',
  '@firebase/database',
  '@firebase/remote-config',
  '@firebase/performance',
];

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    typescript(),

    // Visualize the bundle in `stats.html`.
    // Helps make sure we aren't pulling in extra deps
    visualizer({ template: 'treemap' }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './test/setupTests.ts',
  },
  define: {
    // replace `process.env.REACTFIRE_VERSION` in the source
    // for usage stats
    'process.env.REACTFIRE_VERSION': JSON.stringify(version),
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ReactFire',
      fileName: 'index',
    },
    rollupOptions: {
      external: externals,
      output: {
        globals: { react: 'React' },
      },
    },
    sourcemap: true,
  },
});
