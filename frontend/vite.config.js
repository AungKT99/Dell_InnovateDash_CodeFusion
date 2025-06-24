import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    server: {
      port: env.VITE_PORT || 4173,
      // Remove proxy completely - we're using direct API calls now
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets'
    }
  };
});