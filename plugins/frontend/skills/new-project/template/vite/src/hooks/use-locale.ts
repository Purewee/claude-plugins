// #file i18n
import { useTranslation } from 'react-i18next'
import {
  DEFAULT_LANGUAGE,
  type SupportedLanguage,
  supportedLanguages,
} from '@/i18n/config'

export function useLocale() {
  const { i18n } = useTranslation()
  const resolved = i18n.resolvedLanguage as SupportedLanguage
  const locale = supportedLanguages.includes(resolved)
    ? resolved
    : DEFAULT_LANGUAGE

  return {
    locale,
    setLocale: (next: SupportedLanguage) => i18n.changeLanguage(next),
  }
}
