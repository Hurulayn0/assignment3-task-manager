import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  build: { modulePreload: false, cssCodeSplit: false, assetsInlineLimit: 1000000 },
  server: {
    watch: { ignored: ['**/assignment3.zip', '**/assignment3-history.bundle', '**/Offline-TaskManager.html', '**/*verification.json', '**/test-results.txt'] },
  },
})
