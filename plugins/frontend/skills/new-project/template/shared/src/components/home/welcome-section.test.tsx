import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/test/utils'
import { WelcomeSection } from './welcome-section'

describe('WelcomeSection', () => {
  it('greets the visitor with the page heading', () => {
    renderWithProviders(<WelcomeSection />)

    expect(
      screen.getByRole('heading', { level: 1, name: {{tq:home.title}} }),
    ).toBeTruthy()
  })

  it('reveals the details on request and hides them again', () => {
    renderWithProviders(<WelcomeSection />)
    const toggle = screen.getByRole('button', { name: {{tq:home.showDetails}} })
    expect(toggle.getAttribute('aria-expanded')).toBe('false')

    fireEvent.click(toggle)

    expect(toggle.getAttribute('aria-expanded')).toBe('true')
    expect(screen.getByText({{tq:home.details}})).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: {{tq:home.hideDetails}} }))

    expect(screen.queryByText({{tq:home.details}})).toBeNull()
  })
})
