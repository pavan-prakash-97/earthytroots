import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Test-only build: an IIFE bundle jsdom can execute (it cannot run ES modules).
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist-smoke',
    emptyOutDir: true,
    rollupOptions: {
      output: { format: 'iife', inlineDynamicImports: true, entryFileNames: 'app.js' },
    },
  },
})
