// #file i18n
'use client'

import { useLocale, useTranslations } from 'next-intl'
import { Fragment } from 'react'
import { usePathname, useRouter } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { cn } from '@/lib/utils'

export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations()
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      {routing.locales.map((code, index) => (
        <Fragment key={code}>
          {index > 0 ? (
            <span aria-hidden="true" className="text-brand-outline{{?theme: dark:text-brand-outline-dark}}">
              |
            </span>
          ) : null}
          <button
            type="button"
            lang={code}
            aria-label={t(`language.${code}`)}
            aria-pressed={code === locale}
            onClick={() => router.replace(pathname, { locale: code })}
            className={cn(
              'text-xs uppercase transition-colors hover:underline',
              code === locale
                ? 'font-bold text-brand-on-surface{{?theme: dark:text-brand-on-surface-dark}}'
                : 'font-normal text-brand-on-surface-variant hover:text-brand-on-surface{{?theme: dark:text-brand-on-surface-variant-dark dark:hover:text-brand-on-surface-dark}}',
            )}
          >
            {code}
          </button>
        </Fragment>
      ))}
    </div>
  )
}
