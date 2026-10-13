import type { NextConfig } from 'next'
// #if i18n
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()
// #endif

const nextConfig: NextConfig = {
  output: 'standalone',
  poweredByHeader: false,
// #if i18n
  experimental: {
    globalNotFound: true,
  },
// #endif
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },
}

// #if i18n
export default withNextIntl(nextConfig)
// #else
export default nextConfig
// #endif
