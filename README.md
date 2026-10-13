# Purewee Claude Code Plugins

A [Claude Code](https://claude.com/claude-code) plugin marketplace for frontend development.

| Plugin | Command | Description |
|---|---|---|
| `frontend` | `/frontend:new-project` | Scaffolds a production-ready React + Vite or Next.js application in about two minutes. |

## Installation

Add the marketplace and install the plugin once:

```text
/plugin marketplace add Purewee/claude-plugins
/plugin install frontend@purewee-plugins
```

Then run `/reload-plugins`, or start a new Claude Code session.

## frontend

`/frontend:new-project` creates a new React + Vite or Next.js application with a consistent, opinionated
setup. Every combination of framework, language setup and extras is generated from a template that is
verified with lint, type-check, tests and a production build, and every package is installed at its latest
version when the project is created.

### What you get

- **Framework:** React 19 with Vite (single-page app, built-in router) or Next.js with the App Router.
- **Language and tooling:** strict TypeScript, pnpm, Biome for formatting and linting, and oxlint for React
  and TypeScript rules. Team conventions such as file naming, default exports and promise handling are
  enforced by the linters rather than by review.
- **Styling:** Tailwind CSS v4 with brand design tokens, and shadcn/ui.
- **Data:** a zod-validated API client with TanStack Query. It supports every HTTP method, reads RFC 9457
  problem details and per-field validation errors, and works with relative API URLs.
- **Internationalization (optional):** i18next for Vite, or next-intl with locale routing for Next.js,
  including a type-checked message catalogue and localized 404 pages.
- **Extras (optional):** forms (react-hook-form + zod), data tables (TanStack Table), toast notifications
  (sonner), and a light/dark theme with a toggle.
- **Tests:** Vitest and Testing Library, with tests for every generated file and an 80% per-file coverage
  gate on lines, statements, functions and branches.
- **Documentation:** a project README, and a `CLAUDE.md` that records the architecture and coding standards
  for future work with Claude Code.

### Requirements

- Node.js 24 or newer
- pnpm
- macOS or Linux (Windows through WSL)

### Usage

Open Claude Code in the folder where the new project should be created and run:

```text
/frontend:new-project
```

Claude asks four questions (framework, project name, languages and extras) in a single form, then
generates, installs and formats the project. No further questions are asked.

To skip the form, pass the answers as arguments:

```text
/frontend:new-project next my-shop mn,en forms,toasts
/frontend:new-project vite ../apps/admin-panel mn
```

| Argument | Values |
|---|---|
| Framework | `vite` or `next` |
| Name | A project name, or a path whose last segment is the name |
| Languages | One language code (`mn`, `en`) for a single-language app, or a comma-separated list (`mn,en`) for i18n; the first is the default |
| Extras | Any of `forms`, `tables`, `toasts` and `theme`, comma-separated; omit for none |

After the first project, running `/frontend:new-project` without arguments reuses the previous answers and
creates the next project alongside the last one (`my-shop-2`, `my-shop-3`, …). The answers are stored in
`~/.config/new-frontend-project/last-answers.json`.

### After generation

```sh
cd my-shop
pnpm verify   # lint, type-check, test and build
pnpm dev
```

Set the API address in `.env.development` and `.env.production` before connecting to a backend.

## Updating

Enable automatic updates once: run `/plugin`, open **Marketplaces**, select **purewee-plugins** and choose
**Enable auto-update**. New versions are then downloaded in the background and load in the next session.

To update manually:

```sh
claude plugin marketplace update purewee-plugins
claude plugin update frontend@purewee-plugins
```
