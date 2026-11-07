import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  // Base path './' ensures all assets load properly under any GitHub Pages subpath (e.g. https://<username>.github.io/<repo>/)
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
  server: {
    port: 3000,
    open: true,
  },
});
