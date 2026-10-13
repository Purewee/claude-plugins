// #file i18n
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocale } from '@/hooks/use-locale'
import { supportedLanguages } from '@/i18n/config'
import { cn } from '@/lib/utils'

export function LanguageSwitcher({ className }: { className?: string }) {
  const { t } = useTranslation()
  const { locale, setLocale } = useLocale()

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      {supportedLanguages.map((code, index) => (
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
            onClick={() => void setLocale(code)}
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
