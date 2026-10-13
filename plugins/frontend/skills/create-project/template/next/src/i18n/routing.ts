// #file i18n
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: [{{LANGS_LIST}}],
  defaultLocale: '{{DEFAULT_LANG}}',
  localePrefix: 'as-needed',
})
