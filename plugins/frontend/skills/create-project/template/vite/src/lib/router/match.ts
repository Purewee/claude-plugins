export type RouteParams = Record<string, string>

export function normalizePath(path: string) {
  const [pathname] = path.split(/[?#]/)
  return pathname.length > 1 ? pathname.replace(/\/+$/, '') || '/' : pathname
}

export function matchPath(
  pattern: string,
  pathname: string,
): RouteParams | null {
  const expected = pattern.split('/').filter(Boolean)
  const actual = pathname.split('/').filter(Boolean)
  if (expected.length !== actual.length) return null

  const params: RouteParams = {}
  for (const [index, segment] of expected.entries()) {
    const value = actual[index]
    if (segment.startsWith(':')) {
      try {
        params[segment.slice(1)] = decodeURIComponent(value)
      } catch {
        return null
      }
    } else if (segment !== value) {
      return null
    }
  }
  return params
}
