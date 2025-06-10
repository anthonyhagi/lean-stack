import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  optimizeDeps: {
    // For an explanation as to why this was added, refer to:
    // https://github.com/smithy-lang/smithy-typescript/issues/1437#issuecomment-2508474767
    exclude: ['@smithy/shared-ini-file-loader'],
  },
  plugins: [reactRouter(), tsconfigPaths()],
});
