import { ArrowRight, Target, Ruler, Flame } from 'lucide-react'
import Button from '@/shared/components/ui/Button'
import ImageWithFallback from '@/shared/components/ui/ImageWithFallback'
import { nutritionSectionImage } from '@/features/catalog/data/meals'

const highlights = [
  { icon: Target, label: 'Mục tiêu rõ ràng' },
  { icon: Ruler, label: 'Nhập hồ sơ thể trạng' },
  { icon: Flame, label: 'Ước tính nhu cầu calo' },
]

export default function NutritionPreview() {
  return (
    <section
      aria-labelledby="nutrition-preview-title"
      className="bg-white"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
        {/* Photo */}
        <div className="relative order-2 mx-auto w-full max-w-xl lg:order-1 lg:max-w-none">
          <div className="absolute -bottom-6 -left-6 -z-0 hidden size-44 rounded-[2rem] bg-sage-200 lg:block" />
          <div className="relative overflow-hidden rounded-[2.5rem] shadow-xl">
            <ImageWithFallback
              src={nutritionSectionImage.url}
              alt={nutritionSectionImage.alt}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          <div className="absolute right-6 bottom-6 flex items-center gap-2 rounded-2xl bg-forest-700 px-5 py-3 text-white shadow-lg">
            <Flame className="size-5 text-accent-400" aria-hidden />
            <span className="text-sm font-semibold">Gợi ý calo theo cơ thể bạn</span>
          </div>
        </div>

        {/* Text */}
        <div className="order-1 flex flex-col items-start gap-5 lg:order-2">
          <span className="text-xs font-bold tracking-[0.2em] text-forest-500 uppercase">
            Dinh dưỡng cá nhân
          </span>
          <h2 className="max-w-md text-3xl leading-tight font-extrabold text-forest-900 sm:text-4xl">
            Mỗi cơ thể, một chế độ dinh dưỡng riêng
          </h2>
          <p className="max-w-lg text-base leading-relaxed text-forest-900/70">
            Nhập thông tin cơ thể và khám phá lượng calo phù hợp với mục tiêu
            của bạn.
          </p>

          <ul className="flex flex-wrap gap-3">
            {highlights.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-2 rounded-full bg-sage-100 px-4 py-2 text-sm font-medium text-forest-700"
              >
                <Icon className="size-4" aria-hidden />
                {label}
              </li>
            ))}
          </ul>

          <Button to="/dinh-duong-ca-nhan" size="lg" className="mt-2">
            Tính nhu cầu dinh dưỡng
            <ArrowRight className="size-4" aria-hidden />
          </Button>
        </div>
      </div>
    </section>
  )
}
