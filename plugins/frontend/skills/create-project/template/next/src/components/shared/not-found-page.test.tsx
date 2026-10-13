import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { nextRouter } from '@/test/next-router'
import { renderWithProviders } from '@/test/utils'
import { NotFoundPage } from './not-found-page'

describe('NotFoundPage', () => {
  it('goes home on Back when there is no history', () => {
    vi.spyOn(window.history, 'length', 'get').mockReturnValue(1)
    renderWithProviders(<NotFoundPage />, { path: '/missing' })

    fireEvent.click(screen.getByRole('button', { name: {{tq:errors.actions.back}} }))

    expect(nextRouter.push).toHaveBeenCalledWith('/')
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
