import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// #if theme
import { ThemeProvider } from 'next-themes'
// #endif
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/App.tsx'
import { RootErrorBoundary } from '@/components/shared/root-error-boundary'
// #if toasts
import { Toaster } from '@/components/ui/sonner'
// #endif
import { retryFailedRequest } from '@/queries/retry'
import { DEFAULT_GC_TIME, DEFAULT_STALE_TIME } from '@/queries/stale-time'
// #if i18n
import '@/i18n/config'
// #endif
import '@/index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: DEFAULT_STALE_TIME,
      gcTime: DEFAULT_GC_TIME,
      refetchOnWindowFocus: false,
      retry: retryFailedRequest,
    },
  },
})

// biome-ignore lint/style/noNonNullAssertion: index.html always provides #root
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootErrorBoundary>
// #if theme
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <QueryClientProvider client={queryClient}>
          <App />
// #if toasts
          <Toaster />
// #endif
        </QueryClientProvider>
      </ThemeProvider>
// #else
      <QueryClientProvider client={queryClient}>
        <App />
// #if toasts
        <Toaster theme="light" />
// #endif
      </QueryClientProvider>
// #endif
    </RootErrorBoundary>
  </StrictMode>,
)
