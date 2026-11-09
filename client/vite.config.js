import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    // In development, requests to /api are forwarded to the local server,
    // so the client can always use relative URLs and no CORS setup is needed.
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
})
