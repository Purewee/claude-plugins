import {
  createContext,
  type MouseEvent,
  useCallback,
  useContext,
  useMemo,
} from 'react'

export interface NavigateOptions {
  replace?: boolean
  scroll?: boolean
}

interface RouterContextValue {
  path: string
  search: string
  navigate: (to: string, options?: NavigateOptions) => void
}

export const RouterContext = createContext<RouterContextValue | null>(null)

export function useRouter() {
  const ctx = useContext(RouterContext)
  if (!ctx) throw new Error('useRouter must be used within a RouterProvider')
  return ctx
}

export function useSearchParams() {
  const { search, navigate } = useRouter()
  const params = useMemo(() => new URLSearchParams(search), [search])

  const setParams = useCallback(
    (changes: Record<string, string | null>, options?: NavigateOptions) => {
      const next = new URLSearchParams(window.location.search)
      for (const [key, value] of Object.entries(changes)) {
        if (value === null) {
          next.delete(key)
        } else {
          next.set(key, value)
        }
      }
      const query = next.toString()
      navigate(
        `${window.location.pathname}${query ? `?${query}` : ''}`,
        options,
      )
    },
    [navigate],
  )

  return [params, setParams] as const
}

type LinkClick = Pick<
  MouseEvent,
  'defaultPrevented' | 'button' | 'metaKey' | 'ctrlKey' | 'shiftKey' | 'altKey'
>

export function isNavigableClick(
  event: LinkClick,
  href: string,
  link?: Pick<HTMLAnchorElement, 'target' | 'hasAttribute'>,
) {
  return (
    !event.defaultPrevented &&
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey &&
    href.startsWith('/') &&
    !href.startsWith('//') &&
    (!link ||
      ((link.target === '' || link.target === '_self') &&
        !link.hasAttribute('download')))
  )
}

export function useInternalLinkClick(href: string) {
  const { navigate } = useRouter()
  return useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      if (!isNavigableClick(event, href, event.currentTarget)) return
      event.preventDefault()
      navigate(href)
    },
    [href, navigate],
  )
}
