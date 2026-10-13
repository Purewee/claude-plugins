import { Component, type ReactNode } from 'react'
import {
  STATUS_PRIMARY_BUTTON,
  STATUS_SECONDARY_BUTTON,
  StatusPage,
} from '@/components/shared/status-page'
// #if i18n
import i18n from '@/i18n/config'
// #endif
import { leaveTo, reloadPage } from '@/lib/navigation'

export class RootErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: unknown) {
    console.error('App failed to render', error)
  }

  render() {
    if (!this.state.failed) {
      return this.props.children
    }

// #if i18n
    const t = (key: string, fallback: string) =>
      i18n.isInitialized ? i18n.t(key, { defaultValue: fallback }) : fallback

// #endif
    return (
      <div className="flex min-h-svh flex-col">
        <StatusPage
          code="500"
// #if i18n
          title={t('errors.server.title', {{tq:errors.server.title}})}
          description={t('errors.server.description', {{tq:errors.server.description}})}
// #else
          title={{TA:errors.server.title}}
          description={{TA:errors.server.description}}
// #endif
          actions={
            <>
              <button
                type="button"
                onClick={() =>
                  window.history.length > 1
                    ? window.history.back()
                    : leaveTo('/')
                }
                className={STATUS_SECONDARY_BUTTON}
              >
// #if i18n
                {t('errors.actions.back', {{tq:errors.actions.back}})}
// #else
                {{t:errors.actions.back}}
// #endif
              </button>
              <button
                type="button"
                onClick={() => reloadPage()}
                className={STATUS_PRIMARY_BUTTON}
              >
// #if i18n
                {t('errors.actions.refresh', {{tq:errors.actions.refresh}})}
// #else
                {{t:errors.actions.refresh}}
// #endif
              </button>
            </>
          }
        />
      </div>
    )
  }
}
