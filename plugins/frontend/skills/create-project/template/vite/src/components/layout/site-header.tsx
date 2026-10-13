// #if i18n
import { LanguageSwitcher } from '@/components/layout/language-switcher'
// #endif
// #if theme
import { ThemeToggle } from '@/components/layout/theme-toggle'
// #endif
import { AppLink } from '@/components/shared/app-link'
import { SITE_NAME } from '@/lib/site'

export function SiteHeader() {
  return (
    <header className="w-full border-brand-outline-variant border-b bg-brand-surface{{?theme: dark:border-brand-outline-variant-dark dark:bg-brand-surface-dark}}">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-14">
        <AppLink
          href="/"
          className="font-bold text-brand-headline-sm text-brand-on-surface{{?theme: dark:text-brand-on-surface-dark}}"
        >
          {SITE_NAME}
        </AppLink>
// #if i18n && theme
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
// #elif i18n
        <LanguageSwitcher />
// #elif theme
        <ThemeToggle />
// #endif
      </div>
    </header>
  )
}
