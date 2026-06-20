'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { localeLabels, type Locale } from '@/i18n/config'
import { Link as LocaleLink, usePathname } from '@/i18n/navigation'

export function Nav({ locale }: { locale: Locale }) {
  const t = useTranslations('nav')
  const pathname = usePathname()

  const links = [
    { href: '/', label: t('home') },
    { href: '/products', label: t('products') },
    { href: '/about', label: t('about') },
    { href: '/contact', label: t('contact') },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.04] bg-warm-canvas/95 backdrop-blur-sm">
      <div className="page-container flex h-16 items-center justify-between gap-6">
        <LocaleLink href="/" className="flex items-center gap-3">
          <Image src="/hagen-icon.png" alt="Hagen Creative" width={32} height={32} className="rounded-sm" />
          <span className="text-[15px] font-medium tracking-[-0.2px] text-charcoal-primary">Hagen Creative</span>
        </LocaleLink>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <LocaleLink
              key={link.href}
              href={link.href}
              className={`text-sm font-medium tracking-[-0.18px] transition-colors ${
                pathname === link.href ? 'text-midnight' : 'text-charcoal-primary hover:text-midnight'
              }`}
            >
              {link.label}
            </LocaleLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-[32px] bg-cream-button p-1">
            {(['en', 'zh-TW'] as const).map((code) => (
              <LocaleLink
                key={code}
                href={pathname}
                locale={code}
                className={`rounded-[32px] px-3 py-1 text-xs font-medium transition-colors ${
                  locale === code ? 'bg-white text-midnight shadow-sm' : 'text-ash hover:text-charcoal-primary'
                }`}
              >
                {localeLabels[code]}
              </LocaleLink>
            ))}
          </div>
          <Link href="/admin" className="btn-pill-light hidden sm:inline-flex">
            {t('admin')}
          </Link>
          <LocaleLink href="/products" className="btn-pill-dark">
            {t('products')}
          </LocaleLink>
        </div>
      </div>
    </header>
  )
}
