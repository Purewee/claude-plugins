import type { Metadata } from 'next'
import type { ReactNode } from 'react'
// #if plain
import { fontSans } from '@/app/fonts'
import { Providers } from '@/app/providers'
import { AppLayout } from '@/components/layout/app-layout'
// #endif
import { SITE_NAME } from '@/lib/site'
// #if plain
import '@/app/globals.css'
// #endif

export const metadata: Metadata = {
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: '{{SITE_DESCRIPTION}}',
}

// #if i18n
// [locale]/layout.tsx renders <html> in the visitor's language; this root passes through.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children
}
// #else
// #if theme
// next-themes sets the theme class before hydration, so <html> differs from the server render.
// #endif
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="{{DEFAULT_LANG}}"
      className={fontSans.variable}
// #if theme
      suppressHydrationWarning
// #endif
    >
      <body>
        <Providers>
          <AppLayout>{children}</AppLayout>
        </Providers>
      </body>
    </html>
  )
}
// #endif
