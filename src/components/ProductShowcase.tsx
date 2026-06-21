import Image from 'next/image'
import { getMediaUrl } from '@/lib/media'
import type { Media } from '@/payload-types'

type ProductShowcaseProps = {
  title: string
  image?: Media | number | null
  fallbackSrc?: string
}

export function ProductShowcase({ title, image, fallbackSrc }: ProductShowcaseProps) {
  const imageUrl = getMediaUrl(image as Media | null)
  const media = image && typeof image === 'object' ? image : null
  const imageWidth = media?.width ?? 200
  const imageHeight = media?.height ?? 200
  const src = imageUrl ?? fallbackSrc

  return (
    <div className="w-full max-w-[200px]">
      {src ? (
        <div className="overflow-hidden rounded-xl bg-parchment-card p-3">
          <Image
            src={src}
            alt={title}
            width={imageUrl ? imageWidth : 96}
            height={imageUrl ? imageHeight : 96}
            className="h-auto w-full"
            sizes="200px"
            priority
          />
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl bg-parchment-card p-3">
          <div className="aspect-square w-full rounded-lg bg-stone-surface" />
        </div>
      )}
    </div>
  )
}
