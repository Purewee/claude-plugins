// #file i18n
import type messages from './locales/{{REF_LANG}}.json'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    resources: {
      translation: typeof messages
    }
  }
}
