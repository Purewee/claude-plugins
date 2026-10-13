import { ArrowLeft, RotateCw } from 'lucide-react'
// #if i18n
import { useTranslation } from 'react-i18next'
// #endif
import {
  STATUS_PRIMARY_BUTTON,
  STATUS_SECONDARY_BUTTON,
  StatusPage,
} from '@/components/shared/status-page'
import { goBack, reloadPage } from '@/lib/navigation'
import { useRouter } from '@/lib/router/context'

export function ServerErrorPage() {
// #if i18n
  const { t } = useTranslation()
// #endif
  const { navigate } = useRouter()

  return (
    <StatusPage
      code="500"
      title={{TA:errors.server.title}}
      description={{TA:errors.server.description}}
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
