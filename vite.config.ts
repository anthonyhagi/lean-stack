import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

declare module '@remix-run/node' {
  // or cloudflare, deno, etc.
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig({
  optimizeDeps: {
    // For an explanation as to why this was added, refer to:
    // https://github.com/smithy-lang/smithy-typescript/issues/1437#issuecomment-2508474767
    exclude: ['@smithy/shared-ini-file-loader'],
  },
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        unstable_optimizeDeps: true,
        v3_lazyRouteDiscovery: true,
        v3_routeConfig: true,
        v3_singleFetch: true,
      },
    }),
    tsconfigPaths(),
  ],
});
