import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SITE_NAME } from '@/lib/site'
import { useDocumentTitle } from './use-document-title'

describe('useDocumentTitle', () => {
  it('combines the page title with the site name', () => {
    renderHook(() => useDocumentTitle('Contact'))

    expect(document.title).toBe(`Contact | ${SITE_NAME}`)
  })

  it('uses the site name alone without a title', () => {
    renderHook(() => useDocumentTitle())

    expect(document.title).toBe(SITE_NAME)
  })

  it('leaves the title alone when disabled', () => {
    document.title = 'Earlier title'

    renderHook(() => useDocumentTitle('Contact', false))

    expect(document.title).toBe('Earlier title')
  })
})
