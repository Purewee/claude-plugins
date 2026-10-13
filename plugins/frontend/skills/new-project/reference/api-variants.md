# API variants

The template targets a REST API that wraps every response in an envelope (`{ success, data, meta: { total } }`). Apply one of these variants only when the user requests it, after the project has been generated, then run `pnpm lint:fix` and a single `pnpm verify`.

## Plain JSON API

- In `src/lib/api.ts`, drop `envelopeSchema` and validate the body with the caller's schema directly.
- Take the total from wherever the API reports it (a header such as `X-Total-Count`, or a body field), or remove `apiPagedRequest`.
- Adjust `src/lib/api.test.ts` to match, and the CLAUDE.md sentence that names the envelope.

## No API

- Delete `src/lib/api.ts` and its test, `src/queries/`, and the TanStack Query provider (`main.tsx` on Vite, `app/providers.tsx` on Next.js); `pnpm remove @tanstack/react-query`.
- Remove the API variable (`VITE_API_URL` or `NEXT_PUBLIC_API_URL`) everywhere it appears: `.env*`, `src/vite-env.d.ts` or `src/env.d.ts`, `test.env` in the Vitest config, and the `preconnect` links in `index.html`.
- Remove `mockFetch`, `jsonResponse` and `createTestQueryClient` from `src/test/utils.tsx` and the tests that used them.
- Keep zod only for forms, and keep the data-layer pattern in CLAUDE.md for when an API is added.
