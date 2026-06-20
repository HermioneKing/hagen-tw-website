export const locales = ['en', 'zh-TW'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'zh-TW'

export const localeLabels: Record<Locale, string> = {
  en: 'EN',
  'zh-TW': '繁中',
}
