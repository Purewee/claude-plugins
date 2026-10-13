import * as z from 'zod'

// #if next
const baseUrl = process.env.NEXT_PUBLIC_API_URL
// #else
const baseUrl = import.meta.env.VITE_API_URL
// #endif

if (!baseUrl) {
  throw new Error(
    '{{API_ENV}} is not set - copy .env.example to .env and restart the dev server',
  )
}
// #if plain

const API_LANGUAGE = '{{DEFAULT_LANG}}'
// #endif

const envelopeSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  meta: z.object({ total: z.number() }).optional(),
})

const optionalText = z.string().optional().catch(undefined)

// Error bodies come as the envelope's { error, message } or as RFC 9457 problem details { type, title, detail, errors }.
const errorSchema = z.object({
  error: optionalText,
  message: optionalText,
  code: optionalText,
  type: optionalText,
  title: optionalText,
  detail: optionalText,
  errors: z.record(z.string(), z.string()).optional().catch(undefined),
})

type ErrorBody = z.infer<typeof errorSchema>

export class ApiError extends Error {
  readonly status: number
  readonly detail: string | undefined
  readonly code: string | undefined
  readonly fieldErrors: Record<string, string>

  constructor(
    status: number,
    message: string,
    {
      detail,
      code,
      fieldErrors = {},
    }: {
      detail?: string
      code?: string
      fieldErrors?: Record<string, string>
    } = {},
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.detail = detail
    this.code = code
    this.fieldErrors = fieldErrors
  }
}

export function isServerError(error: unknown) {
  return !(
    error instanceof ApiError &&
    error.status >= 400 &&
    error.status < 500
  )
}

type RequestInput = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  searchParams?: Record<string, string | number | boolean | undefined>
  body?: unknown
  headers?: Record<string, string>
  init?: RequestInit
}

export async function apiRequest<T>(
  path: string,
  schema: z.ZodType<T>,
  input: RequestInput = {},
): Promise<T> {
  const { data } = await request(path, schema, input)
  return data
}

export type Page<T> = { items: T[]; total: number }

export async function apiPagedRequest<T>(
  path: string,
  itemSchema: z.ZodType<T>,
  input: RequestInput = {},
): Promise<Page<T>> {
  const { data, total } = await request(
    path,
    itemSchema.array().default([]),
    input,
  )
  return { items: data, total: total ?? data.length }
}

// A problem type ends in the error's name: `urn:app:problems:not-found` and `https://api.example/problems/not-found` both give `not-found`.
function errorCode({ code, error, type }: ErrorBody) {
  return code ?? error ?? type?.split(/[:/]/).at(-1)
}

function failure(status: number, json: unknown) {
  const parsed = errorSchema.safeParse(json)
  const body: ErrorBody = parsed.success ? parsed.data : {}
  const detail = body.message ?? body.detail ?? body.title
  return new ApiError(
    status,
    detail ?? body.error ?? `Request failed with status ${status}`,
    { detail, code: errorCode(body), fieldErrors: body.errors },
  )
}

async function request<T>(
  path: string,
  schema: z.ZodType<T>,
  { method = 'GET', searchParams = {}, body, headers, init }: RequestInput,
): Promise<{ data: T; total: number | undefined }> {
  // A relative base such as /api resolves against the page's own origin.
  const url = new URL(`${baseUrl}${path}`, globalThis.location?.origin)
  for (const [key, value] of Object.entries(searchParams)) {
    if (value !== undefined) {
      url.searchParams.set(key, String(value))
    }
  }

  let res: Response
  try {
    res = await fetch(url, {
      ...init,
      method,
      headers: {
        Accept: 'application/json',
// #if plain
        'Accept-Language': API_LANGUAGE,
// #endif
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError(0, `Cannot reach the API at ${baseUrl}.`)
  }

  const raw = await res.text()
  let json: unknown = null
  if (raw) {
    try {
      json = JSON.parse(raw)
    } catch {
      throw new ApiError(res.status, 'API returned a non-JSON response')
    }
  }

  if (!res.ok) {
    throw failure(res.status, json)
  }

  // An empty body (204) leaves the data undefined; the caller's schema decides whether that is right.
  let payload: unknown
  let total: number | undefined
  if (json !== null) {
    const envelope = envelopeSchema.safeParse(json)
    if (!envelope.success) {
      throw new ApiError(res.status, 'Unexpected API response')
    }
    payload = envelope.data.data
    total = envelope.data.meta?.total
  }

  const data = schema.safeParse(payload)
  if (!data.success) {
    throw new ApiError(res.status, 'Unexpected API response shape')
  }

  return { data: data.data, total }
}
