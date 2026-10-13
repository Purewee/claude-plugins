import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '@/test/utils'
import {
  isNavigableClick,
  type NavigateOptions,
  useRouter,
  useSearchParams,
} from './context'

function Location() {
  const { path, search } = useRouter()
  return <p>{`at ${path}${search}`}</p>
}

function Navigator({ to, options }: { to: string; options?: NavigateOptions }) {
  const { navigate } = useRouter()
  return (
    <button type="button" onClick={() => navigate(to, options)}>
      Go
    </button>
  )
}

function Filters() {
  const [params, setParams] = useSearchParams()
  return (
    <>
      <p>{`q=${params.get('q') ?? ''}`}</p>
      <button type="button" onClick={() => setParams({ q: 'new', page: '2' })}>
        Set
      </button>
      <button
        type="button"
        onClick={() => setParams({ q: null, page: null }, { replace: true })}
      >
        Clear
      </button>
    </>
  )
}

describe('RouterProvider', () => {
  it('reads the address', () => {
    renderWithProviders(<Location />, { path: '/about?tab=team' })

    expect(screen.getByText('at /about?tab=team')).toBeTruthy()
  })

  it('pushes an entry and scrolls to the top on navigate', () => {
    renderWithProviders(
      <>
        <Location />
        <Navigator to="/next?x=1#top" />
      </>,
    )
    const push = vi.spyOn(window.history, 'pushState')
    const scroll = vi.spyOn(window, 'scrollTo')

    fireEvent.click(screen.getByRole('button', { name: 'Go' }))

    expect(screen.getByText('at /next?x=1')).toBeTruthy()
    expect(window.location.hash).toBe('#top')
    expect(push).toHaveBeenCalledOnce()
    expect(scroll).toHaveBeenCalledWith({ top: 0 })
  })

  it('replaces the entry without scrolling when asked', () => {
    renderWithProviders(
      <>
        <Location />
        <Navigator to="/next" options={{ replace: true, scroll: false }} />
      </>,
    )
    const push = vi.spyOn(window.history, 'pushState')
    const replace = vi.spyOn(window.history, 'replaceState')
    const scroll = vi.spyOn(window, 'scrollTo')

    fireEvent.click(screen.getByRole('button', { name: 'Go' }))

    expect(screen.getByText('at /next')).toBeTruthy()
    expect(replace).toHaveBeenCalledOnce()
    expect(push).not.toHaveBeenCalled()
    expect(scroll).not.toHaveBeenCalled()
  })

  it('adds no entry for the current address', () => {
    renderWithProviders(<Navigator to="/same" />, { path: '/same' })
    const push = vi.spyOn(window.history, 'pushState')
    const scroll = vi.spyOn(window, 'scrollTo')

    fireEvent.click(screen.getByRole('button', { name: 'Go' }))

    expect(push).not.toHaveBeenCalled()
    expect(scroll).toHaveBeenCalledWith({ top: 0 })
  })

  it('follows the back and forward buttons', () => {
    renderWithProviders(<Location />, { path: '/first' })
    window.history.pushState({}, '', '/second')

    fireEvent.popState(window)

    expect(screen.getByText('at /second')).toBeTruthy()
  })
})

describe('useRouter', () => {
  it('throws outside the provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => render(<Location />)).toThrow(
      'useRouter must be used within a RouterProvider',
    )
  })
})

describe('useSearchParams', () => {
  it('reads the query, changes several keys in one entry and leaves no stray ?', () => {
    renderWithProviders(
      <>
        <Location />
        <Filters />
      </>,
      { path: '/list?q=old' },
    )
    expect(screen.getByText('q=old')).toBeTruthy()
    const push = vi.spyOn(window.history, 'pushState')

    fireEvent.click(screen.getByRole('button', { name: 'Set' }))

    expect(push).toHaveBeenCalledOnce()
    expect(window.location.search).toBe('?q=new&page=2')
    expect(screen.getByText('q=new')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Clear' }))

    expect(window.location.search).toBe('')
    expect(screen.getByText('at /list')).toBeTruthy()
  })
})

const PLAIN_CLICK = {
  defaultPrevented: false,
  button: 0,
  metaKey: false,
  ctrlKey: false,
  shiftKey: false,
  altKey: false,
}

function link(target: string, download = false) {
  return {
    target,
    hasAttribute: (name: string) => download && name === 'download',
  }
}

describe('isNavigableClick', () => {
  it.each([
    { name: 'a plain left click', change: {}, href: '/a', expected: true },
    {
      name: 'a click on a _self link',
      change: {},
      href: '/a',
      anchor: link('_self'),
      expected: true,
    },
    {
      name: 'a click on a link without target',
      change: {},
      href: '/a',
      anchor: link(''),
      expected: true,
    },
    {
      name: 'a meta click',
      change: { metaKey: true },
      href: '/a',
      expected: false,
    },
    {
      name: 'a ctrl click',
      change: { ctrlKey: true },
      href: '/a',
      expected: false,
    },
    {
      name: 'a shift click',
      change: { shiftKey: true },
      href: '/a',
      expected: false,
    },
    {
      name: 'an alt click',
      change: { altKey: true },
      href: '/a',
      expected: false,
    },
    {
      name: 'a middle click',
      change: { button: 1 },
      href: '/a',
      expected: false,
    },
    {
      name: 'a prevented click',
      change: { defaultPrevented: true },
      href: '/a',
      expected: false,
    },
    {
      name: 'a target _blank link',
      change: {},
      href: '/a',
      anchor: link('_blank'),
      expected: false,
    },
    {
      name: 'a download link',
      change: {},
      href: '/a',
      anchor: link('', true),
      expected: false,
    },
    {
      name: 'an external link',
      change: {},
      href: 'https://example.com',
      expected: false,
    },
    {
      name: 'a protocol-relative link',
      change: {},
      href: '//example.com',
      expected: false,
    },
    {
      name: 'a tel: link',
      change: {},
      href: 'tel:+97611111111',
      expected: false,
    },
    {
      name: 'a mailto: link',
      change: {},
      href: 'mailto:info@example.com',
      expected: false,
    },
  ])(
    'treats $name as navigable: $expected',
    ({ change, href, anchor, expected }) => {
      expect(
        isNavigableClick({ ...PLAIN_CLICK, ...change }, href, anchor),
      ).toBe(expected)
    },
  )
})
