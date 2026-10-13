// #file i18n
import { render, screen } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { describe, expect, it } from 'vitest'
import messages from '@/i18n/locales/{{OTHER_LANG}}.json'
import HomePage, { generateMetadata } from './page'

const params = Promise.resolve({ locale: '{{OTHER_LANG}}' })

describe('HomePage', () => {
  it('is titled in the requested language', async () => {
    const metadata = await generateMetadata({ params } as never)

    expect(metadata.title).toBe(messages.home.title)
  })

  it('renders the welcome section', async () => {
    render(
      <NextIntlClientProvider locale="{{OTHER_LANG}}" messages={messages}>
        {await HomePage({ params } as never)}
      </NextIntlClientProvider>,
    )

    expect(
      screen.getByRole('heading', { level: 1, name: messages.home.title }),
    ).toBeTruthy()
  })
})
