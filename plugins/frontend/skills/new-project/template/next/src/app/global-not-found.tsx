// #file i18n
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getTranslations } from 'next-intl/server'
import { fontSans } from '@/app/fonts'
import { Providers } from '@/app/providers'
import { AppLayout } from '@/components/layout/app-layout'
import { NotFoundPage } from '@/components/shared/not-found-page'
import { SITE_NAME } from '@/lib/site'
import '@/app/globals.css'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations()
  return {
    title: { absolute: `${t('errors.notFound.title')} | ${SITE_NAME}` },
  }
}

// Every unknown address ends here, rendered on the server outside all layouts; the proxy's locale header picks the language.
export default async function GlobalNotFound() {
  const locale = await getLocale()

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
            <AppLayout>
              <NotFoundPage />
            </AppLayout>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
