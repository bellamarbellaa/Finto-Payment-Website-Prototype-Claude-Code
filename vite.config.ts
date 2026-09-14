import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Screens ported from finto-web import types/errors from the real
      // shared package; this project has no backend, so the same names
      // resolve to the local mock client's types instead.
      '@finto/api-client': fileURLToPath(new URL('./src/lib/mock/types.ts', import.meta.url))
    }
  },
  server: { port: 5174, strictPort: false },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts']
  }
});
