import { Scale, Clock3, UtensilsCrossed, Sprout } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import SectionHeading from '@/shared/components/ui/SectionHeading'
import { benefits } from '@/features/home/data/benefits'

const iconMap: Record<string, LucideIcon> = {
  balance: Scale,
  clock: Clock3,
  utensils: UtensilsCrossed,
  leaf: Sprout,
}

export default function WhyOffiMeal() {
  return (
    <section aria-labelledby="why-offimeal-title" className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <SectionHeading
          eyebrow="Điểm khác biệt"
          title="Vì sao chọn OffiMeal?"
          description="Chúng tôi lo từ khâu thực đơn đến giao hàng, để bạn chỉ cần tập trung vào công việc và sống khỏe."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => {
            const Icon = iconMap[benefit.icon]
            return (
              <article
                key={benefit.title}
                className="group flex flex-col gap-4 rounded-3xl bg-cream-100 p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <span className="flex size-13 items-center justify-center rounded-2xl bg-forest-700 text-white transition-colors duration-300 group-hover:bg-accent-500 group-hover:text-forest-900">
                  <Icon className="size-6" aria-hidden />
                </span>
                <span className="text-xs font-bold text-forest-500/70">
                  0{index + 1}
                </span>
                <h3 className="text-lg leading-snug font-bold text-forest-900">
                  {benefit.title}
                </h3>
                <p className="text-sm leading-relaxed text-forest-900/70">
                  {benefit.description}
                </p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
