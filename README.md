# purewee-plugins

Claude Code plugins by Purewee.

## frontend

`/frontend:new-project` bootstraps a new React + Vite or Next.js project with the team's house setup:
pnpm, strict TypeScript, Tailwind CSS v4 + shadcn/ui, Biome + oxlint, a zod-validated API client with
TanStack Query, optional i18n, a light/dark theme, and Vitest with an 80% per-file coverage gate. It asks
one question form, then builds the project.

Requirements: Node.js 24+, pnpm, macOS or Linux (Windows through WSL).

## Install

```text
/plugin marketplace add Purewee/claude-plugins
/plugin install frontend@purewee-plugins
```

Then turn on updates once: `/plugin` → **Marketplaces** → **purewee-plugins** → **Enable auto-update**.
New versions then arrive in the background and load in the next session (or after `/reload-plugins`).

Without auto-update, update by hand:

```sh
claude plugin marketplace update purewee-plugins
claude plugin update frontend@purewee-plugins
```

## Use

In the folder where the new project should go:

```text
/frontend:new-project
```
