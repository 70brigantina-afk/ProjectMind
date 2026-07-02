import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages: https://<username>.github.io/ProjectMind/
export default defineConfig({
  base: '/ProjectMind/',
  plugins: [react()],
});
