import { Check, BadgeCheck } from 'lucide-react'
import Button from '@/shared/components/ui/Button'
import SectionHeading from '@/shared/components/ui/SectionHeading'
import { subscriptionPlans } from '@/features/catalog/data/plans'

export default function SubscriptionPlans() {
  return (
    <section
      aria-labelledby="subscription-plans-title"
      className="bg-cream-100"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <SectionHeading
          eyebrow="Gói ăn"
          title="Gói ăn phù hợp với lịch trình của bạn"
          description="Tham khảo gói tuần và gói tháng. Chức năng đăng ký cùng chính sách giao, đổi và tạm dừng gói đang được hoàn thiện."
        />

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2">
          {subscriptionPlans.map((plan) => {
            const isHighlighted = Boolean(plan.highlight)
            return (
              <article
                key={plan.id}
                className={`relative flex flex-col gap-6 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1 ${
                  isHighlighted
                    ? 'bg-forest-700 text-white shadow-xl'
                    : 'bg-white text-forest-900 shadow-sm ring-1 ring-sage-200 hover:shadow-lg'
                }`}
              >
                {isHighlighted && (
                  <span className="absolute -top-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-accent-500 px-4 py-1.5 text-xs font-bold text-forest-900 shadow-sm">
                    <BadgeCheck className="size-3.5" aria-hidden />
                    Gói theo tháng
                  </span>
                )}

                <div>
                  <h3 className={`text-lg font-bold ${isHighlighted ? 'text-white' : 'text-forest-900'}`}>
                    {plan.name}
                  </h3>
                  <p className={`mt-1 text-sm ${isHighlighted ? 'text-sage-200' : 'text-forest-900/60'}`}>
                    {plan.description}
                  </p>
                </div>

                <div>
                  <p className={`text-4xl font-extrabold ${isHighlighted ? 'text-white' : 'text-forest-700'}`}>
                    {plan.priceLabel}
                  </p>
                  <p className={`mt-1 text-sm font-medium ${isHighlighted ? 'text-sage-200' : 'text-forest-900/60'}`}>
                    {plan.periodLabel}
                  </p>
                </div>

                <ul className={`flex flex-col gap-3 ${isHighlighted ? 'text-sage-100' : 'text-forest-900/80'}`}>
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <Check
                        className={`mt-0.5 size-4 shrink-0 ${isHighlighted ? 'text-accent-400' : 'text-forest-500'}`}
                        aria-hidden
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  to="/goi-an"
                  variant={isHighlighted ? 'secondary' : 'outline'}
                  className="mt-auto w-full"
                >
                  Tìm hiểu gói ăn
                </Button>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
