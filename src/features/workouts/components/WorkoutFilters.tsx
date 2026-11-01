import { Search, RotateCcw } from 'lucide-react'
import type { Goal } from '@/features/nutrition/models/nutrition'
import type { WorkoutCategory, WorkoutDifficulty } from '../models/Workout'
import { categoryLabels, difficultyLabels } from '../data/workouts'

export interface FilterState {
  searchQuery: string
  durationFilter: 'all' | 'under10' | '10to15' | 'over15'
  difficultyFilter: 'all' | WorkoutDifficulty
  categoryFilter: 'all' | WorkoutCategory
  goalFilter: 'all' | Goal
}

interface WorkoutFiltersProps {
  filters: FilterState
  onChange: (updated: FilterState) => void
  totalCount: number
  filteredCount: number
}

const durationOptions: { id: FilterState['durationFilter']; label: string }[] = [
  { id: 'all', label: 'Tất cả thời lượng' },
  { id: 'under10', label: 'Dưới 10 phút' },
  { id: '10to15', label: '10 - 15 phút' },
  { id: 'over15', label: 'Trên 15 phút' },
]

const goalOptions: { id: FilterState['goalFilter']; label: string }[] = [
  { id: 'all', label: 'Mọi mục tiêu' },
  { id: 'lose', label: 'Giảm cân' },
  { id: 'maintain', label: 'Duy trì vóc dáng' },
  { id: 'gain', label: 'Tăng cơ săn chắc' },
]

export default function WorkoutFilters({
  filters,
  onChange,
  totalCount,
  filteredCount,
}: WorkoutFiltersProps) {
  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.durationFilter !== 'all' ||
    filters.difficultyFilter !== 'all' ||
    filters.categoryFilter !== 'all' ||
    filters.goalFilter !== 'all'

  const handleReset = () => {
    onChange({
      searchQuery: '',
      durationFilter: 'all',
      difficultyFilter: 'all',
      categoryFilter: 'all',
      goalFilter: 'all',
    })
  }

  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-sage-200/80 sm:p-6">
      {/* Search Bar & Stats */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-forest-700/50" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onChange({ ...filters, searchQuery: e.target.value })}
            placeholder="Tìm theo tên bài tập, nhóm cơ (cổ vai gáy, bụng, cardio...)"
            className="w-full rounded-2xl bg-cream-100/70 py-2.5 pr-4 pl-10 text-sm text-forest-900 placeholder:text-forest-900/40 focus:bg-white focus:ring-2 focus:ring-forest-600 focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-between gap-3 text-xs text-forest-900/70 sm:justify-end">
          <span>
            Hiển thị <strong>{filteredCount}</strong> / {totalCount} bài tập
          </span>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 rounded-full bg-sage-100 px-3 py-1 font-semibold text-forest-700 transition-colors hover:bg-sage-200"
            >
              <RotateCcw className="size-3" />
              Đặt lại bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Filter Row 1: Categories */}
      <div className="mt-4 border-t border-sage-100 pt-4">
        <label className="mb-2 block text-xs font-bold tracking-wider text-forest-700 uppercase">
          Dạng bài tập
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onChange({ ...filters, categoryFilter: 'all' })}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
              filters.categoryFilter === 'all'
                ? 'bg-forest-800 text-white shadow-sm'
                : 'bg-cream-100 text-forest-900/80 hover:bg-sage-100'
            }`}
          >
            Tất cả dạng bài
          </button>
          {(Object.keys(categoryLabels) as WorkoutCategory[]).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => onChange({ ...filters, categoryFilter: cat })}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                filters.categoryFilter === cat
                  ? 'bg-forest-800 text-white shadow-sm'
                  : 'bg-cream-100 text-forest-900/80 hover:bg-sage-100'
              }`}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Row 2: Duration, Difficulty & Goal */}
      <div className="mt-4 grid grid-cols-1 gap-4 border-t border-sage-100 pt-4 sm:grid-cols-3">
        {/* Duration */}
        <div>
          <label className="mb-1.5 block text-xs font-bold text-forest-700">Thời lượng</label>
          <select
            value={filters.durationFilter}
            onChange={(e) =>
              onChange({
                ...filters,
                durationFilter: e.target.value as FilterState['durationFilter'],
              })
            }
            className="w-full rounded-xl border border-sage-200 bg-white px-3 py-2 text-xs font-medium text-forest-900 focus:border-forest-600 focus:outline-none"
          >
            {durationOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty */}
        <div>
          <label className="mb-1.5 block text-xs font-bold text-forest-700">Độ khó / Trình độ</label>
          <select
            value={filters.difficultyFilter}
            onChange={(e) =>
              onChange({
                ...filters,
                difficultyFilter: e.target.value as FilterState['difficultyFilter'],
              })
            }
            className="w-full rounded-xl border border-sage-200 bg-white px-3 py-2 text-xs font-medium text-forest-900 focus:border-forest-600 focus:outline-none"
          >
            <option value="all">Mọi trình độ</option>
            {(Object.keys(difficultyLabels) as WorkoutDifficulty[]).map((diff) => (
              <option key={diff} value={diff}>
                {difficultyLabels[diff]}
              </option>
            ))}
          </select>
        </div>

        {/* Goal */}
        <div>
          <label className="mb-1.5 block text-xs font-bold text-forest-700">Mục tiêu thể chất</label>
          <select
            value={filters.goalFilter}
            onChange={(e) =>
              onChange({
                ...filters,
                goalFilter: e.target.value as FilterState['goalFilter'],
              })
            }
            className="w-full rounded-xl border border-sage-200 bg-white px-3 py-2 text-xs font-medium text-forest-900 focus:border-forest-600 focus:outline-none"
          >
            {goalOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
