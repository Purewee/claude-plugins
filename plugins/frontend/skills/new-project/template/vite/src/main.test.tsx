import { screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SITE_NAME } from '@/lib/site'
import { jsonResponse, mockFetch } from '@/test/utils'

describe('main', () => {
  it('starts the app in #root', async () => {
    mockFetch(() => jsonResponse({ success: true, data: [] }))
    document.body.innerHTML = '<div id="root"></div>'

    await import('./main')

    expect(await screen.findByRole('banner')).toBeTruthy()
    expect(screen.getByRole('main')).toBeTruthy()
    await waitFor(() =>
      expect(document.title).toBe(`{{t:home.title}} | ${SITE_NAME}`),
    )
  })
})
