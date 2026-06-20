import { BlobAccents } from './BlobAccents'
import { Link } from '@/i18n/navigation'

type HeroProps = {
  tagline?: string | null
  headline?: string | null
  subtext?: string | null
  ctaPrimary?: string | null
  ctaSecondary?: string | null
}

export function Hero({ tagline, headline, subtext, ctaPrimary, ctaSecondary }: HeroProps) {
  return (
    <section className="relative overflow-hidden section-gap">
      <BlobAccents />
      <div className="page-container relative z-10 flex flex-col items-center text-center">
        {tagline ? (
          <p className="mb-4 text-sm font-medium tracking-[-0.18px] text-ash">{tagline}</p>
        ) : null}
        <h1 className="display-heading max-w-4xl">{headline ?? 'Hagen Creative'}</h1>
        {subtext ? (
          <p className="mt-6 max-w-xl text-[16px] leading-[1.47] tracking-[-0.16px] text-graphite">{subtext}</p>
        ) : null}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link href="/products" className="btn-pill-dark">
            {ctaPrimary ?? 'View products'}
          </Link>
          <Link href="/about" className="btn-pill-light">
            {ctaSecondary ?? 'About us'}
          </Link>
        </div>
      </div>
    </section>
  )
}
