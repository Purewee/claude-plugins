// #file i18n
import { NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { fontSans } from '@/app/fonts'
import { Providers } from '@/app/providers'
import { AppLayout } from '@/components/layout/app-layout'
import { readLocale } from '@/i18n/locale'
import { routing } from '@/i18n/routing'
import '@/app/globals.css'

// Only the configured locales exist, so any other first segment is unmatched and gets the global 404 page.
export const dynamicParams = false

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

// #if theme
// next-themes sets the theme class before hydration, so <html> differs from the server render.
// #endif
export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<'/[locale]'>) {
  const locale = await readLocale(params)
  setRequestLocale(locale)

  return (
    <html
      lang={locale}
      className={fontSans.variable}
// #if theme
      suppressHydrationWarning
// #endif
    >
      <body>
        <NextIntlClientProvider>
          <Providers>
            <AppLayout>{children}</AppLayout>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
