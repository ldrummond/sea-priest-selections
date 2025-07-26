/* eslint-disable */
import { defineConfig } from 'vite'
import { resolve } from 'path';
import handlebars from 'vite-plugin-handlebars';
import siteData from "./site-data";
import eslint from 'vite-plugin-eslint';

// https://github.com/vitejs/vite/issues/6596
const forwardToTrailingSlashPlugin = routes => ({
  name: 'forward-to-trailing-slash',
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      const requestURLwithoutLeadingSlash = req.url.substring(1)
      if (routes.includes(requestURLwithoutLeadingSlash)) {
        req.url = `${req.url}/`
      }
      next()
    })
  }
})

const build = {
  outDir: "dist",
  rollupOptions: {
    input: {
      index: resolve(__dirname, 'index.html'),
      contact: resolve(__dirname, 'contact', 'index.html'),
      producers: resolve(__dirname,  'producers', 'index.html'),
    },
  },
}

// https://vitejs.dev/config/
// eslint-
export default defineConfig({
  build,
  plugins: [
    eslint(),
    handlebars({
      partialDirectory: resolve(__dirname, 'src', 'partials'),
      context(pagePath) {
        return {
          site: siteData,
          page: siteData.routes.find(route => route.path === pagePath),
        }
      },
    }),
    forwardToTrailingSlashPlugin(Object.keys(build.rollupOptions.input))
  ],
})