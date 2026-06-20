import Image from 'next/image'
import { setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import { RichTextContent } from '@/components/RichTextContent'
import type { Locale } from '@/i18n/config'
import { getMediaUrl } from '@/lib/media'
import { getPayloadClient } from '@/lib/payload'
import type { Media } from '@/payload-types'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const payload = await getPayloadClient()
  const about = await payload.findGlobal({ slug: 'about-page', locale: locale as Locale })
  return { title: `${about.heading ?? 'About'} | Hagen Creative` }
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const payload = await getPayloadClient()
  const about = await payload.findGlobal({
    slug: 'about-page',
    locale: locale as Locale,
    depth: 1,
  })

  const imageUrl = getMediaUrl(about.image as Media | null)

  return (
    <section className="section-gap">
      <div className="page-container grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <h1 className="section-heading">{about.heading}</h1>
          <div className="mt-6">
            <RichTextContent content={about.body} />
          </div>
        </div>
        <div className="card-inset overflow-hidden rounded-[10px] bg-white p-8">
          {imageUrl ? (
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-parchment-card">
              <Image src={imageUrl} alt={about.heading ?? 'About'} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
            </div>
          ) : (
            <div className="flex aspect-[4/3] items-center justify-center rounded-xl bg-parchment-card">
              <Image src="/hagen-icon.png" alt="Hagen Creative" width={96} height={96} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
