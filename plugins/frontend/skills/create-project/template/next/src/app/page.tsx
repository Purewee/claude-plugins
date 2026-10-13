// #file plain
import type { Metadata } from 'next'
import { WelcomeSection } from '@/components/home/welcome-section'
import { SITE_NAME } from '@/lib/site'

export const metadata: Metadata = {
  title: { absolute: `{{t:home.title}} | ${SITE_NAME}` },
}

export default function HomePage() {
  return <WelcomeSection />
}
