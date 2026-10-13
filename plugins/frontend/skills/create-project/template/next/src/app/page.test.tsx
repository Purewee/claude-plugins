// #file plain
import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SITE_NAME } from '@/lib/site'
import { renderWithProviders } from '@/test/utils'
import HomePage, { metadata } from './page'

describe('HomePage', () => {
  it('has an absolute title, because the root title template skips its own segment', () => {
    expect(metadata.title).toEqual({ absolute: `{{t:home.title}} | ${SITE_NAME}` })
  })

  it('renders the welcome section', () => {
    renderWithProviders(<HomePage />)

    expect(
      screen.getByRole('heading', { level: 1, name: {{tq:home.title}} }),
    ).toBeTruthy()
  })
})
