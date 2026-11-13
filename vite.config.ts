import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    watch: { ignored: ['**/assignment3.zip', '**/assignment3-history.bundle'] },
  },
})
