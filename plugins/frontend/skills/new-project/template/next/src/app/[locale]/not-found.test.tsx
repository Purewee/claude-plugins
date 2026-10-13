// #file i18n
import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/test/utils'
import NotFound from './not-found'

describe('the localized 404 page', () => {
  it('shows the not-found page', () => {
    renderWithProviders(<NotFound />)

    expect(
      screen.getByRole('heading', { level: 1, name: {{tq:errors.notFound.title}} }),
    ).toBeTruthy()
  })
})
