// #file i18n
import { describe, expect, it } from 'vitest'
{{LOCALE_TEST_IMPORTS}}

function keysOf(messages: object, prefix = ''): string[] {
  return Object.entries(messages).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key
    return value !== null && typeof value === 'object' && !Array.isArray(value)
      ? keysOf(value, path)
      : [path.replace(/_(zero|one|two|few|many|other)$/, '')]
  })
}

function keySet(messages: object) {
  return [...new Set(keysOf(messages))].sort()
}

describe('locale files', () => {
  it.each([
    {{LOCALE_TEST_ROWS}}
  ])(
    '%s has exactly the keys of {{REF_LANG}}, so no screen falls back to another language',
    (_, messages) => {
      expect(keySet(messages)).toEqual(keySet({{REF_LANG}}))
    },
  )
})
