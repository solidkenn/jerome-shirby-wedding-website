import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = (env.VITE_SITE_URL || '').replace(/\/$/, '')

  return {
    plugins: [
      react(),
      {
        name: 'site-url',
        transformIndexHtml(html) {
          return html.replaceAll('%SITE_URL%', siteUrl)
        },
      },
    ],
    server: {
      proxy: {
        '/api/upload': {
          target: env.VITE_UPLOAD_PROXY_TARGET || 'https://uploadtesting.vercel.app',
          changeOrigin: true,
        },
      },
    },
  }
})
