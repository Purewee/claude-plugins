'use client'

import { ArrowLeft, House } from 'lucide-react'
// #if i18n
import { useTranslations } from 'next-intl'
// #else
import Link from 'next/link'
import { useRouter } from 'next/navigation'
// #endif
import {
  STATUS_PRIMARY_BUTTON,
  STATUS_SECONDARY_BUTTON,
  StatusPage,
} from '@/components/shared/status-page'
// #if i18n
import { Link, useRouter } from '@/i18n/navigation'
// #endif
import { goBack } from '@/lib/navigation'

export function NotFoundPage() {
// #if i18n
  const t = useTranslations()
// #endif
  const router = useRouter()

  return (
    <StatusPage
      code="404"
      title={{TA:errors.notFound.title}}
      description={{TA:errors.notFound.description}}
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
          <Link href="/" className={STATUS_PRIMARY_BUTTON}>
            <House aria-hidden="true" className="size-4" />
            {{T:errors.actions.home}}
          </Link>
        </>
      }
    />
  )
}
