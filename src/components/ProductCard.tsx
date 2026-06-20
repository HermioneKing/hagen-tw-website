'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { getMediaUrl } from '@/lib/media'
import type { Media, Product } from '@/payload-types'

type ProductCardProps = {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations('products')
  const imageUrl = getMediaUrl(product.heroImage as Media | null)

  return (
    <article className="card-inset flex h-full flex-col rounded-[10px] bg-white p-8">
      <div className="mb-6 overflow-hidden rounded-xl bg-parchment-card p-4">
        {imageUrl ? (
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-obsidian">
            <Image src={imageUrl} alt={product.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
          </div>
        ) : (
          <div className="flex aspect-[4/3] items-center justify-center rounded-lg bg-obsidian shadow-lg">
            <div className="h-16 w-16 rounded-sm bg-warm-canvas/10" />
          </div>
        )}
      </div>
      <h3 className="text-[19px] font-semibold tracking-[-0.25px] text-charcoal-primary">{product.title}</h3>
      {product.summary ? (
        <p className="mt-3 flex-1 text-[15px] leading-[1.47] tracking-[-0.2px] text-graphite">{product.summary}</p>
      ) : null}
      <Link href={`/products/${product.slug}`} className="link-accent mt-6">
        {t('viewDetails')} →
      </Link>
    </article>
  )
}
