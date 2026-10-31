import { useState } from 'react'
import { Play, ExternalLink, Flame, CheckCircle2 } from 'lucide-react'
import {
  youtubeThumb,
  youtubeUrl,
  categoryLabels,
  difficultyLabels,
  type WorkoutVideo,
} from '@/features/workouts/data/workouts'
import { goalLabels } from '@/features/nutrition/services/nutritionCalculator'

interface WorkoutVideoCardProps {
  video: WorkoutVideo
  onLogCompleted?: (video: WorkoutVideo) => void
  isRecentlyLogged?: boolean
}

const intensityStyles: Record<WorkoutVideo['intensity'], string> = {
  low: 'bg-sage-100 text-forest-700',
  medium: 'bg-accent-300/80 text-forest-900',
  high: 'bg-forest-700 text-white',
}

export default function WorkoutVideoCard({
  video,
  onLogCompleted,
  isRecentlyLogged = false,
}: WorkoutVideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-sage-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Video area — lazy: thumbnail first, embed on click */}
      <div className="relative aspect-video overflow-hidden bg-forest-900">
        {isPlaying ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
            title={`${video.name} — video hướng dẫn`}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <button
            type="button"
            className="group relative block h-full w-full cursor-pointer"
            onClick={() => setIsPlaying(true)}
            aria-label={`Phát video: ${video.name}`}
          >
            <img
              src={youtubeThumb(video.youtubeId)}
              alt={`Ảnh xem trước bài tập: ${video.name}`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.opacity = '0.35'
              }}
            />
            <span className="absolute inset-0 flex items-center justify-center bg-forest-900/30 transition-colors group-hover:bg-forest-900/15">
              <span className="flex size-14 items-center justify-center rounded-full bg-white/95 text-forest-700 shadow-lg transition-transform duration-200 group-hover:scale-110">
                <Play className="size-6 translate-x-0.5 fill-forest-700" aria-hidden />
              </span>
            </span>

            {/* Duration & Category Badges */}
            <span className="absolute bottom-2.5 left-2.5 rounded-lg bg-forest-900/80 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-xs">
              {video.durationLabel}
            </span>
            <span className="absolute top-2.5 right-2.5 rounded-lg bg-white/90 px-2.5 py-1 text-xs font-bold text-forest-900 backdrop-blur-xs shadow-xs">
              {categoryLabels[video.category]}
            </span>
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${intensityStyles[video.intensity]}`}
          >
            {difficultyLabels[video.difficulty]}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-xs font-medium text-amber-700">
            <Flame className="size-3 text-accent-500 fill-accent-500" />
            ~{video.estimatedCalories} kcal
          </span>
          {video.goals.slice(0, 2).map((goal) => (
            <span
              key={goal}
              className="rounded-full bg-cream-100 px-2 py-0.5 text-xs font-medium text-forest-900/70"
            >
              {goalLabels[goal]}
            </span>
          ))}
        </div>

        <h3 className="text-base leading-snug font-bold text-forest-900 line-clamp-1">
          {video.name}
        </h3>
        <p className="text-xs leading-relaxed text-forest-900/70 line-clamp-2">
          {video.description}
        </p>

        <div className="mt-auto flex flex-col gap-3 border-t border-sage-100/70 pt-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-forest-700">Vùng tác động: {video.targetArea}</span>
            <a
              href={youtubeUrl(video.youtubeId)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-forest-900/50 hover:text-forest-700"
            >
              YouTube
              <ExternalLink className="size-3" aria-hidden />
            </a>
          </div>

          {onLogCompleted && (
            <button
              type="button"
              onClick={() => onLogCompleted(video)}
              className={`flex w-full items-center justify-center gap-2 rounded-2xl py-2 text-xs font-bold transition-all ${
                isRecentlyLogged
                  ? 'bg-sage-200 text-forest-900 cursor-default'
                  : 'bg-forest-800 text-white hover:bg-forest-700 active:scale-[0.98]'
              }`}
            >
              <CheckCircle2 className={`size-4 ${isRecentlyLogged ? 'text-forest-700' : 'text-sage-300'}`} />
              {isRecentlyLogged ? 'Đã hoàn thành hôm nay' : 'Đánh dấu đã hoàn thành'}
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
