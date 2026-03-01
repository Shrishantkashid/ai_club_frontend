#!/usr/bin/env node

import { build } from 'vite';
import { resolve } from 'path';

async function buildApp() {
  try {
    await build({
      root: resolve(process.cwd()),
      build: {
        outDir: 'dist',
        assetsDir: 'assets',
        minify: 'terser',
        sourcemap: true,
        rollupOptions: {
          output: {
            manualChunks: {
              vendor: ['react', 'react-dom'],
            }
          }
        }
      }
    });
    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildApp();