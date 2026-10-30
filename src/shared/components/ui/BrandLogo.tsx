import { useState } from 'react'

// Save the original team logo here; all brand placements share this asset.
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
      width={1254}
      height={1254}
      className={footer
        ? 'block h-auto w-52 max-w-full rounded-2xl bg-white'
        : 'block h-20 w-28 shrink-0 object-contain sm:w-32'}
      onError={() => setMissing(true)}
      onLoad={() => {
        const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
        if (favicon) {
          favicon.type = 'image/png'
          favicon.href = logoUrl
        }
      }}
    />
  )
}
