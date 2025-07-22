/* eslint-disable */
import { defineConfig } from 'vite'
import { resolve } from 'path';
import handlebars from 'vite-plugin-handlebars';
import data from "./src/data";
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
// eslint-
export default defineConfig({
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        contact: resolve(__dirname,'src', 'pages', 'contact.html'),
        producers: resolve(__dirname, 'src', 'pages', 'producers.html'),
      },
    },
  },
  plugins: [
    eslint(),
    handlebars({
      context: data,
      partialDirectory: resolve(__dirname, 'src', 'partials'),
    }),
  ],
})