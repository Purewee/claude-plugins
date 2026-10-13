// #file plain
import type { Metadata } from 'next'
import { NotFoundPage } from '@/components/shared/not-found-page'
import { SITE_NAME } from '@/lib/site'

export const metadata: Metadata = {
  title: { absolute: `{{t:errors.notFound.title}} | ${SITE_NAME}` },
}

export default function NotFound() {
  return <NotFoundPage />
}
