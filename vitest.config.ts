import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        setupFiles: ['./src/utils/test-setup.ts'],
        globals: true,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/',
                'src/utils/test-utils.ts',
                '**/*.d.ts',
                '**/*.config.*',
                '**/mockData',
                '.astro/',
                'dist/',
            ],
        },
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
        },
    },
});
