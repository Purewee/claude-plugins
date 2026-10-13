import { describe, expect, it } from 'vitest'
import { ApiError } from '@/lib/api'
import { retryFailedRequest } from './retry'

describe('retryFailedRequest', () => {
  it('never retries a client error', () => {
    expect(retryFailedRequest(0, new ApiError(404, 'Not found'))).toBe(false)
  })

  it.each([0, 500])('retries status %i twice, then gives up', (status) => {
    const error = new ApiError(status, 'Failed')

    expect(retryFailedRequest(0, error)).toBe(true)
    expect(retryFailedRequest(1, error)).toBe(true)
    expect(retryFailedRequest(2, error)).toBe(false)
  })

  it('treats a non-API error like a server error', () => {
    expect(retryFailedRequest(0, new Error('boom'))).toBe(true)
  })
})
