// #file i18n
import { notFound } from 'next/navigation'
import { describe, expect, it } from 'vitest'
import { readLocale } from './locale'

describe('readLocale', () => {
  it('accepts a known locale', async () => {
    expect(await readLocale(Promise.resolve({ locale: '{{OTHER_LANG}}' }))).toBe('{{OTHER_LANG}}')
  })

  it('sends an unknown locale to the 404 page', async () => {
    await expect(readLocale(Promise.resolve({ locale: 'xx' }))).rejects.toThrow(
      'NEXT_NOT_FOUND',
    )
    expect(notFound).toHaveBeenCalled()
  })
})
