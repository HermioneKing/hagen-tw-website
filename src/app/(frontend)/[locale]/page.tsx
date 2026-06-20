import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import { Hero } from '@/components/Hero'
import { ProductCard } from '@/components/ProductCard'
import { SectionHeading } from '@/components/SectionHeading'
import type { Locale } from '@/i18n/config'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return {
    title: 'Hagen Creative',
    description: locale === 'zh-TW' ? 'Hagen Creative 官方網站' : 'Hagen Creative official website',
    icons: { icon: '/hagen-icon.png' },
  }
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const payload = await getPayloadClient()
  const t = await getTranslations('hero')

  const siteSettings = await payload.findGlobal({
    slug: 'site-settings',
    locale: locale as Locale,
  })

  const products = await payload.find({
    collection: 'products',
    locale: locale as Locale,
    where: { published: { equals: true } },
    sort: 'sortOrder',
    limit: 3,
    depth: 1,
  })

  return (
    <>
      <Hero
        tagline={siteSettings.tagline}
        headline={siteSettings.heroHeadline}
        subtext={siteSettings.heroSubtext}
        ctaPrimary={siteSettings.heroCtaPrimary}
        ctaSecondary={siteSettings.heroCtaSecondary}
      />

      <section className="section-gap">
        <div className="page-container">
          <SectionHeading title={t('featured')} />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.docs.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
