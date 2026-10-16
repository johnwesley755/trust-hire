import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// Resolve Windows Junction / symlink mismatch for Vite dev server dependency optimization
try {
  const realCwd = fs.realpathSync.native(process.cwd());
  if (realCwd && realCwd.toLowerCase() !== process.cwd().toLowerCase()) {
    process.chdir(realCwd);
  }
} catch {
  // fallback
}

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [react(), tailwindcss(), VitePWA({
    registerType: 'prompt',
    includeAssets: ['logo.png', 'vite.svg'],
    workbox: {
      cleanupOutdatedCaches: true,
      clientsClaim: true,
      skipWaiting: false,
      maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      navigateFallback: '/index.html',
      navigateFallbackDenylist: [/^\/api/],
    },
    manifest: {
      name: 'TrustHyre | Trusted Talent. Better Hiring.',
      short_name: 'TrustHyre',
      description: 'India’s #1 Verified Workforce & Employer Network',
      theme_color: '#0f2f63',
      background_color: '#ffffff',
      display: 'standalone',
      icons: [
        {
          src: 'logo.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'logo.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        }
      ]
    }
  })],
  define: {
    global: 'window',
    __APP_BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-pdf': ['@react-pdf/renderer', 'jspdf', 'html2canvas'],
          'vendor-maps': ['leaflet', 'react-leaflet'],
          'vendor-motion': ['framer-motion', 'gsap'],
          'vendor-firebase': ['firebase/app', 'firebase/auth'],
          'vendor-icons': ['lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
