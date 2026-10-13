import { useEffect } from 'react'
// #if i18n
import { useTranslation } from 'react-i18next'
// #endif
import { AppLayout } from '@/components/layout/app-layout'
import { PageErrorBoundary } from '@/components/shared/page-error-boundary'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { useRouter } from '@/lib/router/context'
import { RouterProvider } from '@/lib/router/provider'
import { findPage } from '@/pages'
import { NotFoundPage } from '@/pages/not-found-page'

function App() {
  return (
    <RouterProvider>
      <AppContent />
    </RouterProvider>
  )
}

function AppContent() {
  const { path } = useRouter()
// #if i18n
  const { t } = useTranslation()
  const match = findPage(path)
  useDocumentTitle(
    match?.page.titleKey ? t(match.page.titleKey) : t('errors.notFound.title'),
    !match || Boolean(match.page.titleKey),
  )
// #else
  const match = findPage(path)
  useDocumentTitle(
    match ? match.page.title : {{tq:errors.notFound.title}},
    !match || Boolean(match.page.title),
  )
// #endif

  // biome-ignore lint/correctness/useExhaustiveDependencies: path is not read; it re-runs the #hash scroll whenever the page changes
  useEffect(() => {
    const hash = window.location.hash
    if (!hash) return
    document.getElementById(hash.slice(1))?.scrollIntoView()
  }, [path])

  const Page = match?.page.component

  return (
    <AppLayout>
      <PageErrorBoundary key={match?.pathname ?? path}>
        {Page && match ? <Page params={match.params} /> : <NotFoundPage />}
      </PageErrorBoundary>
    </AppLayout>
  )
}

export default App
