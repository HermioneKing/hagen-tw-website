import Image from 'next/image'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ProductShowcase } from '@/components/ProductShowcase'
import { RichTextContent } from '@/components/RichTextContent'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/config'
import { getMediaUrl } from '@/lib/media'
import { getPayloadClient } from '@/lib/payload'
import type { Media } from '@/payload-types'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'products',
    locale: locale as Locale,
    where: { slug: { equals: slug }, published: { equals: true } },
    limit: 1,
  })

  const product = result.docs[0]
  if (!product) return { title: 'Hagen Creative' }

  return {
    title: `${product.title} | Hagen Creative`,
    description: product.summary ?? undefined,
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const t = await getTranslations('products')

  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'products',
    locale: locale as Locale,
    where: { slug: { equals: slug }, published: { equals: true } },
    limit: 1,
    depth: 1,
  })

  const product = result.docs[0]
  if (!product) notFound()

  return (
    <section className="section-gap">
      <div className="page-container">
        <Link href="/products" className="link-accent mb-8 inline-block">
          ← {t('back')}
        </Link>

        <div className="grid gap-12 lg:grid-cols-[1fr_320px] lg:items-start">
          <div>
            <h1 className="display-heading text-[44px] md:text-[56px]">{product.title}</h1>
            {product.summary ? (
              <p className="mt-4 max-w-2xl text-[17px] leading-[1.47] tracking-[-0.22px] text-graphite">{product.summary}</p>
            ) : null}
            <div className="mt-8">
              <RichTextContent content={product.description} />
            </div>

            {product.features && product.features.length > 0 ? (
              <div className="mt-10">
                <h2 className="mb-4 text-[19px] font-semibold tracking-[-0.25px] text-charcoal-primary">{t('features')}</h2>
                <ul className="space-y-2">
                  {product.features.map((item, index) => (
                    <li key={index} className="flex items-center gap-2 text-[15px] text-graphite">
                      <span className="h-2 w-2 rounded-full bg-meadow-green" />
                      {item.feature}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {product.gallery && product.gallery.length > 0 ? (
              <div className="mt-10">
                <h2 className="mb-4 text-[19px] font-semibold tracking-[-0.25px] text-charcoal-primary">{t('gallery')}</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {product.gallery.map((item, index) => {
                    const url = getMediaUrl(item.image as Media)
                    if (!url) return null
                    return (
                      <div key={index} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-parchment-card">
                        <Image src={url} alt="" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex justify-center lg:sticky lg:top-24">
            <ProductShowcase title={product.title} image={product.heroImage} />
          </div>
        </div>
      </div>
    </section>
  )
}
