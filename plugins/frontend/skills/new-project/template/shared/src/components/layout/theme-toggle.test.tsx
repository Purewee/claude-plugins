// #file theme
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
// #if next && i18n
import { NextIntlClientProvider } from 'next-intl'
// #endif
import { ThemeProvider } from 'next-themes'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
// #if next && i18n
import messages from '@/i18n/locales/{{DEFAULT_LANG}}.json'
// #endif
import { ThemeToggle } from './theme-toggle'

function themedToggle(defaultTheme = 'system') {
// #if next && i18n
  return (
    <NextIntlClientProvider locale="{{DEFAULT_LANG}}" messages={messages}>
      <ThemeProvider attribute="class" defaultTheme={defaultTheme} enableSystem>
        <ThemeToggle />
      </ThemeProvider>
    </NextIntlClientProvider>
  )
// #else
  return (
    <ThemeProvider attribute="class" defaultTheme={defaultTheme} enableSystem>
      <ThemeToggle />
    </ThemeProvider>
  )
// #endif
}

describe('ThemeToggle', () => {
  it('switches to the dark theme and back', async () => {
    render(themedToggle('light'))
    const toggle = screen.getByRole('button', { name: {{tq:theme.dark}} })
    await waitFor(() =>
      expect(toggle.getAttribute('aria-pressed')).toBe('false'),
    )

    fireEvent.click(toggle)

    await waitFor(() =>
      expect(toggle.getAttribute('aria-pressed')).toBe('true'),
    )
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    fireEvent.click(toggle)

    await waitFor(() =>
      expect(toggle.getAttribute('aria-pressed')).toBe('false'),
    )
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('hydrates server HTML without a mismatch when the dark theme was saved', async () => {
    const container = document.createElement('div')
    container.innerHTML = renderToString(themedToggle())
    document.body.append(container)
    localStorage.setItem('theme', 'dark')
    const onRecoverableError = vi.fn()
    const logged = vi.spyOn(console, 'error')

    await act(async () => {
      hydrateRoot(container, themedToggle(), { onRecoverableError })
    })

    expect(onRecoverableError).not.toHaveBeenCalled()
    expect(logged).not.toHaveBeenCalled()
    expect(
      container.querySelector('button')?.getAttribute('aria-pressed'),
    ).toBe('true')
    container.remove()
  })
})
