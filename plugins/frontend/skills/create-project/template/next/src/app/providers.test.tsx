import { useQueryClient } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DEFAULT_GC_TIME, DEFAULT_STALE_TIME } from '@/queries/stale-time'
import { Providers } from './providers'

function QueryDefaults() {
  const queries = useQueryClient().getDefaultOptions().queries
  return (
    <p>{`${queries?.staleTime} ${queries?.gcTime} ${queries?.refetchOnWindowFocus}`}</p>
  )
}

describe('Providers', () => {
  it('gives the app a query client with the house defaults', () => {
    render(
      <Providers>
        <QueryDefaults />
      </Providers>,
    )

    expect(
      screen.getByText(`${DEFAULT_STALE_TIME} ${DEFAULT_GC_TIME} false`),
    ).toBeTruthy()
  })
})
