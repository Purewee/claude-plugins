// #if i18n
import { useTranslations } from 'next-intl'
// #endif
import { currentYear } from '@/lib/date'
import { SITE_NAME } from '@/lib/site'

export function SiteFooter() {
// #if i18n
  const t = useTranslations()

// #endif
  return (
    <footer className="w-full bg-brand-inverse-surface py-8 text-brand-inverse-on-surface{{?theme: dark:bg-brand-inverse-surface-dark dark:text-brand-inverse-on-surface-dark}}">
      <p className="mx-auto w-full max-w-7xl px-4 text-brand-body-sm md:px-14">
// #if i18n
        {t('footer.copyright', {
          year: currentYear(),
          site: SITE_NAME,
        })}
// #else
        {`© ${currentYear()} ${SITE_NAME}`}
// #endif
      </p>
    </footer>
  )
}
