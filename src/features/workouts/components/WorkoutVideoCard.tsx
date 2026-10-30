import { useState } from 'react'
import { Play, ExternalLink } from 'lucide-react'
import {
  youtubeThumb,
  youtubeUrl,
  type WorkoutVideo,
} from '@/features/workouts/data/workouts'
import { goalLabels } from '@/features/nutrition/services/nutritionCalculator'

interface WorkoutVideoCardProps {
  video: WorkoutVideo
}

const intensityLabels: Record<WorkoutVideo['intensity'], string> = {
  low: 'Nhẹ',
  medium: 'Trung bình',
  high: 'Cao',
}

const intensityStyles: Record<WorkoutVideo['intensity'], string> = {
  low: 'bg-sage-100 text-forest-700',
  medium: 'bg-accent-300 text-forest-900',
  high: 'bg-forest-700 text-white',
}

export default function WorkoutVideoCard({ video }: WorkoutVideoCardProps) {
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
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.opacity = '0.25'
              }}
            />
            <span className="absolute inset-0 flex items-center justify-center bg-forest-900/25 transition-colors group-hover:bg-forest-900/10">
              <span className="flex size-14 items-center justify-center rounded-full bg-white/95 text-forest-700 shadow-lg transition-transform duration-200 group-hover:scale-110">
                <Play className="size-6 translate-x-0.5 fill-forest-700" aria-hidden />
              </span>
            </span>
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${intensityStyles[video.intensity]}`}>
            Cường độ {intensityLabels[video.intensity]}
          </span>
          {video.goals.map((goal) => (
            <span
              key={goal}
              className="rounded-full bg-cream-100 px-2.5 py-1 text-xs font-medium text-forest-900/70"
            >
              {goalLabels[goal]}
            </span>
          ))}
        </div>

        <h3 className="text-lg leading-snug font-bold text-forest-900">
          {video.name}
        </h3>
        <p className="text-sm leading-relaxed text-forest-900/70">
          {video.description}
        </p>

        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-sm font-semibold text-forest-700">
            {video.durationLabel}
          </span>
          <a
            href={youtubeUrl(video.youtubeId)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest-900/60 transition-colors hover:text-forest-700"
          >
            Mở trên YouTube
            <ExternalLink className="size-3.5" aria-hidden />
          </a>
        </div>
      </div>
    </article>
  )
}
