// #if next
'use client'

// #endif
import { useState } from 'react'
// #if vite && i18n
import { useTranslation } from 'react-i18next'
// #elif next && i18n
import { useTranslations } from 'next-intl'
// #endif

export function WelcomeSection() {
// #if vite && i18n
  const { t } = useTranslation()
// #elif next && i18n
  const t = useTranslations()
// #endif
  const [showDetails, setShowDetails] = useState(false)

  return (
    <section className="w-full bg-brand-surface py-12 lg:py-16{{?theme: dark:bg-brand-surface-dark}}">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-start gap-6 px-4 md:px-14">
        <h1 className="text-brand-headline-xl-mobile text-brand-on-surface md:text-brand-headline-xl{{?theme: dark:text-brand-on-surface-dark}}">
          {{T:home.title}}
        </h1>
        <p className="max-w-2xl text-brand-body-lg text-brand-on-surface-variant{{?theme: dark:text-brand-on-surface-variant-dark}}">
          {{T:home.intro}}
        </p>
        <button
          type="button"
          aria-expanded={showDetails}
          onClick={() => setShowDetails((open) => !open)}
          className="rounded-brand-lg bg-brand-primary px-5 py-2.5 text-brand-label-md text-brand-on-primary transition-colors hover:bg-brand-primary-hover{{?theme: dark:bg-brand-primary-dark dark:text-brand-on-primary-dark dark:hover:bg-brand-primary-hover-dark}}"
        >
          {showDetails ? {{TS:home.hideDetails}} : {{TS:home.showDetails}}}
        </button>
        {showDetails ? (
          <p className="max-w-2xl text-brand-body-md text-brand-on-surface{{?theme: dark:text-brand-on-surface-dark}}">
            {{T:home.details}}
          </p>
        ) : null}
      </div>
    </section>
  )
}
