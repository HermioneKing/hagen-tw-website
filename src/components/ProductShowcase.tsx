import Image from 'next/image'
import { getMediaUrl } from '@/lib/media'
import type { Media } from '@/payload-types'

type ProductShowcaseProps = {
  title: string
  image?: Media | number | null
}

export function ProductShowcase({ title, image }: ProductShowcaseProps) {
  const imageUrl = getMediaUrl(image as Media | null)

  return (
    <div className="overflow-hidden rounded-t-3xl rounded-b-3xl bg-obsidian p-1 shadow-lg">
      <div className="relative aspect-[9/16] w-full max-w-sm overflow-hidden rounded-[20px] bg-midnight">
        {imageUrl ? (
          <Image src={imageUrl} alt={title} fill className="object-cover" sizes="400px" priority />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="h-20 w-20 rounded-sm bg-white/10" />
          </div>
        )}
      </div>
    </div>
  )
}
