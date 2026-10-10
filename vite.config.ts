import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // The animation library is by far the largest dependency and changes
        // far less often than app code, so it gets its own long-lived chunk.
        // Splitting it out keeps the app chunk small and lets the vendor code
        // stay cached across deploys.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('framer-motion')) return 'vendor-motion';
          if (id.includes('/react') || id.includes('scheduler')) return 'vendor-react';
          return undefined;
        },
      },
    },
  },
});
