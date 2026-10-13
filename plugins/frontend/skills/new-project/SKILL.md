---
name: new-project
description: Run in the folder where a new project should go. Creates a React + Vite or Next.js app with the team setup (pnpm, strict TS, Tailwind v4 + shadcn, Biome + oxlint, TanStack Query, optional i18n, light/dark theme, Vitest 80% coverage gate) from one question form, or straight from arguments such as `next my-shop mn,en forms,toasts`. Renders a checked template, so the build takes about two minutes.
argument-hint: "[vite|next] [name or path] [mn | en | mn,en …] [forms,tables,toasts,theme | none]"
disable-model-invocation: true
---

# Frontend Project Bootstrap

**Purpose.** Create a new frontend project in the team's house setup:

- pnpm and strict TypeScript
- Tailwind CSS v4 with design tokens, and shadcn/ui
- Biome and oxlint
- a zod-validated API client with TanStack Query
- i18n when asked for
- a Vitest + Testing Library suite with a per-file coverage gate, already at 100%

React + Vite and Next.js get the identical house setup; only the files the framework owns differ.

**How it works.** `<skill dir>` below is the base directory this skill was loaded from (shown when it loads). Every file of the project lives in `<skill dir>/template/`, already written, formatted and checked with `pnpm verify` for both frameworks, with and without i18n, and with every extra. `scaffold.mjs` renders the template for the form's answers, writes `package.json`, installs every package at `@latest`, adds the chosen shadcn primitives, fills the README versions and runs `pnpm lint:fix`. You ask the form, run one command, and report. You never write the template's files by hand.

**Out of scope, always:** git, git hooks, CI, Docker, nginx, Kubernetes, Vercel and any other deployment. Never create, install or ask about them.

## 0. Rules

1. **Ask first, unless the arguments already answer** (1.0). Otherwise your first message is the question form (1.1). Until it is answered you may only read, for example the current directory's name to suggest a project name. Create, install and change nothing.
2. **At most one form, then no more questions.** Every other value has a default (1.3).
3. **Run the generator; do not rewrite its output.** Edit generated files only for an adaptation in `reference/` that the user asked for, or to fix a failure. Read no library docs or `node_modules` unless a step fails.
4. **pnpm is the only package manager.** Never npm, yarn or npx.
5. **Never weaken a gate.** Do not lower the coverage threshold, add coverage-ignore comments, disable a lint rule for app code or relax a TypeScript flag.
6. **Invent no product content, endpoints or data.** The shell is one home page with a sample section, the 404 and 500 pages, and the infrastructure.
7. **Work only inside the target directory.** It must not exist yet, or must be empty, and must never be inside another project's repository; use a sibling folder.
8. **Run no checks yourself.** The generator ends with `pnpm lint:fix`; the user runs `pnpm verify`. The exception is an adaptation from `reference/`, which is followed by one `pnpm verify`.
9. **Keep a short "Deviations" list** of everything that differs from this file (a held-back version, a reference adaptation, a failed step you fixed). It goes into the report.

## 1. Interview

### 1.0 Arguments

Arguments after the skill's command answer the form up front, in the order `<framework> <name> <languages> [extras]`, for example `next my-shop mn,en forms,toasts` or `vite ../apps/admin-panel mn`:

- **framework:** `vite` or `next`.
- **name:** the project name, kebab-cased; a path (`../apps/admin-panel`) names the folder, and its last segment is the name.
- **languages:** one code (`mn`) means no i18n, in that language; a comma list (`mn,en`) means i18n, the first being the default.
- **extras:** a comma list of `forms`, `tables`, `toasts` and `theme`, or `none`; left out, it means none.

When the framework, the name and the languages are all given and valid, skip the form: print the 1.2 message and the decision record, and build. Otherwise ask the form with only the questions the arguments left open.

### 1.1 The form

Open with one sentence on what you are about to build, then ask **one AskUserQuestion call with these four questions** (only those the arguments left open), so the user submits once and can walk away. Two to four options per question, a one-line description per option, the recommended option first with "(Recommended)" at the end of its label where one is recommended. Without the tool, send the same questions as one numbered list and wait for one reply.

1. **Framework.** The user's call: mark neither option as recommended, and say both get the identical house setup.
   - React + Vite SPA: client-rendered and served as static files.
   - Next.js (App Router): server rendering and per-page metadata.
2. **Project name.** Offer two kebab-case suggestions (for example `new-web-app`, `my-app`); the user types their own through "Other" as `name` or `name path`. The folder is a sibling of the current directory, never inside another repository.
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

### 1.2 After the form is submitted or skipped

Before any tool call, print:

```markdown
# ☕ Building {{SITE_NAME}} now — about 2 minutes

Nothing else will be asked; the project will be ready at `{{TARGET_DIR}}`.
```

Then print the decision record (1.3) as one short table and start in the same turn.

### 1.3 Decision record and defaults

| Decision | Value |
|---|---|
| Framework, languages, extras | from the answers; the first language is the default, and the only one without i18n |
| Theme | light + dark with a toggle when that extra was ticked; otherwise light only |
| API | the envelope REST API (`{ success, data, meta }`); `reference/api-variants.md` only if the user said otherwise |
| Router | the built-in router for Vite; `reference/tanstack-router.md` only if the user asked for TanStack Router |
| App name, folder | the name in kebab-case (`test new prompt` becomes `test-new-prompt`), and its absolute folder |
| Site name | the name in Title Case, written by the generator |
| Brand, font | the Material 3 placeholder palette and Inter; the tokens are swapped later |
| API URLs | the literal placeholders `<API_URL_DEV>` and `<API_URL_PROD>` in the tracked env files |
| Coverage | 80% per file on lines, statements, functions and branches |
| Node, pnpm | the active Node LTS (looked up by the generator) and the local pnpm |

## 2. Build

### 2.1 Languages other than `mn` and `en`

Only when i18n includes another language. Get the English messages for the chosen framework, extras and languages, translate every value into each other language (keep the keys and the `{{name}}` or `{name}` placeholders exactly), and save each as a JSON file in your scratchpad:

```sh
node <skill dir>/scaffold.mjs locale-template --framework <vite|next> --extras <list> --i18n <codes>
```

Pass each file as `--locale <code>=<file>` in 2.2. `mn` and `en` are built in. Without i18n in another language, translate the same file and pass it with `--lang <code> --locale <code>=<file>`.

### 2.2 Generate

One Bash call, with a 600000 ms timeout:

```sh
node <skill dir>/scaffold.mjs \
  --framework <vite|next> --name <app-name> --dir <absolute target folder> \
  <--i18n mn,en | --lang mn> [--extras forms,tables,toasts,theme] [--locale <code>=<file> ...]
```

It prints each step and ends with "is ready at …" and the installed versions. A warm pnpm store takes about 10 seconds for Vite and under a minute for Next.js; a cold one takes longer.

### 2.3 When a step fails

The generator stops at the failing step and names it. Fix the cause, then rerun the same command with `--from <step>` (`install`, `shadcn`, `finish`); never rerun from the start over a half-written folder.

- **`ERR_PNPM_IGNORED_BUILDS`:** decide each package pnpm names under `allowBuilds` in `pnpm-workspace.yaml` (allow a script only when the package does not work without it), then `--from install`.
- **Release-age hold** (`minimumReleaseAge`): keep pnpm's supply-chain checks on; accept the newest allowed version and list it under Deviations. Add a `minimumReleaseAgeExclude` entry only if the user asks.
- **A tool fails on the TypeScript API** (TypeScript 7 ships none): `pnpm add -D typescript@^6`, record it, `--from finish`.
- **A newer major changed a config schema:** the generator already retries `pnpm lint:fix` after `pnpm exec biome migrate --write`. For the others use the tool's own migration (`pnpm dlx @tailwindcss/upgrade@latest`, the official guide), keep the intent, record it. A Biome `nursery` rule that a newer version renamed or promoted is moved by `biome migrate`; if it was dropped, delete it from `biome.json` and record it.
- **`pnpm lint:fix` reports an error:** fix the file it names, run `pnpm lint:fix` once more.
- **`experimental.globalNotFound` is renamed or made stable** (Next.js with i18n): follow what `next build` prints (move the flag, or drop it once stable), keep `app/global-not-found.tsx`, record it.
- Never pass `--force`, and add no `overrides` to silence peer ranges; if the newest plugin does not support the newest host major yet, use the newest compatible pair and record it.

### 2.4 Adaptations outside the form

Only when the user asked for them, after 2.2, then `pnpm lint:fix` and one `pnpm verify`:

- `reference/tanstack-router.md`: TanStack Router instead of the built-in router (Vite).
- `reference/api-variants.md`: a plain JSON API, or no API at all.
- `reference/dark-only.md`: dark only.

## 3. Hand-over

Finish with this short report, and nothing longer:

```markdown
## {{SITE_NAME}} is ready

`{{TARGET_DIR}}` — {{framework}}, {{languages}}, {{extras or "no extras"}}, {{theme}}.

- **Versions:** {{the line the generator printed}}
- **Next:** `cd {{TARGET_DIR}} && pnpm verify`, then set the API address in `.env.development` and `.env.production` (`<API_URL_DEV>`, `<API_URL_PROD>`).
- **Deviations:** {{the list, or "none"}}
```

## 4. Maintaining the template

Read this only when changing the skill itself.

- **Layout.** `template/shared/` holds files both frameworks use; `template/vite/` and `template/next/` hold the framework-owned ones (a file there replaces a shared file of the same path). `template/locales/` holds the messages: `base/` plus one folder per extra that adds keys. `reference/` holds the adaptations outside the form.
- **Directives** are whole lines, in any comment syntax (`// #if`, `{/* #if */}`, `<!-- #if -->`, `# #if`), and are always dropped from the output: `#if expr`, `#elif expr`, `#else`, `#endif`, and `#file expr` to skip a whole file. Flags: `vite`, `next`, `i18n`, `plain`, `forms`, `tables`, `toasts`, `theme`, `en`, `cyrillic`, combined with `&&`, `||`, `!` and parentheses.
- **Tokens.** `{{SITE_NAME}}`, `{{APP_NAME}}`, `{{DEFAULT_LANG}}`, `{{OTHER_LANG}}`, `{{REF_LANG}}`, `{{LANGS_LIST}}`, `{{API_ENV}}`, `{{CSS_ENTRY}}`, `{{ERROR_DIR}}` and the generated blocks (`{{LOCALE_IMPORTS}}`, `{{LOCALE_RESOURCES}}`, `{{LOCALE_MESSAGES}}`, `{{LOCALE_TEST_ROWS}}`); a token alone on its line expands a multi-line value at that indentation, and tokens also work in file paths. Strings: `{{T:key}}` a JSX child, `{{TS:key}}` an expression and `{{TA:key}}` an attribute value, each `t('key')` with i18n or the default-language text without; `{{t:key}}`, `{{tq:key}}` and `{{ta:key}}` are always the default-language text (tests assert them, so one test file serves every language). `{{?flag:text}}` keeps `text` only when the flag is on (`{{?!flag:…}}` when off); its text may hold `{{UPPERCASE}}` tokens but no other `}`. Uppercase tokens resolve first, then the flags, then the strings. In `.md` files, `#. ` lines are numbered in order. README versions are `{{V:package}}`, filled after install.
- **Checking a change.** Render and verify the combinations it touches, at least Vite and Next.js each with i18n and every extra and without i18n and extras, with `--verify` (it runs `pnpm verify` at the end):

```sh
node scaffold.mjs --framework next --name check-a --dir /tmp/check-a --i18n mn,en --extras forms,tables,toasts,theme --verify
```

- **Coding standards** live in `template/shared/CLAUDE.md`, which every generated project receives with the conditions resolved; change the house rules there.
