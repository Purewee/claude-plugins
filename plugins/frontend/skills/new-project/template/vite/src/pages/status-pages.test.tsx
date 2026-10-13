import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { reloadPage } from '@/lib/navigation'
import { renderWithProviders } from '@/test/utils'
import { NotFoundPage } from './not-found-page'
import { ServerErrorPage } from './server-error-page'

vi.mock('@/lib/navigation', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/navigation')>()),
  reloadPage: vi.fn(),
}))

describe('NotFoundPage', () => {
  it('goes home on Back when there is no history', () => {
    vi.spyOn(window.history, 'length', 'get').mockReturnValue(1)
    renderWithProviders(<NotFoundPage />, { path: '/missing' })

    fireEvent.click(screen.getByRole('button', { name: {{tq:errors.actions.back}} }))

    expect(window.location.pathname).toBe('/')
  })

  it('links home', () => {
    renderWithProviders(<NotFoundPage />, { path: '/missing' })

    expect(
      screen.getByRole('heading', { level: 1, name: {{tq:errors.notFound.title}} }),
    ).toBeTruthy()
    expect(
      screen.getByRole('link', { name: {{tq:errors.actions.home}} }).getAttribute('href'),
    ).toBe('/')
  })
})

describe('ServerErrorPage', () => {
  it('steps back in history on Back', () => {
    vi.spyOn(window.history, 'length', 'get').mockReturnValue(2)
    const back = vi.spyOn(window.history, 'back').mockImplementation(() => {})
    renderWithProviders(<ServerErrorPage />)

    fireEvent.click(screen.getByRole('button', { name: {{tq:errors.actions.back}} }))

    expect(back).toHaveBeenCalledOnce()
  })

  it('reloads the page on Refresh', () => {
    renderWithProviders(<ServerErrorPage />)

    fireEvent.click(screen.getByRole('button', { name: {{tq:errors.actions.refresh}} }))

    expect(reloadPage).toHaveBeenCalledOnce()
  })
})
