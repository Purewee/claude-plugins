import { describe, expect, it, vi } from 'vitest'
import * as z from 'zod'
import { jsonResponse, mockFetch } from '@/test/utils'
import { ApiError, apiPagedRequest, apiRequest, isServerError } from './api'

const ItemSchema = z.object({ id: z.string() })

async function failure(request: Promise<unknown>) {
  return request.then(
    () => {
      throw new Error('expected the request to fail')
    },
    (error: unknown) => error as ApiError,
  )
}

describe('apiRequest', () => {
  it('returns the envelope data and sends the search params, skipping undefined ones', async () => {
    const { calls, fetchMock } = mockFetch(() =>
      jsonResponse({ success: true, data: { id: 'a' } }),
    )

    const item = await apiRequest('/items/a', ItemSchema, {
      searchParams: { locale: 'mn', page: 2, draft: false, search: undefined },
    })

    expect(item).toEqual({ id: 'a' })
    expect(calls[0].href).toBe(
      'https://api.test/api/items/a?locale=mn&page=2&draft=false',
    )
    expect(fetchMock.mock.calls[0][1]).toMatchObject({
      method: 'GET',
      body: undefined,
      headers: {
        Accept: 'application/json',
// #if plain
        'Accept-Language': '{{DEFAULT_LANG}}',
// #endif
      },
    })
  })

  it('sends a JSON body with its method, headers and fetch options', async () => {
    const { fetchMock } = mockFetch(() =>
      jsonResponse({ success: true, data: { id: 'b' } }, 201),
    )

    const item = await apiRequest('/items', ItemSchema, {
      method: 'POST',
      body: { title: 'New' },
      headers: { 'X-Request-Id': 'r1' },
      init: { credentials: 'include' },
    })

    const init = fetchMock.mock.calls[0][1]
    expect(item).toEqual({ id: 'b' })
    expect(init).toMatchObject({
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ title: 'New' }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Request-Id': 'r1',
      },
    })
  })

  it('accepts an empty answer when the schema expects none', async () => {
    mockFetch(() => new Response(null, { status: 204 }))

    await expect(
      apiRequest('/items/a', z.undefined(), { method: 'DELETE' }),
    ).resolves.toBeUndefined()
  })

  it.each([
    [
      'the envelope message and code',
      { error: 'not_found', message: 'Not here' },
      { message: 'Not here', detail: 'Not here', code: 'not_found' },
    ],
    [
      'the envelope code without a message',
      { error: 'not_found' },
      { message: 'not_found', detail: undefined, code: 'not_found' },
    ],
    [
      'problem details with field errors',
      {
        type: 'urn:app:problems:validation-failed',
        title: 'Invalid input',
        detail: 'Check the highlighted fields.',
        errors: { email: 'Enter a valid email.' },
      },
      {
        message: 'Check the highlighted fields.',
        detail: 'Check the highlighted fields.',
        code: 'validation-failed',
        fieldErrors: { email: 'Enter a valid email.' },
      },
    ],
    [
      'a problem title and a URL type',
      { type: 'https://api.test/problems/out-of-stock', title: 'Out of stock' },
      { message: 'Out of stock', detail: 'Out of stock', code: 'out-of-stock' },
    ],
    [
      'the status when the body says nothing usable',
      { detail: 42, errors: ['x'] },
      {
        message: 'Request failed with status 422',
        detail: undefined,
        code: undefined,
        fieldErrors: {},
      },
    ],
  ])('throws %s', async (_, body, expected) => {
    mockFetch(() => jsonResponse(body, 422))

    const error = await failure(apiRequest('/items/a', ItemSchema))

    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ status: 422, ...expected })
  })

  it('falls back to the status for an error without a body', async () => {
    mockFetch(() => new Response(null, { status: 500 }))

    const error = await failure(apiRequest('/items/a', ItemSchema))

    expect(error).toMatchObject({
      status: 500,
      message: 'Request failed with status 500',
      detail: undefined,
    })
  })

  it('reports a network failure as status 0', async () => {
    mockFetch(() => Promise.reject(new TypeError('Failed to fetch')))

    const error = await failure(apiRequest('/items/a', ItemSchema))

    expect(error).toMatchObject({ status: 0, detail: undefined })
    expect(error.message).toContain('Cannot reach the API')
  })

  it.each([
    [
      'a non-JSON body',
      () => new Response('<html></html>', { status: 200 }),
      'API returned a non-JSON response',
    ],
    [
      'a foreign body',
      () => jsonResponse({ id: 'a' }),
      'Unexpected API response',
    ],
    [
      'data of the wrong shape',
      () => jsonResponse({ success: true, data: { id: 1 } }),
      'Unexpected API response shape',
    ],
    [
      'an empty body where data was expected',
      () => new Response(null, { status: 200 }),
      'Unexpected API response shape',
    ],
  ])('rejects %s', async (_, respond, message) => {
    mockFetch(respond)

    const error = await failure(apiRequest('/items/a', ItemSchema))

    expect(error).toMatchObject({ status: 200, message })
  })
})

describe('apiPagedRequest', () => {
  it('returns the rows with the total from meta', async () => {
    mockFetch(() =>
      jsonResponse({ success: true, data: [{ id: 'a' }], meta: { total: 9 } }),
    )

    expect(await apiPagedRequest('/items', ItemSchema)).toEqual({
      items: [{ id: 'a' }],
      total: 9,
    })
  })

  it('counts the rows when there is no meta', async () => {
    mockFetch(() =>
      jsonResponse({ success: true, data: [{ id: 'a' }, { id: 'b' }] }),
    )

    expect((await apiPagedRequest('/items', ItemSchema)).total).toBe(2)
  })

  it('treats missing data as an empty page', async () => {
    mockFetch(() => jsonResponse({ success: true }))

    expect(await apiPagedRequest('/items', ItemSchema)).toEqual({
      items: [],
      total: 0,
    })
  })
})

describe('isServerError', () => {
  it.each([
    ['a 4xx', new ApiError(404, 'Not found'), false],
    ['no answer', new ApiError(0, 'Offline'), true],
    ['a 5xx', new ApiError(503, 'Down'), true],
    ['any other error', new Error('boom'), true],
  ])('reads %s as a server error: %s', (_, error, expected) => {
    expect(isServerError(error)).toBe(expected)
  })
})

describe('the api module', () => {
  it('resolves a relative base address against the page', async () => {
    vi.stubEnv('{{API_ENV}}', '/api')
    vi.resetModules()
    const { apiRequest: request } = await import('./api')
    const { calls } = mockFetch(() =>
      jsonResponse({ success: true, data: { id: 'a' } }),
    )

    await request('/items/a', ItemSchema)

    expect(calls[0].href).toBe(`${window.location.origin}/api/items/a`)
  })

  it('refuses to load without {{API_ENV}}', async () => {
    vi.stubEnv('{{API_ENV}}', '')
    vi.resetModules()

    await expect(import('./api')).rejects.toThrow('{{API_ENV}} is not set')
  })
})
