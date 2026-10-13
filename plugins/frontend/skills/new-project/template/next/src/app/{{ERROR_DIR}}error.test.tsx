import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { reloadPage } from '@/lib/navigation'
import { nextRouter } from '@/test/next-router'
import { renderWithProviders } from '@/test/utils'
import PageError from './error'

vi.mock('@/lib/navigation', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/navigation')>()),
  reloadPage: vi.fn(),
}))

const error = new Error('boom')

describe('PageError', () => {
  it('shows the server error page and logs the error', () => {
    const logged = vi.spyOn(console, 'error').mockImplementation(() => {})

    renderWithProviders(<PageError error={error} />)

    expect(
      screen.getByRole('heading', { level: 1, name: {{tq:errors.server.title}} }),
    ).toBeTruthy()
    expect(logged).toHaveBeenCalledWith('Page failed to render', error)
  })

  it('goes home on Back when there is no history', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(window.history, 'length', 'get').mockReturnValue(1)
    renderWithProviders(<PageError error={error} />)

    fireEvent.click(screen.getByRole('button', { name: {{tq:errors.actions.back}} }))

    expect(nextRouter.push).toHaveBeenCalledWith('/')
  })

  it('reloads the page on Refresh', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    renderWithProviders(<PageError error={error} />)

    fireEvent.click(screen.getByRole('button', { name: {{tq:errors.actions.refresh}} }))

    expect(reloadPage).toHaveBeenCalledOnce()
  })
})
