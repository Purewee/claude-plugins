import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.ts'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      pool: 'vmThreads',
      include: ['src/**/*.test.{ts,tsx}'],
      setupFiles: ['./src/test/setup.ts'],
      env: {
        VITE_API_URL: 'https://api.test/api',
      },
      css: false,
      coverage: {
        provider: 'v8',
        include: ['src/**/*.{ts,tsx}'],
        exclude: [
          'src/**/*.test.{ts,tsx}',
          'src/**/*.d.ts',
          'src/test/**',
          'src/components/ui/**',
        ],
        thresholds: {
          perFile: true,
          lines: 80,
          statements: 80,
          functions: 80,
          branches: 80,
        },
        reporter: [
          ['text', { skipFull: true, maxCols: 140 }],
          'text-summary',
          'html',
        ],
      },
    },
  }),
)
