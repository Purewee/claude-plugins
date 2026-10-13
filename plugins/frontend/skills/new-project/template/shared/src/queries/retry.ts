import { ApiError } from '@/lib/api'

export function retryFailedRequest(failureCount: number, error: unknown) {
  const status = error instanceof ApiError ? error.status : 0
  if (status >= 400 && status < 500) {
    return false
  }
  return failureCount < 2
}
