import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
// #if i18n
import { type Locale, NextIntlClientProvider } from 'next-intl'
// #endif
import type { ReactNode } from 'react'
import { vi } from 'vitest'
// #if i18n
import defaultMessages from '@/i18n/locales/{{DEFAULT_LANG}}.json'
// #endif

// A fresh cache per test, with retries off so a failing request fails at once.
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
}

// #if i18n
export function renderWithProviders(
  ui: ReactNode,
  {
    path = '/',
    locale = '{{DEFAULT_LANG}}',
    messages = defaultMessages,
  }: { path?: string; locale?: Locale; messages?: typeof defaultMessages } = {},
) {
  window.history.replaceState({}, '', path)
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <QueryClientProvider client={createTestQueryClient()}>
        {ui}
      </QueryClientProvider>
    </NextIntlClientProvider>,
  )
}
// #else
export function renderWithProviders(ui: ReactNode, { path = '/' } = {}) {
  window.history.replaceState({}, '', path)
  return render(
    <QueryClientProvider client={createTestQueryClient()}>
      {ui}
    </QueryClientProvider>,
  )
}
// #endif

export function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

export function mockFetch(
  handler: (url: URL, init?: RequestInit) => Response | Promise<Response>,
) {
  const calls: URL[] = []
  const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = new URL(typeof input === 'string' ? input : input.toString())
    calls.push(url)
    return handler(url, init)
  })
  vi.stubGlobal('fetch', fetchMock)
  return { calls, fetchMock }
}
