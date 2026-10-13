import { QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
// #if i18n
import i18n from '@/i18n/config'
// #endif
import { SITE_NAME } from '@/lib/site'
import { createTestQueryClient, jsonResponse, mockFetch } from '@/test/utils'
import App from './App'
import { findPage, PAGES } from './pages'

function fakeApi(url: URL) {
  void url
  return jsonResponse({ error: 'not found' }, 404)
}

function renderAt(path: string) {
  window.history.replaceState({}, '', path)
  return render(
    <QueryClientProvider client={createTestQueryClient()}>
      <App />
    </QueryClientProvider>,
  )
}

const FIXED_PAGES = PAGES.flatMap((page) =>
// #if i18n
  page.titleKey && !page.path.includes(':')
    ? [{ path: page.path, title: i18n.t(page.titleKey) }]
    : [],
// #else
  page.title && !page.path.includes(':')
    ? [{ path: page.path, title: page.title }]
    : [],
// #endif
)

beforeEach(() => {
  mockFetch(fakeApi)
  vi.spyOn(console, 'error').mockImplementation((...args) => {
    throw new Error(`console.error: ${args.map(String).join(' ')}`)
  })
})

describe.each(FIXED_PAGES)('page $path', ({ path, title }) => {
  it('renders without the 404 or server error page, with its tab title', async () => {
    renderAt(path)

    await waitFor(() => expect(document.title).toBe(`${title} | ${SITE_NAME}`))
    expect(
      screen.queryByRole('heading', { name: {{tq:errors.notFound.title}} }),
    ).toBeNull()
    expect(
      screen.queryByRole('heading', { name: {{tq:errors.server.title}} }),
    ).toBeNull()
  })

  it('links only to pages that exist', async () => {
    const { container } = renderAt(path)
    await waitFor(() => expect(document.title).toBe(`${title} | ${SITE_NAME}`))
    await new Promise((resolve) => setTimeout(resolve, 0))

    const broken = Array.from(container.querySelectorAll('a[href^="/"]'))
      .map((link) => link.getAttribute('href') ?? '')
      .filter((href) => findPage(href) === null)

    expect(broken).toEqual([])
  })
})
