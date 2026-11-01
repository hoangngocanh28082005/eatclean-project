import { useState } from 'react'
import type { FormEvent } from 'react'
import { Calculator } from 'lucide-react'
import Button from '@/shared/components/ui/Button'
import { foodTerms, normalizeFood } from '@/features/nutrition/services/mealSuggestions'
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

const lunchOptions = [
  { value: 25, label: '25% · Bữa trưa nhẹ', detail: 'Chọn khi bạn muốn dành nhiều calo hơn cho bữa sáng, bữa tối hoặc bữa phụ.' },
  { value: 30, label: '30% · Chia gần đều ba bữa', detail: 'Chọn khi bạn muốn bữa trưa chiếm gần một phần ba lượng calo cả ngày.' },
  { value: 35, label: '35% · Ưu tiên bữa trưa hơn', detail: 'Chọn khi bạn muốn ăn trưa nhiều hơn một chút và dành ít calo hơn cho các bữa còn lại.' },
  { value: 40, label: '40% · Bữa trưa là bữa chính lớn', detail: 'Chọn khi bạn muốn dành phần lớn hơn cho bữa trưa, giảm phần dành cho các bữa còn lại.' },
]

const favoriteOptions = ['Ức gà', 'Cá hồi', 'Gạo lứt', 'Bơ', 'Trứng', 'Đậu gà', 'Quinoa', 'Yến mạch']

export default function CalorieForm({ onCalculate, initialProfile }: CalorieFormProps) {
  const [gender, setGender] = useState<Gender | ''>(initialProfile?.gender ?? '')
  const [age, setAge] = useState(String(initialProfile?.age ?? ''))
  const [heightCm, setHeightCm] = useState(String(initialProfile?.heightCm ?? ''))
  const [weightKg, setWeightKg] = useState(String(initialProfile?.weightKg ?? ''))
  const [goal, setGoal] = useState<Goal | ''>(initialProfile?.goal ?? '')
  const [activity, setActivity] = useState<ActivityLevel | ''>(initialProfile?.activity ?? '')
  const [diet, setDiet] = useState<NonNullable<BodyProfile['diet']> | ''>(initialProfile?.diet ?? '')
  const [favorites, setFavorites] = useState(initialProfile?.favorites ?? '')
  const [dislikes, setDislikes] = useState(initialProfile?.dislikes ?? '')
  const [allergies, setAllergies] = useState(initialProfile?.allergies ?? '')
  const [lunchPercent, setLunchPercent] = useState<number | ''>(initialProfile?.lunchPercent ?? '')
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!gender || !goal || !activity || !diet || lunchPercent === '' || !age.trim() || !heightCm.trim() || !weightKg.trim()) {
      setError('Vui lòng nhập đầy đủ thông tin và chọn các mục trước khi xem kết quả.')
      return
    }
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
          required
          value={gender}
          onChange={(e) => setGender(e.target.value as Gender)}
          className={inputClasses}
        >
          <option value="" disabled>Chọn giới tính</option>
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
          required
          value={goal}
          onChange={(e) => setGoal(e.target.value as Goal)}
          className={inputClasses}
        >
          <option value="" disabled>Chọn mục tiêu</option>
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
          required
          aria-describedby="activity-help"
          value={activity}
          onChange={(e) => setActivity(e.target.value as ActivityLevel)}
          className={inputClasses}
        >
          <option value="" disabled>Chọn mức độ vận động</option>
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
        <select id="diet" className={inputClasses} value={diet} onChange={e => setDiet(e.target.value as typeof diet)} required>
          <option value="" disabled>Chọn chế độ ăn</option>
          <option value="all">Ăn đa dạng</option>
          <option value="vegetarian">Ăn chay (có trứng/sữa)</option>
          <option value="vegan">Thuần chay</option>
        </select>
      </div>
      <div>
        <label htmlFor="lunch-percent" className={labelClasses}>Tỷ lệ calo dành cho bữa trưa</label>
        <select id="lunch-percent" className={inputClasses} value={lunchPercent} onChange={e => setLunchPercent(e.target.value === '' ? '' : Number(e.target.value))} aria-describedby="lunch-help" required>
          <option value="" disabled>Chọn tỷ lệ calo bữa trưa</option>
          {lunchOptions.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
        </select>
        <div id="lunch-help" className="mt-2 space-y-2 text-xs leading-relaxed text-forest-900/70">
          <p>{lunchOptions.find(option => option.value === lunchPercent)?.detail ?? 'Chọn theo cách bạn muốn chia lượng ăn trong ngày. 30% tương đương gần một phần ba calo cả ngày.'}</p>
          <p>Ví dụ với 2.000 kcal/ngày: 25% = 500, 30% = 600, 35% = 700, 40% = 800 kcal cho bữa trưa. Tỷ lệ chỉ phân bổ calo giữa các bữa, không thay đổi mục tiêu calo cả ngày.</p>
        </div>
      </div>
      <div>
        <label htmlFor="favorites" className={labelClasses}>Nguyên liệu yêu thích</label>
        <input id="favorites" className={inputClasses} maxLength={300} value={favorites} onChange={e => setFavorites(e.target.value)} placeholder="Ví dụ: cá hồi, bơ" aria-describedby="favorites-help" />
        <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Chọn nhanh nguyên liệu trong món mẫu">
          {favoriteOptions.map(ingredient => {
            const selected = foodTerms(favorites).includes(normalizeFood(ingredient))
            return <button key={ingredient} type="button" aria-pressed={selected} onClick={() => {
              const terms = favorites.split(/[,;\n]/).map(term => term.trim()).filter(Boolean)
              const next = selected ? terms.filter(term => normalizeFood(term) !== normalizeFood(ingredient)) : [...terms, ingredient]
              if (next.join(', ').length <= 300) setFavorites(next.join(', '))
            }} className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-700 ${selected ? 'border-forest-700 bg-forest-700 text-white' : 'border-sage-200 bg-white text-forest-900 hover:bg-sage-100'}`}>{ingredient}</button>
          })}
        </div>
        <p id="favorites-help" className="mt-2 text-xs leading-relaxed text-forest-900/70">Chọn nhanh hoặc nhập nguyên liệu, cách nhau bằng dấu phẩy. Món mẫu có nguyên liệu yêu thích được cộng ưu tiên khi xếp hạng gợi ý sau khi áp dụng hồ sơ; đây không phải bộ lọc bắt buộc. Chế độ ăn, nguyên liệu không thích và dị ứng vẫn được xét trước.</p>
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
