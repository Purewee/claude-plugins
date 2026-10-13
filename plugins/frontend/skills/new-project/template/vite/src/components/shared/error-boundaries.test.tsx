import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AppLayout } from '@/components/layout/app-layout'
// #if i18n
import i18n from '@/i18n/config'
// #endif
import { leaveTo, reloadPage } from '@/lib/navigation'
import { renderWithProviders } from '@/test/utils'
import { PageErrorBoundary } from './page-error-boundary'
import { RootErrorBoundary } from './root-error-boundary'

vi.mock('@/lib/navigation', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/navigation')>()),
  reloadPage: vi.fn(),
  leaveTo: vi.fn(),
}))

function Broken(): never {
  throw new Error('boom')
}

describe('PageErrorBoundary', () => {
  it('shows the server error page inside the layout', () => {
    const logged = vi.spyOn(console, 'error').mockImplementation(() => {})
    renderWithProviders(
      <AppLayout>
        <PageErrorBoundary>
          <Broken />
        </PageErrorBoundary>
      </AppLayout>,
    )

    expect(screen.getByRole('heading', { name: {{tq:errors.server.title}} })).toBeTruthy()
    expect(screen.getByRole('banner')).toBeTruthy()
    expect(screen.getByRole('contentinfo')).toBeTruthy()
    expect(logged).toHaveBeenCalledWith(
      'Page failed to render',
      expect.any(Error),
    )
  })

  it('renders its children when nothing throws', () => {
    renderWithProviders(
      <PageErrorBoundary>
        <p>Content</p>
      </PageErrorBoundary>,
    )

    expect(screen.getByText('Content')).toBeTruthy()
  })
})

describe('RootErrorBoundary', () => {
  it('renders its children when nothing throws', () => {
    render(
      <RootErrorBoundary>
        <p>Content</p>
      </RootErrorBoundary>,
    )

    expect(screen.getByText('Content')).toBeTruthy()
  })

  it('shows the server error page without any providers', () => {
    const logged = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(
      <RootErrorBoundary>
        <Broken />
      </RootErrorBoundary>,
    )

    expect(screen.getByRole('heading', { name: {{tq:errors.server.title}} })).toBeTruthy()
    expect(logged).toHaveBeenCalledWith(
      'App failed to render',
      expect.any(Error),
    )
  })

  it('steps back in history on Back', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(window.history, 'length', 'get').mockReturnValue(2)
    const back = vi.spyOn(window.history, 'back').mockImplementation(() => {})
    render(
      <RootErrorBoundary>
        <Broken />
      </RootErrorBoundary>,
    )

    fireEvent.click(screen.getByRole('button', { name: {{tq:errors.actions.back}} }))

    expect(back).toHaveBeenCalledOnce()
  })

  it('goes home on Back when there is no history', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(window.history, 'length', 'get').mockReturnValue(1)
    render(
      <RootErrorBoundary>
        <Broken />
      </RootErrorBoundary>,
    )

    fireEvent.click(screen.getByRole('button', { name: {{tq:errors.actions.back}} }))

    expect(leaveTo).toHaveBeenCalledWith('/')
  })

  it('reloads the page on Refresh', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    render(
      <RootErrorBoundary>
        <Broken />
      </RootErrorBoundary>,
    )

    fireEvent.click(screen.getByRole('button', { name: {{tq:errors.actions.refresh}} }))

    expect(reloadPage).toHaveBeenCalledOnce()
  })
// #if i18n

  it('falls back to its own texts when i18n never initialized', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const initialized = i18n.isInitialized
    i18n.isInitialized = false
    try {
      render(
        <RootErrorBoundary>
          <Broken />
        </RootErrorBoundary>,
      )

      expect(
        screen.getByRole('heading', { name: {{tq:errors.server.title}} }),
      ).toBeTruthy()
    } finally {
      i18n.isInitialized = initialized
    }
  })
// #endif
})
