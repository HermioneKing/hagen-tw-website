import { setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import { ProductShowcase } from '@/components/ProductShowcase'
import { RichTextContent } from '@/components/RichTextContent'
import type { Locale } from '@/i18n/config'
import { getPayloadClient } from '@/lib/payload'

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

  return (
    <section className="section-gap">
      <div className="page-container grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <h1 className="section-heading">{about.heading}</h1>
          <div className="mt-6">
            <RichTextContent content={about.body} />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <ProductShowcase
            title={about.heading ?? 'About'}
            image={about.image}
            fallbackSrc="/hagen-icon.png"
          />
        </div>
      </div>
    </section>
  )
}
