import type { AnchorHTMLAttributes } from 'react'
import { useInternalLinkClick } from '@/lib/router/context'

type AppLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

export function AppLink({ href, onClick, ...props }: AppLinkProps) {
  const handleInternalClick = useInternalLinkClick(href)

  return (
    <a
      href={href}
      onClick={(event) => {
        onClick?.(event)
        handleInternalClick(event)
      }}
      {...props}
    />
  )
}
