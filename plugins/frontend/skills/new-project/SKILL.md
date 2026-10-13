---
name: new-project
description: Creates a production-ready React + Vite or Next.js application in the current folder: strict TypeScript, Tailwind CSS v4 and shadcn/ui, Biome and oxlint, TanStack Query, optional i18n, a light/dark theme and Vitest with an 80% coverage gate. Asks one question form, or takes the answers as arguments such as `next my-shop mn,en forms,toasts`.
argument-hint: "[vite|next] [name or path] [mn | en | mn,en …] [forms,tables,toasts,theme | none]"
disable-model-invocation: true
---

# Frontend Project Generator

Creates a new frontend application with the team's standard setup:

- pnpm and strict TypeScript
- Tailwind CSS v4 with design tokens, and shadcn/ui
- Biome and oxlint, configured to enforce the team's coding conventions
- a zod-validated API client with TanStack Query
- optional internationalization
- a Vitest and Testing Library suite with an 80% per-file coverage gate

React + Vite and Next.js receive the same setup; only the files each framework owns differ.

**How it works.** In this document, `<skill dir>` is the base directory this skill was loaded from (shown when it loads). Every project file lives in `<skill dir>/template/` and has been verified with `pnpm verify` for both frameworks, with and without i18n, and with every extra. `scaffold.mjs` renders the template for the chosen options, writes `package.json`, installs every package at its latest version, adds the selected shadcn/ui components, records the installed versions in the README and formats the result. Your role is to collect the answers, run one command and report the outcome; never write template files by hand.

**Out of scope:** git, git hooks, CI, Docker, nginx, Kubernetes, Vercel and any other deployment. Do not create, install or ask about them.

## 0. Rules

1. **Ask only when nothing answers yet** (see 1.0). Arguments, or the answers from the previous build, skip the form; otherwise your first message is the form (1.1). Until it is answered, only read (for example, the current directory's name to suggest a project name); create, install and change nothing.
2. **One form at most.** Every other value has a default (1.3); ask nothing else.
3. **Use the generator, not hand-written files.** Edit generated files only to apply an adaptation from `reference/` that the user requested, or to fix a failure. Do not read library documentation or `node_modules` unless a step fails.
4. **Use pnpm only.** Never npm, yarn or npx.
5. **Never weaken a quality gate.** Do not lower the coverage threshold, add coverage-ignore comments, disable a lint rule for application code or relax a TypeScript option.
6. **Do not invent product content, endpoints or data.** The application shell is one home page with a sample section, the 404 and 500 pages, and the infrastructure.
7. **Work only inside the target directory.** It must not exist or must be empty, and it must not be inside another project's repository; use a sibling folder instead.
8. **Do not run checks yourself.** The generator finishes with `pnpm lint:fix`, and the user runs `pnpm verify`. The only exception is an adaptation from `reference/`, which is followed by a single `pnpm verify`.
9. **Record deviations.** Keep a short list of everything that differs from this document (a held-back version, an applied adaptation, a failed step you fixed) for the final report.

## 1. Collecting the answers

### 1.0 Arguments and previous answers

Arguments after the command answer the form in advance, in the order `<framework> <name> <languages> [extras]`, for example `next my-shop mn,en forms,toasts` or `vite ../apps/admin-panel mn`:

- **framework:** `vite` or `next`.
- **name:** the project name, converted to kebab-case. A path (`../apps/admin-panel`) sets the folder, and its last segment becomes the name.
- **languages:** a single code (`mn`) creates a single-language app without i18n; a comma-separated list (`mn,en`) enables i18n, with the first language as the default.
- **extras:** a comma-separated list of `forms`, `tables`, `toasts` and `theme`, or `none`. When omitted, no extras are added.

When the framework, name and languages are all present and valid, skip the form: print the start message (1.2) and the decision record, then build. Otherwise, ask only the questions the arguments leave open.

**Without arguments,** first run `node <skill dir>/scaffold.mjs last`. If it prints a set of answers, reuse them without asking: the same framework, languages and extras, with `nextName` in `nextDir` (the previous name with the next free `-2`, `-3` suffix). State in the decision record that the previous answers were reused and that arguments select a different setup. Ask the form only when it prints `none`, which happens on the first build on a machine.

### 1.1 The form

Introduce the task in one sentence, then ask **a single AskUserQuestion call** containing the four questions below (only those still open), so the user submits once. Give two to four options per question, each with a one-line description; where an option is recommended, list it first and end its label with "(Recommended)". If the tool is unavailable, send the same questions as one numbered list and wait for a single reply.

1. **Framework.** Recommend neither option, and state that both receive the same setup.
   - React + Vite SPA: rendered in the browser and served as static files.
   - Next.js (App Router): server rendering and per-page metadata.
2. **Project name.** Offer two kebab-case suggestions (for example `new-web-app` and `my-app`); the user can enter their own as `name` or `name path` through "Other". The folder is created next to the current directory, never inside another repository.
3. **Internationalization:** "Do you want i18n (translations and a language switcher)?" Recommend no option.
   - No i18n, Mongolian only
   - No i18n, English only
   - i18n with Mongolian (default) and English
   - Other languages (the user enters the codes, default first; for a single-language app in another language, the user enters that language)
4. **Extras** (multiple choice; selecting none adds none):
   - Forms (react-hook-form + zod)
   - Tables (TanStack Table)
   - Toast notifications (sonner)
   - Light and dark theme with a toggle (without it, the app uses the light theme only)

### 1.2 Start message

Once the answers are known, and before any tool call, print:

```markdown
## Building {{SITE_NAME}}

The project will be ready at `{{TARGET_DIR}}` in about two minutes. No further questions will be asked.
```

Then print the decision record (1.3) as one short table and start the build in the same turn.

### 1.3 Decision record and defaults

| Decision | Value |
|---|---|
| Framework, languages, extras | From the answers. The first language is the default, and the only one without i18n. |
| Theme | Light and dark with a toggle when that extra was selected; otherwise light only. |
| API | A REST API with an envelope response (`{ success, data, meta }`). Use `reference/api-variants.md` only if the user specified otherwise. |
| Router | The built-in router for Vite. Use `reference/tanstack-router.md` only if the user asked for TanStack Router. |
| Project name and folder | The name in kebab-case (`test new prompt` becomes `test-new-prompt`) and its absolute folder. |
| Site name | The name in title case, set by the generator. |
| Brand and font | The Material 3 placeholder palette and Inter, to be replaced with the real brand later. |
| API URLs | The placeholders `<API_URL_DEV>` and `<API_URL_PROD>` in the tracked environment files. |
| Coverage | 80% per file for lines, statements, functions and branches. |
| Node.js and pnpm | The active Node.js LTS (detected by the generator) and the locally installed pnpm. |

## 2. Build

### 2.1 Languages other than Mongolian and English

Needed only when i18n includes another language. Print the English messages for the chosen framework, extras and languages, translate every value into each additional language (keeping the keys and the `{{name}}` or `{name}` placeholders unchanged), and save each translation as a JSON file in your scratchpad:

```sh
node <skill dir>/scaffold.mjs locale-template --framework <vite|next> --extras <list> --i18n <codes>
```

Pass each file to the generator as `--locale <code>=<file>`. Mongolian (`mn`) and English (`en`) are built in. For a single-language app in another language, translate the same file and pass it with `--lang <code> --locale <code>=<file>`.

### 2.2 Generate

Run one Bash command with a 600000 ms timeout:

```sh
node <skill dir>/scaffold.mjs \
  --framework <vite|next> --name <app-name> --dir <absolute target folder> \
  <--i18n mn,en | --lang mn> [--extras forms,tables,toasts,theme] [--locale <code>=<file> ...]
```

The generator reports each step with its duration and ends with "is ready at …" followed by the installed versions. With a warm pnpm store it takes about 10 seconds for Vite and under a minute for Next.js; a cold store takes longer.

### 2.3 Handling failures

The generator stops at the failing step and names it. Fix the cause, then rerun the same command with `--from <step>` (`install`, `shadcn` or `finish`). Never restart from the beginning over a partly written folder.

- **`ERR_PNPM_IGNORED_BUILDS`:** decide each package pnpm lists under `allowBuilds` in `pnpm-workspace.yaml`, allowing a build script only when the package cannot work without it, then rerun with `--from install`.
- **Release-age hold** (`minimumReleaseAge`): keep pnpm's supply-chain checks enabled, accept the newest allowed version and record it as a deviation. Add a `minimumReleaseAgeExclude` entry only if the user asks.
- **A tool fails on the TypeScript API** (TypeScript 7 ships none): run `pnpm add -D typescript@^6`, record it and rerun with `--from finish`.
- **A new major version changed a configuration schema:** the generator already retries `pnpm lint:fix` after `pnpm exec biome migrate --write`. For other tools, use their migration path (`pnpm dlx @tailwindcss/upgrade@latest` or the official upgrade guide), preserve the intent of the setting and record it. A Biome `nursery` rule that was renamed or promoted is moved by `biome migrate`; if it was removed, delete it from `biome.json` and record it.
- **`pnpm lint:fix` reports an error:** fix the file it names and run `pnpm lint:fix` once more.
- **`experimental.globalNotFound` was renamed or became stable** (Next.js with i18n): follow the message printed by `next build` (move the option, or remove it once stable), keep `app/global-not-found.tsx` and record the change.
- Never pass `--force`, and do not add `overrides` to silence peer-dependency ranges. If the newest plugin does not yet support the newest major version of its host, use the newest compatible pair and record it.

### 2.4 Adaptations outside the form

Apply these only when the user asked for them, after 2.2, followed by `pnpm lint:fix` and one `pnpm verify`:

- `reference/tanstack-router.md`: TanStack Router instead of the built-in router (Vite only).
- `reference/api-variants.md`: a plain JSON API, or no API.
- `reference/dark-only.md`: a dark-only theme.

## 3. Final report

End with this report and nothing longer:

```markdown
## {{SITE_NAME}} is ready

`{{TARGET_DIR}}`: {{framework}}, {{languages}}, {{extras, or "no extras"}}, {{theme}}.

- **Versions:** {{the line printed by the generator}}
- **Next steps:** run `cd {{TARGET_DIR}} && pnpm verify`, then set the API address in `.env.development` and `.env.production` (replacing `<API_URL_DEV>` and `<API_URL_PROD>`).
- **Deviations:** {{the list, or "none"}}
```

## 4. Maintaining the template

This section is only relevant when changing the skill itself.

- **Layout.** `template/shared/` contains files used by both frameworks; `template/vite/` and `template/next/` contain framework-specific files, which replace a shared file at the same path. `template/locales/` contains the messages: `base/` plus one folder for each extra that adds keys. `reference/` contains the adaptations outside the form.
- **Directives** occupy whole lines, in any comment syntax (`// #if`, `{/* #if */}`, `<!-- #if -->`, `# #if`), and are always removed from the output: `#if expr`, `#elif expr`, `#else`, `#endif`, and `#file expr` to skip an entire file. Available flags are `vite`, `next`, `i18n`, `plain`, `forms`, `tables`, `toasts`, `theme`, `en` and `cyrillic`, combined with `&&`, `||`, `!` and parentheses.
- **Tokens.** `{{SITE_NAME}}`, `{{APP_NAME}}`, `{{DEFAULT_LANG}}`, `{{OTHER_LANG}}`, `{{REF_LANG}}`, `{{LANGS_LIST}}`, `{{API_ENV}}`, `{{CSS_ENTRY}}` and `{{ERROR_DIR}}`, plus the generated blocks `{{LOCALE_IMPORTS}}`, `{{LOCALE_RESOURCES}}`, `{{LOCALE_MESSAGES}}` and `{{LOCALE_TEST_ROWS}}`. A token alone on its line expands a multi-line value at that indentation, and tokens also work in file paths.
- **Strings.** `{{T:key}}` (a JSX child), `{{TS:key}}` (an expression) and `{{TA:key}}` (an attribute value) become `t('key')` with i18n, or the default-language text without it. `{{t:key}}`, `{{tq:key}}` and `{{ta:key}}` always produce the default-language text, which lets one test file serve every language. `{{?flag:text}}` keeps `text` only when the flag is set (`{{?!flag:…}}` when it is not); the text may contain `{{UPPERCASE}}` tokens but no other `}`. Uppercase tokens are resolved first, then flags, then strings. In `.md` files, lines starting with `#. ` are numbered in order, and README versions are written as `{{V:package}}` and filled in after installation.
- **Verifying a change.** Generate and verify the combinations a change affects, at minimum Vite and Next.js each with i18n and all extras, and each without i18n or extras, using `--verify` (which runs `pnpm verify` at the end):

```sh
node scaffold.mjs --framework next --name check-a --dir /tmp/check-a --i18n mn,en --extras forms,tables,toasts,theme --verify
```

- **Coding standards** live in `template/shared/CLAUDE.md`, which every generated project receives with its conditions resolved. Change the team's rules there.
