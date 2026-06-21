'use client'

import { Link } from '@/i18n/navigation'
import type { SiteSetting } from '@/payload-types'

type FooterProps = {
  footer?: SiteSetting['footer'] | null
}

const defaultLinks = [
  { label: 'Products', url: '/products' },
  { label: 'About', url: '/about' },
  { label: 'Contact', url: '/contact' },
]

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
          {links.map((link) => (
            <Link key={link.url} href={link.url} className="hover:text-charcoal-primary">
              {link.label}
            </Link>
          ))}
        </div>
        <div className="text-sm text-fog">
          <p>{email}</p>
          <p className="mt-1">{location}</p>
        </div>
      </div>
    </footer>
  )
}
