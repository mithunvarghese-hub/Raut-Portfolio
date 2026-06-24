import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/Raut-Portfolio/',
  server: {
    port: 8080,
    open: true
  }
});

