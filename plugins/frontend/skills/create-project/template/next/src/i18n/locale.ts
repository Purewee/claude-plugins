// #file i18n
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { routing } from '@/i18n/routing'

export async function readLocale(params: Promise<{ locale: string }>) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  return locale
}
