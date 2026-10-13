import { describe, expect, it } from 'vitest'
import { cn } from './utils'

describe('cn', () => {
  it.each([
    [['text-brand-body-md', 'text-foreground'], 'text-brand-body-md text-foreground'],
    [
      ['text-brand-body-md', 'text-brand-on-primary'],
      'text-brand-body-md text-brand-on-primary',
    ],
    [['text-brand-body-md', 'text-brand-label-sm'], 'text-brand-label-sm'],
    [['text-sm', 'text-brand-body-md'], 'text-brand-body-md'],
    [
      ['text-brand-display-mobile', 'md:text-brand-display'],
      'text-brand-display-mobile md:text-brand-display',
    ],
    [['rounded-brand-lg', 'rounded-full'], 'rounded-full'],
    [['rounded-full', 'rounded-brand-xl'], 'rounded-brand-xl'],
    [['px-2', undefined, false, 'font-bold'], 'px-2 font-bold'],
  ])('merges %j into %j', (input, output) => {
    expect(cn(...input)).toBe(output)
  })
})
