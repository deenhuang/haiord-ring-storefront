import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  base: './',
  publicDir: false,
  plugins: [react()],
  build: {
    outDir: path.resolve('../theme/assets'),
    emptyOutDir: false,
    rollupOptions: {
      input: path.resolve('src/main.jsx'),
      output: {
        entryFileNames: 'noor-app.js',
        assetFileNames: 'noor-app.css',
      },
    },
  },
});
