import { useState, useMemo } from 'react'
import {
  Dumbbell,
  LineChart,
  Utensils,
  Bell,
  CheckCircle,
} from 'lucide-react'
import { workoutVideos, type WorkoutVideo } from '../data/workouts'
import WorkoutVideoCard from '../components/WorkoutVideoCard'
import WorkoutFilters, { type FilterState } from '../components/WorkoutFilters'
import PersonalizedWorkoutBanner from '../components/PersonalizedWorkoutBanner'
import ProgressTracker from '../components/ProgressTracker'
import MealDiaryTracker from '../components/MealDiaryTracker'
import ReminderWidget from '../components/ReminderWidget'
import NotificationModal from '../components/NotificationModal'
import { workoutProgressService } from '../services/workoutProgressService'
import { loadProfile } from '@/features/nutrition/services/profileStorage'

export default function WorkoutsPage() {
  // Navigation tab
  const [activeTab, setActiveTab] = useState<'workouts' | 'progress' | 'meals' | 'reminders'>('workouts')

  // Notification modal
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState(workoutProgressService.getNotifications())

  // Dynamic user data states
  const profile = useMemo(() => loadProfile(), [])
  const [workoutLogs, setWorkoutLogs] = useState(workoutProgressService.getWorkoutLogs())
  const [weightLogs, setWeightLogs] = useState(workoutProgressService.getWeightLogs())
  const [mealLogs, setMealLogs] = useState(workoutProgressService.getMealLogs())

  // Completion toast feedback
  const [completionToast, setCompletionToast] = useState<string | null>(null)

  // Filters state
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    durationFilter: 'all',
    difficultyFilter: 'all',
    categoryFilter: 'all',
    goalFilter: 'all',
  })

  // Filter videos
  const filteredVideos = useMemo(() => {
    return workoutVideos.filter((v) => {
      // Search
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase()
        const matchName = v.name.toLowerCase().includes(q)
        const matchDesc = v.description.toLowerCase().includes(q)
        const matchArea = v.targetArea.toLowerCase().includes(q)
        if (!matchName && !matchDesc && !matchArea) return false
      }

      // Duration
      if (filters.durationFilter === 'under10' && v.durationMinutes >= 10) return false
      if (filters.durationFilter === '10to15' && (v.durationMinutes < 10 || v.durationMinutes > 15))
        return false
      if (filters.durationFilter === 'over15' && v.durationMinutes <= 15) return false

      // Difficulty
      if (filters.difficultyFilter !== 'all' && v.difficulty !== filters.difficultyFilter) return false

      // Category
      if (filters.categoryFilter !== 'all' && v.category !== filters.categoryFilter) return false

      // Goal
      if (filters.goalFilter !== 'all' && !v.goals.includes(filters.goalFilter)) return false

      return true
    })
  }, [filters])

  // Completed today set
  const [todayDate] = useState(() => new Date().toISOString().split('T')[0])
  const completedTodayIds = useMemo(() => {
    const set = new Set<string>()
    workoutLogs.forEach((log) => {
      if (log.completedAt.startsWith(todayDate)) {
        set.add(log.workoutId)
      }
    })
    return set
  }, [workoutLogs, todayDate])

  // Handlers
  const handleLogWorkout = (video: WorkoutVideo) => {
    const newLog = workoutProgressService.addWorkoutLog({
      workoutId: video.id,
      workoutTitle: video.name,
      durationMinutes: video.durationMinutes,
      caloriesBurned: video.estimatedCalories,
      note: `Hoàn tất bài tập ${video.name} qua trang web`,
    })
    setWorkoutLogs([newLog, ...workoutLogs])
    setCompletionToast(`Đã ghi nhận hoàn thành: ${video.name} (+${video.estimatedCalories} kcal) 🎉`)
    setTimeout(() => setCompletionToast(null), 4000)
  }

  const handleAddCustomWorkout = (
    title: string,
    durationMinutes: number,
    calories?: number,
    note?: string
  ) => {
    const newLog = workoutProgressService.addWorkoutLog({
      workoutId: 'custom-' + Date.now(),
      workoutTitle: title,
      durationMinutes,
      caloriesBurned: calories,
      note,
    })
    setWorkoutLogs([newLog, ...workoutLogs])
    setCompletionToast(`Đã ghi nhận hoạt động: ${title} 🎉`)
    setTimeout(() => setCompletionToast(null), 4000)
  }

  const handleAddWeight = (weightKg: number, date?: string, note?: string) => {
    workoutProgressService.addWeightLog(weightKg, date, note)
    setWeightLogs(workoutProgressService.getWeightLogs())
  }

  const handleDeleteWeight = (id: string) => {
    workoutProgressService.deleteWeightLog(id)
    setWeightLogs(workoutProgressService.getWeightLogs())
  }

  const handleToggleMeal = (id: string) => {
    workoutProgressService.toggleMealConsumed(id)
    setMealLogs(workoutProgressService.getMealLogs())
  }

  const handleMarkNotifRead = (id: string) => {
    workoutProgressService.markNotificationAsRead(id)
    setNotifications(workoutProgressService.getNotifications())
  }

  const handleMarkAllNotifsRead = () => {
    workoutProgressService.markAllNotificationsAsRead()
    setNotifications(workoutProgressService.getNotifications())
  }

  const unreadNotifsCount = notifications.filter((n) => !n.isRead).length

  return (
    <div className="min-h-screen bg-cream-100/50 pb-20">
      {/* Toast Feedback */}
      {completionToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl bg-forest-900 px-5 py-3 text-xs font-bold text-white shadow-xl ring-2 ring-sage-300 animate-slide-up">
          <CheckCircle className="size-4 text-emerald-400" />
          <span>{completionToast}</span>
        </div>
      )}

      {/* Hero Header */}
      <section className="border-b border-sage-200/60 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sage-100 px-3.5 py-1 text-xs font-bold tracking-wider text-forest-700 uppercase">
                <Dumbbell className="size-3.5" />
                Vận động & Tiến độ thể chất
              </span>
              <h1 className="text-3xl font-black tracking-tight text-forest-900 sm:text-4xl lg:text-5xl">
                Khỏe mạnh & Cân bằng mỗi ngày
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-forest-900/70 sm:text-base">
                Thư viện bài tập ngắt quãng 5–20 phút, bài tập giãn cơ bàn làm việc, kết hợp biểu đồ
                theo dõi cân nặng và xác nhận nhật ký bữa ăn thực tế.
              </p>
            </div>

            {/* In-App Notifications Button */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsNotifOpen(true)}
                className="relative inline-flex items-center gap-2 rounded-2xl border border-sage-200 bg-cream-100/60 px-4 py-2.5 text-xs font-bold text-forest-900 transition-colors hover:bg-sage-100"
              >
                <Bell className="size-4 text-forest-700" />
                <span>Thông báo website</span>
                {unreadNotifsCount > 0 && (
                  <span className="flex size-5 items-center justify-center rounded-full bg-accent-500 text-[10px] font-bold text-white">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-8 flex flex-wrap gap-2 border-t border-sage-100 pt-6">
            <button
              type="button"
              onClick={() => setActiveTab('workouts')}
              className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold transition-all ${
                activeTab === 'workouts'
                  ? 'bg-forest-800 text-white shadow-sm'
                  : 'bg-cream-100 text-forest-900/70 hover:bg-sage-100'
              }`}
            >
              <Dumbbell className="size-4" />
              Thư viện bài tập & Gợi ý
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('progress')}
              className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold transition-all ${
                activeTab === 'progress'
                  ? 'bg-forest-800 text-white shadow-sm'
                  : 'bg-cream-100 text-forest-900/70 hover:bg-sage-100'
              }`}
            >
              <LineChart className="size-4" />
              Tiến độ & Cân nặng ({weightLogs.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('meals')}
              className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold transition-all ${
                activeTab === 'meals'
                  ? 'bg-forest-800 text-white shadow-sm'
                  : 'bg-cream-100 text-forest-900/70 hover:bg-sage-100'
              }`}
            >
              <Utensils className="size-4" />
              Nhật ký bữa ăn hôm nay
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('reminders')}
              className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold transition-all ${
                activeTab === 'reminders'
                  ? 'bg-forest-800 text-white shadow-sm'
                  : 'bg-cream-100 text-forest-900/70 hover:bg-sage-100'
              }`}
            >
              <Bell className="size-4" />
              Nhắc uống nước & Vươn vai
            </button>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* TAB 1: WORKOUTS & RECOMMENDATIONS */}
        {activeTab === 'workouts' && (
          <div className="space-y-10">
            {/* Smart Personalized Recommendation */}
            <PersonalizedWorkoutBanner
              profile={profile}
              onLogCompleted={handleLogWorkout}
              completedTodayIds={completedTodayIds}
            />

            {/* Video Library with multi-criteria filters */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold text-forest-900">
                    Kho video bài tập ngắn
                  </h2>
                  <p className="text-xs text-forest-900/60">
                    Chọn bài tập phù hợp với thời gian nghỉ ngơi hoặc không gian làm việc của bạn
                  </p>
                </div>
              </div>

              {/* Filters Box */}
              <WorkoutFilters
                filters={filters}
                onChange={setFilters}
                totalCount={workoutVideos.length}
                filteredCount={filteredVideos.length}
              />

              {/* Videos Grid */}
              {filteredVideos.length === 0 ? (
                <div className="rounded-3xl bg-white p-12 text-center shadow-xs ring-1 ring-sage-200">
                  <p className="text-sm font-semibold text-forest-900">
                    Không tìm thấy bài tập nào khớp với bộ lọc hiện tại.
                  </p>
                  <p className="mt-1 text-xs text-forest-900/60">
                    Hãy thử xóa từ khóa tìm kiếm hoặc mở rộng thời lượng/độ khó.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredVideos.map((video) => (
                    <WorkoutVideoCard
                      key={video.id}
                      video={video}
                      onLogCompleted={handleLogWorkout}
                      isRecentlyLogged={completedTodayIds.has(video.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PROGRESS & WEIGHT */}
        {activeTab === 'progress' && (
          <ProgressTracker
            weightLogs={weightLogs}
            workoutLogs={workoutLogs}
            onAddWeight={handleAddWeight}
            onDeleteWeight={handleDeleteWeight}
            onAddCustomWorkout={handleAddCustomWorkout}
          />
        )}

        {/* TAB 3: MEAL DIARY */}
        {activeTab === 'meals' && (
          <MealDiaryTracker meals={mealLogs} onToggleMeal={handleToggleMeal} />
        )}

        {/* TAB 4: REMINDERS */}
        {activeTab === 'reminders' && <ReminderWidget />}
      </main>

      {/* Notifications Drawer Modal */}
      <NotificationModal
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkNotifRead}
        onMarkAllAsRead={handleMarkAllNotifsRead}
      />
    </div>
  )
}
