// #file i18n
import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { nextRouter } from '@/test/next-router'
import { renderWithProviders } from '@/test/utils'
import { LanguageSwitcher } from './language-switcher'

describe('LanguageSwitcher', () => {
  it('marks the current language and switches to another', () => {
    renderWithProviders(<LanguageSwitcher />)

    expect(
      screen
        .getByRole('button', { name: {{tq:language.{{DEFAULT_LANG}}}} })
        .getAttribute('aria-pressed'),
    ).toBe('true')

    fireEvent.click(screen.getByRole('button', { name: {{tq:language.{{OTHER_LANG}}}} }))

    expect(nextRouter.replace).toHaveBeenCalledOnce()
    expect(nextRouter.replace.mock.calls[0][0]).toBe('/{{OTHER_LANG}}')
  })
})
