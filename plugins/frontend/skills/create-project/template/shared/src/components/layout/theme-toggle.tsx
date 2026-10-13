// #file theme
// #if next
'use client'

// #endif
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useSyncExternalStore } from 'react'
// #if vite && i18n
import { useTranslation } from 'react-i18next'
// #elif next && i18n
import { useTranslations } from 'next-intl'
// #endif

const subscribeToNothing = () => () => {}

export function ThemeToggle() {
// #if vite && i18n
  const { t } = useTranslation()
// #elif next && i18n
  const t = useTranslations()
// #endif
  const { resolvedTheme, setTheme } = useTheme()
  const hydrated = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  )
  const isDark = hydrated && resolvedTheme === 'dark'

  return (
    <button
      type="button"
      aria-label={{TA:theme.dark}}
      aria-pressed={isDark}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="inline-flex size-9 items-center justify-center rounded-brand-lg text-brand-on-surface-variant transition-colors hover:bg-brand-surface-container hover:text-brand-on-surface dark:text-brand-on-surface-variant-dark dark:hover:bg-brand-surface-container-dark dark:hover:text-brand-on-surface-dark"
    >
      {isDark ? (
        <Sun aria-hidden="true" className="size-5" />
      ) : (
        <Moon aria-hidden="true" className="size-5" />
      )}
    </button>
  )
}
