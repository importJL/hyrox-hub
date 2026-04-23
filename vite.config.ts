import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.OPENROUTER_KEY': JSON.stringify(env.OPENROUTER_KEY),
      'process.env.OPENROUTER_MODEL': JSON.stringify(env.OPENROUTER_MODEL),
      'import.meta.env.OPENROUTER_KEY': JSON.stringify(env.OPENROUTER_KEY),
      'import.meta.env.OPENROUTER_MODEL': JSON.stringify(env.OPENROUTER_MODEL),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
