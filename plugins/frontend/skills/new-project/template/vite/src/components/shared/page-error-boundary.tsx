import { Component, type ReactNode } from 'react'
import { ServerErrorPage } from '@/pages/server-error-page'

export class PageErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: unknown) {
    console.error('Page failed to render', error)
  }

  render() {
    return this.state.failed ? <ServerErrorPage /> : this.props.children
  }
}
