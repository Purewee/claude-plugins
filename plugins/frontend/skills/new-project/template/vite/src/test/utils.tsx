import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { vi } from 'vitest'
import { RouterProvider } from '@/lib/router/provider'

// A fresh cache per test, with retries off so a failing request fails at once.
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
}

export function renderWithProviders(ui: ReactNode, { path = '/' } = {}) {
  window.history.replaceState({}, '', path)
  return render(
    <QueryClientProvider client={createTestQueryClient()}>
      <RouterProvider>{ui}</RouterProvider>
    </QueryClientProvider>,
  )
}

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

export function clickLeftToBrowser(el: Element, init?: MouseEventInit) {
  let leftToBrowser = true
  const onClick = (event: Event) => {
    leftToBrowser = !event.defaultPrevented
    event.preventDefault()
  }
  window.addEventListener('click', onClick)
  fireEvent.click(el, init)
  window.removeEventListener('click', onClick)
  return leftToBrowser
}
