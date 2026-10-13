import type { ReactNode } from 'react'

export const STATUS_PRIMARY_BUTTON =
  'inline-flex items-center gap-2 rounded-brand-lg bg-brand-primary px-6 py-3 font-semibold text-brand-on-primary text-sm shadow-md transition-colors hover:bg-brand-primary-hover{{?theme: dark:bg-brand-primary-dark dark:text-brand-on-primary-dark dark:hover:bg-brand-primary-hover-dark}}'

export const STATUS_SECONDARY_BUTTON =
  'inline-flex items-center gap-2 rounded-brand-lg border border-brand-outline-variant px-6 py-3 font-semibold text-brand-on-surface text-sm transition-colors hover:border-brand-primary hover:text-brand-primary{{?theme: dark:border-brand-outline-variant-dark dark:text-brand-on-surface-dark dark:hover:border-brand-primary-dark dark:hover:text-brand-primary-dark}}'

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
    <section className="flex w-full grow items-center bg-brand-surface-container-low py-20{{?theme: dark:bg-brand-surface-container-low-dark}}">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-5 px-4 text-center">
        <span
          aria-hidden="true"
          className="font-extrabold text-7xl text-brand-primary tracking-tight md:text-8xl{{?theme: dark:text-brand-primary-dark}}"
        >
          {code}
        </span>
        <h1 className="text-brand-headline-xl-mobile text-brand-on-surface md:text-brand-headline-xl{{?theme: dark:text-brand-on-surface-dark}}">
          {title}
        </h1>
        <p className="max-w-xl text-brand-body-md text-brand-on-surface-variant{{?theme: dark:text-brand-on-surface-variant-dark}}">
          {description}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {actions}
        </div>
      </div>
    </section>
  )
}
