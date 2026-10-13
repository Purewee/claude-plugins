'use client'

import { ArrowLeft, RotateCw } from 'lucide-react'
// #if i18n
import { useTranslations } from 'next-intl'
// #endif
// #if plain
import { useRouter } from 'next/navigation'
// #endif
import { useEffect } from 'react'
import {
  STATUS_PRIMARY_BUTTON,
  STATUS_SECONDARY_BUTTON,
  StatusPage,
} from '@/components/shared/status-page'
// #if i18n
import { useRouter } from '@/i18n/navigation'
// #endif
import { goBack, reloadPage } from '@/lib/navigation'

export default function PageError({ error }: { error: Error }) {
// #if i18n
  const t = useTranslations()
// #endif
  const router = useRouter()

  useEffect(() => {
    console.error('Page failed to render', error)
  }, [error])

  return (
    <StatusPage
      code="500"
      title={{TA:errors.server.title}}
      description={{TA:errors.server.description}}
      actions={
        <>
          <button
            type="button"
            onClick={() => goBack((to) => router.push(to))}
            className={STATUS_SECONDARY_BUTTON}
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            {{T:errors.actions.back}}
          </button>
          <button
            type="button"
            onClick={() => reloadPage()}
            className={STATUS_PRIMARY_BUTTON}
          >
            <RotateCw aria-hidden="true" className="size-4" />
            {{T:errors.actions.refresh}}
          </button>
        </>
      }
    />
  )
}
