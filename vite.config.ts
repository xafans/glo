import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [react()],
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'ReactGlobalStateHook',
            fileName: 'use-global-state',
            formats: ['es', 'cjs']
        },
        rollupOptions: {
            external: ['react']
        }
    }
});
