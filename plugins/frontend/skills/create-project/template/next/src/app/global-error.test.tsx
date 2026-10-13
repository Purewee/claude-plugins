import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { leaveTo, reloadPage } from '@/lib/navigation'
import GlobalError from './global-error'

vi.mock('@/lib/navigation', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/navigation')>()),
  reloadPage: vi.fn(),
  leaveTo: vi.fn(),
}))

const error = new Error('boom')

function renderGlobalError() {
  vi.spyOn(console, 'error').mockImplementation(() => {})
  return render(<GlobalError error={error} />, { container: document } as never)
}

describe('GlobalError', () => {
  it('renders its own <html> with the server error texts and logs the error', () => {
    renderGlobalError()

    expect(document.documentElement.lang).toBe('{{DEFAULT_LANG}}')
    expect(
      screen.getByRole('heading', { level: 1, name: {{tq:errors.server.title}} }),
    ).toBeTruthy()
    expect(console.error).toHaveBeenCalledWith('App failed to render', error)
  })

  it('steps back in history on Back', () => {
    vi.spyOn(window.history, 'length', 'get').mockReturnValue(2)
    const back = vi.spyOn(window.history, 'back').mockImplementation(() => {})
    renderGlobalError()

    fireEvent.click(screen.getByRole('button', { name: {{tq:errors.actions.back}} }))

    expect(back).toHaveBeenCalledOnce()
  })

  it('goes home on Back when there is no history', () => {
    vi.spyOn(window.history, 'length', 'get').mockReturnValue(1)
    renderGlobalError()

    fireEvent.click(screen.getByRole('button', { name: {{tq:errors.actions.back}} }))

    expect(leaveTo).toHaveBeenCalledWith('/')
  })

  it('reloads the page on Refresh', () => {
    renderGlobalError()

    fireEvent.click(screen.getByRole('button', { name: {{tq:errors.actions.refresh}} }))

    expect(reloadPage).toHaveBeenCalledOnce()
  })
})
