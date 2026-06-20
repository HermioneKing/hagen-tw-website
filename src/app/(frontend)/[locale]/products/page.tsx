import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
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
  const t = await getTranslations({ locale, namespace: 'products' })
  return { title: `${t('title')} | Hagen Creative` }
}

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('products')

  const payload = await getPayloadClient()
  const products = await payload.find({
    collection: 'products',
    locale: locale as Locale,
    where: { published: { equals: true } },
    sort: 'sortOrder',
    depth: 1,
  })

  return (
    <section className="section-gap">
      <div className="page-container">
        <SectionHeading title={t('title')} subtitle={t('subtitle')} />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.docs.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
