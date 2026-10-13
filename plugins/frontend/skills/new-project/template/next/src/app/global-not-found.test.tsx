// #file i18n
import { describe, expect, it } from 'vitest'
import { SITE_NAME } from '@/lib/site'
import GlobalNotFound, { generateMetadata } from './global-not-found'

describe('GlobalNotFound', () => {
  it('has an absolute, translated title', async () => {
    expect((await generateMetadata()).title).toEqual({
      absolute: `{{t:errors.notFound.title}} | ${SITE_NAME}`,
    })
  })

  it('renders <html> in the request language', async () => {
    const html = await GlobalNotFound()

    expect(html.props.lang).toBe('{{DEFAULT_LANG}}')
  })
})
