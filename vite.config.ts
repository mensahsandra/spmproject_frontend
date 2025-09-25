import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import Icons from 'unplugin-icons/vite';

export default defineConfig({
  // Explicitly set root to current directory to avoid unintended parent traversal
  root: '.',
  plugins: [
    react(),
    Icons({
      compiler: 'jsx',
      jsx: 'react',
      autoInstall: true,
    }),
  ],
  server: {
    host: 'localhost',
    port: 5182,
    strictPort: true,
  },
});
