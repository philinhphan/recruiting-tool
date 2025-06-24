import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy API requests starting with /api to the backend server
      // This matches the API_BASE_URL = '/api/v1' in apiClient.ts,
      // so requests like /api/v1/users will be proxied.
      '/api': {
        target: 'http://localhost:8000', // Your backend server address
        changeOrigin: true, // Recommended for virtual hosted sites
        // secure: false, // Uncomment if your backend is not HTTPS and you face issues
        // rewrite: (path) => path.replace(/^\/api/, ''), // Use if backend doesn't expect /api prefix
      },
    },
  },
})
