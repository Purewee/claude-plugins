import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { clickLeftToBrowser, renderWithProviders } from '@/test/utils'
import { AppLink } from './app-link'

describe('AppLink', () => {
  it('navigates an internal click without a full page load', () => {
    renderWithProviders(<AppLink href="/about">About</AppLink>)

    const followedByBrowser = fireEvent.click(
      screen.getByRole('link', { name: 'About' }),
    )

    expect(followedByBrowser).toBe(false)
    expect(window.location.pathname).toBe('/about')
  })

  it('still runs its own onClick', () => {
    const onClick = vi.fn()
    renderWithProviders(
      <AppLink href="/about" onClick={onClick}>
        About
      </AppLink>,
    )

    fireEvent.click(screen.getByRole('link', { name: 'About' }))

    expect(onClick).toHaveBeenCalledOnce()
  })

  it.each([{ ctrlKey: true }, { metaKey: true }])(
    'leaves a modified click %o to the browser',
    (init) => {
      renderWithProviders(<AppLink href="/about">About</AppLink>)

      const leftToBrowser = clickLeftToBrowser(
        screen.getByRole('link', { name: 'About' }),
        init,
      )

      expect(leftToBrowser).toBe(true)
      expect(window.location.pathname).toBe('/')
    },
  )

  it('leaves an external link to the browser', () => {
    renderWithProviders(<AppLink href="https://example.com">External</AppLink>)

    const leftToBrowser = clickLeftToBrowser(
      screen.getByRole('link', { name: 'External' }),
    )

    expect(leftToBrowser).toBe(true)
  })

  it('keeps the real href', () => {
    renderWithProviders(<AppLink href="/about">About</AppLink>)

    expect(
      screen.getByRole('link', { name: 'About' }).getAttribute('href'),
    ).toBe('/about')
  })
})
