import { ArrowRight, Sparkles } from 'lucide-react'
import Button from '@/shared/components/ui/Button'
import ImageWithFallback from '@/shared/components/ui/ImageWithFallback'
import { meals, heroImage } from '@/features/catalog/data/meals'

const stats = [
  { value: '5 bữa', label: 'Gói tuần' },
  { value: '20 bữa', label: 'Gói tháng' },
  { value: 'Trước 11:30', label: 'Giờ giao dự kiến' },
]

export default function Hero() {
  return (
    <section className="bg-cream-100">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
        {/* Text */}
        <div className="flex flex-col items-start gap-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-sage-100 px-4 py-1.5 text-xs font-semibold text-forest-700">
            <Sparkles className="size-3.5 text-accent-600" aria-hidden />
            Gói bữa trưa cho dân văn phòng
          </span>

          <h1 className="text-4xl leading-[1.15] font-extrabold text-forest-900 sm:text-5xl lg:text-6xl">
            Ăn lành mạnh,{' '}
            <span className="text-forest-600">sống nhẹ nhàng</span> hơn.
          </h1>

          <p className="max-w-lg text-lg leading-relaxed text-forest-900/70">
            OffiMeal mang đến những bữa ăn dinh dưỡng, tiện lợi và phù hợp với
            mục tiêu sức khỏe của bạn.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button to="/thuc-don" size="lg">
              Khám phá thực đơn
              <ArrowRight className="size-4" aria-hidden />
            </Button>
            <Button to="/dinh-duong-ca-nhan" variant="outline" size="lg">
              Tìm bữa ăn phù hợp
            </Button>
          </div>

          {/* Quick stats */}
          <dl className="mt-4 flex flex-wrap gap-x-10 gap-y-4 border-t border-sage-200 pt-6">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="text-2xl font-extrabold text-forest-700">
                  {stat.value}
                </dd>
                <dd className="text-sm text-forest-900/60">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Photo */}
        <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
          <div className="absolute -top-6 -right-6 -z-0 hidden size-48 rounded-[2rem] bg-sage-200 lg:block" />
          <div className="relative overflow-hidden rounded-[2.5rem] shadow-xl">
            <ImageWithFallback
              src={heroImage.url}
              alt={heroImage.alt}
              className="aspect-[4/5] w-full object-cover sm:aspect-[5/4] lg:aspect-[4/5]"
            />
          </div>

          {/* Floating meal chip */}
          <div className="absolute bottom-6 left-6 flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-3 shadow-lg backdrop-blur-sm sm:bottom-auto sm:top-6 sm:left-6">
            <ImageWithFallback
              src={meals[0].imageUrl}
              alt={meals[0].imageAlt}
              className="size-12 rounded-xl object-cover"
            />
            <div>
              <p className="text-sm font-bold text-forest-900">{meals[0].name}</p>
              <p className="text-xs text-forest-900/60">
                {meals[0].calories} kcal · {meals[0].protein} g đạm
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
