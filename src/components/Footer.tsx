'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export function Footer() {
  const t = useTranslations('footer')
  const nav = useTranslations('nav')

  return (
    <footer className="border-t border-black/[0.04] bg-warm-canvas py-12">
      <div className="page-container grid gap-8 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="text-[15px] font-medium text-charcoal-primary">Hagen Creative</p>
          <p className="mt-2 text-sm text-fog">© {new Date().getFullYear()} Hagen Creative. {t('rights')}</p>
        </div>
        <div className="flex flex-col gap-2 text-sm text-ash">
          <Link href="/products" className="hover:text-charcoal-primary">
            {nav('products')}
          </Link>
          <Link href="/about" className="hover:text-charcoal-primary">
            {nav('about')}
          </Link>
          <Link href="/contact" className="hover:text-charcoal-primary">
            {nav('contact')}
          </Link>
        </div>
        <div className="text-sm text-fog">
          <p>hello@hagencreative.com</p>
          <p className="mt-1">Taipei, Taiwan</p>
        </div>
      </div>
    </footer>
  )
}
