import { useEffect } from 'react'
import { SITE_NAME } from '@/lib/site'

export function useDocumentTitle(title?: string, enabled = true) {
  useEffect(() => {
    if (!enabled) return
    document.title = title ? `${title} | ${SITE_NAME}` : SITE_NAME
  }, [title, enabled])
}
