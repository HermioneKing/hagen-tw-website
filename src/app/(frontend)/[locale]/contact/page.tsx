import { setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import { ContactForm } from '@/components/ContactForm'
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
  const contact = await payload.findGlobal({ slug: 'contact-page', locale: locale as Locale })
  return { title: `${contact.heading ?? 'Contact'} | Hagen Creative` }
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const payload = await getPayloadClient()
  const contact = await payload.findGlobal({
    slug: 'contact-page',
    locale: locale as Locale,
  })

  return (
    <section className="section-gap">
      <div className="page-container grid gap-12 lg:grid-cols-2">
        <div>
          <h1 className="section-heading">{contact.heading}</h1>
          {contact.intro ? (
            <p className="mt-4 text-[17px] leading-[1.47] tracking-[-0.22px] text-graphite">{contact.intro}</p>
          ) : null}

          <div className="mt-8 space-y-3 text-[15px] text-graphite">
            {contact.address ? <p>{contact.address}</p> : null}
            {contact.email ? (
              <p>
                <a href={`mailto:${contact.email}`} className="link-accent">
                  {contact.email}
                </a>
              </p>
            ) : null}
            {contact.phone ? <p>{contact.phone}</p> : null}
          </div>

          {contact.socialLinks && contact.socialLinks.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-4">
              {contact.socialLinks.map((link) => (
                <a key={link.url} href={link.url} className="link-accent" target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>

        <ContactForm locale={locale as Locale} />
      </div>
    </section>
  )
}
