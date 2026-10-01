---
name: new-project
description: Run in the folder where a new project should go. Creates a React + Vite or Next.js app with the team setup (pnpm, strict TS, Tailwind v4 + shadcn, Biome + oxlint, TanStack Query, optional i18n, light/dark theme, Vitest 80% coverage gate) after one question form.
disable-model-invocation: true
---

# Frontend Project Bootstrap

> "The reference" below means the team's existing React 19 + Vite SPA that this setup was taken from. Only its setup, tests and coding standards carry over. No name, content, brand, API or host value of it belongs in the new project.

**Purpose.** You will create a new frontend project that follows one team's house setup:

- pnpm and strict TypeScript
- Tailwind CSS v4 with design tokens, and shadcn/ui
- Biome and oxlint
- a zod-validated API client with TanStack Query
- i18n when asked for
- a Vitest + Testing Library suite with a per-file coverage gate

**Both frameworks get the same house setup.** React + Vite and Next.js share the same tooling, lint and format rules, TypeScript strictness, Tailwind tokens and shadcn, API client, TanStack Query, i18n choice, test stack, coverage gate, test conventions, coding standards and CLAUDE.md. The framework only changes the files the framework itself owns: the scaffold, routing, the entry and layout files, the font loader and the env variable prefix. Neither path is a reduced version of the other; build the chosen one completely.

**Out of scope, always:** git, git hooks, CI, Docker, nginx, Kubernetes, Vercel and any other deployment. Never create, install or ask about them; the user adds them later.

First ask the one question form (section 1) and wait for the answers. Then:

1. Scaffold with the current official generators and install every package at its latest version.
2. Write the configuration, the app shell and the tests from this prompt.
3. Create `CLAUDE.md` and `README.md` so the rules outlive this session.
4. Run `pnpm lint:fix` once, and hand over (section 10). Do not run the tests, the type-check, a build or a server: the user runs `pnpm verify` afterwards.

Everything you need is in this prompt. The reference repository is not required.

## 0. Operating rules

### 0.0 Speed rules

The whole run, from the last answer to the final report, takes about 5 minutes. To stay inside it:

1. **Ask exactly one form (section 1), submitted once,** then print the coffee message and the decision record and start in the same turn. Never ask anything else; every other value has a default (1.3).
2. **Write files in bulk.** One Bash call writes a whole group of related files (a heredoc or a short Python script with many files), never one tool call per file.
3. **Copy, do not redesign.** The code blocks are complete, checked files, and carry only the comments rule 18 (section 8) allows; add none. Write them as given, with only the changes 1.4 lists for the answers. Do not read library docs or `node_modules` unless a command fails.
4. **Run no checks except `pnpm lint:fix` at the end.** No `pnpm test`, `typecheck`, `build`, `dev`, `start`, `outdated` or reinstall. If `lint:fix` reports an error, fix it and run `lint:fix` once more.
5. **Keep the final report short** (section 10).

### 0.1 General rules

1. **Ask first.** Your first message is the question form (1.1). Until it is answered you may only read, for example the current directory's name to suggest a project name. Create, install and change nothing.
2. **Latest versions only** (section 2). This prompt pins no package version on purpose.
3. **pnpm is the only package manager.** Use `pnpm add`, `pnpm dlx` and `pnpm exec`. Never use npm, yarn or npx.
4. **Never weaken a gate.** Do not lower the coverage threshold, add coverage-ignore comments, disable a lint rule for app code or relax a TypeScript flag.
5. **Invent no product content, endpoints or data.** The shell has one home page with a sample section, the 404 and 500 pages, and the infrastructure.
6. **Work only inside the target directory.** It must not exist yet, or must be empty. Never create it inside another project's repository; use a sibling folder instead.
7. **Keep a short "Deviations" list:** every place you did something other than this prompt says, and why (a renamed config key, a rejected generator flag, a held-back version). It goes into the final report.
8. **Placeholders.** UPPERCASE `{{TOKEN}}` placeholders, without a leading `$`, are filled from the decision record (1.3). Lowercase `{{name}}` or `{name}` inside locale files is i18n interpolation and stays literal.
9. **Code blocks are complete files unless marked as an excerpt.** Sections 3 to 6 are written for React + Vite; section 7 gives the Next.js version of every framework-owned file. For Next.js, follow 7.0 from start to finish. The code blocks are written for: built-in router, i18n on with `mn` default + `en`, envelope API, the light + dark theme off (light only). Section 1.4 lists what changes for other answers.
10. **If a generator or CLI rejects a flag this prompt gives,** run it without that flag, answer its prompts to the same effect, and record it.
11. **Edit `package.json` with a Node one-liner, never `pnpm pkg set` for scripts:** `pnpm pkg set` rejects keys with a colon such as `lint:fix`. Use `node -e "const f='package.json',p=require('./'+f);p.scripts={...};p.engines={node:'>={{NODE_LTS}}'};require('fs').writeFileSync(f,JSON.stringify(p,null,2)+'\n')"`.
12. **No command may wait for input or hang.** Wrap every generator and every `shadcn` call as `perl -e 'alarm 300; exec @ARGV' <command> < /dev/null`: input is closed, and a command that still hangs is killed after 5 minutes instead of stalling the run (normal runs take seconds; the limit only leaves room for a slow first download). Never wrap the `pnpm add` installs: they never prompt, and on a cold cache they can legitimately take several minutes. If one is killed, read its output, fix the cause (usually a leftover `components.json` or an undecided build script), and run it once more.

## 1. Interview

Open with one sentence on what you are about to build, then ask **one AskUserQuestion call with exactly these four questions**, so the user submits once and can walk away. Two to four options per question, a one-line description per option, the recommended option first with "(Recommended)" at the end of its label where one is recommended. Without the tool, send the same four as one numbered list and wait for one reply.

### 1.1 The form

1. **Framework.** The user's call: mark neither option as recommended, and say both get the identical house setup.
   - React + Vite SPA: client-rendered and served as static files.
   - Next.js (App Router): server rendering and per-page metadata.
2. **Project name.** Offer two kebab-case suggestions (for example `new-web-app`, `my-app`); the user types their own through "Other" as `name` or `name path`. The folder is a sibling of the current directory, never inside another repository. Normalize the answer to kebab-case (`test new prompt` becomes `test-new-prompt`).
3. **i18n:** "Do you want i18n (translations and a language switcher)?" The user's call: mark no option as recommended.
   - No i18n, Mongolian only
   - No i18n, English only
   - Yes, `mn` default + `en`
   - Yes, other languages (the user types the codes, default first; for no i18n in another language, the user types that language)
4. **Extras** (multi-select; submitting nothing means none):
   - Forms (react-hook-form + zod)
   - Tables (TanStack Table)
   - Toasts (sonner)
   - Light + dark theme, with a toggle (without it, the app is light only)

### 1.2 After the form is submitted

Before any tool call, print this message, so the user knows they can leave:

```markdown
# ☕ Building {{SITE_NAME}} now — about 6–8 minutes

Go get a coffee. Nothing else will be asked; the project will be ready at `{{TARGET_DIR}}` when you are back.
```

Then print the decision record (1.3) and start building in the same turn.

### 1.3 Decision record and defaults

Print one short table with every decision, then start building in the same turn. Only the four form answers are asked; everything else is fixed here:

| Token | Value |
|---|---|
| `{{FRAMEWORK}}`, `{{I18N}}`, `{{LANGS}}`, `{{DEFAULT_LANG}}`, `{{EXTRAS}}` | from the answers (`{{DEFAULT_LANG}}` is the only language when i18n is off) |
| `{{THEME}}` | light + dark with a toggle when that extra was ticked; otherwise light only |
| `{{API}}` | the envelope REST API (5.7). If the user said there is no backend, follow the "No API" row in 1.4 instead |
| `{{ROUTER}}` | the built-in router (5.3) for React; TanStack Router only when the user asks for it |
| `{{BRAND}}`, `{{FONT}}` | the placeholder palette and Inter (4.6); the tokens are swapped later |
| `{{APP_NAME}}`, `{{TARGET_DIR}}` | the kebab-case name, and its folder |
| `{{SITE_NAME}}` | the name in Title Case (`test-new-prompt` becomes `Test New Prompt`) |
| `{{SITE_DESCRIPTION}}` | "A new React web app." or "A new Next.js web app." |
| `{{API_URL_DEV}}`, `{{API_URL_PROD}}` | the literal placeholders `<API_URL_DEV>` and `<API_URL_PROD>`, listed in the final report; no staging file |
| `{{COVERAGE}}` | 80, per file, on lines, statements, functions and branches |
| `{{NEXT_OUTPUT}}` | `standalone` |
| `{{LOCALE_PREFIX}}` | `as-needed` (only the non-default languages carry a prefix) |
| `{{NODE_LTS}}`, `{{PNPM_VERSION}}` | from the preflight (3.1) |

### 1.4 What each answer changes

| Answer | Change |
|---|---|
| Next.js | Follow 7.0. Section 7 gives the Next.js version of every framework-owned file (7.1 lists them, 7.4a lists how each shared file is adapted); everything else is identical to React. |
| Next.js + no i18n | 7.8, with `<html lang>` and the font subsets set to the chosen language |
| TanStack Router | 5.4 replaces 5.3, including its test helpers, registry test and scripts. |
| No i18n (SPA) | <ul><li>`<html lang>` in index.html, the font subsets and every asserted string use the chosen language.</li><li>No i18next packages, no `src/i18n`, no language switcher, and no locale or i18n tests.</li><li>Strings live inline in components, in the one language.</li><li>`titleKey: ParseKeys` becomes `title: string`.</li><li>RootErrorBoundary uses plain strings.</li><li>Query keys and API calls drop the locale.</li><li>`setup.ts` loses the i18n import and its `beforeEach`.</li></ul> |
| No i18n (both) | Add no i18n at all: no i18next, react-i18next, detector or next-intl packages; no `src/i18n`, locale files, key types or language switcher; no locale in routes, query keys or API calls; no locale or parity tests; no i18n rules in CLAUDE.md. |
| Other languages | <ul><li>Change `supportedLanguages`, the resources map, the locale files, the RootErrorBoundary fallback strings, `<html lang>` in index.html and the font subsets.</li><li>In the tests: the default-language strings asserted in `welcome-section.test.tsx` and the other component tests, and the `it.each` table in `locales.test.ts` (one row per language that is not the reference language).</li><li>In `types.d.ts`: the reference file, if there is no English.</li><li>Next.js: `routing.ts`, the messages map and default in the `next-intl/server` mock, the `NextIntlClientProvider` locale in `renderWithProviders`, the `fonts.ts` subsets, and `global-error.tsx`'s `lang`.</li></ul> |
| Plain JSON API | <ul><li>In `lib/api.ts`, drop `envelopeSchema` and validate the body with the caller's schema directly.</li><li>Take the total from wherever the API reports it (a header such as `X-Total-Count`, or a body field), or remove `apiPagedRequest`.</li><li>Adjust the api tests to match.</li></ul> |
| No API | <ul><li>Skip `lib/api.ts`, `src/queries/`, TanStack Query and its provider (`providers.tsx` on Next.js).</li><li>Skip the API variable (`VITE_API_URL` or `NEXT_PUBLIC_API_URL`) in every place 4.7 lists: `.env*`, the env types, `test.env`.</li><li>Skip the `preconnect` links, and the `mockFetch`, `jsonResponse` and `createTestQueryClient` helpers.</li><li>Keep zod only for forms.</li><li>Keep the data-layer pattern in CLAUDE.md for when an API arrives.</li></ul> |
| Extras | 5.11 |
| Theme | 5.12 |

## 2. Version policy

**Install everything at `@latest`.**

- Add packages with `pnpm add <pkg>@latest` or `pnpm add -D <pkg>@latest`.
- Scaffold with `pnpm create vite@latest` or `pnpm create next-app@latest`, and run shadcn as `pnpm dlx shadcn@latest`.
- Generators pin their own versions, so upgrade everything a generator installed to `@latest` right after scaffolding.
- **One exception:** `@types/node` follows the Node major the app is built and served on: `pnpm add -D @types/node@{{NODE_LTS}}`. It is always an expected hold-back in `pnpm outdated`.

**The configs follow the current schemas, but are not pins.**

- In September 2026 the latest releases were TypeScript 7.0, Vite 8.3, Vitest 5.0, Biome 2.5, oxlint 1.86, Tailwind 4.3, shadcn 4.21, Next.js 16.3, next-intl 4.14, TanStack Router 1.170 and pnpm 12.6.
- The config keys used below were checked against those Biome, oxlint, Vitest and shadcn releases.

**When a newer major changes a config schema,** adapt with the tool's own migration command and docs instead of copying stale keys:

- `pnpm exec biome migrate --write`. Run it once after writing biome.json in any case; it also updates the `$schema` URL.
- `pnpm dlx @tailwindcss/upgrade@latest` for a Tailwind major.
- The official migration guide for TypeScript, Vite, Vitest, oxlint, Next.js, next-intl and TanStack Router.

Keep the intent (the rule, the threshold) and change only the syntax. Record every adaptation under Deviations.

**TypeScript 7** is the native compiler and ships no JavaScript compiler API.

- It worked with Next.js 16.3 and Vitest 5; install it as `@latest`.
- If any tool (Vitest, shadcn, `next build`, the TanStack router CLI) fails with an error about the TypeScript API, run `pnpm add -D typescript@^6` and record the hold-back and why.

**Build scripts.** pnpm refuses an install (`ERR_PNPM_IGNORED_BUILDS`) while a dependency's install script is undecided.

- Decide each package pnpm names, in `pnpm-workspace.yaml` (3.3), then re-run the same command.
- Use `pnpm approve-builds` or write the decision under `allowBuilds`, following the installed pnpm's docs if the key has changed.
- Allow a script only when the package does not work without it.

**Supply-chain checks.** Keep pnpm's checks switched on, including the release-age cooldown (`minimumReleaseAge`). If they hold back a version published only hours ago, accept the newest allowed version and list it in the report. Add a `minimumReleaseAgeExclude` entry only if the user asks.

**Never pass `--force`, and add no `overrides` to silence peer ranges.** If the newest plugin does not yet support the newest major of its host, use the newest compatible pair and record it.


## 3. Scaffold and install (React + Vite)

For Next.js, skip to 7.0, which gives the whole Next.js order.

### 3.0 Execution order (React + Vite)

1. Preflight (3.1)
2. Scaffold (3.2)
3. `pnpm-workspace.yaml` (3.3)
4. Configure:
   - `tsconfig*.json` (4.2)
   - `vite.config.ts` (4.3)
   - `src/index.css`: replace its content with the single line `@import "tailwindcss";`
5. Install (3.4)
6. shadcn init (3.5)
7. Clean the template (3.6), then the rest of section 4
8. Application shell (5)
9. Tests (6)
10. CLAUDE.md and README (9)
11. `pnpm lint:fix` and the final report (10)

### 3.1 Preflight

One Bash call: `node --version`, `pnpm --version`, and the active LTS major from `curl -s https://raw.githubusercontent.com/nodejs/Release/main/schedule.json` (the newest major whose `lts` date has passed and whose `maintenance` date has not). That major is `{{NODE_LTS}}`; `engines` and `@types/node` use it. A newer local Node is fine. If the local pnpm is behind `pnpm view pnpm version`, do not update it; record it under Deviations. `{{PNPM_VERSION}}` is the local version.

### 3.2 Generate

```sh
pnpm create vite@latest {{TARGET_DIR}} --template react-ts --no-eslint --no-interactive --no-immediate
cd {{TARGET_DIR}}
```

- The React Compiler is not part of the house setup. Use the `react-ts` template, never `react-compiler-ts`.
- The house setup has no ESLint and no Prettier. If the generator still wrote ESLint files, run `pnpm remove eslint @eslint/js eslint-plugin-react-hooks eslint-plugin-react-refresh globals typescript-eslint` and delete `eslint.config.js`.
- An oxlint config from the generator is replaced by 4.5.

### 3.3 pnpm-workspace.yaml

Write this before any install:

```yaml
packages:
  - "."
```

This file is where pnpm keeps project settings: the build-script decisions (section 2) and, only when the user asks, a `minimumReleaseAgeExclude` entry for an exact version.

### 3.4 Install

```sh
# Runtime
pnpm add react@latest react-dom@latest lucide-react@latest
pnpm add @tanstack/react-query@latest zod@latest        # without an API: zod only, and only for forms
pnpm add i18next@latest react-i18next@latest i18next-browser-languagedetector@latest   # i18n only
pnpm add @fontsource-variable/inter@latest              # the chosen font; skip for the system stack

# Build, lint and test tooling
pnpm add -D typescript@latest vite@latest @vitejs/plugin-react@latest \
  tailwindcss@latest @tailwindcss/vite@latest \
  @types/react@latest @types/react-dom@latest @types/node@{{NODE_LTS}} \
  @biomejs/biome@latest oxlint@latest \
  vitest@latest @vitest/coverage-v8@latest jsdom@latest \
  @testing-library/react@latest @testing-library/dom@latest

# TanStack Router only
pnpm add @tanstack/react-router@latest
pnpm add -D @tanstack/router-plugin@latest @tanstack/router-cli@latest
```

- `@testing-library/dom` is a required peer dependency of Testing Library React. Keep it even though nothing imports it.
- `@vitest/coverage-v8` must be on vitest's major.
- The router CLI is versioned separately from the router, so a different version number is not a mismatch.
- Nothing else is installed unless it was chosen as an extra or needed by the theme (5.11, 5.12). That rules out jest-dom, user-event, MSW and any snapshot tooling.
- Put every runtime package in one `pnpm add` and every dev package in one `pnpm add -D`, extras included.

### 3.5 shadcn/ui

The `@/*` alias (4.2 and 4.3) and `@import "tailwindcss";` as the first line of `src/index.css` must be in place first, because init checks both.

```sh
perl -e 'alarm 300; exec @ARGV' pnpm dlx shadcn@latest init -t vite -b radix -p nova --no-pointer --no-monorepo -y < /dev/null
```

- **Order matters.** Run init only after the installs in 3.4 succeeded. A failed install leaves init half-done with a `components.json` and no files; delete that file before running init again, or init stops at an overwrite prompt. Run every shadcn command wrapped as 0.1 rule 12 says.
- **The flags.**
  - `-b radix` uses the unified `radix-ui` package.
  - `-p nova` is the reference style, so `components.json` reads `"style": "radix-nova"`.
  - `--no-pointer` leaves the pointer-cursor rule to the house rule in 4.6. If the installed CLI has no such flag, drop it and replace whatever pointer rule init writes.
  - If the preset list has changed, run init interactively, pick the closest match (Radix base, neutral, lucide), and record it.
- **The resulting `components.json`:**
  - `$schema: "https://ui.shadcn.com/schema.json"`, `style: "radix-nova"`, `rsc: false`, `tsx: true`
  - `tailwind: { config: "", css: "src/index.css", baseColor: "neutral", cssVariables: true, prefix: "" }`
  - `iconLibrary: "lucide"`, `rtl: false`, `menuColor: "default"`, `menuAccent: "subtle"`, `registries: {}`
  - `aliases`: `components: "@/components"`, `utils: "@/lib/utils"`, `ui: "@/components/ui"`, `lib: "@/lib"`, `hooks: "@/hooks"`
  - Newer fields that init writes stay.
- **What init installs:** `radix-ui`, `class-variance-authority`, `tw-animate-css`, `shadcn` and the `cn` package.
  - `shadcn` stays a runtime dependency, because index.css imports `shadcn/tailwind.css` from it.
  - `cn` is shadcn's compiled replacement for clsx + tailwind-merge. It is used; never remove it as unused. `src/lib/utils.ts` becomes `export { cn } from 'cn'`.
  - If init writes clsx + tailwind-merge instead, keep that.
- **Font.** The preset installs and imports its own font package (`@fontsource-variable/geist` at the time of writing). Remove both when the project uses another font.
- **Button.** Init adds `src/components/ui/button.tsx`. Keep it when Forms or Tables were chosen; otherwise delete it while nothing uses it. `field` also pulls in `separator.tsx`; keep it.
- **Formatting.** Generated files use double quotes and semicolons, and `pnpm lint:fix` reformats them. That is the only change ever made to `src/components/ui/*`.
- **Adding primitives.** Add one only when a feature needs it: `pnpm dlx shadcn@latest add <name>`, then `pnpm lint:fix`.

### 3.6 Clean the template

- Delete the demo files: `src/App.css`, `src/assets/`, any demo icons in `public/`, and the template `README.md`. Section 9 writes a new README.
- `src/App.tsx` and `src/main.tsx` are rewritten in section 5.
- Keep `public/favicon.svg` until the project has its own icon set. The reference used `favicon.ico` (32×32), `favicon-96x96.png` and `apple-touch-icon.png`.

## 4. Configuration

### 4.1 package.json

Set `name` to `{{APP_NAME}}`, keep the `packageManager` field the generator wrote (add `pnpm@{{PNPM_VERSION}}` if it is missing), and write the scripts and `engines` with the Node one-liner from 0.1 rule 11. The scripts:

```json
{
  "dev": "vite",
  "build": "tsc -b && vite build",
  "preview": "vite preview",
  "typecheck": "tsc -b",
  "lint": "biome check --error-on-warnings . && oxlint --deny-warnings",
  "lint:fix": "biome check --write --error-on-warnings . && oxlint --fix --deny-warnings",
  "format": "biome format --write .",
  "test": "vitest run --coverage",
  "test:watch": "vitest",
  "verify": "pnpm lint && pnpm typecheck && pnpm test && pnpm build"
}
```

- `lint` covers formatting, import order and both linters. Both tools fail on warnings.
- `test` always measures coverage. There is no separate coverage script.
- `build` type-checks first, so a type error never ships.
- `verify` is what the user runs after the bootstrap.

### 4.2 TypeScript

Keep the generator's three-file layout and make the files read as follows. If the generator writes a newer `target` or `lib`, or any other extra option, keep it.

`tsconfig.json`:

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ],
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

`tsconfig.app.json`:

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "es2023",
    "lib": ["ES2023", "DOM"],
    "module": "esnext",
    "types": ["vite/client"],
    "allowArbitraryExtensions": true,
    "skipLibCheck": true,

    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,

    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
```

`tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "es2023",
    "lib": ["ES2023"],
    "types": ["node"],
    "skipLibCheck": true,

    "module": "nodenext",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,

    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["vite.config.ts", "vitest.config.ts"]
}
```

- `strict` is written out even though TypeScript 6 and later turn it on by default. The reference left it implicit.
- There is no `baseUrl`, which is deprecated since TypeScript 6. `paths` resolve relative to the tsconfig.
- The alias lives in three places: `tsconfig.json` (for the editor and the shadcn CLI), `tsconfig.app.json`, and `vite.config.ts`.
- `erasableSyntaxOnly` forbids enums, namespaces and constructor parameter properties.
- `verbatimModuleSyntax` makes type-only imports say `type`.
- `allowImportingTsExtensions` allows `import App from '@/App.tsx'`.
- Both config files are in `tsconfig.node.json`'s `include`, so `tsc -b` checks them. Tests live in `src`, so it checks the tests too.
- `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes` are off, as in the reference. Turn them on only if the user asks for more strictness.

### 4.3 vite.config.ts

```ts
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})
```

If the API only accepts listed origins during development, pin the dev port too: `server: { port: <port>, strictPort: true }`.

### 4.4 biome.json

Set `$schema` to the installed version's URL (`pnpm exec biome --version`); `biome migrate --write` keeps it current.

```json
{
  "$schema": "https://biomejs.dev/schemas/2.5.14/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "files": {
    "ignoreUnknown": false,
    "includes": ["**", "!public", "!dist", "!coverage", "!.next", "!out"]
  },
  "css": {
    "parser": {
      "tailwindDirectives": true
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2
  },
  "linter": {
    "enabled": true,
    "rules": {
      "preset": "recommended",
      "correctness": {
        "useExhaustiveDependencies": "error"
      },
      "style": {
        "useImportType": "error"
      }
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "semicolons": "asNeeded"
    }
  },
  "assist": {
    "enabled": true,
    "actions": {
      "source": {
        "organizeImports": "on"
      }
    }
  }
}
```

- **The resulting format:**
  - 2-space indent
  - single quotes in JS and TS, or double quotes when the string itself contains a single quote
  - double quotes in JSX attributes and CSS
  - no semicolons
  - trailing commas everywhere
  - LF line endings and 80 columns
- **The reference used only the `recommended` preset.** The two error-level rules are house additions.
- **Ignored paths.** The explicit `!dist`, `!coverage`, `!.next` and `!out` entries keep build output out even without a git repository, where `useIgnoreFile` does nothing.
- **Domains.** Biome enables its React and test rule domains automatically from package.json.
- **shadcn primitives.** If a newly added primitive fails only on a house rule that is stricter than `recommended`, turn that rule off for `src/components/ui/**` with a Biome `overrides` entry. Never edit the primitive by hand.

### 4.5 .oxlintrc.json

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "categories": {
    "correctness": "error"
  },
  "ignorePatterns": ["dist", "coverage", ".next", "out"],
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  },
  "overrides": [
    {
      "files": ["src/components/ui/**"],
      "rules": {
        "react/only-export-components": "off"
      }
    }
  ]
}
```

- The override exists because `buttonVariants` exported next to `Button` is library code.
- `--deny-warnings` in the scripts turns every warning into a failure.
- If a newer oxlint renames a rule (for example to `react-hooks/rules-of-hooks`), use the new name.
- `react/only-export-components` is the Vite Fast Refresh rule. A `.tsx` file exports only components, plus constants. Hooks, helpers and contexts go in `.ts` files.
- How the work is split: Biome formats, sorts imports and lints broadly (a11y, correctness, security, style). oxlint enforces the hooks and Fast Refresh rules. `tsc -b` checks types.

### 4.6 src/index.css

Merge into what shadcn init wrote. Keep its imports, the `dark` custom variant, the `:root` and `.dark` token blocks, the `--color-*: var(--*)` mappings, the `--radius-*` scale, and any other variables it defines. Then:

- Replace the preset's font import and `--font-sans`.
- Add the brand tokens to the same `@theme inline` block.
- Add the house base rules.

This is an excerpt, with the Material 3 baseline as the placeholder palette:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "@fontsource-variable/inter";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --font-sans: "Inter Variable", ui-sans-serif, system-ui, sans-serif;

  /* Brand colors, named by Material 3 color role: each background has its on- partner. */
  --color-brand-primary: #6750a4;
  --color-brand-on-primary: #ffffff;
  --color-brand-primary-container: #eaddff;
  --color-brand-on-primary-container: #21005d;
  --color-brand-primary-hover: #4f378b;
  --color-brand-secondary: #625b71;
  --color-brand-on-secondary: #ffffff;
  --color-brand-secondary-container: #e8def8;
  --color-brand-on-secondary-container: #1d192b;
  --color-brand-tertiary: #7d5260;
  --color-brand-on-tertiary: #ffffff;
  --color-brand-tertiary-container: #ffd8e4;
  --color-brand-on-tertiary-container: #31111d;
  --color-brand-error: #b3261e;
  --color-brand-on-error: #ffffff;
  --color-brand-error-container: #f9dedc;
  --color-brand-on-error-container: #410e0b;
  --color-brand-background: #fffbfe;
  --color-brand-on-background: #1c1b1f;
  --color-brand-surface: #fffbfe;
  --color-brand-on-surface: #1c1b1f;
  --color-brand-surface-variant: #e7e0ec;
  --color-brand-on-surface-variant: #49454f;
  --color-brand-surface-container-lowest: #ffffff;
  --color-brand-surface-container-low: #f7f2fa;
  --color-brand-surface-container: #f3edf7;
  --color-brand-surface-container-high: #ece6f0;
  --color-brand-surface-container-highest: #e6e0e9;
  --color-brand-outline: #79747e;
  --color-brand-outline-variant: #cac4d0;
  --color-brand-inverse-surface: #313033;
  --color-brand-inverse-on-surface: #f4eff4;

  /* Type scale: one class sets size, line height and weight together. */
  --text-brand-display: 3rem;
  --text-brand-display--line-height: 3.5rem;
  --text-brand-display--font-weight: 800;
  --text-brand-display-mobile: 2rem;
  --text-brand-display-mobile--line-height: 2.5rem;
  --text-brand-display-mobile--font-weight: 800;
  --text-brand-headline-xl: 2.25rem;
  --text-brand-headline-xl--line-height: 2.75rem;
  --text-brand-headline-xl--font-weight: 700;
  --text-brand-headline-xl-mobile: 1.625rem;
  --text-brand-headline-xl-mobile--line-height: 2.125rem;
  --text-brand-headline-xl-mobile--font-weight: 700;
  --text-brand-headline-lg: 1.75rem;
  --text-brand-headline-lg--line-height: 2.25rem;
  --text-brand-headline-lg--font-weight: 700;
  --text-brand-headline-md: 1.375rem;
  --text-brand-headline-md--line-height: 1.875rem;
  --text-brand-headline-md--font-weight: 600;
  --text-brand-headline-sm: 1.125rem;
  --text-brand-headline-sm--line-height: 1.625rem;
  --text-brand-headline-sm--font-weight: 600;
  --text-brand-body-lg: 1.125rem;
  --text-brand-body-lg--line-height: 1.75rem;
  --text-brand-body-lg--font-weight: 400;
  --text-brand-body-md: 1rem;
  --text-brand-body-md--line-height: 1.5rem;
  --text-brand-body-md--font-weight: 400;
  --text-brand-body-sm: 0.875rem;
  --text-brand-body-sm--line-height: 1.25rem;
  --text-brand-body-sm--font-weight: 400;
  --text-brand-label-md: 0.875rem;
  --text-brand-label-md--line-height: 1.125rem;
  --text-brand-label-md--font-weight: 600;
  --text-brand-label-sm: 0.75rem;
  --text-brand-label-sm--line-height: 1rem;
  --text-brand-label-sm--font-weight: 600;
  --text-brand-label-eyebrow: 0.6875rem;
  --text-brand-label-eyebrow--line-height: 1rem;
  --text-brand-label-eyebrow--font-weight: 700;

  --radius-brand-lg: 0.5rem;
  --radius-brand-xl: 0.75rem;

  /* ...shadcn's --color-*: var(--*) mappings and --radius-* scale follow, unchanged */
}

/* ...the :root and .dark blocks from shadcn init, unchanged */

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
  html {
    @apply font-sans;
  }
  /* Tailwind v4 dropped the pointer cursor on buttons; restore it site-wide */
  button:not(:disabled),
  [role="button"]:not([aria-disabled="true"]) {
    cursor: pointer;
  }
}
```

- **There are two token layers.**
  - shadcn's semantic tokens (`bg-background`, `bg-primary`) belong to `components/ui`.
  - App code uses the `brand-*` tokens, and pairs every background with its `on-` color: `bg-brand-primary text-brand-on-primary`.
- **Type tokens** set size, line height and weight in one class (`text-brand-body-md`). Mobile and desktop pairs read `text-brand-headline-xl-mobile md:text-brand-headline-xl`.
- **Custom brand colors.** Derive every role so that each pair meets WCAG AA contrast (4.5:1 for body text). Add Material 3 `-fixed` and `-fixed-dim` roles, or extra named neutrals, only when the design needs them.
- **The system font stack.** Drop the font import and set `--font-sans: ui-sans-serif, system-ui, sans-serif;`.
- **Only when a design needs one:**
  - a custom breakpoint, for example `@theme { --breakpoint-nav: 1240px; }`, which gives the `nav:` variant for "the menu collapses below this width"
  - a scoped rich-text class in `@layer components`
- **Dark mode is class-based:** `.dark` on `<html>`. Only the dark-mode extra adds that class. Without it, write no `dark:` classes.

### 4.7 Environment variables

The files:

| File | Tracked | Holds |
|---|---|---|
| `.env.example` | yes | Every variable, each with an explanation |
| `.env.development` | yes | `VITE_API_URL={{API_URL_DEV}}` |
| `.env.production` | yes, always | `VITE_API_URL={{API_URL_PROD}}`, or `<API_URL_PROD>` |
| `.env` and `*.local` | no (git-ignored) | Machine-only overrides |

`.env.example`:

```sh
# Base URL of the API, including the path prefix every route is mounted under (for example
# /api). No trailing slash.
VITE_API_URL=
```

`src/vite-env.d.ts`:

```ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

1. **Every client variable starts with `VITE_`** and is compiled into the shipped bundle, so it is public. Never put a secret in one. That is also why the per-mode files can be tracked.
2. **Declare every variable** as `readonly NAME: string` in `src/vite-env.d.ts`.
3. **Read `import.meta.env` in as few modules as possible,** ideally only `lib/api.ts`, and fail at module load when a required value is missing.
4. **Tests need no env file.** `vitest.config.ts` sets placeholder values in `test.env`.
5. **A build picks its environment with a Vite mode:** `pnpm build --mode <mode>` loads `.env.<mode>`.
6. **A new variable goes into four places in the same change:** `.env.example`, `vite-env.d.ts`, `test.env`, and every tracked mode file.

### 4.8 index.html

```html
<!doctype html>
<html lang="mn">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>{{SITE_NAME}}</title>
    <meta name="description" content="{{SITE_DESCRIPTION}}" />
    <link rel="preconnect" href="%VITE_API_URL%" crossorigin />
    <link rel="preconnect" href="%VITE_API_URL%" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- **Preconnect.** Vite fills in `%VITE_API_URL%` at build time. There are two preconnects: the `crossorigin` one serves CORS `fetch`, and the plain one serves images. Drop both when there is no API.
- **`lang`** starts as the default language. `src/i18n/config.ts` keeps it in step afterwards.
- **Link cards.** When links will be shared, add Open Graph and Twitter card tags (`og:image` 1200×630, `twitter:card` `summary_large_image`) with an absolute image URL.

### 4.9 .gitignore and editor

```gitignore
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Dependencies and build output
node_modules
dist
dist-ssr
*.local
*.tsbuildinfo

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Local env overrides. The tracked .env.<mode> files hold public values only (every VITE_
# variable ends up in the shipped bundle); .env and *.local stay on this machine.
.env

# Coverage report written by pnpm test
coverage
```

`.vscode/extensions.json`:

```json
{ "recommendations": ["biomejs.biome", "oxc.oxc-vscode"] }
```

## 5. Application shell

### 5.1 Folder structure

```text
src/
  main.tsx                 entry: providers; i18n and CSS side-effect imports
  App.tsx                  route switch, tab title, #hash scroll, page error boundary
  pages.ts                 PAGES registry { path, titleKey, component } + findPage()
  index.css                Tailwind v4, shadcn tokens, brand tokens
  vite-env.d.ts            typed VITE_ variables
  components/
    ui/                    shadcn primitives only: generated, never hand-edited, coverage-excluded
    layout/                app-layout, site-header, site-footer, language-switcher
    shared/                app-link, status-page, page-error-boundary, root-error-boundary
    <feature>/             one folder per page or feature: <name>-section.tsx, <name>-card.tsx
  pages/                   thin <name>-page.tsx files that stack sections; not-found-page, server-error-page
  hooks/                   shared use-*.ts hooks (a hook used by one feature stays in that folder)
  lib/                     framework-free helpers: api.ts, router/, navigation.ts, site.ts, utils.ts
  queries/
    <resource>/            type.ts (zod schemas, types), query.ts (fetchers), options.ts (keys, query options)
    retry.ts               shared retry policy
    stale-time.ts          shared cache timing
  i18n/                    config.ts, types.d.ts, locales/<lang>.json
  test/                    setup.ts, utils.tsx: the only home of test helpers
```

With TanStack Router, these replace `App.tsx`, `pages.ts`, `lib/router/` and `app-link.tsx`:

- `src/routes/` (the route files)
- `src/router.ts`
- the generated `src/routeTree.gen.ts`

### 5.2 Entry point

`src/main.tsx`:

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/App.tsx'
import { RootErrorBoundary } from '@/components/shared/root-error-boundary'
import { retryFailedRequest } from '@/queries/retry'
import { DEFAULT_GC_TIME, DEFAULT_STALE_TIME } from '@/queries/stale-time'
import '@/i18n/config'
import '@/index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: DEFAULT_STALE_TIME,
      gcTime: DEFAULT_GC_TIME,
      refetchOnWindowFocus: false,
      retry: retryFailedRequest,
    },
  },
})

// biome-ignore lint/style/noNonNullAssertion: index.html always provides #root
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </RootErrorBoundary>
  </StrictMode>,
)
```

`src/lib/site.ts`:

```ts
export const SITE_NAME = '{{SITE_NAME}}'
```

`src/hooks/use-document-title.ts`:

```ts
import { useEffect } from 'react'
import { SITE_NAME } from '@/lib/site'

export function useDocumentTitle(title?: string, enabled = true) {
  useEffect(() => {
    if (!enabled) return
    document.title = title ? `${title} | ${SITE_NAME}` : SITE_NAME
  }, [title, enabled])
}
```

### 5.3 Built-in router

The router is about 150 lines with no dependency:

- The address is React state, and the back and forward buttons stay in sync with it.
- The layout stays mounted across navigations.
- Query strings hold shareable view state: filters, tabs and paging.

It is split into three files so its hooks do not break Fast Refresh. Param routes go through one matcher, so detail pages need no hard-coded prefixes.

`src/lib/router/match.ts`:

```ts
export type RouteParams = Record<string, string>

export function normalizePath(path: string) {
  const [pathname] = path.split(/[?#]/)
  return pathname.length > 1 ? pathname.replace(/\/+$/, '') || '/' : pathname
}

export function matchPath(
  pattern: string,
  pathname: string,
): RouteParams | null {
  const expected = pattern.split('/').filter(Boolean)
  const actual = pathname.split('/').filter(Boolean)
  if (expected.length !== actual.length) return null

  const params: RouteParams = {}
  for (const [index, segment] of expected.entries()) {
    const value = actual[index]
    if (segment.startsWith(':')) {
      try {
        params[segment.slice(1)] = decodeURIComponent(value)
      } catch {
        return null
      }
    } else if (segment !== value) {
      return null
    }
  }
  return params
}
```

`src/lib/router/context.ts`:

```ts
import {
  createContext,
  type MouseEvent,
  useCallback,
  useContext,
  useMemo,
} from 'react'

export interface NavigateOptions {
  replace?: boolean
  scroll?: boolean
}

interface RouterContextValue {
  path: string
  search: string
  navigate: (to: string, options?: NavigateOptions) => void
}

export const RouterContext = createContext<RouterContextValue | null>(null)

export function useRouter() {
  const ctx = useContext(RouterContext)
  if (!ctx) throw new Error('useRouter must be used within a RouterProvider')
  return ctx
}

export function useSearchParams() {
  const { search, navigate } = useRouter()
  const params = useMemo(() => new URLSearchParams(search), [search])

  const setParams = useCallback(
    (changes: Record<string, string | null>, options?: NavigateOptions) => {
      const next = new URLSearchParams(window.location.search)
      for (const [key, value] of Object.entries(changes)) {
        if (value === null) {
          next.delete(key)
        } else {
          next.set(key, value)
        }
      }
      const query = next.toString()
      navigate(
        `${window.location.pathname}${query ? `?${query}` : ''}`,
        options,
      )
    },
    [navigate],
  )

  return [params, setParams] as const
}

type LinkClick = Pick<
  MouseEvent,
  'defaultPrevented' | 'button' | 'metaKey' | 'ctrlKey' | 'shiftKey' | 'altKey'
>

export function isNavigableClick(
  event: LinkClick,
  href: string,
  link?: Pick<HTMLAnchorElement, 'target' | 'hasAttribute'>,
) {
  return (
    !event.defaultPrevented &&
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey &&
    href.startsWith('/') &&
    !href.startsWith('//') &&
    (!link ||
      ((link.target === '' || link.target === '_self') &&
        !link.hasAttribute('download')))
  )
}

export function useInternalLinkClick(href: string) {
  const { navigate } = useRouter()
  return useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      if (!isNavigableClick(event, href, event.currentTarget)) return
      event.preventDefault()
      navigate(href)
    },
    [href, navigate],
  )
}
```

`src/lib/router/provider.tsx`:

```tsx
import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { type NavigateOptions, RouterContext } from '@/lib/router/context'

function readLocation() {
  return { path: window.location.pathname, search: window.location.search }
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState(readLocation)

  useEffect(() => {
    const onPopState = () => setLocation(readLocation())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const navigate = useCallback(
    (to: string, { replace = false, scroll = true }: NavigateOptions = {}) => {
      const next = new URL(to, window.location.href)
      const target = `${next.pathname}${next.search}`
      const current = `${window.location.pathname}${window.location.search}`

      if (target !== current) {
        const href = `${target}${next.hash}`
        if (replace) {
          window.history.replaceState({}, '', href)
        } else {
          window.history.pushState({}, '', href)
        }
        setLocation({ path: next.pathname, search: next.search })
      }

      if (scroll) window.scrollTo({ top: 0 })
    },
    [],
  )

  const value = useMemo(() => ({ ...location, navigate }), [location, navigate])

  return <RouterContext value={value}>{children}</RouterContext>
}
```

`src/components/shared/app-link.tsx`:

```tsx
import type { AnchorHTMLAttributes } from 'react'
import { useInternalLinkClick } from '@/lib/router/context'

type AppLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

export function AppLink({ href, onClick, ...props }: AppLinkProps) {
  const handleInternalClick = useInternalLinkClick(href)

  return (
    <a
      href={href}
      onClick={(event) => {
        onClick?.(event)
        handleInternalClick(event)
      }}
      {...props}
    />
  )
}
```

`src/lib/navigation.ts` holds browser side effects that jsdom cannot perform. They live in small named functions, so a test can mock exactly them.

```ts
export function goBack(navigate: (to: string) => void) {
  if (window.history.length > 1) {
    window.history.back()
  } else {
    navigate('/')
  }
}

export function reloadPage() {
  window.location.reload()
}
```

`src/pages.ts`:

```ts
import type { ParseKeys } from 'i18next'
import type { ComponentType } from 'react'
import { matchPath, normalizePath, type RouteParams } from '@/lib/router/match'
import { HomePage } from '@/pages/home-page'

export type SitePage = {
  path: string
  titleKey?: ParseKeys
  component: ComponentType<{ params: RouteParams }>
}

export const PAGES: SitePage[] = [
  { path: '/', titleKey: 'home.title', component: HomePage },
]

export function findPage(path: string) {
  const pathname = normalizePath(path)
  for (const page of PAGES) {
    const params = matchPath(page.path, pathname)
    if (params) return { page, params, pathname }
  }
  return null
}
```

`src/App.tsx`:

```tsx
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { AppLayout } from '@/components/layout/app-layout'
import { PageErrorBoundary } from '@/components/shared/page-error-boundary'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { useRouter } from '@/lib/router/context'
import { RouterProvider } from '@/lib/router/provider'
import { findPage } from '@/pages'
import { NotFoundPage } from '@/pages/not-found-page'

function App() {
  return (
    <RouterProvider>
      <AppContent />
    </RouterProvider>
  )
}

function AppContent() {
  const { path } = useRouter()
  const { t } = useTranslation()
  const match = findPage(path)
  useDocumentTitle(
    match?.page.titleKey ? t(match.page.titleKey) : t('errors.notFound.title'),
    !match || Boolean(match.page.titleKey),
  )

  // biome-ignore lint/correctness/useExhaustiveDependencies: path is not read; it re-runs the #hash scroll whenever the page changes
  useEffect(() => {
    const hash = window.location.hash
    if (!hash) return
    document.getElementById(hash.slice(1))?.scrollIntoView()
  }, [path])

  const Page = match?.page.component

  return (
    <AppLayout>
      <PageErrorBoundary key={match?.pathname ?? path}>
        {Page && match ? <Page params={match.params} /> : <NotFoundPage />}
      </PageErrorBoundary>
    </AppLayout>
  )
}

export default App
```

`src/pages/home-page.tsx`:

```tsx
import { WelcomeSection } from '@/components/home/welcome-section'

export function HomePage() {
  return <WelcomeSection />
}
```

**Adding a page:**

1. Create `src/pages/<name>-page.tsx`. Keep it thin: it stacks sections from `components/<feature>/`.
2. Add `{ path, titleKey, component }` to `PAGES`.
3. Add the `titleKey` to every locale file.

The registry tests (6.5) cover the page immediately.

- **A page with params** (`/items/:id`) receives `params`, omits `titleKey`, and calls `useDocumentTitle(record?.title || t('<area>.crumb'))` itself.
- **Filters and paging** live in the query string through `useSearchParams`:
  - Parse defensively: anything invalid reads as the default.
  - Correct stale values with `{ replace: true, scroll: false }`.
  - Drop default values from the URL.

### 5.4 TanStack Router instead

**Scripts.** Merge these. The route tree must exist before `tsc` or the tests run, because tests run without the plugin.

```json
{
  "scripts": {
    "routes": "tsr generate",
    "typecheck": "pnpm routes && tsc -b",
    "build": "pnpm routes && tsc -b && vite build",
    "test": "pnpm routes && vitest run --coverage"
  }
}
```

**`vite.config.ts` with the router plugin:**

```ts
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    process.env.VITEST
      ? null
      : tanstackRouter({ target: 'react', autoCodeSplitting: true }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})
```

**`src/router.ts`:**

```ts
import { createRouter, type RouterHistory } from '@tanstack/react-router'
import type { ParseKeys } from 'i18next'
import { NotFoundPage } from '@/pages/not-found-page'
import { ServerErrorPage } from '@/pages/server-error-page'
import { routeTree } from '@/routeTree.gen'

export function createAppRouter(history?: RouterHistory) {
  return createRouter({
    routeTree,
    history,
    defaultPreload: 'intent',
    scrollRestoration: true,
    defaultNotFoundComponent: NotFoundPage,
    defaultErrorComponent: ServerErrorPage,
  })
}

export const router = createAppRouter()

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
  interface StaticDataRouteOption {
    titleKey?: ParseKeys
  }
}
```

**`src/routes/__root.tsx`:**

```tsx
import { createRootRoute } from '@tanstack/react-router'
import { RootLayout } from '@/components/layout/root-layout'

export const Route = createRootRoute({ component: RootLayout })
```

**`src/routes/index.tsx`:**

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '@/pages/home-page'

export const Route = createFileRoute('/')({
  staticData: { titleKey: 'home.title' },
  component: HomePage,
})
```

**`src/components/layout/root-layout.tsx`:**

```tsx
import { Outlet, useMatches } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { AppLayout } from '@/components/layout/app-layout'
import { useDocumentTitle } from '@/hooks/use-document-title'

export function RootLayout() {
  const { t } = useTranslation()
  const titleKey = useMatches().findLast((match) => match.staticData.titleKey)
    ?.staticData.titleKey
  useDocumentTitle(titleKey ? t(titleKey) : undefined, Boolean(titleKey))

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  )
}
```

**Wiring and links:**

- `main.tsx` renders `<RouterProvider router={router} />` in place of `<App />`. `RouterProvider` comes from `@tanstack/react-router`, and `router` from `@/router`.
- Links are `<Link to="/">` from `@tanstack/react-router`, which handles modifier-key clicks itself.
- In the 404 and 500 pages, use `const navigate = useNavigate()` and `goBack(() => navigate({ to: '/' }))`. `NotFoundPage` also calls `useDocumentTitle(t('errors.notFound.title'))`.

**Route files:**

- A route file only declares `export const Route = …` and imports its component from `pages/` or `components/`. A component defined inside a route file breaks the Fast Refresh rule.
- `src/routeTree.gen.ts` is generated by `pnpm routes`, `pnpm dev` and `pnpm build`. Commit it, and regenerate it after adding or renaming a route.
- Exclude the generated file from:
  - Biome: add `"!src/routeTree.gen.ts"` to `files.includes`.
  - oxlint: add `"src/routeTree.gen.ts"` to `ignorePatterns`, and `"allowExportNames": ["Route"]` to the `only-export-components` options.
  - Coverage: add `'src/routeTree.gen.ts'` to `coverage.exclude`.
- Keep non-route files, tests included, out of `src/routes/`, because the generator warns about them. The registry test is `src/routes.test.tsx`.

**Search params** use `validateSearch` with a zod schema, `Route.useSearch()`, and `navigate({ search: (prev) => ({ ...prev, page }), replace: true, resetScroll: false })`.

**Test helpers.** These replace `renderWithProviders` in 6.3; `jsonResponse`, `mockFetch` and `clickLeftToBrowser` stay.

```tsx
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router'
import { createAppRouter } from '@/router'

export function renderRoute(path: string) {
  const router = createAppRouter(
    createMemoryHistory({ initialEntries: [path] }),
  )
  const result = render(
    <QueryClientProvider client={createTestQueryClient()}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
  return { ...result, router }
}

export function renderWithProviders(ui: ReactNode, { path = '/' } = {}) {
  const router = createRouter({
    routeTree: createRootRoute({ component: () => ui }),
    history: createMemoryHistory({ initialEntries: [path] }),
  })
  return render(
    <QueryClientProvider client={createTestQueryClient()}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
}
```

**The registry test** (`src/routes.test.tsx`, excerpt) reads the route tree and checks links with the router's own matcher:

```tsx
const FIXED_ROUTES = Object.values(router.routesByPath).flatMap((route) =>
  route.options.staticData?.titleKey && !route.fullPath.includes('$')
    ? [{ path: route.fullPath, titleKey: route.options.staticData.titleKey }]
    : [],
)

// ...for each <a href^="/"> on the page:
const matches = router.matchRoutes(new URL(href, 'http://localhost').pathname)
const known = matches.some((match) => match.routeId !== '__root__')
```

### 5.5 Status pages and error boundaries

The layers, from the outside in:

1. RootErrorBoundary wraps everything in `main.tsx`.
2. PageErrorBoundary wraps each page. It is keyed by path, so navigating clears it.
3. The 404 page handles unknown addresses.
4. Detail pages branch per query: a 4xx shows an inline not-found state, and anything else shows the server error page.

`src/components/shared/status-page.tsx`:

```tsx
import type { ReactNode } from 'react'

export const STATUS_PRIMARY_BUTTON =
  'inline-flex items-center gap-2 rounded-lg bg-brand-primary px-6 py-3 font-semibold text-brand-on-primary text-sm shadow-md transition-colors hover:bg-brand-primary-hover'

export const STATUS_SECONDARY_BUTTON =
  'inline-flex items-center gap-2 rounded-lg border border-brand-outline-variant px-6 py-3 font-semibold text-brand-on-surface text-sm transition-colors hover:border-brand-primary hover:text-brand-primary'

export function StatusPage({
  code,
  title,
  description,
  actions,
}: {
  code: string
  title: string
  description: string
  actions: ReactNode
}) {
  return (
    <section className="flex w-full grow items-center bg-brand-surface-container-low py-20">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-5 px-4 text-center">
        <span
          aria-hidden="true"
          className="font-extrabold text-7xl text-brand-primary tracking-tight md:text-8xl"
        >
          {code}
        </span>
        <h1 className="text-brand-headline-xl-mobile text-brand-on-surface md:text-brand-headline-xl">
          {title}
        </h1>
        <p className="max-w-xl text-brand-body-md text-brand-on-surface-variant">
          {description}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {actions}
        </div>
      </div>
    </section>
  )
}
```

`src/pages/not-found-page.tsx`:

```tsx
import { ArrowLeft, House } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AppLink } from '@/components/shared/app-link'
import {
  STATUS_PRIMARY_BUTTON,
  STATUS_SECONDARY_BUTTON,
  StatusPage,
} from '@/components/shared/status-page'
import { goBack } from '@/lib/navigation'
import { useRouter } from '@/lib/router/context'

export function NotFoundPage() {
  const { t } = useTranslation()
  const { navigate } = useRouter()

  return (
    <StatusPage
      code="404"
      title={t('errors.notFound.title')}
      description={t('errors.notFound.description')}
      actions={
        <>
          <button
            type="button"
            onClick={() => goBack(navigate)}
            className={STATUS_SECONDARY_BUTTON}
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            {t('errors.actions.back')}
          </button>
          <AppLink href="/" className={STATUS_PRIMARY_BUTTON}>
            <House aria-hidden="true" className="size-4" />
            {t('errors.actions.home')}
          </AppLink>
        </>
      }
    />
  )
}
```

`src/pages/server-error-page.tsx`:

```tsx
import { ArrowLeft, RotateCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  STATUS_PRIMARY_BUTTON,
  STATUS_SECONDARY_BUTTON,
  StatusPage,
} from '@/components/shared/status-page'
import { goBack, reloadPage } from '@/lib/navigation'
import { useRouter } from '@/lib/router/context'

export function ServerErrorPage() {
  const { t } = useTranslation()
  const { navigate } = useRouter()

  return (
    <StatusPage
      code="500"
      title={t('errors.server.title')}
      description={t('errors.server.description')}
      actions={
        <>
          <button
            type="button"
            onClick={() => goBack(navigate)}
            className={STATUS_SECONDARY_BUTTON}
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            {t('errors.actions.back')}
          </button>
          <button
            type="button"
            onClick={reloadPage}
            className={STATUS_PRIMARY_BUTTON}
          >
            <RotateCw aria-hidden="true" className="size-4" />
            {t('errors.actions.refresh')}
          </button>
        </>
      }
    />
  )
}
```

`src/components/shared/page-error-boundary.tsx`:

```tsx
import { Component, type ReactNode } from 'react'
import { ServerErrorPage } from '@/pages/server-error-page'

export class PageErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: unknown) {
    console.error('Page failed to render', error)
  }

  render() {
    return this.state.failed ? <ServerErrorPage /> : this.props.children
  }
}
```

`src/components/shared/root-error-boundary.tsx` (the fallback strings are in the default language):

```tsx
import { Component, type ReactNode } from 'react'
import {
  STATUS_PRIMARY_BUTTON,
  STATUS_SECONDARY_BUTTON,
  StatusPage,
} from '@/components/shared/status-page'
import i18n from '@/i18n/config'
import { reloadPage } from '@/lib/navigation'

export class RootErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: unknown) {
    console.error('App failed to render', error)
  }

  render() {
    if (!this.state.failed) {
      return this.props.children
    }

    const t = (key: string, fallback: string) =>
      i18n.isInitialized ? i18n.t(key, { defaultValue: fallback }) : fallback

    return (
      <div className="flex min-h-svh flex-col">
        <StatusPage
          code="500"
          title={t('errors.server.title', 'Алдаа гарлаа')}
          description={t(
            'errors.server.description',
            'Серверт түр зуурын алдаа гарсан тул хуудсыг харуулж чадсангүй. Хуудсыг дахин ачаалах эсвэл хэсэг хугацааны дараа дахин оролдоно уу.',
          )}
          actions={
            <>
              <button
                type="button"
                onClick={() =>
                  window.history.length > 1
                    ? window.history.back()
                    : window.location.assign('/')
                }
                className={STATUS_SECONDARY_BUTTON}
              >
                {t('errors.actions.back', 'Буцах')}
              </button>
              <button
                type="button"
                onClick={reloadPage}
                className={STATUS_PRIMARY_BUTTON}
              >
                {t('errors.actions.refresh', 'Дахин ачаалах')}
              </button>
            </>
          }
        />
      </div>
    )
  }
}
```

### 5.6 Layout

`src/components/layout/app-layout.tsx`:

```tsx
import type { ReactNode } from 'react'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <main className="flex grow flex-col">{children}</main>
      <SiteFooter />
    </div>
  )
}
```

`src/components/layout/site-header.tsx`:

```tsx
import { LanguageSwitcher } from '@/components/layout/language-switcher'
import { AppLink } from '@/components/shared/app-link'
import { SITE_NAME } from '@/lib/site'

export function SiteHeader() {
  return (
    <header className="w-full border-brand-outline-variant border-b bg-brand-surface">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-14">
        <AppLink
          href="/"
          className="font-bold text-brand-headline-sm text-brand-on-surface"
        >
          {SITE_NAME}
        </AppLink>
        <LanguageSwitcher />
      </div>
    </header>
  )
}
```

`src/components/layout/site-footer.tsx`:

```tsx
import { useTranslation } from 'react-i18next'
import { currentYear } from '@/lib/date'
import { SITE_NAME } from '@/lib/site'

export function SiteFooter() {
  const { t } = useTranslation()

  return (
    <footer className="w-full bg-brand-inverse-surface py-8 text-brand-inverse-on-surface">
      <p className="mx-auto w-full max-w-7xl px-4 text-brand-body-sm md:px-14">
        {t('footer.copyright', {
          year: currentYear(),
          site: SITE_NAME,
        })}
      </p>
    </footer>
  )
}
```

`src/components/layout/language-switcher.tsx`:

```tsx
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocale } from '@/hooks/use-locale'
import { supportedLanguages } from '@/i18n/config'
import { cn } from '@/lib/utils'

export function LanguageSwitcher({ className }: { className?: string }) {
  const { t } = useTranslation()
  const { locale, setLocale } = useLocale()

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      {supportedLanguages.map((code, index) => (
        <Fragment key={code}>
          {index > 0 ? (
            <span aria-hidden="true" className="text-brand-outline">
              |
            </span>
          ) : null}
          <button
            type="button"
            lang={code}
            aria-label={t(`language.${code}`)}
            aria-pressed={code === locale}
            onClick={() => void setLocale(code)}
            className={cn(
              'text-xs uppercase transition-colors hover:underline',
              code === locale
                ? 'font-bold text-brand-on-surface'
                : 'font-normal text-brand-on-surface-variant hover:text-brand-on-surface',
            )}
          >
            {code}
          </button>
        </Fragment>
      ))}
    </div>
  )
}
```

`src/lib/date.ts` holds the one impure call, because oxlint's `react/purity` rule rejects `new Date()` during render:

```ts
export function currentYear() {
  return new Date().getFullYear()
}
```

When there is more than one page, the header gets a `<nav>`:

- Its links come from a `NAV_LINKS` table (`{ labelKey: ParseKeys; href: string }[]`).
- The active link is marked with `aria-current="page"`.
- It collapses into a mobile menu below a breakpoint.

### 5.7 API client

`src/lib/api.ts`:

```ts
import * as z from 'zod'

const baseUrl = import.meta.env.VITE_API_URL

if (!baseUrl) {
  throw new Error(
    'VITE_API_URL is not set - copy .env.example to .env and restart the dev server',
  )
}

const envelopeSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  meta: z.object({ total: z.number() }).optional(),
})

const errorSchema = z.object({
  error: z.string(),
  message: z.string().optional(),
})

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
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
  searchParams?: Record<string, string | number | undefined>
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

async function request<T>(
  path: string,
  schema: z.ZodType<T>,
  input: RequestInput,
): Promise<{ data: T; total: number | undefined }> {
  const url = new URL(`${baseUrl}${path}`)
  for (const [key, value] of Object.entries(input.searchParams ?? {})) {
    if (value !== undefined) {
      url.searchParams.set(key, String(value))
    }
  }

  let res: Response
  try {
    res = await fetch(url)
  } catch {
    throw new ApiError(0, `Cannot reach the API at ${baseUrl}.`)
  }

  const text = await res.text()
  let json: unknown = null
  if (text) {
    try {
      json = JSON.parse(text)
    } catch {
      throw new ApiError(res.status, 'API returned a non-JSON response')
    }
  }

  if (!res.ok) {
    const parsed = errorSchema.safeParse(json)
    throw new ApiError(
      res.status,
      parsed.success
        ? parsed.data.message || parsed.data.error
        : `Request failed with status ${res.status}`,
    )
  }

  const envelope = envelopeSchema.safeParse(json)
  if (!envelope.success) {
    throw new ApiError(res.status, 'Unexpected API response')
  }

  const data = schema.safeParse(envelope.data.data)
  if (!data.success) {
    throw new ApiError(res.status, 'Unexpected API response shape')
  }

  return { data: data.data, total: envelope.data.meta?.total }
}
```

Every failure becomes an `ApiError` with a status: no answer, bad JSON, an error status and a shape mismatch alike. That gives the retry policy and the status pages one thing to branch on.

### 5.8 Server state (TanStack Query)

`src/queries/retry.ts`:

```ts
import { ApiError } from '@/lib/api'

export function retryFailedRequest(failureCount: number, error: unknown) {
  const status = error instanceof ApiError ? error.status : 0
  if (status >= 400 && status < 500) {
    return false
  }
  return failureCount < 2
}
```

`src/queries/stale-time.ts`:

```ts
export const DEFAULT_STALE_TIME = 5 * 60 * 1000
export const DEFAULT_GC_TIME = 30 * 60 * 1000
```

Every resource gets three files in `src/queries/<resource>/`. Do not create them for an endpoint nobody has confirmed. Instead, copy this template into CLAUDE.md as the pattern for the first real resource.

`src/queries/items/type.ts`:

```ts
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

`src/queries/items/query.ts`:

```ts
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

`src/queries/items/options.ts`:

```ts
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

**How components use them:**

- Components call `useQuery(fetchItemsOptions(locale, params))`. They spread the factory only to add an option such as `enabled`.
- While `isPlaceholderData` is true, the list shows `aria-busy` and `opacity-60`.
- A hook that derives values from a query (links, fallbacks) does it once, for every component.
- A search box keeps its text in local state and waits for a minimum length (a `MIN_SEARCH_LENGTH` constant). It debounces what reaches the query with the hook below, which is added together with the first search box.

`src/hooks/use-debounced-value.ts`:

```ts
import { useEffect, useState } from 'react'

export function useDebouncedValue<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(timer)
  }, [value, delayMs])

  return debounced
}
```

### 5.9 i18n

`src/i18n/config.ts`:

```ts
import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import mn from './locales/mn.json'

export const supportedLanguages = ['mn', 'en'] as const

export type SupportedLanguage = (typeof supportedLanguages)[number]

export const DEFAULT_LANGUAGE: SupportedLanguage = supportedLanguages[0]

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      mn: { translation: mn },
      en: { translation: en },
    },
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: supportedLanguages,
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage'],
      caches: ['localStorage'],
    },
  })

const syncDocumentLanguage = (lng: string) => {
  document.documentElement.lang = lng
}

syncDocumentLanguage(i18n.resolvedLanguage ?? DEFAULT_LANGUAGE)
i18n.on('languageChanged', syncDocumentLanguage)

export default i18n
```

`src/i18n/types.d.ts` makes a missing or misspelled key a compile error. It is typed against `en.json`, or against the default language's file when there is no English.

```ts
import type en from './locales/en.json'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    resources: {
      translation: typeof en
    }
  }
}
```

`src/hooks/use-locale.ts`:

```ts
import { useTranslation } from 'react-i18next'
import {
  DEFAULT_LANGUAGE,
  type SupportedLanguage,
  supportedLanguages,
} from '@/i18n/config'

export function useLocale() {
  const { i18n } = useTranslation()
  const resolved = i18n.resolvedLanguage as SupportedLanguage
  const locale = supportedLanguages.includes(resolved)
    ? resolved
    : DEFAULT_LANGUAGE

  return {
    locale,
    setLocale: (next: SupportedLanguage) => i18n.changeLanguage(next),
  }
}
```

`src/i18n/locales/en.json`:

```json
{
  "common": {
    "home": "Home"
  },
  "language": {
    "mn": "Монгол",
    "en": "English"
  },
  "home": {
    "title": "Welcome",
    "intro": "This is the starting point of the app.",
    "showDetails": "Show details",
    "hideDetails": "Hide details",
    "details": "Real sections replace this one as the app grows."
  },
  "footer": {
    "copyright": "© {{year}} {{site}}"
  },
  "errors": {
    "notFound": {
      "title": "Page not found",
      "description": "The page you're looking for doesn't exist, has been removed, or its address has changed."
    },
    "server": {
      "title": "Something went wrong",
      "description": "A temporary server error kept this page from loading. Refresh the page, or try again in a little while."
    },
    "actions": {
      "back": "Go back",
      "home": "Home",
      "refresh": "Refresh"
    }
  }
}
```

`src/i18n/locales/mn.json` is the default language, whose texts the tests assert:

```json
{
  "common": {
    "home": "Нүүр"
  },
  "language": {
    "mn": "Монгол",
    "en": "English"
  },
  "home": {
    "title": "Тавтай морил",
    "intro": "Энэ бол аппын эхлэл.",
    "showDetails": "Дэлгэрэнгүй харах",
    "hideDetails": "Дэлгэрэнгүйг нуух",
    "details": "Апп өсөхийн хэрээр жинхэнэ хэсгүүд үүнийг орлоно."
  },
  "footer": {
    "copyright": "© {{year}} {{site}}"
  },
  "errors": {
    "notFound": {
      "title": "Хуудас олдсонгүй",
      "description": "Таны хайсан хуудас байхгүй, устгагдсан эсвэл хаяг нь өөрчлөгдсөн байна."
    },
    "server": {
      "title": "Алдаа гарлаа",
      "description": "Серверт түр зуурын алдаа гарсан тул хуудсыг харуулж чадсангүй. Хуудсыг дахин ачаалах эсвэл хэсэг хугацааны дараа дахин оролдоно уу."
    },
    "actions": {
      "back": "Буцах",
      "home": "Нүүр хуудас",
      "refresh": "Дахин ачаалах"
    }
  }
}
```

- The language picked in the app persists in localStorage (`i18nextLng`), and `<html lang>` follows the active language.
- There is one bundled `translation` namespace. Keys nest by area, then section, then item (`home.hero.title`, `errors.server.title`).
- Language names are written in their own language in every locale file.
- Plurals use the i18next suffixes (`resultCount_one` and `resultCount_other`, plus whatever forms the language needs) and are called as `t('resultCount', { count })`.
- The locale travels into every localized query: it is in the query key and in the request.

### 5.10 Sample section

`src/components/home/welcome-section.tsx` is the living example of the house style, and the component whose test shows the coverage gate at work:

```tsx
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export function WelcomeSection() {
  const { t } = useTranslation()
  const [showDetails, setShowDetails] = useState(false)

  return (
    <section className="w-full bg-brand-surface py-12 lg:py-16">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-start gap-6 px-4 md:px-14">
        <h1 className="text-brand-headline-xl-mobile text-brand-on-surface md:text-brand-headline-xl">
          {t('home.title')}
        </h1>
        <p className="max-w-2xl text-brand-body-lg text-brand-on-surface-variant">
          {t('home.intro')}
        </p>
        <button
          type="button"
          aria-expanded={showDetails}
          onClick={() => setShowDetails((open) => !open)}
          className="rounded-lg bg-brand-primary px-5 py-2.5 text-brand-label-md text-brand-on-primary transition-colors hover:bg-brand-primary-hover"
        >
          {showDetails ? t('home.hideDetails') : t('home.showDetails')}
        </button>
        {showDetails ? (
          <p className="max-w-2xl text-brand-body-md text-brand-on-surface">
            {t('home.details')}
          </p>
        ) : null}
      </div>
    </section>
  )
}
```

### 5.11 Optional extras

Install only the extras that were chosen, in one `pnpm add` and one `pnpm dlx shadcn@latest add … -y -o` call.

**Forms**

- `pnpm add react-hook-form@latest @hookform/resolvers@latest` and `pnpm dlx shadcn@latest add field input label button -y -o`.
- Write no app form: there is no real form yet. The primitives stay as the forms toolkit, and CLAUDE.md documents the pattern: one zod schema per form, `useForm({ resolver: zodResolver(Schema) })`, fields built from `field`, `input` and `label`.
- The generated `field.tsx` breaks three rules of Biome's recommended preset. Primitives are never hand-edited, so add this `overrides` entry to `biome.json`:

```json
"overrides": [
  {
    "includes": ["src/components/ui/**"],
    "linter": {
      "rules": {
        "a11y": { "useSemanticElements": "off" },
        "suspicious": { "noDoubleEquals": "off", "noArrayIndexKey": "off" }
      }
    }
  }
]
```

**Tables**

- `pnpm add @tanstack/react-table@latest` and `pnpm dlx shadcn@latest add table button -y -o`.
- TanStack Table is on v9: `useTable` with features registered through `tableFeatures`, not v8's `useReactTable`. The file below is written against v9 and checked; do not research the API.
- Add the table keys to every locale file (without i18n, write the strings inline instead):
  - `mn`: `"table": { "columns": "Харагдах баганууд", "empty": "Үр дүн олдсонгүй.", "pagination": "Хуудаслалт", "previous": "Өмнөх", "next": "Дараах" }`
  - `en`: `"table": { "columns": "Visible columns", "empty": "No results.", "pagination": "Pagination", "previous": "Previous", "next": "Next" }`

`src/components/shared/data-table.tsx`:

```tsx
import {
  type ColumnDef,
  columnVisibilityFeature,
  createPaginatedRowModel,
  createSortedRowModel,
  functionalUpdate,
  type PaginationState,
  type RowData,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const DATA_TABLE_FEATURES = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text },
  columnVisibilityFeature,
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
})

export type DataTableFeatures = typeof DATA_TABLE_FEATURES

export type DataTableColumn<TData extends RowData> = ColumnDef<
  DataTableFeatures,
  TData,
  // biome-ignore lint/suspicious/noExplicitAny: columns of one table hold different value types
  any
>

export interface DataTableProps<TData extends RowData> {
  columns: DataTableColumn<TData>[]
  data: TData[]
  pageSize?: number
  serverPagination?: {
    pageIndex: number
    rowCount: number
    onPageChange: (pageIndex: number) => void
  }
}

const SORT_ICON_CLASS = 'size-3.5 shrink-0'

export function DataTable<TData extends RowData>({
  columns,
  data,
  pageSize = 10,
  serverPagination,
}: DataTableProps<TData>) {
  const { t } = useTranslation()
  const togglesId = useId()
  const table = useTable({
    features: DATA_TABLE_FEATURES,
    columns,
    data,
    initialState: { pagination: { pageIndex: 0, pageSize } },
    ...(serverPagination
      ? {
          manualPagination: true,
          rowCount: serverPagination.rowCount,
          state: {
            pagination: { pageIndex: serverPagination.pageIndex, pageSize },
          },
          onPaginationChange: (
            updater:
              | PaginationState
              | ((old: PaginationState) => PaginationState),
          ) =>
            serverPagination.onPageChange(
              functionalUpdate(updater, {
                pageIndex: serverPagination.pageIndex,
                pageSize,
              }).pageIndex,
            ),
        }
      : {}),
  })

  const hideable = table
    .getAllLeafColumns()
    .filter((column) => column.getCanHide())
  const { pageIndex } = table.state.pagination
  const pageCount = Math.max(table.getPageCount(), 1)
  const rows = table.getRowModel().rows

  return (
    <div className="flex w-full flex-col gap-4">
      {hideable.length > 0 ? (
        <fieldset className="flex flex-wrap items-center gap-3 text-brand-body-sm text-brand-on-surface-variant">
          <legend className="sr-only">{t('table.columns')}</legend>
          {hideable.map((column) => (
            <label
              key={column.id}
              htmlFor={`${togglesId}-${column.id}`}
              className="flex cursor-pointer items-center gap-1.5"
            >
              <input
                id={`${togglesId}-${column.id}`}
                type="checkbox"
                checked={column.getIsVisible()}
                onChange={column.getToggleVisibilityHandler()}
                className="cursor-pointer"
              />
              {typeof column.columnDef.header === 'string'
                ? column.columnDef.header
                : column.id}
            </label>
          ))}
        </fieldset>
      ) : null}

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id}>
              {group.headers.map((header) => {
                const sorted = header.column.getIsSorted()
                return (
                  <TableHead
                    key={header.id}
                    scope="col"
                    aria-sort={
                      sorted === 'asc'
                        ? 'ascending'
                        : sorted === 'desc'
                          ? 'descending'
                          : undefined
                    }
                  >
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                        className="inline-flex items-center gap-1.5 font-semibold"
                      >
                        <table.FlexRender header={header} />
                        {sorted === 'asc' ? (
                          <ArrowUp
                            aria-hidden="true"
                            className={SORT_ICON_CLASS}
                          />
                        ) : sorted === 'desc' ? (
                          <ArrowDown
                            aria-hidden="true"
                            className={SORT_ICON_CLASS}
                          />
                        ) : (
                          <ArrowUpDown
                            aria-hidden="true"
                            className={SORT_ICON_CLASS}
                          />
                        )}
                      </button>
                    ) : (
                      <table.FlexRender header={header} />
                    )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {rows.length > 0 ? (
            rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    <table.FlexRender cell={cell} />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={table.getVisibleLeafColumns().length}
                className="h-24 text-center text-brand-on-surface-variant"
              >
                {t('table.empty')}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <nav
        aria-label={t('table.pagination')}
        className="flex items-center justify-end gap-3 text-brand-body-sm text-brand-on-surface-variant"
      >
        <span aria-live="polite">
          {pageIndex + 1} / {pageCount}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {t('table.previous')}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {t('table.next')}
        </Button>
      </nav>
    </div>
  )
}
```

`src/components/shared/data-table.test.tsx`:

```tsx
import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DataTable, type DataTableColumn } from './data-table'

type Person = { name: string; age: number }

function makePeople(count: number): Person[] {
  return Array.from({ length: count }, (_, index) => ({
    name: `Хүн ${String(index + 1).padStart(2, '0')}`,
    age: 20 + index,
  }))
}

const COLUMNS: DataTableColumn<Person>[] = [
  { accessorKey: 'name', header: 'Нэр' },
  { accessorKey: 'age', header: 'Нас' },
]

function bodyRows() {
  const [, body] = screen.getAllByRole('rowgroup')
  return within(body).getAllByRole('row')
}

function button(name: string) {
  return screen.getByRole('button', { name }) as HTMLButtonElement
}

describe('DataTable', () => {
  it('shows one page of rows and pages through the rest', () => {
    render(<DataTable columns={COLUMNS} data={makePeople(12)} pageSize={5} />)

    expect(bodyRows()).toHaveLength(5)
    expect(screen.getByText('1 / 3')).toBeTruthy()
    expect(button('Өмнөх').disabled).toBe(true)

    fireEvent.click(button('Дараах'))

    expect(screen.getByText('2 / 3')).toBeTruthy()
    expect(bodyRows()[0].textContent).toContain('Хүн 06')

    fireEvent.click(button('Өмнөх'))

    expect(screen.getByText('1 / 3')).toBeTruthy()
  })

  it('sorts a text column ascending, then descending', () => {
    render(<DataTable columns={COLUMNS} data={makePeople(3)} />)
    const nameHeader = screen.getByRole('columnheader', { name: 'Нэр' })

    fireEvent.click(within(nameHeader).getByRole('button'))

    expect(nameHeader.getAttribute('aria-sort')).toBe('ascending')
    expect(bodyRows()[0].textContent).toContain('Хүн 01')

    fireEvent.click(within(nameHeader).getByRole('button'))

    expect(nameHeader.getAttribute('aria-sort')).toBe('descending')
    expect(bodyRows()[0].textContent).toContain('Хүн 03')
  })

  it('hides and shows a column', () => {
    render(<DataTable columns={COLUMNS} data={makePeople(1)} />)

    fireEvent.click(screen.getByRole('checkbox', { name: 'Нас' }))

    expect(screen.queryByRole('columnheader', { name: 'Нас' })).toBeNull()

    fireEvent.click(screen.getByRole('checkbox', { name: 'Нас' }))

    expect(screen.getByRole('columnheader', { name: 'Нас' })).toBeTruthy()
  })

  it('names a column toggle by its id when the header is not text', () => {
    render(
      <DataTable
        columns={[{ accessorKey: 'name', header: () => <span>Нэр</span> }]}
        data={makePeople(1)}
      />,
    )

    expect(screen.getByRole('checkbox', { name: 'name' })).toBeTruthy()
  })

  it('says so when there are no rows', () => {
    render(<DataTable columns={COLUMNS} data={[]} />)

    expect(screen.getByText('Үр дүн олдсонгүй.')).toBeTruthy()
    expect(screen.getByText('1 / 1')).toBeTruthy()
  })

  it('renders a header without sorting or hiding as plain text', () => {
    render(
      <DataTable
        columns={[
          {
            accessorKey: 'name',
            header: 'Нэр',
            enableSorting: false,
            enableHiding: false,
          },
        ]}
        data={makePeople(1)}
      />,
    )

    const header = screen.getByRole('columnheader', { name: 'Нэр' })
    expect(within(header).queryByRole('button')).toBeNull()
    expect(screen.queryByRole('group')).toBeNull()
  })

  it('asks the caller for another page when the server pages the rows', () => {
    const onPageChange = vi.fn()
    render(
      <DataTable
        columns={COLUMNS}
        data={makePeople(5)}
        pageSize={5}
        serverPagination={{ pageIndex: 1, rowCount: 15, onPageChange }}
      />,
    )

    expect(screen.getByText('2 / 3')).toBeTruthy()
    expect(bodyRows()).toHaveLength(5)

    fireEvent.click(button('Дараах'))

    expect(onPageChange).toHaveBeenCalledWith(2)
  })
})
```

**Toasts**

- `pnpm dlx shadcn@latest add sonner -y -o`. It also installs `next-themes`, which its wrapper reads the theme from.
- Mount `<Toaster />` once: in `main.tsx` next to `<App />` (Vite), or in `src/app/providers.tsx` after `{children}` (Next.js).
- With a single theme, pin it: `<Toaster theme="light" />` or `<Toaster theme="dark" />`. With light + dark, leave the prop out so it follows next-themes.

### 5.12 Theme

**Light only** (the default in the code blocks): no `next-themes` unless toasts brought it, no `.dark` class, and no `dark:` classes anywhere.

**Dark only:**

- Put `class="dark"` on `<html>`: in `index.html` (Vite), or `className={`${fontSans.variable} dark`}` in the root layout (Next.js). shadcn's `.dark` block then switches the semantic tokens.
- In `index.css` / `globals.css`, give the brand roles app code uses their dark values instead of the light ones: `primary #d0bcff`, `on-primary #381e72`, `primary-hover #e8ddff`, `surface #141218`, `on-surface #e6e0e9`, `on-surface-variant #cac4d0`, `surface-container-low #1d1b20`, `surface-container #211f26`, `outline #938f99`, `outline-variant #49454f`, `inverse-surface #e6e0e9`, `inverse-on-surface #322f35`.
- Write no `dark:` classes and no toggle.

**Light + dark, with a toggle:**

- `pnpm add next-themes@latest`. It works outside Next.js too.
- Wrap the app in `<ThemeProvider attribute="class" defaultTheme="system" enableSystem>`: in `main.tsx` around `QueryClientProvider` (Vite), or as the outermost element of `Providers` (Next.js). On Next.js, add `suppressHydrationWarning` to `<html>`, with one comment line above the layout function: `// next-themes sets the theme class before hydration, so <html> differs from the server render.`
- Never read `resolvedTheme` or `theme` directly in the first render of anything that is server-rendered: gate it behind the `hydrated` flag, as `ThemeToggle` does. Reading it straight away breaks hydration, and React then also warns "Encountered a script tag while rendering React component" about next-themes' script.
- Add the dark partners to the `@theme inline` block, after the light brand colors:
```css
  /* Dark-mode partners of the roles app code uses, from the Material 3 dark baseline. */
  --color-brand-primary-dark: #d0bcff;
  --color-brand-on-primary-dark: #381e72;
  --color-brand-primary-hover-dark: #e8ddff;
  --color-brand-surface-dark: #141218;
  --color-brand-on-surface-dark: #e6e0e9;
  --color-brand-on-surface-variant-dark: #cac4d0;
  --color-brand-surface-container-low-dark: #1d1b20;
  --color-brand-surface-container-dark: #211f26;
  --color-brand-outline-dark: #938f99;
  --color-brand-outline-variant-dark: #49454f;
  --color-brand-inverse-surface-dark: #e6e0e9;
  --color-brand-inverse-on-surface-dark: #322f35;
```

- Pair every brand surface, border and text class in app code with its `-dark` partner, for example `bg-brand-surface dark:bg-brand-surface-dark`, `text-brand-on-surface dark:text-brand-on-surface-dark`, `border-brand-outline-variant dark:border-brand-outline-variant-dark`, `bg-brand-primary dark:bg-brand-primary-dark`, `hover:bg-brand-primary-hover dark:hover:bg-brand-primary-hover-dark`. That covers the header, footer, status page and its two button constants, the sample section and the DataTable.
- The header renders `<ThemeToggle />` next to the language switcher (or on its own without i18n).
- Add the key to every locale file: `mn` `"theme": { "dark": "Харанхуй горим" }`, `en` `"theme": { "dark": "Dark mode" }`. Without i18n, `aria-label="Харанхуй горим"` (or `"Dark mode"`) is written inline.
- In the test setup's `afterEach`, also reset `document.documentElement.className = ''`, so a test that switched the theme leaves no class behind.

`src/components/layout/theme-toggle.tsx`:

```tsx
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useSyncExternalStore } from 'react'
import { useTranslation } from 'react-i18next'

const subscribeToNothing = () => () => {}

export function ThemeToggle() {
  const { t } = useTranslation()
  const { resolvedTheme, setTheme } = useTheme()
  const hydrated = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  )
  const isDark = hydrated && resolvedTheme === 'dark'

  return (
    <button
      type="button"
      aria-label={t('theme.dark')}
      aria-pressed={isDark}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="inline-flex size-9 items-center justify-center rounded-lg text-brand-on-surface-variant transition-colors hover:bg-brand-surface-container hover:text-brand-on-surface dark:text-brand-on-surface-variant-dark dark:hover:bg-brand-surface-container-dark dark:hover:text-brand-on-surface-dark"
    >
      {isDark ? (
        <Sun aria-hidden="true" className="size-5" />
      ) : (
        <Moon aria-hidden="true" className="size-5" />
      )}
    </button>
  )
}
```

`src/components/layout/theme-toggle.test.tsx` (the second test guards against the hydration mismatch that makes React rebuild the page and warn about next-themes' `<script>`):

```tsx
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ThemeProvider } from 'next-themes'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { ThemeToggle } from './theme-toggle'

function themedToggle(defaultTheme = 'system') {
  return (
    <ThemeProvider attribute="class" defaultTheme={defaultTheme} enableSystem>
      <ThemeToggle />
    </ThemeProvider>
  )
}

describe('ThemeToggle', () => {
  it('switches to the dark theme and back', async () => {
    render(themedToggle('light'))
    const toggle = screen.getByRole('button', { name: 'Харанхуй горим' })
    await waitFor(() =>
      expect(toggle.getAttribute('aria-pressed')).toBe('false'),
    )

    fireEvent.click(toggle)

    await waitFor(() =>
      expect(toggle.getAttribute('aria-pressed')).toBe('true'),
    )
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    fireEvent.click(toggle)

    await waitFor(() =>
      expect(toggle.getAttribute('aria-pressed')).toBe('false'),
    )
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('hydrates server HTML without a mismatch when the dark theme was saved', async () => {
    const container = document.createElement('div')
    container.innerHTML = renderToString(themedToggle())
    document.body.append(container)
    localStorage.setItem('theme', 'dark')
    const onRecoverableError = vi.fn()
    const logged = vi.spyOn(console, 'error')

    await act(async () => {
      hydrateRoot(container, themedToggle(), { onRecoverableError })
    })

    expect(onRecoverableError).not.toHaveBeenCalled()
    expect(logged).not.toHaveBeenCalled()
    expect(
      container.querySelector('button')?.getAttribute('aria-pressed'),
    ).toBe('true')
    container.remove()
  })
})
```

## 6. Testing

The stack is Vitest in jsdom, with Testing Library and v8 coverage. The suite needs no `.env` file and no running API, and every file must reach the coverage gate on its own. Write every test below; do not run them (0.0).

### 6.1 vitest.config.ts

```ts
import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.ts'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      include: ['src/**/*.test.{ts,tsx}'],
      setupFiles: ['./src/test/setup.ts'],
      env: {
        VITE_API_URL: 'https://api.test/api',
      },
      css: false,
      coverage: {
        provider: 'v8',
        include: ['src/**/*.{ts,tsx}'],
        exclude: [
          'src/**/*.test.{ts,tsx}',
          'src/**/*.d.ts',
          'src/test/**',
          'src/components/ui/**',
        ],
        thresholds: {
          perFile: true,
          lines: 80,
          statements: 80,
          functions: 80,
          branches: 80,
        },
        reporter: [
          ['text', { skipFull: true, maxCols: 140 }],
          'text-summary',
          'html',
        ],
      },
    },
  }),
)
```

- **Untested files count.** `coverage.include` also reports files that no test imports, at 0%. Combined with `perFile`, a new untested file fails `pnpm test` even when every test passes. That is the mechanism behind "tests with every change".
- **Explicit imports.** There is no `globals: true`, so every test file imports from `'vitest'`.
- **Address.** jsdom's address starts at `http://localhost:3000`.

### 6.2 src/test/setup.ts

```ts
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'
import i18n, { DEFAULT_LANGUAGE } from '@/i18n/config'

window.scrollTo = () => {}
Element.prototype.scrollIntoView = () => {}
window.matchMedia ??= (query: string) =>
  ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }) as MediaQueryList

class NoopObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}
globalThis.ResizeObserver ??= NoopObserver as unknown as typeof ResizeObserver

beforeEach(async () => {
  await i18n.changeLanguage(DEFAULT_LANGUAGE)
})

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
  vi.useRealTimers()
  localStorage.clear()
  window.history.replaceState({}, '', '/')
})
```

### 6.3 src/test/utils.tsx

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { vi } from 'vitest'
import { RouterProvider } from '@/lib/router/provider'

// A fresh cache per test, with retries off so a failing request fails at once.
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
}

export function renderWithProviders(ui: ReactNode, { path = '/' } = {}) {
  window.history.replaceState({}, '', path)
  return render(
    <QueryClientProvider client={createTestQueryClient()}>
      <RouterProvider>{ui}</RouterProvider>
    </QueryClientProvider>,
  )
}

export function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

export function mockFetch(handler: (url: URL) => Response | Promise<Response>) {
  const calls: URL[] = []
  const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
    const url = new URL(typeof input === 'string' ? input : input.toString())
    calls.push(url)
    return handler(url)
  })
  vi.stubGlobal('fetch', fetchMock)
  return { calls, fetchMock }
}

export function clickLeftToBrowser(el: Element, init?: MouseEventInit) {
  let leftToBrowser = true
  const onClick = (event: Event) => {
    leftToBrowser = !event.defaultPrevented
    event.preventDefault()
  }
  window.addEventListener('click', onClick)
  fireEvent.click(el, init)
  window.removeEventListener('click', onClick)
  return leftToBrowser
}
```

**Network mocking** uses `mockFetch` only:

- Route on `url.pathname` and `url.searchParams`.
- Assert on `calls` and `fetchMock`.
- Override per test by calling `mockFetch` again.
- A network failure is `mockFetch(() => Promise.reject(new TypeError('Failed to fetch')))`, and a server error is `jsonResponse({ error: 'boom' }, 500)`.

**`vi.mock`** is kept for third-party SDKs with side effects, and for the tiny browser-API wrappers in `lib/navigation.ts` as a partial mock:

```ts
vi.mock('@/lib/navigation', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/navigation')>()),
  reloadPage: vi.fn(),
}))
```

### 6.4 Tests the shell needs

Write all of these. Aim for 100% on the shell; the gate requires `{{COVERAGE}}`% per file.

- **`lib/api.test.ts`:**
  - Returns the envelope data and sends the search params, skipping undefined ones.
  - Throws the API's message and status for an error response. Falls back to the error code, then to "Request failed with status N".
  - Reports a network failure as status 0.
  - Rejects a non-JSON body, an empty or foreign body ("Unexpected API response"), and a data shape mismatch ("Unexpected API response shape").
  - `apiPagedRequest` returns rows plus `meta.total`, counts rows when there is no meta, and treats a missing `data` as an empty page.
  - `isServerError` reads a 4xx as not found, and 0, a 5xx or anything else as a server error.
  - The module refuses to load without `VITE_API_URL`: run `vi.stubEnv('VITE_API_URL', '')` and `vi.resetModules()`, then `await expect(import('./api')).rejects.toThrow('VITE_API_URL is not set')`.
- **`queries/retry.test.ts`:** never retries a 4xx; retries no answer or a 5xx twice, then gives up; treats a non-API error like a server error.
- **`lib/router/match.test.ts`:**
  - An `it.each` input/output table for `normalizePath`: `/`, empty, trailing slashes, `//`, a query and a hash.
  - Fixed paths and decoded params.
  - Different paths and depths.
  - A segment that cannot be decoded is no match.
- **`lib/router/router.test.tsx`:**
  - Reads the address.
  - `navigate` pushes an entry and scrolls to the top. `replace` with `scroll: false` does neither. The current address adds no entry.
  - Follows `popstate`, and consumers re-render.
  - `useRouter` outside the provider throws.
  - `useSearchParams` reads the query, changes several keys in one entry, and leaves no stray `?`.
  - An `isNavigableClick` table: modifier keys, middle click, `defaultPrevented`, `target="_blank"`, `download`, external, `//host`, `tel:` and `mailto:` links.
- **`components/shared/app-link.test.tsx`:**
  - An internal click navigates without a full load (`fireEvent.click` returns `false`).
  - The link's own `onClick` still runs.
  - Ctrl or ⌘ clicks and external links are left to the browser (`clickLeftToBrowser`).
  - The real `href` stays.
- **`lib/navigation.test.ts`:** both branches of `goBack` (spy on the `history.length` getter); `reloadPage` calls `location.reload` (spy on the `location` getter).
- **`pages/status-pages.test.tsx`:** the 404 page's Back goes home when there is no history; the 404 page links home; the 500 page's Back uses history; Refresh calls the mocked `reloadPage`.
- **`components/shared/error-boundaries.test.tsx`:**
  - The page boundary shows the 500 page and keeps the surrounding layout, and renders its children when nothing throws.
  - The root boundary works with no providers at all. Its Back uses history or `location.assign('/')`.
  - Its fallback texts show when i18n never initialized. Set `i18n.isInitialized = false` inside try/finally.
- **`App.test.tsx`:**
  - An unknown address shows the 404 page with its own tab title.
  - `/` renders the home page, titled from the registry.
  - A `#hash` target is scrolled into view. Create the element, and remove it in `finally`.
  - Once more pages exist: a trailing slash is the same page, and a param route receives decoded params.
- **`hooks/use-locale.test.tsx`** and **`hooks/use-document-title.test.ts`**.
- **`i18n/config.test.ts`:** `<html lang>` follows the language. With a `vi.doMock('i18next', …)` stub that has no resolved language, it starts in the default; afterwards run `vi.doUnmock` and `vi.resetModules()`.
- **`i18n/locales.test.ts`** (6.5).
- **`components/layout/layout.test.tsx`:**
  - The banner, main and contentinfo landmarks exist, and the site name links home.
  - The footer year, under `vi.useFakeTimers({ toFake: ['Date'] })` plus `vi.setSystemTime`.
  - The switcher: `aria-pressed`, `<html lang>` and `localStorage.i18nextLng`.
- **`pages.test.tsx`**, **`main.test.tsx`** and **`components/home/welcome-section.test.tsx`** (6.5).

### 6.5 Reference tests

`src/pages.test.tsx`, the registry-driven page test:

```tsx
import { QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import i18n from '@/i18n/config'
import { SITE_NAME } from '@/lib/site'
import { createTestQueryClient, jsonResponse, mockFetch } from '@/test/utils'
import App from './App'
import { findPage, PAGES } from './pages'

function fakeApi(url: URL) {
  void url
  return jsonResponse({ error: 'not found' }, 404)
}

function renderAt(path: string) {
  window.history.replaceState({}, '', path)
  return render(
    <QueryClientProvider client={createTestQueryClient()}>
      <App />
    </QueryClientProvider>,
  )
}

const FIXED_PAGES = PAGES.flatMap((page) =>
  page.titleKey && !page.path.includes(':')
    ? [{ path: page.path, titleKey: page.titleKey }]
    : [],
)

beforeEach(() => {
  mockFetch(fakeApi)
  vi.spyOn(console, 'error').mockImplementation((...args) => {
    throw new Error(`console.error: ${args.map(String).join(' ')}`)
  })
})

describe.each(FIXED_PAGES)('page $path', ({ path, titleKey }) => {
  it('renders without the 404 or server error page, with its tab title', async () => {
    renderAt(path)

    await waitFor(() =>
      expect(document.title).toBe(`${i18n.t(titleKey)} | ${SITE_NAME}`),
    )
    expect(
      screen.queryByRole('heading', { name: i18n.t('errors.notFound.title') }),
    ).toBeNull()
    expect(
      screen.queryByRole('heading', { name: i18n.t('errors.server.title') }),
    ).toBeNull()
  })

  it('links only to pages that exist', async () => {
    const { container } = renderAt(path)
    await waitFor(() =>
      expect(document.title).toBe(`${i18n.t(titleKey)} | ${SITE_NAME}`),
    )
    await new Promise((resolve) => setTimeout(resolve, 0))

    const broken = Array.from(container.querySelectorAll('a[href^="/"]'))
      .map((link) => link.getAttribute('href') ?? '')
      .filter((href) => findPage(href) === null)

    expect(broken).toEqual([])
  })
})
```

`src/main.test.tsx`, which boots the real entry file:

```tsx
import { screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import i18n from '@/i18n/config'
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
      expect(document.title).toBe(`${i18n.t('home.title')} | ${SITE_NAME}`),
    )
  })
})
```

`src/i18n/locales.test.ts`, which keeps every language complete:

```ts
import { describe, expect, it } from 'vitest'
import en from './locales/en.json'
import mn from './locales/mn.json'

function keysOf(messages: object, prefix = ''): string[] {
  return Object.entries(messages).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key
    return value !== null && typeof value === 'object' && !Array.isArray(value)
      ? keysOf(value, path)
      : [path.replace(/_(zero|one|two|few|many|other)$/, '')]
  })
}

function keySet(messages: object) {
  return [...new Set(keysOf(messages))].sort()
}

describe('locale files', () => {
  it.each([['mn', mn]])(
    '%s has exactly the keys of en, so no screen falls back to another language',
    (_, messages) => {
      expect(keySet(messages)).toEqual(keySet(en))
    },
  )
})
```

`src/components/home/welcome-section.test.tsx`, which asserts the real default-language text:

```tsx
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { WelcomeSection } from './welcome-section'

describe('WelcomeSection', () => {
  it('greets the visitor with the page heading', () => {
    render(<WelcomeSection />)

    expect(
      screen.getByRole('heading', { level: 1, name: 'Тавтай морил' }),
    ).toBeTruthy()
  })

  it('reveals the details on request and hides them again', () => {
    render(<WelcomeSection />)
    const toggle = screen.getByRole('button', { name: 'Дэлгэрэнгүй харах' })
    expect(toggle.getAttribute('aria-expanded')).toBe('false')

    fireEvent.click(toggle)

    expect(toggle.getAttribute('aria-expanded')).toBe('true')
    expect(
      screen.getByText('Апп өсөхийн хэрээр жинхэнэ хэсгүүд үүнийг орлоно.'),
    ).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Дэлгэрэнгүйг нуух' }))

    expect(
      screen.queryByText('Апп өсөхийн хэрээр жинхэнэ хэсгүүд үүнийг орлоно.'),
    ).toBeNull()
  })
})
```

## 7. Next.js setup

Next.js gets the same house setup as React + Vite, file for file wherever the framework allows. Identical for both:

- pnpm, the version policy, Biome and its format, oxlint, TypeScript strictness, `.gitignore` and editor files
- Tailwind v4, the brand tokens, the base CSS rules (the pointer cursor included) and shadcn
- the API client, zod, TanStack Query, the retry and cache defaults, the query-file pattern
- the i18n answer (next-intl when on, nothing when off)
- the app shell's components: layout, header, footer, status pages, sample section
- the test stack, helpers, coverage gate and test conventions
- coding standards, CLAUDE.md and README

The subsections that follow assume i18n with next-intl. 7.8 covers no i18n.

### 7.0 Execution order (Next.js)

1. Preflight (3.1)
2. Scaffold, `pnpm-workspace.yaml`, install (all packages, extras included, in two `pnpm add` calls) and shadcn init plus the chosen primitives (7.2, with 3.3 and the shadcn notes in 3.5)
3. Configuration: `package.json` (4.1 with the Next.js scripts below), `tsconfig.json`, `.oxlintrc.json`, `biome.json`, `next.config.ts` and env files (7.3), `src/app/globals.css` (4.6), `.gitignore` and editor files (4.9 merged as in 7.2)
4. App Router files (7.4) and i18n (7.5, or 7.8 without i18n)
5. Shared shell files, adapted (7.4a), extras (5.11) and theme (5.12)
6. Tests (7.6)
7. CLAUDE.md and README (9)
8. `pnpm lint:fix` and the final report (10)

**`package.json` scripts for Next.js** (written with the one-liner from 0.1 rule 11; `packageManager` and `engines` as in 4.1):

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "typecheck": "next typegen && tsc --noEmit",
    "lint": "biome check --error-on-warnings . && oxlint --deny-warnings",
    "lint:fix": "biome check --write --error-on-warnings . && oxlint --fix --deny-warnings",
    "format": "biome format --write .",
    "test": "vitest run --coverage",
    "test:watch": "vitest",
    "verify": "pnpm lint && pnpm typecheck && pnpm test && pnpm build"
  }
}
```

### 7.1 Framework-owned files

| Piece | React + Vite | Next.js (App Router) |
|---|---|---|
| Scaffold | `pnpm create vite@latest` | `pnpm create next-app@latest` (7.2), then upgrade everything it pinned |
| Scripts | `dev`, `build`, `preview` | `dev: next dev`, `build: next build`, `start: next start`, `typecheck: next typegen && tsc --noEmit`. The other scripts are unchanged; there is no `preview`. |
| TypeScript | three-file project references | the generated single `tsconfig.json` plus the house flags (7.3) |
| CSS entry | `src/index.css` | `src/app/globals.css`, with the same content; Tailwind runs through `@tailwindcss/postcss` |
| Fonts | `@fontsource-variable/*` import | `next/font` in `src/app/fonts.ts`, exposed as a CSS variable that is mapped to `--font-sans` |
| shadcn | `-t vite`, `rsc: false` | `-t next`, `rsc: true`, css `src/app/globals.css` |
| Routing | built-in router or TanStack Router | The App Router file system, with no custom router. `Link` and the navigation hooks come from `@/i18n/navigation` (next-intl), or from `next/link` and `next/navigation` without i18n. |
| Page registry | `src/pages.ts` drives rendering and titles | Not needed for routing. With several pages, keep `src/routes.ts` (`{ path, titleKey }[]`) for navigation, a sitemap and a route test. |
| index.html | preconnects and meta tags | The `[locale]` layout and `metadata`. Resource hints use `preconnect()` from `react-dom`, if wanted. |
| Titles | `useDocumentTitle` | `generateMetadata` per page. The `title.template` lives in the pass-through `src/app/layout.tsx`. |
| 404 and 500 | NotFoundPage, PageErrorBoundary, RootErrorBoundary | `[locale]/not-found.tsx` + `notFound()`, `[locale]/[...rest]/page.tsx`, `[locale]/error.tsx`, `global-error.tsx` |
| Providers | `main.tsx` | `src/app/providers.tsx` (`'use client'`), rendered by the `[locale]` layout |
| Data | TanStack Query in components | The same `apiRequest` in Server Components for the first render. TanStack Query for interactive client data. |
| Env vars | `VITE_*`, `import.meta.env`, `vite-env.d.ts`, Vite modes | `NEXT_PUBLIC_*` for the browser (inlined at build time), and unprefixed server-only values. Read with `process.env`, typed in `src/env.d.ts`. `.env.production` is always tracked; `.env.production.local` selects another environment. |
| i18n | i18next + react-i18next + detector | next-intl (recommended): it works in Server Components, handles locale routing and types the keys. i18next would stay client-only. |
| Lint | Biome + oxlint (`react`, `typescript`, `oxc`) | The same, plus the oxlint `nextjs` plugin and `allowExportNames` for Next's exports |
| Tests | `vitest.config.ts` merged with the Vite config | A standalone `vitest.config.mts` with `@vitejs/plugin-react`, jsdom and the alias. Mocks for `next/navigation`, `next/font/google` and `next-intl/server`. |

### 7.2 Scaffold and upgrade

```sh
pnpm create next-app@latest {{TARGET_DIR}} --ts --tailwind --app --src-dir --import-alias "@/*" \
  --use-pnpm --biome --no-react-compiler --empty --skip-install --disable-git --yes
cd {{TARGET_DIR}}
# write or merge pnpm-workspace.yaml (3.3) now, before any install
pnpm add next@latest react@latest react-dom@latest lucide-react@latest @tanstack/react-query@latest zod@latest next-intl@latest
pnpm add -D typescript@latest @types/node@{{NODE_LTS}} @types/react@latest @types/react-dom@latest \
  @biomejs/biome@latest tailwindcss@latest @tailwindcss/postcss@latest oxlint@latest \
  vitest@latest @vitest/coverage-v8@latest jsdom@latest @vitejs/plugin-react@latest \
  @testing-library/react@latest @testing-library/dom@latest
perl -e 'alarm 300; exec @ARGV' pnpm dlx shadcn@latest init -t next -b radix -p nova --no-pointer --no-monorepo -y < /dev/null
```

- **The generator flags.**
  - `--yes` fills the remaining prompts from saved preferences or defaults. That is why the React Compiler, git and installing are switched off explicitly.
  - `--skip-install` lets the build-script decisions in `pnpm-workspace.yaml` exist before the first install. If the generator wrote its own `pnpm-workspace.yaml`, merge it with 3.3; never overwrite it.
  - `--disable-git`: git is out of scope; the user adds it later.
- **Build scripts.** Write these decisions into `pnpm-workspace.yaml` before the first `pnpm add`, so pnpm never stops with `ERR_PNPM_IGNORED_BUILDS`: `allowBuilds: { "@parcel/watcher": false, "@swc/core": false, sharp: false, unrs-resolver: false }` (the first two come with next-intl; all four ship prebuilt binaries). Keep any other entry the generator wrote.
- **shadcn never waits for input.** Run every `shadcn` command wrapped as 0.1 rule 12 says. If a failed attempt left a `components.json`, delete it before running init again; otherwise init stops at an overwrite prompt and hangs.
- **`AGENTS.md` and `CLAUDE.md`.** create-next-app writes an `AGENTS.md`, Next's pointer to the version-matched docs in `node_modules/next/dist/docs/` (`next dev` re-adds it), and a `CLAUDE.md` that contains only `@AGENTS.md`.
  - Keep both, and put the house `CLAUDE.md` content below that first line.
  - Read the bundled docs before using a Next API you are unsure about.
- **Clean up the generated files:**
  - Replace the generated `biome.json` with 4.4, adding `"!next-env.d.ts"` to `files.includes`.
  - Delete any demo `page.tsx`, `layout.tsx` and `public/*.svg`; 7.4 replaces them.
  - shadcn init on Next adds no font package: it puts a `next/font` Geist import and its variable into `layout.tsx` (which 7.4 or 7.8 replaces) and writes `--font-sans: var(--font-sans);` into `globals.css`. Replace that line as 4.6 says and keep `--font-heading: var(--font-sans);`.
- **`.gitignore`.** Merge the generated entries (`.next/`, `out/`, `next-env.d.ts`, `.vercel`, `*.tsbuildinfo`, `/build`, `*.pem`) into the house file (4.9), and drop the Yarn and PnP lines. Replace its `.env*` rule with `.env` and `.env*.local`, so the per-environment files can be tracked.

### 7.3 Config differences

**`tsconfig.json`:** keep what create-next-app writes:

- the `next` plugin, `paths` and `incremental`
- the `include` list, which already covers `**/*.mts`

Then set `target` to `es2023`, and add the house flags: `strict`, `verbatimModuleSyntax`, `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`, `noFallthroughCasesInSwitch` and `noUncheckedSideEffectImports`. Do not use `.tsx` extensions in imports.

**`.oxlintrc.json`:** the same as 4.5, except:

- `"plugins": ["react", "typescript", "oxc", "nextjs"]`
- `next-env.d.ts` added to `ignorePatterns`
- Next's special exports allowed next to components. This excerpt of `rules` shows how:

```json
"react/only-export-components": [
  "warn",
  {
    "allowConstantExport": true,
    "allowExportNames": [
      "metadata",
      "generateMetadata",
      "generateStaticParams",
      "viewport",
      "generateViewport",
      "dynamic",
      "dynamicParams",
      "revalidate",
      "fetchCache",
      "runtime",
      "preferredRegion",
      "maxDuration"
    ]
  }
]
```

**`next.config.ts`:**

```ts
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },
}

export default withNextIntl(nextConfig)
```

**Environment variables:**

- Track `.env.development` and `.env.production` (with `NEXT_PUBLIC_API_URL`) always. Without `.env.production`, `next build` throws while prerendering.
- `src/env.d.ts` types the variables.
- `lib/api.ts` reads `process.env.NEXT_PUBLIC_API_URL` written out in full, because Next only inlines a variable that is not destructured or computed. It fails fast with the same message, naming `NEXT_PUBLIC_API_URL`.
- The `test.env` placeholder is `NEXT_PUBLIC_API_URL`.

`src/env.d.ts`:

```ts
declare namespace NodeJS {
  interface ProcessEnv {
    readonly NEXT_PUBLIC_API_URL: string
  }
}
```

### 7.4 App Router layout

```text
src/
  proxy.ts                         next-intl locale handling (the file was called middleware.ts before Next 16)
  env.d.ts                         typed process.env
  app/
    layout.tsx                     pass-through root: the title template only
    globals.css                    Tailwind, shadcn tokens, brand tokens (4.6)
    fonts.ts                       next/font definitions
    providers.tsx                  'use client': QueryClientProvider
    global-error.tsx               'use client': replaces the root layout when it fails; own <html>
    [locale]/
      layout.tsx                   <html lang>, fonts, NextIntlClientProvider, Providers, AppLayout
      page.tsx                     home: generateMetadata + sections
      not-found.tsx                localized 404 with its own title
      error.tsx                    'use client': page-level error boundary
      [...rest]/page.tsx           unknown addresses under a locale → notFound()
    not-found.tsx                  404 for addresses the proxy never sees (files with an extension); own <html> in the default language, absolute title, a plain next/link home, and a test that renders it into `document`
  components/ hooks/ lib/ queries/ i18n/ test/     as in the SPA
```

`src/app/layout.tsx`:

```tsx
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { SITE_NAME } from '@/lib/site'

export const metadata: Metadata = {
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
}

// [locale]/layout.tsx renders <html> in the visitor's language; this root passes through.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children
}
```

`src/app/[locale]/layout.tsx`:

```tsx
import { NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { fontSans } from '@/app/fonts'
import { Providers } from '@/app/providers'
import { AppLayout } from '@/components/layout/app-layout'
import { readLocale } from '@/i18n/locale'
import { routing } from '@/i18n/routing'
import '@/app/globals.css'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<'/[locale]'>) {
  const locale = await readLocale(params)
  setRequestLocale(locale)

  return (
    <html lang={locale} className={fontSans.variable}>
      <body>
        <NextIntlClientProvider>
          <Providers>
            <AppLayout>{children}</AppLayout>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

`src/app/[locale]/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { WelcomeSection } from '@/components/home/welcome-section'
import { readLocale } from '@/i18n/locale'

export async function generateMetadata({
  params,
}: PageProps<'/[locale]'>): Promise<Metadata> {
  const t = await getTranslations({ locale: await readLocale(params) })
  return { title: t('home.title') }
}

export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  setRequestLocale(await readLocale(params))

  return <WelcomeSection />
}
```

`src/app/[locale]/not-found.tsx`. Its client part with the Back button is `components/shared/not-found-page.tsx`: the SPA's NotFoundPage, using `useRouter` and `Link` from `@/i18n/navigation`, and `goBack((to) => router.push(to))`.

```tsx
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { NotFoundPage } from '@/components/shared/not-found-page'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations()
  return { title: t('errors.notFound.title') }
}

export default function NotFound() {
  return <NotFoundPage />
}
```

`src/app/[locale]/[...rest]/page.tsx`:

```tsx
import { notFound } from 'next/navigation'

// Any address under a locale that no page claims gets the localized 404 page.
export default function CatchAllPage() {
  notFound()
}
```

`src/app/providers.tsx`:

```tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode, useState } from 'react'
import { retryFailedRequest } from '@/queries/retry'
import { DEFAULT_GC_TIME, DEFAULT_STALE_TIME } from '@/queries/stale-time'

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: DEFAULT_STALE_TIME,
            gcTime: DEFAULT_GC_TIME,
            refetchOnWindowFocus: false,
            retry: retryFailedRequest,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
```

`src/app/fonts.ts`. Include the subsets the languages need; `cyrillic` covers Mongolian.

```ts
import { Inter } from 'next/font/google'

export const fontSans = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-app-sans',
  display: 'swap',
})
```

In `globals.css`, set `--font-sans: var(--font-app-sans), ui-sans-serif, system-ui, sans-serif;` and add no fontsource import.

**The remaining files:**

- **`[locale]/error.tsx`** is the SPA's ServerErrorPage as a client component, with `export default function PageError({ error }: { error: Error })`. It logs with `console.error('Page failed to render', error)` in a `useEffect`, and its Back button uses `goBack((to) => router.push(to))`.
- **`global-error.tsx`** is RootErrorBoundary's fallback as a client component:
  - It renders its own `<html lang="{{DEFAULT_LANG}}"><body>` and imports `globals.css`.
  - It uses default-language strings and no providers.
  - It logs in a `useEffect`.
- **Client and server components.** Components that use state, effects, event handlers, browser APIs or TanStack Query hooks start with `'use client'`; WelcomeSection and the language switcher are examples. The header, footer and layout stay Server Components. next-intl's `useTranslations` works in both.
- **The language switcher** uses `useLocale()` from `next-intl` and `router.replace(pathname, { locale: code })` from `@/i18n/navigation`, over `routing.locales`.

### 7.4a Shared shell files, adapted

Write every file from section 5 that is not framework-owned, with only these changes. Nothing else in them differs.

| File (section) | Next.js change |
|---|---|
| `lib/site.ts`, `lib/utils.ts`, `queries/retry.ts`, `queries/stale-time.ts`, `queries/<resource>/*` (5.2, 5.8) | none |
| `lib/api.ts` (5.7) | reads `process.env.NEXT_PUBLIC_API_URL`, written out in full, and names it in the error (7.3) |
| `lib/navigation.ts` (5.3) | none; callers pass `(to) => router.push(to)` |
| `hooks/use-debounced-value.ts` (5.8), only together with the first search box | `'use client'` is not needed in a hook file; the components that call it are client components |
| `components/layout/app-layout.tsx` (5.6) | none; a Server Component |
| `components/layout/site-header.tsx` (5.6) | `Link` from `@/i18n/navigation` (or `next/link` without i18n) instead of `AppLink` |
| `components/layout/site-footer.tsx` (5.6) | `useTranslations()` from `next-intl` instead of `useTranslation()`; `t('footer.copyright', { year, site })` stays |
| `components/layout/language-switcher.tsx` (5.6) | `'use client'`; as described in 7.4 |
| `components/shared/status-page.tsx` (5.5) | none |
| `components/shared/not-found-page.tsx` (5.5 NotFoundPage) | `'use client'`; `useTranslations()`, `useRouter` and `Link` from `@/i18n/navigation`, `goBack((to) => router.push(to))` |
| `app/[locale]/error.tsx` (5.5 ServerErrorPage + PageErrorBoundary) | as described in 7.4 |
| `app/global-error.tsx` (5.5 RootErrorBoundary) | as described in 7.4 |
| `components/shared/data-table.tsx`, `components/layout/theme-toggle.tsx` (5.11, 5.12) | `'use client'` first; `useTranslations()` from `next-intl` instead of `useTranslation()` |
| `components/home/welcome-section.tsx` (5.10) | `'use client'` first; `useTranslations()` from `next-intl` instead of `useTranslation()` |
| `lib/router/*`, `components/shared/app-link.tsx`, `pages.ts`, `App.tsx`, `main.tsx`, `hooks/use-document-title.ts`, `hooks/use-locale.ts`, `i18n/config.ts` | not created; the App Router, `generateMetadata` and next-intl own these jobs |

Without i18n, the `t(...)` calls become the inline strings in the chosen language.

### 7.5 i18n with next-intl

`src/i18n/routing.ts`:

```ts
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['mn', 'en'],
  defaultLocale: 'mn',
  localePrefix: 'as-needed',
})
```

`src/i18n/navigation.ts`:

```ts
import { createNavigation } from 'next-intl/navigation'
import { routing } from '@/i18n/routing'

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
```

`src/i18n/request.ts`:

```ts
import { hasLocale } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'
import { routing } from '@/i18n/routing'

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale

  return {
    locale,
    messages: (await import(`./locales/${locale}.json`)).default,
  }
})
```

`src/i18n/locale.ts`:

```ts
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { routing } from '@/i18n/routing'

export async function readLocale(params: Promise<{ locale: string }>) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  return locale
}
```

`src/i18n/types.d.ts`:

```ts
import type { routing } from '@/i18n/routing'
import type messages from './locales/en.json'

declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number]
    Messages: typeof messages
  }
}
```

`src/proxy.ts`:

```ts
import createMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
}
```

- **Message syntax.** next-intl messages use ICU syntax: `"© {year} {site}"` with single braces, and plurals inside the message (`"{count, plural, one {# result} other {# results}}"`) instead of `_one`/`_other` keys. The locale parity test works unchanged.
- **Calls per file.** Every page and layout under `[locale]` calls `readLocale(params)` and `setRequestLocale(locale)`, so it can render statically. Client components call `useTranslations()`. Server Components with async work call `await getTranslations({ locale })`.

### 7.6 Tests

`vitest.config.mts`. Next.js has no Vite config to merge with, and next-intl needs inlining.

```ts
import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['./src/test/setup.ts'],
    env: {
      NEXT_PUBLIC_API_URL: 'https://api.test/api',
    },
    css: false,
    server: { deps: { inline: ['next-intl'] } },
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/**/*.d.ts',
        'src/test/**',
        'src/components/ui/**',
      ],
      thresholds: {
        perFile: true,
        lines: 80,
        statements: 80,
        functions: 80,
        branches: 80,
      },
      reporter: [
        ['text', { skipFull: true, maxCols: 140 }],
        'text-summary',
        'html',
      ],
    },
  },
})
```

`src/test/next-router.ts`:

```ts
import { vi } from 'vitest'

export const nextRouter = {
  push: vi.fn((href: string) => window.history.pushState({}, '', href)),
  replace: vi.fn((href: string) => window.history.replaceState({}, '', href)),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn(),
}
```

`src/test/setup.ts` for Next.js:

```ts
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

vi.mock('next/navigation', async (importOriginal) => {
  const { nextRouter } = await import('@/test/next-router')
  return {
    ...(await importOriginal<typeof import('next/navigation')>()),
    useRouter: () => nextRouter,
    usePathname: () => window.location.pathname,
    useSearchParams: () => new URLSearchParams(window.location.search),
    useParams: () => ({}),
    notFound: vi.fn(() => {
      throw new Error('NEXT_NOT_FOUND')
    }),
  }
})

vi.mock('next/font/google', () => ({
  Inter: () => ({ className: 'font-inter', variable: 'font-inter-variable' }),
}))

vi.mock('next-intl/server', async () => {
  const { createTranslator } = await import('next-intl')
  const messages = {
    mn: (await import('@/i18n/locales/mn.json')).default,
    en: (await import('@/i18n/locales/en.json')).default,
  }
  return {
    getRequestConfig: (config: unknown) => config,
    setRequestLocale: () => {},
    getTranslations: async ({ locale = 'mn' }: { locale?: 'mn' | 'en' } = {}) =>
      createTranslator({ locale, messages: messages[locale] }),
  }
})

window.scrollTo = () => {}
Element.prototype.scrollIntoView = () => {}
window.matchMedia ??= (query: string) =>
  ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }) as MediaQueryList

class NoopObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}
globalThis.ResizeObserver ??= NoopObserver as unknown as typeof ResizeObserver

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
  vi.useRealTimers()
  localStorage.clear()
  window.history.replaceState({}, '', '/')
})
```

`src/test/utils.tsx` for Next.js. `createTestQueryClient`, `jsonResponse` and `mockFetch` are unchanged from 6.3; `clickLeftToBrowser` is dropped, because navigation is Next's job.

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import { type Locale, NextIntlClientProvider } from 'next-intl'
import type { ReactNode } from 'react'
import mn from '@/i18n/locales/mn.json'

// ...createTestQueryClient, jsonResponse and mockFetch exactly as in 6.3

export function renderWithProviders(
  ui: ReactNode,
  {
    path = '/',
    locale = 'mn',
    messages = mn,
  }: { path?: string; locale?: Locale; messages?: typeof mn } = {},
) {
  window.history.replaceState({}, '', path)
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <QueryClientProvider client={createTestQueryClient()}>
        {ui}
      </QueryClientProvider>
    </NextIntlClientProvider>,
  )
}
```

**The Next.js test inventory.**

**Kept from 6.4:**

- `lib/api.test.ts` (reading `NEXT_PUBLIC_API_URL`), `queries/retry.test.ts` and `lib/navigation.test.ts`
- `i18n/locales.test.ts`
- `welcome-section.test.tsx`, now rendered through `renderWithProviders`
- the header and footer layout test
- the status-page components: `components/shared/not-found-page.tsx`, with Back asserted through `nextRouter.push`

**Dropped:** the router, app-link, `App`, `main`, `pages`, `use-document-title`, `use-locale` and `i18n/config` tests, and both error-boundary classes.

**Added:**

- **`app/layout.test.tsx`:** the title template and default; the component returns its children.
- **`app/[locale]/layout.test.tsx`:**
  - `const html = await LocaleLayout({ children, params: Promise.resolve({ locale: 'en' }) } as never)`, then assert `html.props.lang`.
  - An unknown locale rejects with `NEXT_NOT_FOUND`, and `notFound` was called.
- **`app/[locale]/page.test.tsx`:**
  - `await generateMetadata({ params: Promise.resolve({ locale: 'en' }) } as never)`.
  - `render(<NextIntlClientProvider locale="en" messages={en}>{await HomePage({ params: Promise.resolve({ locale: 'en' }) } as never)}</NextIntlClientProvider>)`.
- **`app/[locale]/not-found.test.tsx`** (its metadata and render) and **`app/[locale]/[...rest]/page.test.tsx`** (it calls `notFound`).
- **`app/[locale]/error.test.tsx`:** it logs, Back pushes, and Refresh calls the mocked `reloadPage`.
- **`app/global-error.test.tsx`:** `render(<GlobalError error={error} />, { container: document } as never)`, since it renders its own `<html>`.
- **`app/providers.test.tsx`:** a child that calls `useQueryClient()` gets a client with the house defaults.
- **`proxy.test.ts`:** in jsdom, `await proxy(new NextRequest('http://localhost/'))` answers with `x-middleware-rewrite: http://localhost/mn` for the default locale.
- **`i18n/request.test.ts`:** with `getRequestConfig` mocked as identity, `{ requestLocale: Promise.resolve('de') }` gives the default locale, and `'en'` gives the English messages.
- **`i18n/locale.test.ts`:** `readLocale` accepts a known locale and calls `notFound` for an unknown one.
- **`components/layout/language-switcher.test.tsx`:** `aria-pressed`, and `nextRouter.replace` is called with the chosen locale.
- **With several pages, `src/routes.test.ts`:** every `src/routes.ts` entry has an `app/**/page.tsx` (`import.meta.glob('/src/app/**/page.tsx')` works in Vitest), and every page file is registered.

**Links** are asserted by their `href`, not clicked. Buttons that navigate are asserted through `nextRouter.push` and `nextRouter.replace`.

### 7.7 Server and client components

- **Server by default.** Components are Server Components unless marked. Add `'use client'` only for state, effects, event handlers, browser APIs, TanStack Query hooks and context consumers. Keep client components small and near the leaves.
- **Crossing the boundary.** Pass server-fetched data to client components as serializable props. Never import server-only modules (secrets, `next/headers`) into client code. Mark such modules with `import 'server-only'`, and mock it as an empty module in tests.
- **First-render data.** Fetch it in Server Components with the same zod-validated `apiRequest`.
  - To pass Next's cache options, give `RequestInput` an `init?: RequestInit` that is passed to `fetch`.
  - Choose caching explicitly per call: `cache: 'force-cache'`, `next: { revalidate: N }`, or the installed Next's cache model. `fetch` is not cached by default.
- **Interactive client data** (search as you type, paging without navigation) uses TanStack Query. Optionally prefetch on the server and hand over with `HydrationBoundary`.
- **Params and the query string.** `params` and `searchParams` are Promises in pages and layouts. Filters and paging live in the query string: read them from `searchParams` on the server, and change them with `router.replace(href, { scroll: false })` on the client.
- **Detail pages.** A 4xx from the API calls `notFound()`. Anything else throws to `error.tsx`.

### 7.8 Next.js without i18n

There is no next-intl, `src/i18n`, `[locale]` segment, `[...rest]`, `proxy.ts` or language switcher. Strings are written inline in components; links and navigation come from `next/link` and `next/navigation`.

The routes sit at the root of `app/`:

- `app/layout.tsx`
- `app/page.tsx`
- `app/not-found.tsx`, which also catches unknown addresses
- `app/error.tsx`
- `app/global-error.tsx`

`next.config.ts` is 7.3 without `createNextIntlPlugin`. Query keys and requests drop the locale.

`src/app/layout.tsx`:

```tsx
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { fontSans } from '@/app/fonts'
import { Providers } from '@/app/providers'
import { AppLayout } from '@/components/layout/app-layout'
import { SITE_NAME } from '@/lib/site'
import '@/app/globals.css'

export const metadata: Metadata = {
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: '{{SITE_DESCRIPTION}}',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="{{DEFAULT_LANG}}" className={fontSans.variable}>
      <body>
        <Providers>
          <AppLayout>{children}</AppLayout>
        </Providers>
      </body>
    </html>
  )
}
```

- **Titles in the root segment.** A title template does not apply to its own segment, and `app/page.tsx` and `app/not-found.tsx` share the root segment. So both set an absolute title, for example `export const metadata: Metadata = { title: { absolute: \`<home title> | ${SITE_NAME}\` } }`, and pages in their own folders set a plain `title`.
- **Tests:**
  - In `vitest.config.mts`, drop `server.deps.inline` and its comment: it exists only for next-intl.
  - Drop the `next-intl/server` mock and the `NextIntlClientProvider` in `renderWithProviders`, which then wraps only `QueryClientProvider` (or nothing, without an API).
  - Drop the locale parity, `proxy`, `request` and `locale` tests.
  - Test `app/layout.tsx` by calling it and asserting `html.props.lang === '{{DEFAULT_LANG}}'`.

## 8. Coding standards

These rules apply to all work in the new project, for both frameworks. Copy this section into `CLAUDE.md` (section 9).

**Formatting and linting**

1. Biome formats everything (4.4). Run `pnpm lint:fix`; never format against it by hand.
2. `pnpm lint` (Biome + oxlint, zero warnings) and `pnpm typecheck` pass before a change is called done.
3. Suppress a rule only as `// biome-ignore <group>/<rule>: <concrete reason>`, for example `// biome-ignore lint/style/noNonNullAssertion: index.html always provides #root`. "see above" is not a reason. Never use `@ts-ignore`, `@ts-expect-error`, `eslint-disable` or `oxlint-disable`.

**Files, exports and naming**

4. File names are kebab-case: `scroll-to-top-button.tsx`, `use-debounced-value.ts`. The suffixes are `*-page.tsx`, `*-section.tsx`, `*-card.tsx`, `use-*.ts` and `*.test.ts(x)`. Use `.tsx` only for files with JSX.
5. Use named exports, written as `export function Name()`. Default exports appear only where something requires them: the `App` entry, the i18n instance, tool config files, and the Next.js special files (`page`, `layout`, `not-found`, `error`, `global-error`).
6. Export one component per file. Small private subcomponents stay unexported in the same file. Constants may be exported next to a component.
7. Components are function declarations. Never write them as arrow constants, never use `React.FC`, and never use `forwardRef` (`ref` is a regular prop in React 19). Class components are only for error boundaries.
8. Names:
   - PascalCase components: `XxxSection`, `XxxPage`, `XxxCard`
   - `useXxx` hooks, `getXxx` fetchers, `fetchXxxOptions` query-option factories
   - `XxxSchema` zod schemas, with `type Xxx = z.infer<typeof XxxSchema>`
   - booleans that read as states: `isLoading`, `open`, `copied`
   - callback props `onXxx`, and handlers `handleXxx` or a verb (`goToPage`)
   - module-level constants, magic numbers and reused class strings in SCREAMING_SNAKE: `MIN_SEARCH_LENGTH`, `CARD_CLASS`
9. Props:
   - An inline object type on the destructured parameter for small components.
   - `interface XxxProps` when a component is page-level or has many props.
   - `type` for unions and intersections.
   - Defaults go in the destructuring.
   - Reusable components accept `className?: string` and merge it with `cn()`.
10. Use no enums, namespaces or parameter properties. Use `as const` arrays with derived union types instead: `type Lang = (typeof supportedLanguages)[number]`.

**Imports**

11. Use the `@/` alias for every import across folders. Relative imports are only for siblings within one tight module (`queries/<resource>/*`, `i18n/*`), and for a test importing the unit under test.
12. Type-only imports use `import type` or an inline `type` specifier. Import zod as `import * as z from 'zod'`, or `import type * as z from 'zod'` for types only. Use one import statement per module; Biome orders them.

**Styling**

13. Use Tailwind utilities only.
    - Compose class lists with `cn()` from `@/lib/utils`, never with template literals.
    - Long or reused class strings become SCREAMING_SNAKE constants.
    - `cva` is used only inside `components/ui`.
    - The pattern is `cn(BASE, active ? ACTIVE : INACTIVE, flag && EXTRA, className)`.
14. App code uses the `brand-*` tokens, never a raw palette color (`neutral-200`) or a hex value in a class. shadcn's semantic tokens belong to `components/ui`. Use arbitrary values only where no token fits, such as container widths.
15. Mobile-first: base classes are for phones, then `sm:`, `md:`, `lg:`, `xl:`.
    - `size-*` for icons, and `gap-*` rather than margins.
    - `min-w-0 truncate` and `shrink-0` against overflow.
    - `motion-safe:` on animations, and state from data attributes (`data-[state=open]:`).
    - `scroll-mt-*` on anchor targets under a sticky header.
    - The section recipe: `<section className="w-full py-12 lg:py-16"><div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 md:px-14">`.
16. Every clickable element shows a pointer. The base CSS rule covers `button` and `[role="button"]`. Add `cursor-pointer` to anything else that is clickable, `disabled:cursor-not-allowed` to disabled controls, and `cursor-grab` to drag handles.
17. Follow the theme answer (5.12): with light + dark, every brand surface, border and text class has its `dark:` partner from the `-dark` tokens; with one theme, write no `dark:` classes.

**Comments**

18. Comment only a special function or component, one whose purpose or behaviour is not obvious from the code: one line directly above it, never more (a normal sentence, not a paragraph). Ordinary code, JSX, props, tests and simple helpers get no comments. Never write multi-line explanation blocks.
19. Use no JSDoc blocks; the one-line rule in 18 covers every comment.
20. Write no banner or divider comments, no end-of-line comments and no TODO, FIXME or HACK markers.
21. Delete dead code, together with its translations, assets and tests. When asked to disable code temporarily, comment it out bare, with no explanatory note such as "hidden for now" or "kept for later".

**State and effects**

22. Where state lives:
    - Server state lives in TanStack Query.
    - URL state (filters, tabs, paging) lives in the query string, so a reload restores the view and a link shares it.
    - Local UI state uses `useState`.
    - Context is only for cross-cutting infrastructure (router, theme). There is no global store.
23. Derive values during render. Never mirror props or query data into state. Use `useMemo` and `useCallback` only for expensive work or for identities that matter.
24. `useEffect` is only for syncing with the outside world (listeners, timers, the document title, scrolling). It always has cleanup and never fetches data. Timer logic moves into a hook (`useDebouncedValue`).
25. Mark intentionally floating promises with `void`.
26. Wrap browser side effects that jsdom cannot perform (`location.reload`, `location.assign`) in tiny named functions in `lib/`, so tests mock only those.

**Data layer**

27. All server access goes through `lib/api.ts` (zod-validated) and `queries/<resource>/{type,query,options}.ts`. Every response is validated, and schemas mirror the API's field names.
28. Query keys come from a keys factory: `[resource, 'list', locale, ...filters]` and `[resource, 'detail', id, locale]`, with defaults normalized. The locale is part of every localized key and request.
29. Encode path segments with `encodeURIComponent`, send page sizes explicitly, and leave blank searches out.
30. Queries inherit `staleTime` and `gcTime` from the client defaults and override them only when they need to. Paged and searchable lists use `placeholderData: keepPreviousData`.

**UI states and errors**

31. Every data-driven section renders four states in one ternary chain:
    - loading: a skeleton shaped like the content, with `animate-pulse` on a brand surface token
    - error: a translated message, plus a retry through `refetch()` where useful
    - empty: a translated message
    - then the content
32. In detail views, a 4xx shows a not-found state inside the page frame. No answer, a 5xx or a bad shape shows the server error page (`isServerError`).
33. Write `cond ? <X /> : null`, not `cond && <X />`.
34. `console.error` appears only in error boundaries, with a context label. There is no stray `console.log`.

**i18n (when on)**

35. No hardcoded user-facing strings, including `aria-label`, `placeholder`, `alt` and `title`. The only exceptions are brand and product names and social network names.
36. Keys nest by area, then section, then item. Keys held in data use `ParseKeys` (with next-intl, its typed message keys). Data-driven lists are `as const` tables with template keys, such as ``t(`home.cards.${card.key}.title`)``.
37. Every locale file changes in the same commit; the parity test enforces it. Plurals and interpolation use the library's syntax.

**Accessibility**

38. Use semantic landmarks (`header`, `nav`, `main`, `footer`, `section`, `article`). One `h1` per page, `h2` for sections and `h3` for cards. Use `ol`/`ul` for lists, and give tables `th scope`.
39. State goes through ARIA:
    - `aria-current="page"` on the active link, crumb or page number
    - `aria-pressed` on toggles, and `aria-expanded` on disclosures
    - `role="tablist"`/`tab` with `aria-selected`
    - `aria-live="polite"` on async results and form status
    - `aria-busy` while stale data shows
40. Labels and hiding:
    - Every icon-only button has a translated `aria-label`.
    - Every input has a `<label>`, visually hidden if need be, tied to it with an id from `useId()`.
    - Decorative icons and separators get `aria-hidden="true"`.
    - A mounted but hidden focusable element gets `tabIndex={-1}` and `aria-hidden`.
41. Every `<button>` has an explicit `type`. Internal navigation uses real links (`AppLink`, or the framework's `Link`), never click handlers on non-links.
42. Links, images and motion:
    - External links get `target="_blank" rel="noopener noreferrer"`.
    - Decorative images get `alt=""`, images below the fold get `loading="lazy"`, and the LCP image gets `fetchPriority="high"`.
    - Respect `prefers-reduced-motion` for smooth scrolling and animation.

**Testing**

43. Every change ships with tests that cover it, and the per-file coverage gate (`{{COVERAGE}}`% on lines, statements, functions and branches) passes. Never lower the thresholds, add coverage excludes for app code, or add coverage-ignore comments.
44. Tests sit next to their code as `name.test.ts(x)`, and helpers live only in `src/test/`. Import `describe`, `it`, `expect` and `vi` from `vitest` explicitly.
45. Test structure:
    - `describe('<Unit>')` with `it('<behaviour in present tense, from the user's point of view>')`. No "should", and `it` rather than `test`.
    - Arrange, act and assert are separated by blank lines.
    - Use `it.each` tables for input/output cases.
46. Query by role and accessible name first (`getByRole`, `findByRole`, `within`), then `getByLabelText`, then `getByText`. Use `querySelector` only with a comment saying why. No `data-testid`, and no snapshots.
47. Assert the real rendered default-language strings, not keys; registry-driven tests may compute them with `i18n.t`. Presence is `expect(screen.getByRole(...)).toBeTruthy()`, absence is `expect(screen.queryByRole(...)).toBeNull()`, and attributes are compared directly (`getAttribute('aria-pressed')`).
48. Mocking:
    - Mock only the network (`mockFetch`), third-party SDKs, and the tiny browser-API wrappers.
    - In tests, spy on browser APIs with `vi.spyOn` and never reassign them. Only `src/test/setup.ts` stubs what jsdom lacks.
    - Do not restore or clear mocks by hand; the setup file does.
    - Silence an expected React error log in that test with `vi.spyOn(console, 'error').mockImplementation(() => {})`.
49. Fixtures are factory functions with overrides. For async work, prefer `await findBy…`, then `waitFor`. Use fake timers only inside the test that needs them. Use `fireEvent`, or `userEvent` when that extra was chosen.
50. Cover the error, empty and loading branches, not just the happy path. Registered pages get the registry checks automatically, but their behaviour still needs its own tests.

**Dependencies and process**

51. pnpm only. Add packages with `@latest`, using `-D` for build and test tools. shadcn primitives come from `pnpm dlx shadcn@latest add <name>`, followed by `pnpm lint:fix`. Never hand-edit `components/ui/*`, and delete primitives nothing uses.
52. Update README.md and CLAUDE.md in the same change whenever commands, versions or conventions change.

## 9. CLAUDE.md and README

Create `CLAUDE.md` at the project root. For Next.js, put it below the existing `@AGENTS.md` line. Every future session reads it, so it holds rules, not history. Its sections:

1. **`# {{SITE_NAME}}`** and one paragraph: what the app is, the framework, the router or output mode, the languages, the API mode and the theme.
2. **`## Commands`:** a table of every package.json script and what it does, plus `pnpm dlx shadcn@latest add <name>` followed by `pnpm lint:fix`.
3. **`## Architecture`:** the folder map as it actually exists, and where new things go:
   - a page: `pages/` plus `PAGES`, or a route file, or an `app/[locale]/…/page.tsx`
   - a section: `components/<feature>/`
   - a resource: the three query files, with the template from 5.8
   - an env var: the four places from 4.7
   - a translation key: every locale file
4. **`## Coding standards`:** section 8 word for word, with the conditional rules resolved for this project. For Next.js, resolve the Vite wording too: `Link` from `next/link` (or `@/i18n/navigation`) instead of `AppLink`; default exports only for tool configs and the Next special files; and add the server/client rules from 7.7. Drop what does not apply, such as the i18n rules without i18n, or `dark:` without dark mode.
5. **`## Testing`:** the helpers in `src/test/`, the registry test, how to read the coverage table and `coverage/index.html`, and the gate.
6. **`## Before you call a change done`:** `pnpm lint`, `pnpm typecheck`, `pnpm test` (with the gate) and `pnpm build`, plus README and CLAUDE.md updated if a command or convention changed.

Keep it concrete and readable in one pass.

Write `README.md` for people. It covers:

- a one-line description
- a stack table with the installed versions
- requirements: Node `>= {{NODE_LTS}}`, and the pnpm version from `packageManager`
- getting started: `pnpm install`, `pnpm dev`
- the commands and the environment variables
- tests: how to run them, the coverage rule, the HTML report, the helpers and the registry test
- the project layout
- adding UI with shadcn
- translations: typed keys, every locale file
- a pointer to CLAUDE.md for conventions

Everything in it must match the project as built.

## 10. Hand-over

1. Run `pnpm lint:fix` once. It formats every written file. oxlint prints nothing when it passes; an exit code of 0 is enough, so do not run it again. If it reports an error, fix the cause and run it once more. Run nothing else.
2. Finish with this short report, and nothing longer:

```markdown
## {{SITE_NAME}} is ready

Created at `{{TARGET_DIR}}`.

| Decision | Choice |
|---|---|

**Installed:** next/vite <version>, react <version>, typescript <version>, tailwindcss <version>, vitest <version> (from the install output, no extra commands).

**Check it:** `cd {{TARGET_DIR}} && pnpm verify` runs lint, type-check, tests with the 80% coverage gate, and the build. `pnpm dev` starts the app.

**Fill in:** `.env.development` and `.env.production` (`<API_URL_DEV>`, `<API_URL_PROD>`), when there is an API.

**Deviations:** …
```
