// #file i18n
import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { WelcomeSection } from '@/components/home/welcome-section'
import { readLocale } from '@/i18n/locale'

export async function generateMetadata({
  params,
}: PageProps<'/[locale]'>): Promise<Metadata> {
  const t = await getTranslations({ locale: await readLocale(params) })
  return { title: t('home.title') }
}

export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  setRequestLocale(await readLocale(params))

  return <WelcomeSection />
}
