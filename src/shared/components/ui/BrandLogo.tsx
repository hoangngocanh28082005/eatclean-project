import { useState } from 'react'

// Web-prepared logo based on the team's supplied reference; shared by header and footer.
const logoUrl = '/logo-offimeal.png'

export default function BrandLogo({ footer = false }: { footer?: boolean }) {
  const [missing, setMissing] = useState(false)

  if (missing) {
    return (
      <span className={`text-2xl font-extrabold tracking-tight ${footer ? 'text-white' : 'text-forest-700'}`}>
        Offi<span className="text-accent-500">Meal</span>
      </span>
    )
  }

  return (
    <img
      src={logoUrl}
      alt="OffiMeal — Healthy Meals · Better You · Every Workday"
      width={1454}
      height={1082}
      decoding="async"
      className={footer
        ? 'block h-auto w-60 max-w-full rounded-2xl bg-white p-3 shadow-sm'
        : 'block h-24 w-36 shrink-0 object-contain sm:h-28 sm:w-44'}
      onError={() => setMissing(true)}
    />
  )
}
