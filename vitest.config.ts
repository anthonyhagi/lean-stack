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

    // Specify the required environment variables here
    // so that we're able to run unit tests.
    env: {
      APP_ENV: 'test',
      APP_URL: 'http://localhost:5173',
      DATABASE_URL: ':memory:',
      SESSION_SECRET: 'some-secret-for-tests',
      MAIL_DRIVER: 'smtp',
      MAIL_HOST: '127.0.0.1',
      MAIL_PORT: '1025',
      MAIL_SECURE: 'false',
    },
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, 'app'),
    },
  },
  plugins: [react()],
});
