import { useState } from 'react'
import {
  TrendingDown,
  TrendingUp,
  Scale,
  Calendar,
  Flame,
  CheckCircle,
  Plus,
  Trash2,
  Clock,
  Sparkles,
} from 'lucide-react'
import type { WeightLog, WorkoutLog } from '../models/Workout'

interface ProgressTrackerProps {
  weightLogs: WeightLog[]
  workoutLogs: WorkoutLog[]
  onAddWeight: (weightKg: number, date?: string, note?: string) => void
  onDeleteWeight: (id: string) => void
  onAddCustomWorkout: (title: string, durationMinutes: number, calories?: number, note?: string) => void
}

export default function ProgressTracker({
  weightLogs,
  workoutLogs,
  onAddWeight,
  onDeleteWeight,
  onAddCustomWorkout,
}: ProgressTrackerProps) {
  // Input states
  const [newWeight, setNewWeight] = useState('')
  const [weightDate, setWeightDate] = useState(() => new Date().toISOString().split('T')[0])
  const [weightNote, setWeightNote] = useState('')
  const [isAddingWeight, setIsAddingWeight] = useState(false)

  // Custom workout input states
  const [isAddingWorkout, setIsAddingWorkout] = useState(false)
  const [customTitle, setCustomTitle] = useState('')
  const [customDuration, setCustomDuration] = useState('15')
  const [customCalories, setCustomCalories] = useState('80')
  const [customNote, setCustomNote] = useState('')

  // Weight statistics calculation
  const sortedWeights = [...weightLogs].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )
  const firstWeight = sortedWeights.length > 0 ? sortedWeights[0].weightKg : 0
  const currentWeight = sortedWeights.length > 0 ? sortedWeights[sortedWeights.length - 1].weightKg : 0
  const weightDiff = (currentWeight - firstWeight).toFixed(1)
  const isWeightReduced = Number(weightDiff) < 0

  // Workout statistics calculation
  const totalWorkoutMinutes = workoutLogs.reduce((acc, log) => acc + log.durationMinutes, 0)
  const totalCaloriesBurned = workoutLogs.reduce((acc, log) => acc + (log.caloriesBurned || 0), 0)

  const handleWeightSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const val = parseFloat(newWeight)
    if (!val || val <= 30 || val >= 250) return
    onAddWeight(val, weightDate, weightNote)
    setNewWeight('')
    setWeightNote('')
    setIsAddingWeight(false)
  }

  const handleWorkoutSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customTitle.trim()) return
    onAddCustomWorkout(
      customTitle.trim(),
      parseInt(customDuration, 10) || 15,
      parseInt(customCalories, 10) || 50,
      customNote.trim()
    )
    setCustomTitle('')
    setCustomNote('')
    setIsAddingWorkout(false)
  }

  // Generate SVG Line Chart coordinates
  const renderWeightChart = () => {
    if (sortedWeights.length < 2) {
      return (
        <div className="flex h-44 items-center justify-center rounded-2xl bg-cream-100/50 text-xs text-forest-900/60">
          Cần ít nhất 2 lần ghi nhận cân nặng để hiển thị biểu đồ tiến độ.
        </div>
      )
    }

    const minW = Math.min(...sortedWeights.map((w) => w.weightKg)) - 1
    const maxW = Math.max(...sortedWeights.map((w) => w.weightKg)) + 1
    const rangeW = maxW - minW || 1

    const width = 500
    const height = 140
    const padding = 25

    const points = sortedWeights.map((w, idx) => {
      const x = padding + (idx / (sortedWeights.length - 1)) * (width - padding * 2)
      const y = height - padding - ((w.weightKg - minW) / rangeW) * (height - padding * 2)
      return { x, y, ...w }
    })

    const pathData = points.reduce((acc, p, idx) => {
      return `${acc} ${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
    }, '')

    return (
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[340px] overflow-visible">
          {/* Subtle Gridlines */}
          <line
            x1={padding}
            y1={padding}
            x2={width - padding}
            y2={padding}
            stroke="#d9e7d4"
            strokeDasharray="4 4"
          />
          <line
            x1={padding}
            y1={height / 2}
            x2={width - padding}
            y2={height / 2}
            stroke="#d9e7d4"
            strokeDasharray="4 4"
          />
          <line
            x1={padding}
            y1={height - padding}
            x2={width - padding}
            y2={height - padding}
            stroke="#d9e7d4"
          />

          {/* Area fill */}
          <path
            d={`${pathData} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`}
            fill="url(#weightGradient)"
            opacity="0.25"
          />

          <defs>
            <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2f604a" />
              <stop offset="100%" stopColor="#e9f1e6" />
            </linearGradient>
          </defs>

          {/* Line */}
          <path d={pathData} fill="none" stroke="#244d3a" strokeWidth="3" strokeLinecap="round" />

          {/* Points & Labels */}
          {points.map((p) => (
            <g key={p.id}>
              <circle
                cx={p.x}
                cy={p.y}
                r="4.5"
                className="fill-white stroke-forest-800"
                strokeWidth="2.5"
              />
              <text
                x={p.x}
                y={p.y - 8}
                textAnchor="middle"
                className="fill-forest-900 text-[10px] font-bold"
              >
                {p.weightKg}kg
              </text>
              <text
                x={p.x}
                y={height - 8}
                textAnchor="middle"
                className="fill-forest-900/50 text-[9px]"
              >
                {p.date.slice(5)}
              </text>
            </g>
          ))}
        </svg>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Current Weight & Difference */}
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-sage-200">
          <div className="flex items-center justify-between text-forest-700">
            <span className="text-xs font-bold tracking-wider uppercase">Cân nặng hiện tại</span>
            <Scale className="size-5 text-forest-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-forest-900">{currentWeight}</span>
            <span className="text-sm font-semibold text-forest-900/60">kg</span>
            {sortedWeights.length > 1 && (
              <span
                className={`ml-auto inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-bold ${
                  isWeightReduced ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                }`}
              >
                {isWeightReduced ? (
                  <TrendingDown className="size-3.5" />
                ) : (
                  <TrendingUp className="size-3.5" />
                )}
                {weightDiff} kg
              </span>
            )}
          </div>
          <p className="mt-2 text-xs text-forest-900/60">
            {sortedWeights.length > 1
              ? `So với ngày đầu tiên (${firstWeight} kg)`
              : 'Hãy ghi nhận thêm để theo dõi biến đổi'}
          </p>
        </div>

        {/* Workouts completed */}
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-sage-200">
          <div className="flex items-center justify-between text-forest-700">
            <span className="text-xs font-bold tracking-wider uppercase">Số buổi đã tập</span>
            <CheckCircle className="size-5 text-forest-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-forest-900">{workoutLogs.length}</span>
            <span className="text-sm font-semibold text-forest-900/60">buổi</span>
          </div>
          <p className="mt-2 text-xs text-forest-900/60">
            Tổng thời gian vận động: <strong>{totalWorkoutMinutes} phút</strong>
          </p>
        </div>

        {/* Burned calories */}
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-sage-200">
          <div className="flex items-center justify-between text-forest-700">
            <span className="text-xs font-bold tracking-wider uppercase">Năng lượng tiêu hao</span>
            <Flame className="size-5 text-accent-500 fill-accent-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-forest-900">
              ~{totalCaloriesBurned}
            </span>
            <span className="text-sm font-semibold text-forest-900/60">kcal</span>
          </div>
          <p className="mt-2 text-xs text-forest-900/60">
            Ước tính từ các bài tập & buổi giãn cơ đã hoàn tất
          </p>
        </div>
      </div>

      {/* Weight Chart Section */}
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-sage-200">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-bold text-forest-900">Biểu đồ tiến độ cân nặng</h3>
            <p className="text-xs text-forest-900/60">
              Cập nhật cân nặng đều đặn để thấy rõ chuyển biến cơ thể theo tuần/tháng
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddingWeight(!isAddingWeight)}
            className="inline-flex items-center gap-1.5 self-start rounded-full bg-forest-800 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-forest-700"
          >
            <Plus className="size-3.5" />
            {isAddingWeight ? 'Đóng form' : 'Ghi cân nặng hôm nay'}
          </button>
        </div>

        {/* Add weight form */}
        {isAddingWeight && (
          <form
            onSubmit={handleWeightSubmit}
            className="mt-4 rounded-2xl bg-cream-100/70 p-4 ring-1 ring-sage-200"
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-bold text-forest-700">Cân nặng (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  min="30"
                  max="200"
                  required
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  placeholder="Ví dụ: 62.5"
                  className="w-full rounded-xl border border-sage-200 bg-white px-3 py-2 text-xs font-bold text-forest-900 focus:outline-none focus:ring-1 focus:ring-forest-600"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-forest-700">Ngày ghi</label>
                <input
                  type="date"
                  value={weightDate}
                  onChange={(e) => setWeightDate(e.target.value)}
                  className="w-full rounded-xl border border-sage-200 bg-white px-3 py-2 text-xs font-medium text-forest-900 focus:outline-none focus:ring-1 focus:ring-forest-600"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-forest-700">Ghi chú (tùy chọn)</label>
                <input
                  type="text"
                  value={weightNote}
                  onChange={(e) => setWeightNote(e.target.value)}
                  placeholder="VD: Cân sáng sớm lúc bụng đói"
                  className="w-full rounded-xl border border-sage-200 bg-white px-3 py-2 text-xs font-medium text-forest-900 focus:outline-none focus:ring-1 focus:ring-forest-600"
                />
              </div>
            </div>

            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingWeight(false)}
                className="rounded-xl px-3 py-1.5 text-xs font-medium text-forest-900/60 hover:text-forest-900"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="rounded-xl bg-forest-800 px-4 py-1.5 text-xs font-bold text-white hover:bg-forest-700"
              >
                Lưu chỉ số
              </button>
            </div>
          </form>
        )}

        {/* Chart View */}
        <div className="mt-6">{renderWeightChart()}</div>

        {/* History table */}
        <div className="mt-6 border-t border-sage-100 pt-4">
          <h4 className="text-xs font-bold tracking-wider text-forest-700 uppercase">
            Lịch sử các lần cân
          </h4>
          <div className="mt-3 max-h-48 overflow-y-auto divide-y divide-sage-100 text-xs">
            {sortedWeights
              .slice()
              .reverse()
              .map((w) => (
                <div key={w.id} className="flex items-center justify-between py-2.5">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-forest-900">{w.weightKg} kg</span>
                    <span className="text-forest-900/50">{w.date}</span>
                    {w.note && <span className="italic text-forest-900/70">— {w.note}</span>}
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeleteWeight(w.id)}
                    className="p-1 text-forest-900/40 hover:text-red-500"
                    title="Xóa bản ghi này"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Workout Logs List & Custom Workout Add */}
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-sage-200">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-bold text-forest-900">Nhật ký luyện tập & Vận động</h3>
            <p className="text-xs text-forest-900/60">
              Ghi nhận các bài tập bạn đã hoàn tất trên website hoặc tự tập ngoài
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddingWorkout(!isAddingWorkout)}
            className="inline-flex items-center gap-1.5 self-start rounded-full bg-cream-200 px-4 py-2 text-xs font-bold text-forest-900 transition-colors hover:bg-sage-200"
          >
            <Plus className="size-3.5" />
            {isAddingWorkout ? 'Đóng form' : 'Ghi hoạt động khác'}
          </button>
        </div>

        {/* Custom workout form */}
        {isAddingWorkout && (
          <form
            onSubmit={handleWorkoutSubmit}
            className="mt-4 rounded-2xl bg-cream-100/70 p-4 ring-1 ring-sage-200"
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-bold text-forest-700">Tên hoạt động</label>
                <input
                  type="text"
                  required
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="VD: Đi bộ nhanh 2km quanh hồ, Yoga..."
                  className="w-full rounded-xl border border-sage-200 bg-white px-3 py-2 text-xs font-medium text-forest-900 focus:outline-none focus:ring-1 focus:ring-forest-600"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-forest-700">Thời lượng (phút)</label>
                <input
                  type="number"
                  min="1"
                  max="180"
                  required
                  value={customDuration}
                  onChange={(e) => setCustomDuration(e.target.value)}
                  className="w-full rounded-xl border border-sage-200 bg-white px-3 py-2 text-xs font-medium text-forest-900 focus:outline-none focus:ring-1 focus:ring-forest-600"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-forest-700">Calo ước tính</label>
                <input
                  type="number"
                  min="0"
                  value={customCalories}
                  onChange={(e) => setCustomCalories(e.target.value)}
                  className="w-full rounded-xl border border-sage-200 bg-white px-3 py-2 text-xs font-medium text-forest-900 focus:outline-none focus:ring-1 focus:ring-forest-600"
                />
              </div>
            </div>

            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingWorkout(false)}
                className="rounded-xl px-3 py-1.5 text-xs font-medium text-forest-900/60 hover:text-forest-900"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="rounded-xl bg-forest-800 px-4 py-1.5 text-xs font-bold text-white hover:bg-forest-700"
              >
                Ghi nhận
              </button>
            </div>
          </form>
        )}

        {/* Workout history list */}
        <div className="mt-6 divide-y divide-sage-100">
          {workoutLogs.length === 0 ? (
            <p className="py-6 text-center text-xs text-forest-900/50">
              Chưa có buổi tập nào được ghi nhận. Hãy bấm “Đánh dấu đã hoàn thành” trên các video bài tập phía trên!
            </p>
          ) : (
            workoutLogs.map((log) => {
              const dateObj = new Date(log.completedAt)
              const timeStr = `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}`
              const dateStr = dateObj.toLocaleDateString('vi-VN', {
                weekday: 'short',
                day: '2-digit',
                month: '2-digit',
              })

              return (
                <div key={log.id} className="flex items-center justify-between py-3.5">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-sage-100 p-2 text-forest-700">
                      <Sparkles className="size-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-forest-900">{log.workoutTitle}</h4>
                      <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs text-forest-900/60">
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          {dateStr} ({timeStr})
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-semibold text-forest-700">
                          <Clock className="size-3" />
                          {log.durationMinutes} phút
                        </span>
                        {log.caloriesBurned ? (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-amber-700">
                              <Flame className="size-3 fill-amber-500 text-amber-500" />
                              {log.caloriesBurned} kcal
                            </span>
                          </>
                        ) : null}
                      </div>
                      {log.note && (
                        <p className="mt-1 text-xs italic text-forest-900/70">{log.note}</p>
                      )}
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    <CheckCircle className="size-3.5" />
                    Hoàn thành
                  </span>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
