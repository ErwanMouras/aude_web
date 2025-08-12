// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://aude-mouradian.netlify.app',
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          format: 'esm'
        }
      }
    }
  }
});