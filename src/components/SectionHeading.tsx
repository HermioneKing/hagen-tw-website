type SectionHeadingProps = {
  title: string
  subtitle?: string | null
  accent?: string | null
}

export function SectionHeading({ title, subtitle, accent }: SectionHeadingProps) {
  return (
    <div className="mb-12 max-w-2xl">
      <h2 className="section-heading">
        {title}
        {accent ? <span className="text-ember-orange"> {accent}</span> : null}
      </h2>
      {subtitle ? (
        <p className="mt-4 text-[17px] leading-[1.47] tracking-[-0.22px] text-graphite">{subtitle}</p>
      ) : null}
    </div>
  )
}
