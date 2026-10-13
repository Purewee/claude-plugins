import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { type NavigateOptions, RouterContext } from '@/lib/router/context'

function readLocation() {
  return { path: window.location.pathname, search: window.location.search }
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState(readLocation)

  useEffect(() => {
    const onPopState = () => setLocation(readLocation())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const navigate = useCallback(
    (to: string, { replace = false, scroll = true }: NavigateOptions = {}) => {
      const next = new URL(to, window.location.href)
      const target = `${next.pathname}${next.search}`
      const current = `${window.location.pathname}${window.location.search}`

      if (target !== current) {
        const href = `${target}${next.hash}`
        if (replace) {
          window.history.replaceState({}, '', href)
        } else {
          window.history.pushState({}, '', href)
        }
        setLocation({ path: next.pathname, search: next.search })
      }

      if (scroll) window.scrollTo({ top: 0 })
    },
    [],
  )

  const value = useMemo(() => ({ ...location, navigate }), [location, navigate])

  return <RouterContext value={value}>{children}</RouterContext>
}
