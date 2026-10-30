import { useState } from 'react'
import type { FormEvent } from 'react'
import { Calculator } from 'lucide-react'
import Button from '@/shared/components/ui/Button'
import {
  activityLabels,
  goalLabels,
  isBodyProfile,
  type ActivityLevel,
  type BodyProfile,
  type Gender,
  type Goal,
} from '@/features/nutrition/services/nutritionCalculator'

interface CalorieFormProps {
  onCalculate: (profile: BodyProfile) => void
  initialProfile?: BodyProfile | null
}

const labelClasses = 'mb-1.5 block text-sm font-semibold text-forest-900'
const inputClasses =
  'w-full rounded-xl border border-sage-200 bg-white px-4 py-2.5 text-sm text-forest-900 outline-none transition-colors focus:border-forest-500'

export default function CalorieForm({ onCalculate, initialProfile }: CalorieFormProps) {
  const [gender, setGender] = useState<Gender>(initialProfile?.gender ?? 'female')
  const [age, setAge] = useState(String(initialProfile?.age ?? 28))
  const [heightCm, setHeightCm] = useState(String(initialProfile?.heightCm ?? 165))
  const [weightKg, setWeightKg] = useState(String(initialProfile?.weightKg ?? 58))
  const [goal, setGoal] = useState<Goal>(initialProfile?.goal ?? 'maintain')
  const [activity, setActivity] = useState<ActivityLevel>(initialProfile?.activity ?? 'sedentary')
  const [diet, setDiet] = useState<NonNullable<BodyProfile['diet']>>(initialProfile?.diet ?? 'all')
  const [favorites, setFavorites] = useState(initialProfile?.favorites ?? '')
  const [dislikes, setDislikes] = useState(initialProfile?.dislikes ?? '')
  const [allergies, setAllergies] = useState(initialProfile?.allergies ?? '')
  const [lunchPercent, setLunchPercent] = useState(initialProfile?.lunchPercent ?? 35)
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const ageNum = Number(age)
    const heightNum = Number(heightCm)
    const weightNum = Number(weightKg)

    const nextProfile: BodyProfile = {
      gender,
      age: ageNum,
      heightCm: heightNum,
      weightKg: weightNum,
      goal,
      activity,
      diet, favorites: favorites.trim(), dislikes: dislikes.trim(), allergies: allergies.trim(), lunchPercent,
    }
    if (!isBodyProfile(nextProfile)) {
      setError('Vui lòng kiểm tra tuổi (18–90), chiều cao (120–220 cm) và cân nặng (30–200 kg).')
      return
    }
    setError('')
    onCalculate(nextProfile)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-5 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-sage-200 sm:grid-cols-2 sm:p-8"
    >
      <div>
        <label htmlFor="gender" className={labelClasses}>
          Giới tính dùng trong công thức
        </label>
        <select
          id="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value as Gender)}
          className={inputClasses}
        >
          <option value="female">Nữ</option>
          <option value="male">Nam</option>
        </select>
      </div>

      <div>
        <label htmlFor="age" className={labelClasses}>
          Tuổi
        </label>
        <input
          id="age"
          type="number"
          min={18}
          max={90}
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className={inputClasses}
          required
        />
      </div>

      <div>
        <label htmlFor="height" className={labelClasses}>
          Chiều cao (cm)
        </label>
        <input
          id="height"
          type="number"
          step="0.1"
          min={120}
          max={220}
          value={heightCm}
          onChange={(e) => setHeightCm(e.target.value)}
          className={inputClasses}
          required
        />
      </div>

      <div>
        <label htmlFor="weight" className={labelClasses}>
          Cân nặng (kg)
        </label>
        <input
          id="weight"
          type="number"
          step="0.1"
          min={30}
          max={200}
          value={weightKg}
          onChange={(e) => setWeightKg(e.target.value)}
          className={inputClasses}
          required
        />
      </div>

      <div>
        <label htmlFor="goal" className={labelClasses}>
          Mục tiêu
        </label>
        <select
          id="goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value as Goal)}
          className={inputClasses}
        >
          {(Object.keys(goalLabels) as Goal[]).map((key) => (
            <option key={key} value={key}>
              {goalLabels[key]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="activity" className={labelClasses}>
          Mức độ vận động
        </label>
        <select
          id="activity"
          aria-describedby="activity-help"
          value={activity}
          onChange={(e) => setActivity(e.target.value as ActivityLevel)}
          className={inputClasses}
        >
          {(Object.keys(activityLabels) as ActivityLevel[]).map((key) => (
            <option key={key} value={key}>
              {activityLabels[key]}
            </option>
          ))}
        </select>
        <p id="activity-help" className="mt-2 text-xs leading-relaxed text-forest-900/70">Chọn mức gần với thói quen sinh hoạt và tập luyện thường ngày của bạn.</p>
      </div>

      <div>
        <label htmlFor="diet" className={labelClasses}>Chế độ ăn ưu tiên</label>
        <select id="diet" className={inputClasses} value={diet} onChange={e => setDiet(e.target.value as typeof diet)}>
          <option value="all">Ăn đa dạng</option>
          <option value="vegetarian">Ăn chay (có trứng/sữa)</option>
          <option value="vegan">Thuần chay</option>
        </select>
      </div>
      <div>
        <label htmlFor="lunch-percent" className={labelClasses}>Tỷ lệ calo dành cho bữa trưa</label>
        <select id="lunch-percent" className={inputClasses} value={lunchPercent} onChange={e => setLunchPercent(Number(e.target.value))}>
          {[25, 30, 35, 40].map(value => <option key={value} value={value}>{value}% calo cả ngày</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="favorites" className={labelClasses}>Nguyên liệu yêu thích</label>
        <input id="favorites" className={inputClasses} maxLength={300} value={favorites} onChange={e => setFavorites(e.target.value)} placeholder="Ví dụ: cá hồi, bơ" />
      </div>
      <div>
        <label htmlFor="dislikes" className={labelClasses}>Nguyên liệu không thích</label>
        <input id="dislikes" className={inputClasses} maxLength={300} value={dislikes} onChange={e => setDislikes(e.target.value)} placeholder="Ví dụ: trứng, mè" />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="allergies" className={labelClasses}>Dị ứng thực phẩm</label>
        <input id="allergies" className={inputClasses} maxLength={300} value={allergies} onChange={e => setAllergies(e.target.value)} placeholder="Ví dụ: đậu phộng, sữa. Để trống nếu không có." aria-describedby="food-help" />
        <p id="food-help" className="mt-2 text-sm text-forest-900/70">Tách nguyên liệu bằng dấu phẩy. Danh mục hiện là dữ liệu mẫu, chưa xác minh đầy đủ nguyên liệu và nguy cơ nhiễm chéo. Khi khai báo dị ứng, chỉ món có dữ liệu đã xác minh mới được gợi ý.</p>
      </div>
      <div className="sm:col-span-2">
        <p className="mb-4 text-sm text-forest-900/70">Công cụ ước tính cho người trưởng thành. Hồ sơ đang sửa chỉ được áp dụng sau khi bấm nút bên dưới.</p>
        {error && <p role="alert" className="mb-3 text-sm text-red-700">{error}</p>}
        <Button type="submit" size="lg" className="w-full sm:w-auto">
          <Calculator className="size-4" aria-hidden />
          Áp dụng hồ sơ và xem kết quả
        </Button>
      </div>
    </form>
  )
}
