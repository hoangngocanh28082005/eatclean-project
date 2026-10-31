import { useState } from 'react'
import { Sparkles, ArrowRight, UserCheck, Dumbbell, Coffee } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { BodyProfile, Goal, ActivityLevel } from '@/features/nutrition/models/nutrition'
import { getWorkoutRecommendations } from '../services/workoutRecommendation'
import WorkoutVideoCard from './WorkoutVideoCard'
import type { WorkoutVideo } from '../models/Workout'

interface PersonalizedWorkoutBannerProps {
  profile: BodyProfile | null
  onLogCompleted: (video: WorkoutVideo) => void
  completedTodayIds: Set<string>
}

const goalNames: Record<Goal, string> = {
  lose: 'Giảm cân & Đốt mỡ',
  maintain: 'Duy trì vóc dáng',
  gain: 'Tăng cơ săn chắc',
}

const activityNames: Record<ActivityLevel, string> = {
  sedentary: 'Ngồi nhiều (văn phòng)',
  light: 'Vận động nhẹ (đi lại ít)',
  moderate: 'Vận động vừa (tập 3-5 ngày)',
}

export default function PersonalizedWorkoutBanner({
  profile,
  onLogCompleted,
  completedTodayIds,
}: PersonalizedWorkoutBannerProps) {
  const [selectedGoal, setSelectedGoal] = useState<Goal>(profile?.goal || 'lose')
  const [selectedActivity, setSelectedActivity] = useState<ActivityLevel>(
    profile?.activity || 'sedentary'
  )

  const recommendations = getWorkoutRecommendations(profile, selectedGoal, selectedActivity)

  return (
    <section className="overflow-hidden rounded-3xl bg-linear-to-br from-forest-900 via-forest-800 to-forest-900 p-6 text-white shadow-xl sm:p-8">
      {/* Header with badge */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-sage-300/20 px-3.5 py-1 text-xs font-semibold text-sage-300 backdrop-blur-md">
            <Sparkles className="size-3.5 text-accent-400" />
            Đề xuất thông minh theo thể trạng
          </div>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
            Lộ trình vận động dành riêng cho bạn
          </h2>
        </div>

        {profile ? (
          <div className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 text-xs backdrop-blur-md">
            <UserCheck className="size-4 text-sage-300" />
            <span>
              Đã đồng bộ hồ sơ: <strong>{profile.age} tuổi</strong>,{' '}
              <strong>{profile.weightKg}kg</strong>
            </span>
            <Link
              to="/dinh-duong-ca-nhan"
              className="text-accent-400 hover:underline"
              title="Cập nhật hồ sơ"
            >
              Sửa
            </Link>
          </div>
        ) : (
          <Link
            to="/dinh-duong-ca-nhan"
            className="inline-flex items-center gap-1.5 rounded-full bg-accent-500 px-4 py-2 text-xs font-bold text-forest-900 transition-colors hover:bg-accent-400"
          >
            Nhập hồ sơ cá nhân
            <ArrowRight className="size-3.5" />
          </Link>
        )}
      </div>

      {/* Profile filters switch */}
      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/15 pt-5 text-xs">
        <span className="font-semibold text-sage-300">Tùy biến nhanh:</span>

        {/* Goal buttons */}
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(goalNames) as Goal[]).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setSelectedGoal(g)}
              className={`rounded-xl px-3 py-1 font-semibold transition-all ${
                selectedGoal === g
                  ? 'bg-accent-500 text-forest-900 shadow-sm'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              {goalNames[g]}
            </button>
          ))}
        </div>

        {/* Activity selector */}
        <select
          value={selectedActivity}
          onChange={(e) => setSelectedActivity(e.target.value as ActivityLevel)}
          className="rounded-xl border border-white/20 bg-forest-900/80 px-3 py-1 text-xs font-medium text-white focus:outline-none"
        >
          {(Object.keys(activityNames) as ActivityLevel[]).map((a) => (
            <option key={a} value={a} className="bg-forest-900 text-white">
              {activityNames[a]}
            </option>
          ))}
        </select>
      </div>

      {/* Why recommended box */}
      <div className="mt-5 rounded-2xl bg-white/10 p-4 backdrop-blur-md">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-accent-500/20 p-2 text-accent-400">
            <Dumbbell className="size-5" />
          </div>
          <div className="space-y-1 text-xs sm:text-sm">
            <p className="font-semibold text-accent-300">Tại sao OffiMeal đề xuất bài tập này?</p>
            <p className="leading-relaxed text-white/90">{recommendations.reason}</p>
            <div className="flex items-center gap-1.5 pt-1 text-xs text-sage-300 font-medium">
              <Coffee className="size-3.5 text-accent-400 shrink-0" />
              <span>{recommendations.dailyRoutineTip}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Video Cards */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {recommendations.recommendedVideos.slice(0, 3).map((video) => (
          <div key={video.id} className="text-forest-900">
            <WorkoutVideoCard
              video={video}
              onLogCompleted={onLogCompleted}
              isRecentlyLogged={completedTodayIds.has(video.id)}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
