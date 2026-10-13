'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// #if theme
import { ThemeProvider } from 'next-themes'
// #endif
import { type ReactNode, useState } from 'react'
// #if toasts
import { Toaster } from '@/components/ui/sonner'
// #endif
import { retryFailedRequest } from '@/queries/retry'
import { DEFAULT_GC_TIME, DEFAULT_STALE_TIME } from '@/queries/stale-time'

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: DEFAULT_STALE_TIME,
            gcTime: DEFAULT_GC_TIME,
            refetchOnWindowFocus: false,
            retry: retryFailedRequest,
          },
        },
      }),
  )

  return (
// #if theme
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        {children}
// #if toasts
        <Toaster />
// #endif
      </QueryClientProvider>
    </ThemeProvider>
// #else
    <QueryClientProvider client={queryClient}>
      {children}
// #if toasts
      <Toaster theme="light" />
// #endif
    </QueryClientProvider>
// #endif
  )
}
