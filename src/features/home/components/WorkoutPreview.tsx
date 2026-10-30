import { ArrowRight, Timer, BarChart3 } from 'lucide-react'
import Button from '@/shared/components/ui/Button'
import ImageWithFallback from '@/shared/components/ui/ImageWithFallback'
import SectionHeading from '@/shared/components/ui/SectionHeading'
import { workoutPreviews } from '@/features/workouts/data/workouts'

export default function WorkoutPreview() {
  return (
    <section aria-labelledby="workout-preview-title" className="bg-forest-700">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:items-end sm:text-left">
          <SectionHeading
            align="left"
            eyebrow="Kèm vận động"
            title="Ăn khỏe hơn, vận động dễ dàng hơn"
            description="Những chuỗi bài tập ngắn được thiết kế để làm ngay trong ngày làm việc."
          />
          <Button to="/bai-tap" variant="secondary" className="hidden shrink-0 sm:inline-flex">
            Khám phá bài tập
            <ArrowRight className="size-4" aria-hidden />
          </Button>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {workoutPreviews.map((workout) => (
            <article
              key={workout.id}
              className="group flex h-full flex-col overflow-hidden rounded-3xl bg-forest-800 ring-1 ring-forest-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <ImageWithFallback
                  src={workout.imageUrl}
                  alt={workout.imageAlt}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-6">
                <h3 className="text-lg font-bold text-white">{workout.name}</h3>
                <p className="text-sm leading-relaxed text-sage-200">
                  {workout.description}
                </p>
                <div className="mt-auto flex items-center gap-5 pt-3 text-sm text-sage-300">
                  <span className="flex items-center gap-1.5">
                    <Timer className="size-4 text-accent-400" aria-hidden />
                    {workout.durationLabel}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BarChart3 className="size-4 text-accent-400" aria-hidden />
                    {workout.levelLabel}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center sm:hidden">
          <Button to="/bai-tap" variant="secondary">
            Khám phá bài tập
          </Button>
        </div>
      </div>
    </section>
  )
}
