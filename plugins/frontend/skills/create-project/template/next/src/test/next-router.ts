import { vi } from 'vitest'

export const nextRouter = {
  push: vi.fn((href: string) => window.history.pushState({}, '', href)),
  replace: vi.fn((href: string) => window.history.replaceState({}, '', href)),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn(),
}
