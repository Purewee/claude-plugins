import { createCn } from 'cn/config'

const isBrandType = (value: string) =>
  /^brand-(display|headline|body|label)(-|$)/.test(value)

const isBrandRadius = (value: string) => value.startsWith('brand-')

// Teaches the class merger the brand type and radius tokens, so `text-brand-body-md` is a size and never cancels a text colour.
export const cn = createCn({
  extend: {
    classGroups: {
      'font-size': [{ text: [isBrandType] }],
      rounded: [{ rounded: [isBrandRadius] }],
    },
  },
})
