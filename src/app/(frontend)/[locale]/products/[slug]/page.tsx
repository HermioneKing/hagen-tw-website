import Image from 'next/image'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ProductGallery } from '@/components/ProductGallery'
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

  const linkItems = product.links?.items

  const galleryItems =
    product.gallery
      ?.map((item) => {
        const media = item.image as Media
        const url = getMediaUrl(media)
        if (!url) return null
        return {
          url,
          alt: media.alt || product.title,
          width: media.width,
          height: media.height,
        }
      })
      .filter((item): item is NonNullable<typeof item> => item !== null) ?? []

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

            {galleryItems.length > 0 ? (
              <div className="mt-10">
                <h2 className="mb-4 text-[19px] font-semibold tracking-[-0.25px] text-charcoal-primary">{t('gallery')}</h2>
                <ProductGallery items={galleryItems} />
              </div>
            ) : null}
          </div>

          <div className="flex flex-col items-center gap-8 lg:sticky lg:top-24">
            <ProductShowcase title={product.title} image={product.heroImage} />

            {linkItems && linkItems.length > 0
              ? linkItems.map((item) => {
                  const qrMedia = item.qrCode as Media | null | undefined
                  const qrUrl = getMediaUrl(qrMedia)
                  return (
                    <div key={item.id ?? item.url} className="w-full max-w-[200px]">
                      <h2 className="mb-4 text-center text-[19px] font-semibold tracking-[-0.25px] text-charcoal-primary">
                        {item.label}
                      </h2>
                      {qrUrl ? (
                        <div className="mb-4 overflow-hidden rounded-xl bg-parchment-card p-3">
                          <Image
                            src={qrUrl}
                            alt={qrMedia?.alt || item.label}
                            width={qrMedia?.width ?? 200}
                            height={qrMedia?.height ?? 200}
                            className="h-auto w-full"
                            sizes="200px"
                          />
                        </div>
                      ) : null}
                      <a
                        href={item.url}
                        className="link-accent block text-center"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {item.label}
                      </a>
                    </div>
                  )
                })
              : null}
          </div>
        </div>
      </div>
    </section>
  )
}
