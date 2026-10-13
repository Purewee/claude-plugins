import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { SITE_NAME } from '@/lib/site'
import { renderWithProviders } from '@/test/utils'
import { AppLayout } from './app-layout'

describe('AppLayout', () => {
  it('has the banner, main and contentinfo landmarks, and the site name links home', () => {
    renderWithProviders(
      <AppLayout>
        <p>Content</p>
      </AppLayout>,
    )

    expect(screen.getByRole('banner')).toBeTruthy()
    expect(screen.getByRole('main').textContent).toBe('Content')
    expect(screen.getByRole('contentinfo')).toBeTruthy()
    expect(
      screen.getByRole('link', { name: SITE_NAME }).getAttribute('href'),
    ).toBe('/')
  })

  it('shows the current year in the footer', () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2031-05-01T00:00:00Z'))

    renderWithProviders(<AppLayout>{null}</AppLayout>)

    expect(screen.getByRole('contentinfo').textContent).toContain(
      `2031 ${SITE_NAME}`,
    )
  })
})
