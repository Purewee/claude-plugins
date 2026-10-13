// #file i18n
import { NextRequest } from 'next/server'
import { describe, expect, it } from 'vitest'
import proxy, { config } from './proxy'

describe('proxy', () => {
  it('serves the default locale without a prefix', async () => {
    const response = await proxy(new NextRequest('http://localhost/'))

    expect(response.headers.get('x-middleware-rewrite')).toBe(
      'http://localhost/{{DEFAULT_LANG}}',
    )
  })

  it('leaves files and Next internals alone', () => {
    expect(config.matcher).toContain('_next')
  })
})
