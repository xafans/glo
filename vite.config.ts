import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [react()],
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'ReactGlobalStateHook',
            fileName: 'glo',
            formats: ['es', 'cjs']
        },
        rollupOptions: {
            external: ['react']
        }
    }
});
