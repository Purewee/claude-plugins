// #file plain
import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SITE_NAME } from '@/lib/site'
import { renderWithProviders } from '@/test/utils'
import NotFound, { metadata } from './not-found'

describe('the 404 page', () => {
  it('has an absolute title', () => {
    expect(metadata.title).toEqual({
      absolute: `{{t:errors.notFound.title}} | ${SITE_NAME}`,
    })
  })

  it('shows the not-found page', () => {
    renderWithProviders(<NotFound />)

    expect(
      screen.getByRole('heading', { level: 1, name: {{tq:errors.notFound.title}} }),
    ).toBeTruthy()
  })
})
