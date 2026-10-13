'use client'

import { useEffect } from 'react'
import { fontSans } from '@/app/fonts'
import {
  STATUS_PRIMARY_BUTTON,
  STATUS_SECONDARY_BUTTON,
  StatusPage,
} from '@/components/shared/status-page'
import { leaveTo, reloadPage } from '@/lib/navigation'
import '@/app/globals.css'

// Replaces the root layout when it fails, so it brings its own <html> and default-language texts.
export default function GlobalError({ error }: { error: Error }) {
  useEffect(() => {
    console.error('App failed to render', error)
  }, [error])

  return (
    <html lang="{{DEFAULT_LANG}}" className={fontSans.variable}>
      <body>
        <main className="flex min-h-svh flex-col">
          <StatusPage
            code="500"
            title={{ta:errors.server.title}}
            description={{ta:errors.server.description}}
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
                  {{t:errors.actions.back}}
                </button>
                <button
                  type="button"
                  onClick={() => reloadPage()}
                  className={STATUS_PRIMARY_BUTTON}
                >
                  {{t:errors.actions.refresh}}
                </button>
              </>
            }
          />
        </main>
      </body>
    </html>
  )
}
