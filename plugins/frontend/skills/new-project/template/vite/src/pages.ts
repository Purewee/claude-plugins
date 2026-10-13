// #if i18n
import type { ParseKeys } from 'i18next'
// #endif
import type { ComponentType } from 'react'
import { matchPath, normalizePath, type RouteParams } from '@/lib/router/match'
import { HomePage } from '@/pages/home-page'

export type SitePage = {
  path: string
// #if i18n
  titleKey?: ParseKeys
// #else
  title?: string
// #endif
  component: ComponentType<{ params: RouteParams }>
}

export const PAGES: SitePage[] = [
// #if i18n
  { path: '/', titleKey: 'home.title', component: HomePage },
// #else
  { path: '/', title: {{tq:home.title}}, component: HomePage },
// #endif
]

export function findPage(path: string) {
  const pathname = normalizePath(path)
  for (const page of PAGES) {
    const params = matchPath(page.path, pathname)
    if (params) return { page, params, pathname }
  }
  return null
}
