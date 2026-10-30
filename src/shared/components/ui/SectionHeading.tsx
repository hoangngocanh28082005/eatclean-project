interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
}: SectionHeadingProps) {
  const alignment =
    align === 'center' ? 'items-center text-center' : 'items-start text-left'

  return (
    <div className={`flex flex-col gap-3 ${alignment}`}>
      {eyebrow && (
        <span className="text-xs font-bold tracking-[0.2em] text-forest-500 uppercase">
          {eyebrow}
        </span>
      )}
      <h2 className="max-w-2xl text-3xl leading-tight font-extrabold text-forest-900 sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="max-w-xl text-base text-forest-900/70">{description}</p>
      )}
    </div>
  )
}
