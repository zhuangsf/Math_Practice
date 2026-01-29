import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3000,
    open: true,
    // modify by jx: enable LAN access by binding to all network interfaces
    host: '0.0.0.0'
  },
  // modify by jx: Set base path for production build to work with Electron and static file access
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // modify by jx: Disable rollup module preload to fix file:// protocol issues
    modulePreload: {
      polyfill: false
    }
  }
})
