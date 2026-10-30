import SectionHeading from '@/shared/components/ui/SectionHeading'
import { howItWorksSteps } from '@/features/home/data/howItWorks'

export default function HowItWorks() {
  return (
    <section aria-labelledby="how-it-works-title" className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <SectionHeading
          eyebrow="Cách hoạt động"
          title="Tìm hiểu cách sử dụng OffiMeal"
          description="Bắt đầu từ hồ sơ dinh dưỡng và tham khảo gói ăn phù hợp với lịch làm việc."
        />

        <ol className="relative mt-14 grid gap-10 lg:grid-cols-3 lg:gap-8">
          {/* Connector line (desktop) */}
          <div
            aria-hidden
            className="absolute top-7 right-[16%] left-[16%] hidden border-t-2 border-dashed border-sage-300 lg:block"
          />

          {howItWorksSteps.map((step) => (
            <li
              key={step.step}
              className="relative flex flex-col items-center gap-4 rounded-3xl px-4 text-center"
            >
              <span className="z-10 flex size-14 items-center justify-center rounded-full bg-forest-700 text-xl font-extrabold text-white shadow-md">
                {step.step}
              </span>
              <h3 className="text-lg font-bold text-forest-900">{step.title}</h3>
              <p className="max-w-xs text-sm leading-relaxed text-forest-900/70">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
