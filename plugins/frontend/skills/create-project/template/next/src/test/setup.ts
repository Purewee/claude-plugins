import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

vi.mock('next/navigation', async (importOriginal) => {
  const { nextRouter } = await import('@/test/next-router')
  return {
    ...(await importOriginal<typeof import('next/navigation')>()),
    useRouter: () => nextRouter,
    usePathname: () => window.location.pathname,
    useSearchParams: () => new URLSearchParams(window.location.search),
    useParams: () => ({}),
    notFound: vi.fn(() => {
      throw new Error('NEXT_NOT_FOUND')
    }),
  }
})

vi.mock('next/font/google', () => ({
  Inter: () => ({ className: 'font-inter', variable: 'font-inter-variable' }),
}))
// #if i18n

vi.mock('next-intl/server', async () => {
  const { createTranslator } = await import('next-intl')
  const messages = {
    {{LOCALE_MESSAGES}}
  }
  return {
    getRequestConfig: (config: unknown) => config,
    setRequestLocale: () => {},
    getLocale: async () => '{{DEFAULT_LANG}}',
    getTranslations: async ({
      locale = '{{DEFAULT_LANG}}',
    }: { locale?: keyof typeof messages } = {}) =>
      createTranslator({ locale, messages: messages[locale] }),
  }
})
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
