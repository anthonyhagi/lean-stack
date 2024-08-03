/// <reference types="vitest" />

import { resolve } from 'path';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    includeSource: ['app/**/*.{ts,tsx}'],
    exclude: ['node_modules', 'e2e'],
    env: {},
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, 'app'),
    },
  },
  plugins: [react()],
});
