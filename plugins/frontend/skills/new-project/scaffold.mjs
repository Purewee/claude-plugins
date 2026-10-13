#!/usr/bin/env node
// Renders the house frontend template into a new project, installs the latest packages and formats it.
// Usage: node scaffold.mjs --framework vite|next --name my-app [--dir <path>]
//          (--i18n mn,en | --lang mn) [--extras forms,tables,toasts,theme]
//          [--locale <code>=<file.json> ...] [--node-lts 24] [--skip-install] [--verify] [--from <step>]
//        node scaffold.mjs locale-template --framework vite|next [--extras ...]   prints the English messages to translate
//        node scaffold.mjs last   prints the last build's answers and the next free folder, or `none`
import { execFileSync, spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const TEMPLATE = path.join(HERE, 'template')
const EXTRAS = ['forms', 'tables', 'toasts', 'theme']
const BUILT_IN_LANGS = ['mn', 'en']
const STEPS = ['files', 'install', 'shadcn', 'finish', 'verify']
const LAST_ANSWERS = path.join(
  process.env.XDG_CONFIG_HOME ?? path.join(os.homedir(), '.config'),
  'new-frontend-project',
  'last-answers.json',
)

function fail(message) {
  console.error(`\n✖ ${message}`)
  process.exit(1)
}

function parseArgs(argv) {
  const args = { extras: [], locales: {}, command: 'scaffold' }
  const rest = [...argv]
  if (rest[0] && !rest[0].startsWith('--')) args.command = rest.shift()
  while (rest.length) {
    const flag = rest.shift()
    const value = () => {
      const next = rest.shift()
      if (next === undefined) fail(`${flag} needs a value`)
      return next
    }
    switch (flag) {
      case '--framework':
        args.framework = value()
        break
      case '--name':
        args.name = value()
        break
      case '--dir':
        args.dir = value()
        break
      case '--i18n':
        args.langs = value().split(',').map((lang) => lang.trim()).filter(Boolean)
        args.i18n = true
        break
      case '--lang':
        args.langs = [value().trim()]
        args.i18n = false
        break
      case '--extras':
        args.extras = value().split(',').map((extra) => extra.trim()).filter(Boolean)
        break
      case '--locale': {
        const [code, file] = value().split('=')
        args.locales[code] = path.resolve(file)
        break
      }
      case '--node-lts':
        args.nodeLts = value()
        break
      case '--skip-install':
        args.skipInstall = true
        break
      case '--verify':
        args.verify = true
        break
      case '--from':
        args.from = value()
        break
      default:
        fail(`Unknown option ${flag}`)
    }
  }
  if (args.command === 'last') return args
  if (!['vite', 'next'].includes(args.framework)) fail('--framework must be vite or next')
  for (const extra of args.extras) {
    if (!EXTRAS.includes(extra)) fail(`Unknown extra "${extra}" (choose from ${EXTRAS.join(', ')})`)
  }
  if (args.command === 'scaffold') {
    if (!args.name) fail('--name is required')
    if (!args.langs?.length) fail('--i18n <langs> or --lang <lang> is required')
    if (args.from && !STEPS.includes(args.from)) fail(`--from must be one of ${STEPS.join(', ')}`)
  }
  return args
}

function kebab(name) {
  return name
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
}

function titleCase(name) {
  return name
    .split('-')
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

function deepMerge(target, source) {
  for (const [key, value] of Object.entries(source)) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      target[key] = deepMerge(target[key] ?? {}, value)
    } else {
      target[key] = value
    }
  }
  return target
}

function keyPaths(messages, prefix = '') {
  return Object.entries(messages).flatMap(([key, value]) => {
    const at = prefix ? `${prefix}.${key}` : key
    return value && typeof value === 'object' ? keyPaths(value, at) : [at]
  })
}

function lookup(messages, key) {
  const value = key.split('.').reduce((node, part) => node?.[part], messages)
  if (typeof value !== 'string') fail(`Missing message "${key}"`)
  return value
}

// next-intl uses ICU placeholders with single braces; i18next uses double braces.
function toIcu(messages) {
  return JSON.parse(JSON.stringify(messages).replace(/\{\{(\w+)\}\}/g, '{$1}'))
}

function autonym(code) {
  const name = new Intl.DisplayNames([code], { type: 'language' }).of(code) ?? code
  return name[0].toLocaleUpperCase(code) + name.slice(1)
}

// Every locale names every language in that language's own words, so the switcher reads the same in each.
function withLanguageNames(messages, langs) {
  return { ...messages, language: Object.fromEntries(langs.map((code) => [code, autonym(code)])) }
}

function messagesFor(lang, flags, locales) {
  if (locales[lang]) return readJson(locales[lang])
  if (!BUILT_IN_LANGS.includes(lang)) {
    fail(
      `No messages for "${lang}". Run "node scaffold.mjs locale-template ..." for the English file, translate it, and pass --locale ${lang}=<file>.`,
    )
  }
  const merged = readJson(path.join(TEMPLATE, 'locales', 'base', `${lang}.json`))
  for (const extra of ['tables', 'theme']) {
    if (flags[extra]) {
      deepMerge(merged, readJson(path.join(TEMPLATE, 'locales', extra, `${lang}.json`)))
    }
  }
  return merged
}

// Line directives: `// #if expr`, `// #elif expr`, `// #else`, `// #endif`, and `// #file expr` for the whole file.
// The comment opener may also be `{/*`, `/*`, `<!--` or `#`; the line is always dropped from the output.
const DIRECTIVE =
  /^\s*(?:\/\/|\{\/\*|\/\*|<!--|#)\s*#(if|elif|else|endif|file)\b(.*?)\s*(?:\*\/\}|\*\/|-->)?\s*$/

function evaluate(expr, flags, file) {
  const source = expr.trim().replace(/[A-Za-z_][\w]*/g, (name) => {
    if (!(name in flags)) fail(`${file}: unknown flag "${name}"`)
    return flags[name] ? 'true' : 'false'
  })
  return Function(`return (${source})`)()
}

function preprocess(text, flags, file) {
  const out = []
  const stack = []
  let include = true
  for (const line of text.split('\n')) {
    const match = line.match(DIRECTIVE)
    if (!match) {
      if (include) out.push(line)
      continue
    }
    const [, kind, expr] = match
    if (kind === 'file') {
      if (!evaluate(expr, flags, file)) return null
    } else if (kind === 'if') {
      const taken = include && evaluate(expr, flags, file)
      stack.push({ parent: include, done: taken })
      include = taken
    } else if (kind === 'elif') {
      const frame = stack.at(-1)
      if (!frame) fail(`${file}: #elif without #if`)
      const taken = frame.parent && !frame.done && evaluate(expr, flags, file)
      frame.done ||= taken
      include = taken
    } else if (kind === 'else') {
      const frame = stack.at(-1)
      if (!frame) fail(`${file}: #else without #if`)
      include = frame.parent && !frame.done
      frame.done = true
    } else {
      const frame = stack.pop()
      if (!frame) fail(`${file}: #endif without #if`)
      include = frame.parent
    }
  }
  if (stack.length) fail(`${file}: unclosed #if`)
  return out.join('\n')
}

function jsString(value) {
  return value.includes("'") && !value.includes('"')
    ? JSON.stringify(value)
    : `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
}

function jsxAttribute(value) {
  return value.includes('"') ? `{${jsString(value)}}` : `"${value}"`
}

// {{TOKEN}} values; {{t:key}} default-language text, {{tq:key}} as a quoted JS string and {{ta:key}} as a JSX attribute; {{T:key}} a JSX child and
// {{TS:key}} an expression and {{TA:key}} a JSX attribute value, each `t('key')` with i18n or the default-language text
// without; {{?flag:text}} only when the flag is on.
// A token alone on its line expands every line of a multi-line value at that indentation.
function substitute(text, tokens, messages, flags, file) {
  const lines = text.split('\n').flatMap((line) => {
    const only = line.match(/^(\s*)\{\{([A-Z_]+)\}\}\s*$/)
    if (only && tokens[only[2]]?.includes('\n')) {
      return tokens[only[2]].split('\n').map((part) => (part ? only[1] + part : part))
    }
    return [line]
  })
  const valued = lines.join('\n').replace(/\{\{([A-Z_]+)\}\}/g, (_, token) => {
    if (!(token in tokens)) fail(`${file}: unknown token {{${token}}}`)
    return tokens[token]
  })
  const inline = valued.replace(/\{\{\?(!?)(\w+):([^}]*)\}\}/g, (_, not, flag, value) => {
    if (!(flag in flags)) fail(`${file}: unknown flag "${flag}"`)
    return Boolean(flags[flag]) !== Boolean(not) ? value : ''
  })
  return inline.replace(/\{\{(t[qa]?|T[SA]?):([\w.]+)\}\}/g, (_, kind, key) => {
    if (kind === 'ta') return jsxAttribute(lookup(messages, key))
    if (kind === 'T') return flags.i18n ? `{t('${key}')}` : lookup(messages, key)
    if (kind === 'TA') return flags.i18n ? `{t('${key}')}` : jsxAttribute(lookup(messages, key))
    if (kind === 'TS') return flags.i18n ? `t('${key}')` : jsString(lookup(messages, key))
    return kind === 'tq' ? jsString(lookup(messages, key)) : lookup(messages, key)
  })
}

function walk(dir, base = dir) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    return entry.isDirectory() ? walk(full, base) : [path.relative(base, full)]
  })
}

function renderTree(target, flags, tokens, messages) {
  const files = new Map()
  for (const layer of ['shared', flags.next ? 'next' : 'vite']) {
    for (const rel of walk(path.join(TEMPLATE, layer))) files.set(rel, path.join(TEMPLATE, layer, rel))
  }
  let written = 0
  for (const [rel, source] of [...files].sort()) {
    const raw = fs.readFileSync(source, 'utf8')
    const processed = preprocess(raw, flags, rel)
    if (processed === null) continue
    let output = substitute(processed, tokens, messages, flags, rel)
    if (rel.endsWith('.md')) {
      let rule = 0
      output = output.replace(/^#\. /gm, () => `${(rule += 1)}. `)
    }
    const outRel = rel.replace(/\.tmpl$/, '').replace(/\{\{([A-Z_]+)\}\}/g, (_, token) => tokens[token])
    const dest = path.join(target, outRel)
    fs.mkdirSync(path.dirname(dest), { recursive: true })
    fs.writeFileSync(dest, output)
    written += 1
  }
  return written
}

function run(command, args, cwd, { quiet = false } = {}) {
  console.log(`\n$ ${[command, ...args].join(' ')}`)
  const started = Date.now()
  const result = spawnSync(command, args, {
    cwd,
    stdio: quiet ? ['ignore', 'pipe', 'pipe'] : ['ignore', 'inherit', 'inherit'],
    encoding: 'utf8',
    env: { ...process.env, CI: process.env.CI ?? '' },
  })
  if (result.status !== 0) {
    if (quiet) console.error(`${result.stdout ?? ''}${result.stderr ?? ''}`.trim().split('\n').slice(-40).join('\n'))
    return false
  }
  console.log(`  (${((Date.now() - started) / 1000).toFixed(1)}s)`)
  return true
}

function packages(flags, nodeLts) {
  const runtime = [
    'react',
    'react-dom',
    'lucide-react',
    '@tanstack/react-query',
    'zod',
    'radix-ui',
    'class-variance-authority',
    'tw-animate-css',
    'shadcn',
    'cn',
  ]
  const dev = [
    'typescript',
    '@types/react',
    '@types/react-dom',
    '@biomejs/biome',
    'oxlint',
    'tailwindcss',
    'vitest',
    '@vitest/coverage-v8',
    'jsdom',
    '@vitejs/plugin-react',
    '@testing-library/react',
    '@testing-library/dom',
  ]
  if (flags.next) {
    runtime.unshift('next')
    dev.push('@tailwindcss/turbopack')
    if (flags.i18n) runtime.push('next-intl')
  } else {
    runtime.push('@fontsource-variable/inter')
    dev.push('vite', '@tailwindcss/vite')
    if (flags.i18n) runtime.push('i18next', 'react-i18next', 'i18next-browser-languagedetector')
  }
  if (flags.forms) runtime.push('react-hook-form', '@hookform/resolvers')
  if (flags.tables) runtime.push('@tanstack/react-table')
  if (flags.theme || flags.toasts) runtime.push('next-themes')
  if (flags.toasts) runtime.push('sonner')
  return {
    runtime: runtime.map((name) => `${name}@latest`),
    dev: [...dev.map((name) => `${name}@latest`), `@types/node@${nodeLts}`],
  }
}

function shadcnComponents(flags) {
  const names = new Set()
  if (flags.forms) for (const name of ['field', 'input', 'label', 'button']) names.add(name)
  if (flags.tables) for (const name of ['table', 'button']) names.add(name)
  if (flags.toasts) names.add('sonner')
  return [...names]
}

function nodeLtsMajor() {
  try {
    const schedule = JSON.parse(
      execFileSync('curl', ['-fsSL', 'https://raw.githubusercontent.com/nodejs/Release/main/schedule.json'], {
        encoding: 'utf8',
        timeout: 15000,
      }),
    )
    const now = new Date()
    const active = Object.entries(schedule)
      .filter(([, v]) => v.lts && new Date(v.lts) <= now && new Date(v.maintenance) > now)
      .map(([k]) => Number(k.slice(1)))
      .sort((a, b) => b - a)
    if (active.length) return String(active[0])
  } catch {
    // Offline: fall back to the running Node's even major below.
  }
  const major = Number(process.versions.node.split('.')[0])
  return String(major % 2 === 0 ? major : major - 1)
}

function installedVersion(target, name) {
  try {
    return readJson(path.join(target, 'node_modules', name, 'package.json')).version
  } catch {
    return '—'
  }
}

function writePackageJson(target, flags, tokens, pnpmVersion) {
  const scripts = flags.next
    ? {
        dev: 'next dev',
        build: 'next build',
        start: 'next start',
        typecheck: 'next typegen && tsc --noEmit',
      }
    : {
        dev: 'vite',
        build: 'tsc -b && vite build',
        preview: 'vite preview',
        typecheck: 'tsc -b',
      }
  Object.assign(scripts, {
    lint: 'biome check --error-on-warnings . && oxlint --deny-warnings',
    'lint:fix': 'biome check --write --error-on-warnings . && oxlint --fix --deny-warnings',
    format: 'biome format --write .',
    test: 'vitest run --coverage',
    'test:watch': 'vitest',
    verify: 'pnpm lint && pnpm typecheck && pnpm test && pnpm build',
  })
  const file = path.join(target, 'package.json')
  const existing = fs.existsSync(file) ? readJson(file) : {}
  const pkg = {
    name: tokens.APP_NAME,
    private: true,
    version: '0.0.0',
    type: 'module',
    packageManager: `pnpm@${pnpmVersion}`,
    engines: { node: `>=${tokens.NODE_LTS}` },
    scripts,
    dependencies: existing.dependencies ?? {},
    devDependencies: existing.devDependencies ?? {},
  }
  fs.writeFileSync(file, `${JSON.stringify(pkg, null, 2)}\n`)
}

function fillVersions(target, flags) {
  const readme = path.join(target, 'README.md')
  if (!fs.existsSync(readme)) return
  const text = fs.readFileSync(readme, 'utf8').replace(/\{\{V:([@\w./-]+)\}\}/g, (_, name) =>
    installedVersion(target, name),
  )
  fs.writeFileSync(readme, text)
  void flags
}

function main() {
  const args = parseArgs(process.argv.slice(2))
  const flagsBase = Object.fromEntries(EXTRAS.map((extra) => [extra, args.extras.includes(extra)]))

  // Prints the answers of the last finished build, with the next free folder name next to the last one.
  if (args.command === 'last') {
    if (!fs.existsSync(LAST_ANSWERS)) {
      console.log('none')
      return
    }
    const last = readJson(LAST_ANSWERS)
    let name = last.name
    for (let n = 2; fs.existsSync(path.join(last.parent, name)); n += 1) name = `${last.name}-${n}`
    console.log(JSON.stringify({ ...last, nextName: name, nextDir: path.join(last.parent, name) }, null, 2))
    return
  }

  if (args.command === 'locale-template') {
    const flags = { ...flagsBase, next: args.framework === 'next' }
    const messages = withLanguageNames(messagesFor('en', flags, {}), args.langs ?? ['en'])
    process.stdout.write(`${JSON.stringify(flags.next ? toIcu(messages) : messages, null, 2)}\n`)
    return
  }
  if (args.command !== 'scaffold') fail(`Unknown command "${args.command}"`)

  const appName = kebab(args.name)
  const target = path.resolve(args.dir ?? path.join(process.cwd(), appName))
  const langs = args.langs
  const defaultLang = langs[0]
  const i18n = Boolean(args.i18n)
  const flags = {
    ...flagsBase,
    vite: args.framework === 'vite',
    next: args.framework === 'next',
    i18n,
    plain: !i18n,
    en: langs.includes('en'),
    cyrillic: langs.some((lang) => ['mn', 'ru', 'uk', 'bg', 'kk', 'ky', 'sr', 'be'].includes(lang)),
  }
  const startAt = STEPS.indexOf(args.from ?? 'files')

  if (startAt === 0 && fs.existsSync(target) && fs.readdirSync(target).length) {
    fail(`${target} exists and is not empty`)
  }
  for (let dir = path.dirname(target); dir !== path.dirname(dir); dir = path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, '.git')) && startAt === 0) {
      console.warn(`! ${target} is inside the git repository at ${dir}`)
      break
    }
  }

  const nodeLts = args.nodeLts ?? nodeLtsMajor()
  const pnpmVersion = execFileSync('pnpm', ['--version'], { encoding: 'utf8' }).trim()
  const allMessages = Object.fromEntries(
    langs.map((lang) => {
      const messages = i18n ? withLanguageNames(messagesFor(lang, flags, args.locales), langs) : messagesFor(lang, flags, args.locales)
      return [lang, flags.next ? toIcu(messages) : messages]
    }),
  )
  const reference = flags.en ? 'en' : defaultLang
  const referenceKeys = keyPaths(allMessages[reference]).sort().join('\n')
  for (const lang of langs) {
    if (keyPaths(allMessages[lang]).sort().join('\n') !== referenceKeys) {
      fail(`${lang} messages do not have exactly the keys of ${reference}`)
    }
  }
  const messages = allMessages[defaultLang]
  const others = langs.filter((lang) => lang !== reference)
  const sortedLangs = [...langs].sort()
  const siteName = titleCase(appName)
  const tokens = {
    APP_NAME: appName,
    SITE_NAME: siteName,
    SITE_DESCRIPTION: flags.next ? 'A new Next.js web app.' : 'A new React web app.',
    DEFAULT_LANG: defaultLang,
    REF_LANG: reference,
    NODE_LTS: nodeLts,
    PNPM_VERSION: pnpmVersion,
    LANGS_LIST: langs.map((lang) => `'${lang}'`).join(', '),
    LANGS_TEXT: langs.map((lang) => `\`${lang}\``).join(', '),
    FONT_SUBSETS: flags.cyrillic ? "'latin', 'cyrillic'" : "'latin'",
    LOCALE_IMPORTS: sortedLangs.map((lang) => `import ${lang} from './locales/${lang}.json'`).join('\n'),
    LOCALE_TEST_IMPORTS: sortedLangs.map((lang) => `import ${lang} from './locales/${lang}.json'`).join('\n'),
    LOCALE_RESOURCES: langs.map((lang) => `${lang}: { translation: ${lang} },`).join('\n'),
    LOCALE_MESSAGES: langs.map((lang) => `${lang}: (await import('@/i18n/locales/${lang}.json')).default,`).join('\n'),
    LOCALE_TEST_ROWS: others.map((lang) => `['${lang}', ${lang}],`).join('\n'),
    OTHER_LANG: langs.find((lang) => lang !== defaultLang) ?? defaultLang,
    LANG_UNION: langs.map((lang) => `'${lang}'`).join(' | '),
    CSS_ENTRY: flags.next ? 'app/globals.css' : 'index.css',
    ERROR_DIR: i18n ? '[locale]/' : '',
    API_ENV: flags.next ? 'NEXT_PUBLIC_API_URL' : 'VITE_API_URL',
  }

  if (startAt <= STEPS.indexOf('files')) {
    fs.mkdirSync(target, { recursive: true })
    const count = renderTree(target, flags, tokens, messages)
    if (i18n) {
      const localeDir = path.join(target, 'src', 'i18n', 'locales')
      fs.mkdirSync(localeDir, { recursive: true })
      for (const lang of langs) {
        fs.writeFileSync(path.join(localeDir, `${lang}.json`), `${JSON.stringify(allMessages[lang], null, 2)}\n`)
      }
    }
    writePackageJson(target, flags, tokens, pnpmVersion)
    console.log(`✔ Wrote ${count + (i18n ? langs.length : 0) + 1} files to ${target}`)
  }

  if (args.skipInstall) return

  if (startAt <= STEPS.indexOf('install')) {
    const { runtime, dev } = packages(flags, nodeLts)
    if (!run('pnpm', ['add', ...runtime], target)) {
      fail('Installing the runtime packages failed. Fix the cause above (build-script decision or release-age hold), then rerun with --from install.')
    }
    if (!run('pnpm', ['add', '-D', ...dev], target)) {
      fail('Installing the dev packages failed. Fix the cause above, then rerun with --from install.')
    }
  }

  if (startAt <= STEPS.indexOf('shadcn')) {
    const components = shadcnComponents(flags)
    if (components.length && !run('pnpm', ['exec', 'shadcn', 'add', ...components, '-y', '-o'], target)) {
      fail('shadcn add failed. Fix the cause above, then rerun with --from shadcn.')
    }
  }

  if (startAt <= STEPS.indexOf('finish')) {
    const biome = path.join(target, 'biome.json')
    const config = readJson(biome)
    config.$schema = `https://biomejs.dev/schemas/${installedVersion(target, '@biomejs/biome')}/schema.json`
    fs.writeFileSync(biome, `${JSON.stringify(config, null, 2)}\n`)
    fillVersions(target, flags)
    // A newer Biome may rename or promote a rule in biome.json; only then is `biome migrate` worth its time.
    if (
      !run('pnpm', ['lint:fix'], target, { quiet: true }) &&
      !(run('pnpm', ['exec', 'biome', 'migrate', '--write'], target, { quiet: true }) &&
        run('pnpm', ['lint:fix'], target, { quiet: true }))
    ) {
      fail('pnpm lint:fix reported problems (above). Fix them and run it again.')
    }
    console.log('✔ Formatted with pnpm lint:fix')
  }

  if (args.verify && startAt <= STEPS.indexOf('verify')) {
    if (!run('pnpm', ['verify'], target)) fail('pnpm verify failed')
    console.log('✔ pnpm verify passed')
  }

  const report = ['typescript', 'react', flags.next ? 'next' : 'vite', 'vitest', '@biomejs/biome', 'tailwindcss']
    .map((name) => `${name} ${installedVersion(target, name)}`)
    .join(', ')
  if (startAt <= STEPS.indexOf('finish')) {
    fs.mkdirSync(path.dirname(LAST_ANSWERS), { recursive: true })
    const answers = {
      framework: args.framework,
      name: appName,
      parent: path.dirname(target),
      languages: langs.join(','),
      i18n,
      extras: args.extras,
    }
    fs.writeFileSync(LAST_ANSWERS, `${JSON.stringify(answers, null, 2)}\n`)
  }
  console.log(`\n✔ ${siteName} is ready at ${target}\n  ${report}\n  pnpm ${pnpmVersion}, Node LTS ${nodeLts}`)
}

main()
