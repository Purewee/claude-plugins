import { cleanup } from '@testing-library/react'
// #if i18n
import { afterEach, beforeEach, vi } from 'vitest'
import i18n, { DEFAULT_LANGUAGE } from '@/i18n/config'
// #else
import { afterEach, vi } from 'vitest'
// #endif

window.scrollTo = () => {}
Element.prototype.scrollIntoView = () => {}
window.matchMedia ??= (query: string) =>
  ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }) as MediaQueryList

class NoopObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}
globalThis.ResizeObserver ??= NoopObserver as unknown as typeof ResizeObserver

// #if i18n
beforeEach(async () => {
  await i18n.changeLanguage(DEFAULT_LANGUAGE)
})

// #endif
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
  vi.useRealTimers()
  localStorage.clear()
// #if theme
  document.documentElement.className = ''
// #endif
  window.history.replaceState({}, '', '/')
})
