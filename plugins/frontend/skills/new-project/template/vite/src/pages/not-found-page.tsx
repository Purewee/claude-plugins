import { ArrowLeft, House } from 'lucide-react'
// #if i18n
import { useTranslation } from 'react-i18next'
// #endif
import { AppLink } from '@/components/shared/app-link'
import {
  STATUS_PRIMARY_BUTTON,
  STATUS_SECONDARY_BUTTON,
  StatusPage,
} from '@/components/shared/status-page'
import { goBack } from '@/lib/navigation'
import { useRouter } from '@/lib/router/context'

export function NotFoundPage() {
// #if i18n
  const { t } = useTranslation()
// #endif
  const { navigate } = useRouter()

  return (
    <StatusPage
      code="404"
      title={{TA:errors.notFound.title}}
      description={{TA:errors.notFound.description}}
      actions={
        <>
          <button
            type="button"
            onClick={() => goBack(navigate)}
            className={STATUS_SECONDARY_BUTTON}
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            {{T:errors.actions.back}}
          </button>
          <AppLink href="/" className={STATUS_PRIMARY_BUTTON}>
            <House aria-hidden="true" className="size-4" />
            {{T:errors.actions.home}}
          </AppLink>
        </>
      }
    />
  )
}
