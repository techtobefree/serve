import generouted from '@generouted/react-router/plugin'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), generouted(), VitePWA({
    registerType: 'autoUpdate',
    strategies: 'generateSW',
    workbox: {
      skipWaiting: true,
      clientsClaim: true,
    },
    manifest: {
      name: 'Serve2free',
      short_name: 'Serve2free',
      description: 'Celebrating service',
      theme_color: '#3f6788',
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ],
      start_url: '/',
      display: 'standalone',
      background_color: '#001B48'
    }
  })],
})
