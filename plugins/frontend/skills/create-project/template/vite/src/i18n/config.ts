// #file i18n
import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
{{LOCALE_IMPORTS}}

export const supportedLanguages = [{{LANGS_LIST}}] as const

export type SupportedLanguage = (typeof supportedLanguages)[number]

export const DEFAULT_LANGUAGE: SupportedLanguage = supportedLanguages[0]

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      {{LOCALE_RESOURCES}}
    },
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: supportedLanguages,
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage'],
      caches: ['localStorage'],
    },
  })

const syncDocumentLanguage = (lng: string) => {
  document.documentElement.lang = lng
}

syncDocumentLanguage(i18n.resolvedLanguage ?? DEFAULT_LANGUAGE)
i18n.on('languageChanged', syncDocumentLanguage)

export default i18n
