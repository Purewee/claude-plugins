# {{SITE_NAME}}

{{SITE_DESCRIPTION}}

## Stack

| Piece | Version |
|---|---|
<!-- #if vite -->
| React + Vite | {{V:react}} / {{V:vite}} |
<!-- #else -->
| Next.js (App Router) + React | {{V:next}} / {{V:react}} |
<!-- #endif -->
| TypeScript | {{V:typescript}} |
| Tailwind CSS + shadcn/ui | {{V:tailwindcss}} / {{V:shadcn}} |
| TanStack Query | {{V:@tanstack/react-query}} |
| zod | {{V:zod}} |
<!-- #if i18n && vite -->
| i18next + react-i18next | {{V:i18next}} / {{V:react-i18next}} |
<!-- #elif i18n -->
| next-intl | {{V:next-intl}} |
<!-- #endif -->
<!-- #if forms -->
| react-hook-form | {{V:react-hook-form}} |
<!-- #endif -->
<!-- #if tables -->
| TanStack Table | {{V:@tanstack/react-table}} |
<!-- #endif -->
<!-- #if toasts -->
| sonner | {{V:sonner}} |
<!-- #endif -->
<!-- #if theme || toasts -->
| next-themes | {{V:next-themes}} |
<!-- #endif -->
| Biome + oxlint | {{V:@biomejs/biome}} / {{V:oxlint}} |
| Vitest + Testing Library | {{V:vitest}} / {{V:@testing-library/react}} |

## Requirements

- Node.js {{NODE_LTS}} or newer
- pnpm {{PNPM_VERSION}} (the `packageManager` field; `corepack enable` picks it up)

## Getting started

```sh
pnpm install
pnpm dev
```

Set the API address first: copy `.env.example` to `.env` and fill in `{{API_ENV}}`, or edit the tracked `.env.development`.

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

## Environment variables

| Variable | Where | Meaning |
|---|---|---|
| `{{API_ENV}}` | `.env.development`, `.env.production` | Base URL of the API, including its path prefix (for example `https://api.example.com/api`), without a trailing slash |

Every {{?vite:`VITE_`}}{{?next:`NEXT_PUBLIC_`}} variable is compiled into the shipped bundle, so none of them may hold a secret.

## Tests

`pnpm test` runs Vitest once with coverage. Every file must reach 80% on lines, statements, functions and branches on its own; a file no test imports counts as 0%. The HTML report is `coverage/index.html`. Test helpers live in `src/test/`{{?vite:, and `src/pages.test.tsx` checks every registered page}}.

## Layout

<!-- #if vite -->
`src/pages/` holds thin pages registered in `src/pages.ts`; `src/components/<feature>/` holds their sections; `src/lib/` the API client, router and helpers; `src/queries/<resource>/` the zod schemas, fetchers and query options{{?i18n:; `src/i18n/` the translations}}.
<!-- #else -->
`src/app/` holds the routes{{?i18n: under `[locale]`}}; `src/components/<feature>/` holds their sections; `src/lib/` the API client and helpers; `src/queries/<resource>/` the zod schemas, fetchers and query options{{?i18n:; `src/i18n/` the routing and translations}}.
<!-- #endif -->

## Adding UI

`pnpm dlx shadcn@latest add <name>` adds a primitive to `src/components/ui/`; run `pnpm lint:fix` after it. Primitives are never edited by hand.
<!-- #if i18n -->

## Translations

The messages live in `src/i18n/locales/<lang>.json` ({{LANGS_TEXT}}). Keys are typed, so a missing or misspelled key is a compile error, and a parity test fails when one language lacks a key another has. Add every key to every file.
<!-- #endif -->

## Conventions

See `CLAUDE.md` for the coding standards, the architecture and where new things go.
