// #file i18n
import { describe, expect, it, vi } from 'vitest'
import i18n, { DEFAULT_LANGUAGE } from './config'

describe('i18n config', () => {
  it('keeps <html lang> in step with the language', async () => {
    await i18n.changeLanguage('{{OTHER_LANG}}')

    expect(document.documentElement.lang).toBe('{{OTHER_LANG}}')

    await i18n.changeLanguage(DEFAULT_LANGUAGE)

    expect(document.documentElement.lang).toBe('{{DEFAULT_LANG}}')
  })

  it('starts in the default language when none is resolved', async () => {
    vi.resetModules()
    vi.doMock('i18next', async (importOriginal) => {
      const actual = await importOriginal<typeof import('i18next')>()
      const instance = actual.default.createInstance()
      Object.defineProperty(instance, 'resolvedLanguage', {
        get: () => undefined,
        set: () => {},
      })
      return { ...actual, default: instance }
    })
    try {
      document.documentElement.lang = ''

      await import('./config')

      expect(document.documentElement.lang).toBe('{{DEFAULT_LANG}}')
    } finally {
      vi.doUnmock('i18next')
      vi.resetModules()
    }
  })
})
