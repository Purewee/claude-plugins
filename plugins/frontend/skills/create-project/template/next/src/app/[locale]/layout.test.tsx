// #file i18n
import { notFound } from 'next/navigation'
import { describe, expect, it } from 'vitest'
import { routing } from '@/i18n/routing'
import LocaleLayout, { dynamicParams, generateStaticParams } from './layout'

describe('LocaleLayout', () => {
  it('renders <html> in the requested language', async () => {
    const html = await LocaleLayout({
      children: <p>Content</p>,
      params: Promise.resolve({ locale: '{{OTHER_LANG}}' }),
    } as never)

    expect(html.props.lang).toBe('{{OTHER_LANG}}')
  })

  it('answers an unknown locale with the 404 page', async () => {
    await expect(
      LocaleLayout({
        children: null,
        params: Promise.resolve({ locale: 'xx' }),
      } as never),
    ).rejects.toThrow('NEXT_NOT_FOUND')
    expect(notFound).toHaveBeenCalled()
  })

  it('prerenders every locale and serves no other', () => {
    expect(generateStaticParams()).toEqual(
      routing.locales.map((locale) => ({ locale })),
    )
    expect(dynamicParams).toBe(false)
  })
})
