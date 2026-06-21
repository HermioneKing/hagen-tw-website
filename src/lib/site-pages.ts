export const SITE_PAGES = [
  { value: 'home', label: 'Home', path: '/' },
  { value: 'products', label: 'Products', path: '/products' },
  { value: 'about', label: 'About', path: '/about' },
  { value: 'contact', label: 'Contact', path: '/contact' },
] as const

export type SitePage = (typeof SITE_PAGES)[number]['value'] | 'custom'

export const SITE_PAGE_OPTIONS = [
  ...SITE_PAGES.map((page) => ({ label: page.label, value: page.value })),
  { label: 'Custom URL', value: 'custom' },
]

export function getLinkHref(page: SitePage | null | undefined, url?: string | null): string {
  if (!page || page === 'custom') {
    return url ?? '/'
  }

  const sitePage = SITE_PAGES.find((entry) => entry.value === page)
  return sitePage?.path ?? '/'
}

export function pageFromUrl(url: string): SitePage {
  const sitePage = SITE_PAGES.find((entry) => entry.path === url)
  return sitePage?.value ?? 'custom'
}
