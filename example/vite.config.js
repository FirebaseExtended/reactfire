import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Visualize the bundle in `stats.html`.
    // Helps make sure we aren't pulling in extra deps
    visualizer({ template: 'treemap' }),
  ],
});
