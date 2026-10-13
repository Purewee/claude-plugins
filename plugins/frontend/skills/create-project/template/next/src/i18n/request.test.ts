// #file i18n
import { describe, expect, it } from 'vitest'
import messages from './locales/{{OTHER_LANG}}.json'
import requestConfig from './request'

type RequestConfig = (params: {
  requestLocale: Promise<string | undefined>
}) => Promise<{ locale: string; messages: unknown }>

const config = requestConfig as unknown as RequestConfig

describe('request config', () => {
  it('falls back to the default locale for an unknown one', async () => {
    const result = await config({ requestLocale: Promise.resolve('xx') })

    expect(result.locale).toBe('{{DEFAULT_LANG}}')
  })

  it('loads the messages of a known locale', async () => {
    const result = await config({ requestLocale: Promise.resolve('{{OTHER_LANG}}') })

    expect(result).toEqual({ locale: '{{OTHER_LANG}}', messages })
  })
})
