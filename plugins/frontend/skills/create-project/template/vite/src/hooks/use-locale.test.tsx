// #file i18n
import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import i18n from '@/i18n/config'
import { useLocale } from './use-locale'

describe('useLocale', () => {
  it('reads the active language', () => {
    const { result } = renderHook(() => useLocale())

    expect(result.current.locale).toBe('{{DEFAULT_LANG}}')
  })

  it('switches the language', async () => {
    const { result } = renderHook(() => useLocale())

    await act(() => result.current.setLocale('{{OTHER_LANG}}'))

    expect(result.current.locale).toBe('{{OTHER_LANG}}')
    expect(i18n.resolvedLanguage).toBe('{{OTHER_LANG}}')
  })

  it('falls back to the default for a language it does not support', () => {
    const resolved = Object.getOwnPropertyDescriptor(i18n, 'resolvedLanguage')
    Object.defineProperty(i18n, 'resolvedLanguage', {
      value: 'xx',
      configurable: true,
      writable: true,
    })
    try {
      const { result } = renderHook(() => useLocale())

      expect(result.current.locale).toBe('{{DEFAULT_LANG}}')
    } finally {
      if (resolved) Object.defineProperty(i18n, 'resolvedLanguage', resolved)
    }
  })
})
