import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâ€”file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // Three.js core — large library, benefits from its own cached chunk
            'three': ['three'],
            // React Three Fiber + Drei — 3D scene helpers
            'r3f': ['@react-three/fiber', '@react-three/drei'],
            // Framer Motion / Motion
            'motion': ['motion'],
            // Note: react & react-dom are NOT split here — React 19 is handled
            // internally by @vitejs/plugin-react and splitting it creates an
            // empty chunk that wastes a network round-trip.
          },
        },
      },
    },
  };
});
