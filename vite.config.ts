import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 4000,
        host: 'localhost',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        // Optimizaciones para producción
        minify: 'esbuild',
        // Code splitting optimizado
        rollupOptions: {
          output: {
            // Chunk vendor separado para mejor caching
            manualChunks: {
              'vendor-react': ['react', 'react-dom', 'react-router-dom'],
              'vendor-gsap': ['gsap', '@gsap/react'],
              'vendor-supabase': ['@supabase/supabase-js'],
            },
            // Nombres de chunks con hash para cache busting
            chunkFileNames: 'assets/[name]-[hash].js',
            entryFileNames: 'assets/[name]-[hash].js',
            assetFileNames: 'assets/[name]-[hash].[ext]',
          },
        },
        //生成 sourcemap para debugging
        sourcemap: false,
        // Chunk size warning limit
        chunkSizeWarningLimit: 500,
      },
    };
});
