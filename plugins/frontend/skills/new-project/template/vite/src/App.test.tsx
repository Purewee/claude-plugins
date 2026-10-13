import { QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SITE_NAME } from '@/lib/site'
import { createTestQueryClient, jsonResponse, mockFetch } from '@/test/utils'
import App from './App'

function renderApp(path: string) {
  window.history.replaceState({}, '', path)
  return render(
    <QueryClientProvider client={createTestQueryClient()}>
      <App />
    </QueryClientProvider>,
  )
}

beforeEach(() => {
  mockFetch(() => jsonResponse({ error: 'not found' }, 404))
})

describe('App', () => {
  it('shows the 404 page with its own tab title for an unknown address', () => {
    renderApp('/missing')

    expect(
      screen.getByRole('heading', { level: 1, name: {{tq:errors.notFound.title}} }),
    ).toBeTruthy()
    expect(document.title).toBe(`{{t:errors.notFound.title}} | ${SITE_NAME}`)
  })

  it('renders the home page titled from the registry', () => {
    renderApp('/')

    expect(
      screen.getByRole('heading', { level: 1, name: {{tq:home.title}} }),
    ).toBeTruthy()
    expect(document.title).toBe(`{{t:home.title}} | ${SITE_NAME}`)
  })

  it('scrolls a #hash target into view', () => {
    const target = document.createElement('div')
    target.id = 'contact'
    document.body.append(target)
    const scroll = vi.spyOn(Element.prototype, 'scrollIntoView')

    try {
      renderApp('/#contact')

      expect(scroll).toHaveBeenCalledOnce()
    } finally {
      target.remove()
    }
  })
})
