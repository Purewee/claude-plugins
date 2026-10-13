import { describe, expect, it } from 'vitest'
import { matchPath, normalizePath } from './match'

describe('normalizePath', () => {
  it.each([
    ['/', '/'],
    ['', ''],
    ['/about/', '/about'],
    ['/about///', '/about'],
    ['//', '/'],
    ['/about?tab=1', '/about'],
    ['/about#team', '/about'],
    ['/about/?tab=1#team', '/about'],
  ])('turns %j into %j', (input, expected) => {
    expect(normalizePath(input)).toBe(expected)
  })
})

describe('matchPath', () => {
  it('matches a fixed path', () => {
    expect(matchPath('/', '/')).toEqual({})
    expect(matchPath('/about', '/about')).toEqual({})
  })

  it('decodes params', () => {
    expect(matchPath('/items/:id', '/items/a%20b')).toEqual({ id: 'a b' })
  })

  it('rejects a different path or depth', () => {
    expect(matchPath('/about', '/contact')).toBeNull()
    expect(matchPath('/items/:id', '/items')).toBeNull()
    expect(matchPath('/items', '/items/1')).toBeNull()
  })

  it('rejects a segment that cannot be decoded', () => {
    expect(matchPath('/items/:id', '/items/%E0%A4%A')).toBeNull()
  })
})
