<!-- #if next -->
@AGENTS.md

<!-- #endif -->
# {{SITE_NAME}}

<!-- #if vite -->
{{SITE_NAME}} is a client-rendered React 19 single-page app built with Vite and the house built-in router (no router dependency).
<!-- #else -->
{{SITE_NAME}} is a Next.js App Router app (React 19, `output: 'standalone'`): Server Components by default, client components only where state or browser APIs are needed.
<!-- #endif -->
<!-- #if i18n && vite -->
It is translated into {{LANGS_TEXT}} with i18next (`{{DEFAULT_LANG}}` is the default and the language the tests assert).
<!-- #elif i18n -->
It is translated into {{LANGS_TEXT}} with next-intl and locale routing (`{{DEFAULT_LANG}}` is the default, served without a prefix, and the language the tests assert).
<!-- #else -->
It is in one language, `{{DEFAULT_LANG}}`, with strings written inline (no i18n library).
<!-- #endif -->
It reads a REST API through a zod-validated client (`lib/api.ts`, envelope `{ success, data, meta }`) and TanStack Query, styles with Tailwind CSS v4 tokens and shadcn/ui, and is {{?theme:light + dark with a toggle (next-themes)}}{{?!theme:light only}}.

## Commands

| Command | What it does |
|---|---|
<!-- #if vite -->
| `pnpm dev` | Starts the Vite dev server |
| `pnpm build` | Type-checks (`tsc -b`), then builds to `dist/` |
| `pnpm preview` | Serves the built `dist/` locally |
| `pnpm typecheck` | `tsc -b` over the app, the tests and the config files |
<!-- #else -->
| `pnpm dev` | Starts the Next.js dev server |
| `pnpm build` | `next build`, with the standalone server in `.next/standalone` |
| `pnpm start` | Serves the production build (`node .next/standalone/server.js` in a container) |
| `pnpm typecheck` | `next typegen && tsc --noEmit` |
<!-- #endif -->
| `pnpm lint` | Biome (format, imports, lint) and oxlint; fails on any warning |
| `pnpm lint:fix` | Same as `lint`, applying every safe fix |
| `pnpm format` | Biome formatting only |
| `pnpm test` | Vitest once, with coverage and the per-file gate |
| `pnpm test:watch` | Vitest in watch mode |
| `pnpm verify` | `lint`, `typecheck`, `test` and `build` in a row |
| `pnpm dlx shadcn@latest add <name>` | Adds a shadcn primitive to `src/components/ui/`; run `pnpm lint:fix` after it |

<!-- #if vite -->
A build for another environment uses a Vite mode: `pnpm build --mode <mode>` loads `.env.<mode>`.
<!-- #else -->
`.env.development` and `.env.production` are tracked; `.env.production.local` points a build at another environment.
<!-- #endif -->

## Architecture

```text
<!-- #if vite -->
src/
  main.tsx                 entry: providers{{?i18n:, i18n}} and CSS imports
  App.tsx                  route switch, tab title, #hash scroll, page error boundary
  pages.ts                 PAGES registry { path, {{?i18n:titleKey}}{{?plain:title}}, component } + findPage()
  index.css                Tailwind v4, shadcn tokens, brand tokens
  vite-env.d.ts            typed VITE_ variables
  components/
    ui/                    shadcn primitives only: generated, never hand-edited, coverage-excluded
    layout/                app-layout, site-header, site-footer{{?i18n:, language-switcher}}{{?theme:, theme-toggle}}
    shared/                app-link, status-page, page-error-boundary, root-error-boundary{{?tables:, data-table}}
    home/                  welcome-section (the sample section)
  pages/                   thin <name>-page.tsx files that stack sections; not-found-page, server-error-page
  hooks/                   use-document-title{{?i18n:, use-locale}}
  lib/                     api.ts, router/, navigation.ts, date.ts, site.ts, utils.ts
  queries/                 retry.ts, stale-time.ts, then one folder per resource
<!-- #if i18n -->
  i18n/                    config.ts, types.d.ts, locales/<lang>.json
<!-- #endif -->
  test/                    setup.ts, utils.tsx: the only home of test helpers
<!-- #else -->
src/
<!-- #if i18n -->
  proxy.ts                 next-intl locale handling
<!-- #endif -->
  env.d.ts                 typed process.env
  app/
<!-- #if i18n -->
    layout.tsx             pass-through root: the title template only
<!-- #else -->
    layout.tsx             <html lang>, fonts, Providers, AppLayout, the title template
<!-- #endif -->
    globals.css            Tailwind v4, shadcn tokens, brand tokens
    fonts.ts               next/font definitions
    providers.tsx          'use client': QueryClientProvider{{?theme:, ThemeProvider}}{{?toasts:, Toaster}}
    global-error.tsx       'use client': replaces the root layout when it fails; own <html>
<!-- #if i18n -->
    global-not-found.tsx   the 404 for every unknown address (experimental.globalNotFound); own <html>, in the proxy's locale
    [locale]/              layout.tsx (<html lang>, NextIntlClientProvider, only the configured locales), page.tsx, not-found.tsx, error.tsx
<!-- #else -->
    page.tsx, not-found.tsx, error.tsx
<!-- #endif -->
  components/
    ui/                    shadcn primitives only: generated, never hand-edited, coverage-excluded
    layout/                app-layout, site-header, site-footer{{?i18n:, language-switcher}}{{?theme:, theme-toggle}}
    shared/                status-page, not-found-page{{?tables:, data-table}}
    home/                  welcome-section (the sample section)
  lib/                     api.ts, navigation.ts, date.ts, site.ts, utils.ts
  queries/                 retry.ts, stale-time.ts, then one folder per resource
<!-- #if i18n -->
  i18n/                    routing.ts, navigation.ts, request.ts, locale.ts, types.d.ts, locales/<lang>.json
<!-- #endif -->
  test/                    setup.ts, utils.tsx, next-router.ts: the only home of test helpers
<!-- #endif -->
```

Where new things go:

<!-- #if vite -->
- **A page:** create `src/pages/<name>-page.tsx` (thin: it stacks sections) and add `{ path, {{?i18n:titleKey}}{{?plain:title}}, component }` to `PAGES`{{?i18n:, plus the title key in every locale file}}. The registry test covers it at once. A page with params (`/items/:id`) omits the title, receives `params`, and calls `useDocumentTitle(record?.title || <fallback>)` itself. With more than one page, the header gets a `<nav>` from a `NAV_LINKS` table, `aria-current="page"` on the active link, and a mobile menu below a breakpoint.
- **Filters, tabs and paging:** the query string through `useSearchParams` from `@/lib/router/context`. Parse defensively (anything invalid reads as the default), correct stale values with `{ replace: true, scroll: false }`, and drop defaults from the URL.
<!-- #elif i18n -->
- **A page:** `src/app/[locale]/<route>/page.tsx`. It calls `setRequestLocale(await readLocale(params))`, and its `generateMetadata` returns a plain `title` from `getTranslations({ locale })`; the root template adds the site name. Every page gets a test that awaits it inside `NextIntlClientProvider`.
- **Filters and paging:** read them from `searchParams` on the server; change them with `router.replace(href, { scroll: false })` on the client.
<!-- #else -->
- **A page:** `src/app/<route>/page.tsx` with `export const metadata = { title: '…' }`; the root template adds the site name. Pages in the root segment (`app/page.tsx`, `app/not-found.tsx`) set an absolute title, because a template does not apply to its own segment. Every page gets a test.
- **Filters and paging:** read them from `searchParams` on the server; change them with `router.replace(href, { scroll: false })` on the client.
<!-- #endif -->
- **A section:** `src/components/<feature>/<name>-section.tsx`, with its test next to it.
- **A resource:** three files in `src/queries/<resource>/`, only for an endpoint that is confirmed. `apiRequest(path, Schema, { method, searchParams, body, headers, init })` sends JSON and validates the answer; `init` carries any other `fetch` option (`{ credentials: 'include' }`, `{ signal }`). A failed call throws an `ApiError` with `status`, `detail` (the API's own message, if any), `code` (its error code, or the last segment of a problem `type`) and `fieldErrors`. An endpoint that answers 204 is called with `z.undefined()` as its schema.

```ts
// type.ts
import * as z from 'zod'

export const ItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  tags: z.array(z.string()).default([]),
  published_at: z.string().nullable(),
  image_url: z.string().optional(),
})

export type Item = z.infer<typeof ItemSchema>
```

<!-- #if i18n -->
```ts
// query.ts
import { apiPagedRequest, apiRequest } from '@/lib/api'
import { ItemSchema } from './type'

export const ITEMS_PAGE_SIZE = 20

export type ItemListParams = { search?: string; page?: number }

export const getItems = async (
  locale: string,
  { search, page = 1 }: ItemListParams = {},
) =>
  apiPagedRequest('/items', ItemSchema, {
    searchParams: {
      locale,
      search: search?.trim() || undefined,
      limit: ITEMS_PAGE_SIZE,
      offset: (page - 1) * ITEMS_PAGE_SIZE,
    },
  })

export const getItem = async (id: string, locale: string) =>
  apiRequest(`/items/${encodeURIComponent(id)}`, ItemSchema, {
    searchParams: { locale },
  })
```

```ts
// options.ts
import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { getItem, getItems, type ItemListParams } from './query'

const all = ['items'] as const

export const itemKeys = {
  all,
  list: (locale: string, { search, page }: ItemListParams) =>
    [...all, 'list', locale, search?.trim() ?? '', page ?? 1] as const,
  detail: (id: string, locale: string) =>
    [...all, 'detail', id, locale] as const,
}

export function fetchItemsOptions(locale: string, params: ItemListParams = {}) {
  return queryOptions({
    queryKey: itemKeys.list(locale, params),
    queryFn: () => getItems(locale, params),
    placeholderData: keepPreviousData,
  })
}

export function fetchItemOptions(id: string, locale: string) {
  return queryOptions({
    queryKey: itemKeys.detail(id, locale),
    queryFn: () => getItem(id, locale),
  })
}
```
<!-- #else -->
```ts
// query.ts
import { apiPagedRequest, apiRequest } from '@/lib/api'
import { ItemSchema } from './type'

export const ITEMS_PAGE_SIZE = 20

export type ItemListParams = { search?: string; page?: number }

export const getItems = async ({ search, page = 1 }: ItemListParams = {}) =>
  apiPagedRequest('/items', ItemSchema, {
    searchParams: {
      search: search?.trim() || undefined,
      limit: ITEMS_PAGE_SIZE,
      offset: (page - 1) * ITEMS_PAGE_SIZE,
    },
  })

export const getItem = async (id: string) =>
  apiRequest(`/items/${encodeURIComponent(id)}`, ItemSchema)
```

```ts
// options.ts
import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { getItem, getItems, type ItemListParams } from './query'

const all = ['items'] as const

export const itemKeys = {
  all,
  list: ({ search, page }: ItemListParams) =>
    [...all, 'list', search?.trim() ?? '', page ?? 1] as const,
  detail: (id: string) => [...all, 'detail', id] as const,
}

export function fetchItemsOptions(params: ItemListParams = {}) {
  return queryOptions({
    queryKey: itemKeys.list(params),
    queryFn: () => getItems(params),
    placeholderData: keepPreviousData,
  })
}

export function fetchItemOptions(id: string) {
  return queryOptions({
    queryKey: itemKeys.detail(id),
    queryFn: () => getItem(id),
  })
}
```
<!-- #endif -->

  Components call `useQuery(fetchItemsOptions(…))` and spread the factory only to add an option such as `enabled`. While `isPlaceholderData` is true, the list shows `aria-busy` and `opacity-60`. A search box keeps its text in local state, waits for a `MIN_SEARCH_LENGTH`, and debounces what reaches the query with a `useDebouncedValue` hook in `src/hooks/use-debounced-value.ts`, added with the first search box.
- **A mutation:** a fetcher in `query.ts` such as `createItem = async (input: ItemInput) => apiRequest('/items', ItemSchema, { method: 'POST', body: input })`. The component runs it through `useMutation` and, on success, calls `queryClient.invalidateQueries({ queryKey: itemKeys.all })`. Its errors follow the failed-submit rule in the coding standards.
<!-- #if next -->
- **Server and client data:** first-render data is fetched in Server Components with the same `apiRequest`; choose caching per call through `init` (`{ cache: 'force-cache' }` or `{ next: { revalidate: N } }`). Interactive client data (search as you type, paging without navigation) uses TanStack Query, optionally prefetched on the server and handed over with `HydrationBoundary`. A 4xx in a detail page calls `notFound()`; anything else throws to `error.tsx`.
<!-- #if i18n -->
- **404 pages:** an unknown address never reaches a page. Unknown locales are unmatched (`dynamicParams = false` in `[locale]/layout.tsx`) and there is no catch-all route, so Next serves `app/global-not-found.tsx`, rendered on the server with status 404 in the proxy's locale. A `notFound()` called while a page renders (a missing record) shows `[locale]/not-found.tsx` instead; Next 16 draws that one in the browser, under the site title. Never add a catch-all route that calls `notFound()`: it would turn every unknown address into that browser-drawn kind.
<!-- #else -->
- **404 pages:** an unknown address gets `app/not-found.tsx`, rendered on the server with status 404. A `notFound()` called while a page renders (a missing record) shows the same page, but Next 16 draws it in the browser.
<!-- #endif -->
- **Server and client components:** components are Server Components unless they need state, effects, event handlers, browser APIs, TanStack Query hooks or context; those start with `'use client'` and stay small and near the leaves. Pass server data to them as serializable props. Never import server-only modules (secrets, `next/headers`) into client code; mark such modules with `import 'server-only'` and mock it as an empty module in tests.
<!-- #endif -->
<!-- #if vite -->
- **A persisted query:** public data the first screen draws may keep a localStorage copy, so a reload shows it at once and refetches only once it is stale. Add `src/queries/persisted.ts` with the first one, and spread `persisted(key, Schema, fetcher)` into the options in place of `queryFn`; the key includes everything the query key varies by. Every read re-validates the copy with the schema, a 4xx deletes it, and a 5xx or network failure keeps it on screen, so the section renders `data` before checking `isPending`/`isError`. Never persist per-user data. Test it with a `savePersisted(key, data, ageMs)` helper in `src/test/utils.tsx` that writes `query-cache:<key>` as `{ data, savedAt }`.

```ts
// src/queries/persisted.ts
import type * as z from 'zod'
import { ApiError } from '@/lib/api'
import { DEFAULT_STALE_TIME } from '@/queries/stale-time'

const PREFIX = 'query-cache:'

export const PERSISTED_MAX_AGE_MS = 24 * 60 * 60 * 1000

type Entry<T> = { data: T; savedAt: number }

export function removePersisted(key: string) {
  try {
    window.localStorage.removeItem(PREFIX + key)
  } catch {
    return
  }
}

export function writePersisted(key: string, data: unknown) {
  try {
    window.localStorage.setItem(
      PREFIX + key,
      JSON.stringify({ data, savedAt: Date.now() }),
    )
  } catch {
    return
  }
}

// Re-validated on read, so a copy saved by an older release, expired or tampered with is dropped instead of shown.
export function readPersisted<T>(
  key: string,
  schema: z.ZodType<T>,
  maxAge = PERSISTED_MAX_AGE_MS,
): Entry<T> | undefined {
  try {
    const raw = window.localStorage.getItem(PREFIX + key)
    if (!raw) return undefined
    const { data, savedAt } = JSON.parse(raw) as Partial<Entry<unknown>>
    const parsed = schema.safeParse(data)
    if (
      typeof savedAt === 'number' &&
      Date.now() - savedAt <= maxAge &&
      parsed.success
    ) {
      return { data: parsed.data, savedAt }
    }
  } catch {
    // An unreadable copy is dropped below like an expired one.
  }
  removePersisted(key)
  return undefined
}

function isGone(error: unknown) {
  return error instanceof ApiError && error.status >= 400 && error.status < 500
}

// Query options that keep the answer in localStorage: a reload shows the saved copy at once and refetches only once it is stale.
export function persisted<T>(
  key: string,
  schema: z.ZodType<T>,
  fetch: () => Promise<T>,
) {
  let entry: Entry<T> | undefined | null = null
  const stored = () => {
    if (entry === null) entry = readPersisted(key, schema)
    return entry
  }
  return {
    queryFn: async () => {
      try {
        const data = await fetch()
        writePersisted(key, data)
        return data
      } catch (error) {
        if (isGone(error)) removePersisted(key)
        throw error
      }
    },
    initialData: () => stored()?.data,
    initialDataUpdatedAt: () => stored()?.savedAt,
    staleTime: DEFAULT_STALE_TIME,
  }
}
```

  Its test covers a fresh read, dropping an expired, foreign-shaped, timeless or unreadable copy, blocked storage, initial data with its save time, saving a fresh answer, forgetting on a 404, and keeping the copy through a 503 and a network failure.
<!-- #endif -->
- **An env var:** add it to `.env.example`, {{?vite:`src/vite-env.d.ts`}}{{?next:`src/env.d.ts`}}, `test.env` in {{?vite:`vitest.config.ts`}}{{?next:`vitest.config.mts`}}, and every tracked `.env.<mode>` file, in the same change. Every {{?vite:`VITE_`}}{{?next:`NEXT_PUBLIC_`}} variable ships in the bundle, so never put a secret in one. Read it in as few modules as possible (ideally only `lib/api.ts`){{?next:, written out in full (`process.env.NEXT_PUBLIC_X`) so Next inlines it}}, and fail at module load when a required value is missing.
<!-- #if i18n -->
- **A translation key:** add it to every locale file in the same change; the parity test fails otherwise. Keys nest by area, then section, then item (`home.hero.title`). Language names are written in their own language in every file.
<!-- #endif -->
- **Styling tokens:** `src/{{CSS_ENTRY}}` holds two token layers. shadcn's semantic tokens (`bg-background`, `bg-primary`) belong to `components/ui`; app code uses the `brand-*` tokens and pairs every background with its `on-` color (`bg-brand-primary text-brand-on-primary`). Type tokens set size, line height and weight in one class (`text-brand-body-md`) and are named `--text-brand-display*`, `-headline*`, `-body*` or `-label*`: that prefix is how `cn` in `lib/utils.ts` tells a size from a colour. A custom shadow token is added to `lib/utils.ts` by its exact name. App code never uses the bare radius scale (`rounded-lg` follows shadcn's `--radius`); it uses `rounded-brand-*`, `rounded-full` or `rounded-none`, and a new radius is named after its role (`--radius-brand-card`).
- **shadcn primitives:** `components/ui/*` merge classes with the plain `cn` package, so a brand type size passed into a shadcn component loses to its own `text-sm`. Where a design needs its own size on such a part, use the Radix primitive (`AlertDialog as AlertDialogPrimitive` from `radix-ui`) for that part instead of the wrapper.
<!-- #if forms -->
- **Forms:** one zod schema per form, `useForm({ resolver: zodResolver(Schema) })`, and fields built from the `field`, `input` and `label` primitives. The API's error for a field shows under that field (rule on failed submits below).
<!-- #endif -->
<!-- #if tables -->
- **Tables:** `DataTable` in `components/shared/data-table.tsx` (TanStack Table v9: `useTable` with features from `tableFeatures`) takes `columns` and `data`, sorts, hides columns and pages; `serverPagination` hands paging to the API.
<!-- #endif -->
<!-- #if toasts -->
- **Success messages:** confirm a finished action with `toast.success('…')` from `sonner` (one `Toaster`, mounted in {{?vite:`main.tsx`}}{{?next:`app/providers.tsx`}}). Errors stay inline next to the form, and a whole-screen outcome stays a page state.
<!-- #endif -->

## Coding standards

Biome and oxlint enforce the rules they can: kebab-case file names, default exports only where listed, the zod namespace import, no `console.log`, no `forwardRef`, function-declaration components, no floating promises, no TODO or FIXME markers and no `@ts-` comments. The others are kept by review.

**Formatting and linting**

#. Biome formats everything. Run `pnpm lint:fix`; never format against it by hand.
#. `pnpm lint` (Biome + oxlint, zero warnings) and `pnpm typecheck` pass before a change is called done.
#. Suppress a rule only as `// biome-ignore <group>/<rule>: <concrete reason>`, for example `// biome-ignore lint/style/noNonNullAssertion: index.html always provides #root`. "see above" is not a reason. Never use `@ts-ignore`, `@ts-expect-error`, `eslint-disable` or `oxlint-disable`.

**Files, exports and naming**

#. File names are kebab-case: `scroll-to-top-button.tsx`, `use-debounced-value.ts`. The suffixes are `*-page.tsx`, `*-section.tsx`, `*-card.tsx`, `use-*.ts` and `*.test.ts(x)`. Use `.tsx` only for files with JSX.
<!-- #if vite && i18n -->
#. Use named exports, written as `export function Name()`. Default exports appear only where something requires them: the `App` entry, the i18n instance and tool config files.
<!-- #elif vite -->
#. Use named exports, written as `export function Name()`. Default exports appear only where something requires them: the `App` entry and tool config files.
<!-- #elif i18n -->
#. Use named exports, written as `export function Name()`. Default exports appear only where something requires them: tool config files, the Next.js special files (`page`, `layout`, `not-found`, `error`, `global-error`), `proxy.ts` and `i18n/request.ts`.
<!-- #else -->
#. Use named exports, written as `export function Name()`. Default exports appear only where something requires them: tool config files and the Next.js special files (`page`, `layout`, `not-found`, `error`, `global-error`).
<!-- #endif -->
#. Export one component per file. Small private subcomponents stay unexported in the same file. Constants may be exported next to a component.
#. Components are function declarations. Never write them as arrow constants, never use `React.FC`, and never use `forwardRef` (`ref` is a regular prop in React 19). Class components are only for error boundaries.
#. Names:
   - PascalCase components: `XxxSection`, `XxxPage`, `XxxCard`
   - `useXxx` hooks, `getXxx` fetchers, `fetchXxxOptions` query-option factories
   - `XxxSchema` zod schemas, with `type Xxx = z.infer<typeof XxxSchema>`
   - booleans that read as states: `isLoading`, `open`, `copied`
   - callback props `onXxx`, and handlers `handleXxx` or a verb (`goToPage`)
   - module-level constants, magic numbers and reused class strings in SCREAMING_SNAKE: `MIN_SEARCH_LENGTH`, `CARD_CLASS`
#. Props:
   - An inline object type on the destructured parameter for small components.
   - `interface XxxProps` when a component is page-level or has many props.
   - `type` for unions and intersections.
   - Defaults go in the destructuring.
   - Reusable components accept `className?: string` and merge it with `cn()`.
#. Use no enums, namespaces or parameter properties. Use `as const` arrays with derived union types instead: `type Kind = (typeof KINDS)[number]`.

**Imports**

#. Use the `@/` alias for every import across folders. Relative imports are only for siblings within one tight module (`queries/<resource>/*`{{?i18n:, `i18n/*`}}), and for a test importing the unit under test.
#. Type-only imports use `import type` or an inline `type` specifier. Import zod as `import * as z from 'zod'`, or `import type * as z from 'zod'` for types only. Use one import statement per module; Biome orders them.

**Styling**

#. Use Tailwind utilities only.
    - Compose class lists with `cn()` from `@/lib/utils`, never with template literals. It knows the brand type and radius tokens by name (4.6); a new shadow token is added to it by name.
    - Long or reused class strings become SCREAMING_SNAKE constants.
    - `cva` is used only inside `components/ui`.
    - The pattern is `cn(BASE, active ? ACTIVE : INACTIVE, flag && EXTRA, className)`.
#. App code uses the `brand-*` tokens, never a raw palette color (`neutral-200`) or a hex value in a class. shadcn's semantic tokens belong to `components/ui`. Use arbitrary values only where no token fits, such as container widths.
    - Radii are `rounded-brand-*`, `rounded-full` or `rounded-none`, never the bare scale (`rounded-lg`): shadcn remaps that scale to its `--radius`. A new radius token is named after its role (`--radius-brand-card`), not a size.
#. Mobile-first: base classes are for phones, then `sm:`, `md:`, `lg:`, `xl:`.
    - Spacing and sizes read from a desktop design frame (usually 1440px wide) go behind `lg:`. The base class gets a phone value: a 127px footer padding is `pb-10 lg:pb-[127px]`, never `pb-[127px]`. Check every new section at 375px before calling it done.
    - `size-*` for icons, and `gap-*` rather than margins.
    - `min-w-0 truncate` and `shrink-0` against overflow.
    - `motion-safe:` on animations, and state from data attributes (`data-[state=open]:`).
    - `scroll-mt-*` on anchor targets under a sticky header.
    - The section recipe: `<section className="w-full py-12 lg:py-16"><div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 md:px-14">`.
#. Every clickable element shows a pointer. The base CSS rule covers `button` and `[role="button"]`. Add `cursor-pointer` to anything else that is clickable, `disabled:cursor-not-allowed` to disabled controls, and `cursor-grab` to drag handles.
<!-- #if theme -->
#. Light + dark: every brand surface, border and text class has its `dark:` partner from the `-dark` tokens (`bg-brand-surface dark:bg-brand-surface-dark`). Never read `resolvedTheme` in the first render; gate it behind a hydrated flag as `ThemeToggle` does.
<!-- #else -->
#. The app is light only: write no `dark:` classes.
<!-- #endif -->

**Comments**

#. Comment only a special function or component, one whose purpose or behaviour is not obvious from the code: one line directly above it, never more (a normal sentence, not a paragraph). Ordinary code, JSX, props, tests and simple helpers get no comments. Never write multi-line explanation blocks.
#. Use no JSDoc blocks; the one-line rule above covers every comment.
#. Write no banner or divider comments, no end-of-line comments and no TODO, FIXME or HACK markers.
#. Delete dead code, together with its {{?i18n:translations, }}assets and tests. When asked to disable code temporarily, comment it out bare, with no explanatory note such as "hidden for now" or "kept for later".

**State and effects**

#. Where state lives:
    - Server state lives in TanStack Query.
    - URL state (filters, tabs, paging) lives in the query string, so a reload restores the view and a link shares it.
    - Local UI state uses `useState`.
<!-- #if vite && theme -->
    - Context is only for cross-cutting infrastructure (router, theme). There is no global store.
<!-- #elif vite -->
    - Context is only for cross-cutting infrastructure (router). There is no global store.
<!-- #elif theme -->
    - Context is only for cross-cutting infrastructure (theme, next-intl). There is no global store.
<!-- #else -->
    - Context is only for cross-cutting infrastructure (providers). There is no global store.
<!-- #endif -->
#. Derive values during render. Never mirror props or query data into state. Use `useMemo` and `useCallback` only for expensive work or for identities that matter.
#. `useEffect` is only for syncing with the outside world (listeners, timers, the document title, scrolling). It always has cleanup and never fetches data. Timer logic moves into a hook (`useDebouncedValue`).
#. Mark intentionally floating promises with `void`.
#. Wrap browser side effects that jsdom cannot perform (`location.reload`, `location.assign`) in tiny named functions in `lib/navigation.ts` (`reloadPage`, `leaveTo`). Each takes the browser object as a default parameter, so its own test passes a fake and every other test mocks the function. Call them as `onClick={() => reloadPage()}`: `onClick={reloadPage}` would pass the click event in as the location.

**Data layer**

#. All server access goes through `lib/api.ts` (zod-validated) and `queries/<resource>/{type,query,options}.ts`. Every response is validated, and schemas mirror the API's field names.
<!-- #if i18n -->
#. Query keys come from a keys factory: `[resource, 'list', locale, ...filters]` and `[resource, 'detail', id, locale]`, with defaults normalized. The locale is part of every localized key and request.
<!-- #else -->
#. Query keys come from a keys factory: `[resource, 'list', ...filters]` and `[resource, 'detail', id]`, with defaults normalized.
<!-- #endif -->
#. Encode path segments with `encodeURIComponent`, send page sizes explicitly, and leave blank searches out.
<!-- #if vite -->
#. Queries inherit `staleTime` and `gcTime` from the client defaults and override them only when they need to. Paged and searchable lists use `placeholderData: keepPreviousData`. Public data that the first screen draws may spread `persisted(key, Schema, fetcher)` from `@/queries/persisted` (see Architecture); per-user data is never persisted.
<!-- #else -->
#. Queries inherit `staleTime` and `gcTime` from the client defaults and override them only when they need to. Paged and searchable lists use `placeholderData: keepPreviousData`.
<!-- #endif -->

**UI states and errors**

#. Every data-driven section renders four states in one ternary chain:
    - loading: a skeleton shaped like the content, with `animate-pulse` on a brand surface token
    - error: {{?i18n:a translated message}}{{?plain:a message in the app's language}}, plus a retry through `refetch()` where useful
    - empty: {{?i18n:a translated message}}{{?plain:a message in the app's language}}
    - then the content
#. In detail views, a 4xx shows a not-found state inside the page frame. No answer, a 5xx or a bad shape shows the server error page (`isServerError`).
#. A failed submit shows the API's own message, not a hardcoded one:
    - `error.fieldErrors[name]` when the API returned one for that field, otherwise `error.detail`, goes directly under the input it concerns, in the error color. The input gets `aria-invalid` and `aria-describedby` pointing at it, and the message gets `role="alert"`. It clears as soon as the input changes.
    - Only when the API sent no message (`error.detail` is undefined) or did not answer (status 0) does the UI show a fixed{{?i18n:, translated}} message. An error that belongs to no field goes under the submit button.
    - Branch on `error.code` when the UI must react to one specific error; never replace the API's message with your own wording.{{?i18n: Every request sends the locale (in `searchParams` or an `Accept-Language` header), so the API answers in the user's language.}}{{?plain: `lib/api.ts` sends `Accept-Language: {{DEFAULT_LANG}}` with every request, so the API answers in the app's language.}}
#. Write `cond ? <X /> : null`, not `cond && <X />`.
#. `console.error` appears only in error boundaries{{?next: and `error.tsx`}}, with a context label. There is no stray `console.log`.

<!-- #if i18n -->
**i18n**

#. No hardcoded user-facing strings, including `aria-label`, `placeholder`, `alt` and `title`. The only exceptions are brand and product names and social network names.
<!-- #if vite -->
#. Keys nest by area, then section, then item. Keys held in data use `ParseKeys`. Data-driven lists are `as const` tables with template keys, such as ``t(`home.cards.${card.key}.title`)``.
<!-- #else -->
#. Keys nest by area, then section, then item. Keys held in data use next-intl's typed message keys. Data-driven lists are `as const` tables with template keys, such as ``t(`home.cards.${card.key}.title`)``.
<!-- #endif -->
<!-- #if vite -->
#. Every locale file changes in the same commit; the parity test enforces it. Plurals and interpolation use i18next's syntax (`{{name}}`, `_one`/`_other` keys).
<!-- #else -->
#. Every locale file changes in the same commit; the parity test enforces it. Plurals and interpolation use ICU syntax (`{name}`, `{count, plural, one {# item} other {# items}}`).
<!-- #endif -->
<!-- #endif -->

**Accessibility**

#. Use semantic landmarks (`header`, `nav`, `main`, `footer`, `section`, `article`). One `h1` per page, `h2` for sections and `h3` for cards. Use `ol`/`ul` for lists, and give tables `th scope`.
#. State goes through ARIA:
    - `aria-current="page"` on the active link, crumb or page number
    - `aria-pressed` on toggles, and `aria-expanded` on disclosures
    - `role="tablist"`/`tab` with `aria-selected`
    - `aria-live="polite"` on async results and form status
    - `aria-busy` while stale data shows
#. Labels and hiding:
    - Every icon-only button has a {{?i18n:translated}}{{?plain:written-out}} `aria-label`.
    - Every input has a `<label>`, visually hidden if need be, tied to it with an id from `useId()`.
    - Decorative icons and separators get `aria-hidden="true"`.
    - A mounted but hidden focusable element gets `tabIndex={-1}` and `aria-hidden`.
<!-- #if vite -->
#. Every `<button>` has an explicit `type`. Internal navigation uses real links (`AppLink`), never click handlers on non-links.
<!-- #elif i18n -->
#. Every `<button>` has an explicit `type`. Internal navigation uses real links (`Link` from `@/i18n/navigation`), never click handlers on non-links.
<!-- #else -->
#. Every `<button>` has an explicit `type`. Internal navigation uses real links (`Link` from `next/link`), never click handlers on non-links.
<!-- #endif -->
#. Links, images and motion:
    - External links get `target="_blank" rel="noopener noreferrer"`.
    - Decorative images get `alt=""`, images below the fold get `loading="lazy"`, and the LCP image gets `fetchPriority="high"`.
    - Respect `prefers-reduced-motion` for smooth scrolling and animation.

**Testing**

#. Every change ships with tests that cover it, and the per-file coverage gate (80% on lines, statements, functions and branches) passes. Never lower the thresholds, add coverage excludes for app code, or add coverage-ignore comments.
#. Tests sit next to their code as `name.test.ts(x)`, and helpers live only in `src/test/`. Import `describe`, `it`, `expect` and `vi` from `vitest` explicitly.
#. Test structure:
    - `describe('<Unit>')` with `it('<behaviour in present tense, from the user's point of view>')`. No "should", and `it` rather than `test`.
    - Arrange, act and assert are separated by blank lines.
    - Use `it.each` tables for input/output cases.
#. Query by role and accessible name first (`getByRole`, `findByRole`, `within`), then `getByLabelText`, then `getByText`. Use `querySelector` only with a comment saying why. No `data-testid`, and no snapshots.
#. Assert the real rendered {{?i18n:default-language }}strings{{?i18n:, not keys}}. Presence is `expect(screen.getByRole(...)).toBeTruthy()`, absence is `expect(screen.queryByRole(...)).toBeNull()`, and attributes are compared directly (`getAttribute('aria-pressed')`).
#. Mocking:
    - Mock only the network (`mockFetch`), third-party SDKs, and the tiny browser-API wrappers.
    - In tests, spy on browser APIs with `vi.spyOn` and never reassign them. Only `src/test/setup.ts` stubs what jsdom lacks.
    - Do not restore or clear mocks by hand; the setup file does.
    - Silence an expected React error log in that test with `vi.spyOn(console, 'error').mockImplementation(() => {})`.
#. Fixtures are factory functions with overrides. For async work, prefer `await findBy…`, then `waitFor`. Use fake timers only inside the test that needs them. Use `fireEvent`.
#. Cover the error, empty and loading branches, not just the happy path. {{?vite:Registered pages get the registry checks automatically, but their behaviour still needs its own tests.}}{{?next:Every page, layout and special file has its own test.}}

**Dependencies and process**

#. pnpm only. Add packages with `@latest`, using `-D` for build and test tools. shadcn primitives come from `pnpm dlx shadcn@latest add <name>`, followed by `pnpm lint:fix`. Never hand-edit `components/ui/*`, and delete primitives nothing uses.
#. Update README.md and CLAUDE.md in the same change whenever commands, versions or conventions change.

## Testing

- **Stack:** Vitest in jsdom, Testing Library, v8 coverage. No `.env` file and no running API are needed; {{?vite:`vitest.config.ts`}}{{?next:`vitest.config.mts`}} sets `{{API_ENV}}` in `test.env`.
- **Helpers in `src/test/utils.tsx`:**
<!-- #if vite -->
  - `renderWithProviders(ui, { path })`: a fresh QueryClient plus the router, at the given address.
<!-- #elif i18n -->
  - `renderWithProviders(ui, { path, locale, messages })`: a fresh QueryClient inside `NextIntlClientProvider`.
<!-- #else -->
  - `renderWithProviders(ui, { path })`: a fresh QueryClient at the given address.
<!-- #endif -->
  - `createTestQueryClient()`: retries off, so a failing request fails at once.
  - `mockFetch(handler)`: stubs `fetch`, routes on `url.pathname` and `url.searchParams`, returns `{ calls, fetchMock }`. A network failure is `mockFetch(() => Promise.reject(new TypeError('Failed to fetch')))`; a server error is `jsonResponse({ error: 'boom' }, 500)`.
  - `jsonResponse(body, status)`{{?vite:, and `clickLeftToBrowser(el, init)` for clicks the router must leave to the browser}}.
<!-- #if next -->
- **Next mocks** live in `src/test/setup.ts`: `next/navigation` (its router is `nextRouter` from `src/test/next-router.ts`, so a test asserts `nextRouter.push` and `nextRouter.replace`), `next/font/google`{{?i18n: and `next-intl/server`}}. Links are asserted by their `href`, not clicked. A Server Component is tested by awaiting it (`await Page({ params: Promise.resolve({ … }) } as never)`) and rendering the result.
<!-- #endif -->
- **`vi.mock`** is kept for third-party SDKs with side effects and for the browser-API wrappers in `lib/navigation.ts`, as a partial mock (`reloadPage: vi.fn()` over `importOriginal`).
- **`src/test/setup.ts`** stubs what jsdom lacks and restores mocks, timers, env, storage and the address after every test.
- **Pool:** Vitest runs in `vmThreads`: each file gets a fresh jsdom inside a reused worker, which halves the run. Its one limit is that a test cannot redefine non-configurable globals such as `window.location`; route such effects through `lib/navigation.ts` and mock that.
<!-- #if vite -->
- **The registry test** (`src/pages.test.tsx`) renders every fixed page in `PAGES`, checks its tab title, that neither the 404 nor the 500 page shows, and that every internal link resolves to a registered page.
<!-- #endif -->
- **Coverage:** `pnpm test` prints a table of the files below 100% and writes `coverage/index.html`. The gate is 80% per file on lines, statements, functions and branches; a file no test imports counts as 0% and fails the run.

## Before you call a change done

1. `pnpm lint`
2. `pnpm typecheck`
3. `pnpm test` (with the coverage gate)
4. `pnpm build`
5. README.md and CLAUDE.md updated if a command or convention changed.
