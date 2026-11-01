import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { serverlessDevPlugin } from './lib/serverlessDevPlugin.js';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), serverlessDevPlugin()],
  server: {
    port: 5173,
  },
});
