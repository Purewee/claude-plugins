import { describe, expect, it, vi } from 'vitest'
import { goBack, leaveTo, reloadPage } from './navigation'

describe('goBack', () => {
  it('steps back in history when there is somewhere to go', () => {
    vi.spyOn(window.history, 'length', 'get').mockReturnValue(3)
    const back = vi.spyOn(window.history, 'back').mockImplementation(() => {})
    const navigate = vi.fn()

    goBack(navigate)

    expect(back).toHaveBeenCalledOnce()
    expect(navigate).not.toHaveBeenCalled()
  })

  it('goes home when there is no history', () => {
    vi.spyOn(window.history, 'length', 'get').mockReturnValue(1)
    const navigate = vi.fn()

    goBack(navigate)

    expect(navigate).toHaveBeenCalledWith('/')
  })
})

describe('reloadPage', () => {
  it('reloads the page', () => {
    const reload = vi.fn()

    reloadPage({ reload })

    expect(reload).toHaveBeenCalledOnce()
  })
})

describe('leaveTo', () => {
  it('loads another address in the whole window', () => {
    const assign = vi.fn()

    leaveTo('/', { assign })

    expect(assign).toHaveBeenCalledWith('/')
  })
})
