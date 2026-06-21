'use client'

import { Link } from '@/i18n/navigation'
import { getLinkHref } from '@/lib/site-pages'
import type { SiteSetting } from '@/payload-types'

type FooterProps = {
  footer?: SiteSetting['footer'] | null
}

type FooterLink = {
  label: string
  page?: 'home' | 'products' | 'about' | 'contact' | 'custom' | null
  url?: string | null
}

const defaultLinks: FooterLink[] = [
  { label: 'Products', page: 'products' },
  { label: 'About', page: 'about' },
  { label: 'Contact', page: 'contact' },
]

function resolveLinkHref(link: FooterLink): string {
  if (link.page) {
    return getLinkHref(link.page, link.url)
  }

  return link.url ?? '/'
}

export function Footer({ footer }: FooterProps) {
  const brandName = footer?.brandName ?? 'Hagen Creative'
  const copyrightText = footer?.copyrightText ?? 'All rights reserved.'
  const email = footer?.email ?? 'hello@hagencreative.com'
  const location = footer?.location ?? 'Taipei, Taiwan'
  const links = footer?.links?.length ? footer.links : defaultLinks

  return (
    <footer className="border-t border-black/[0.04] bg-warm-canvas py-12">
      <div className="page-container grid gap-8 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="text-[15px] font-medium text-charcoal-primary">{brandName}</p>
          <p className="mt-2 text-sm text-fog">
            © {new Date().getFullYear()} {brandName}. {copyrightText}
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm text-ash">
          {links.map((link, index) => {
            const href = resolveLinkHref(link)

            return (
              <Link key={`${href}-${index}`} href={href} className="hover:text-charcoal-primary">
                {link.label}
              </Link>
            )
          })}
        </div>
        <div className="text-sm text-fog">
          <p>{email}</p>
          <p className="mt-1">{location}</p>
        </div>
      </div>
    </footer>
  )
}
