import { describe, expect, it } from 'vitest'
import { SITE_NAME } from '@/lib/site'
import RootLayout, { metadata } from './layout'

describe('RootLayout', () => {
  it('titles every page after the site', () => {
    expect(metadata.title).toEqual({
      default: SITE_NAME,
      template: `%s | ${SITE_NAME}`,
    })
  })

// #if i18n
  it('passes its children through to the locale layout', () => {
    const children = <p>Content</p>

    expect(RootLayout({ children })).toBe(children)
  })
// #else
  it('renders <html> in {{DEFAULT_LANG}} around the app layout', () => {
    const html = RootLayout({ children: <p>Content</p> })

    expect(html.props.lang).toBe('{{DEFAULT_LANG}}')
  })
// #endif
})
