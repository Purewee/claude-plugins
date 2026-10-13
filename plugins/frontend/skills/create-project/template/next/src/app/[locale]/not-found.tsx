// #file i18n
import { NotFoundPage } from '@/components/shared/not-found-page'

// Shown for a notFound() inside a page, which Next 16 draws in the browser; with no params, a translated title would need the request headers.
export default function NotFound() {
  return <NotFoundPage />
}
