import { useRef, useState } from 'react'
import { ArrowRight, Salad, Sparkles } from 'lucide-react'
import Button from '@/shared/components/ui/Button'
import CalorieForm from '@/features/nutrition/components/CalorieForm'
import CalorieResult from '@/features/nutrition/components/CalorieResult'
import WorkoutVideoCard from '@/features/workouts/components/WorkoutVideoCard'
import { meals } from '@/features/catalog/data/meals'
import { suggestMeals } from '@/features/nutrition/services/mealSuggestions'
import { loadProfile, PROFILE_KEY } from '@/features/nutrition/services/profileStorage'
import { workoutVideos, type WorkoutVideo } from '@/features/workouts/data/workouts'
import {
  calcNutrition,
  type BodyProfile,
  type NutritionResult,
} from '@/features/nutrition/services/nutritionCalculator'

const formatPrice = (price: number) => `${price.toLocaleString('vi-VN')}đ`

function recommendVideos(profile: BodyProfile): WorkoutVideo[] {
  const isVerySedentary = profile.activity === 'sedentary'
  const scored = workoutVideos.filter((video) => video.goals.includes(profile.goal))

  // Ít vận động: đẩy các bài low intensity / ngắn lên trước
  const sorted = scored.sort((a, b) => {
    const rank = (v: WorkoutVideo) => {
      if (isVerySedentary) {
        return (v.intensity === 'low' ? 0 : 1) + (v.durationLabel === '5 phút' ? 0 : 1)
      }
      return v.intensity === 'medium' ? 0 : v.intensity === 'high' ? 2 : 1
    }
    return rank(a) - rank(b)
  })

  // Đảm bảo luôn có một bài giãn cơ văn phòng trong gợi ý
  const withStretch = sorted.some((v) => v.id.startsWith('stretch'))
    ? sorted
    : [...sorted, ...workoutVideos.filter((v) => v.id.startsWith('stretch'))]

  return withStretch.slice(0, 3)
}

export default function NutritionPage() {
  const [initialProfile] = useState(loadProfile)
  const [profile, setProfile] = useState<BodyProfile | null>(initialProfile)
  const [result, setResult] = useState<NutritionResult | null>(() => initialProfile ? calcNutrition(initialProfile) : null)
  const [adjustedKcal, setAdjustedKcal] = useState(() => initialProfile ? calcNutrition(initialProfile).targetKcal : 2000)
  const [remember, setRemember] = useState(Boolean(initialProfile))
  const [storageMessage, setStorageMessage] = useState(initialProfile ? 'Đã khôi phục hồ sơ lưu trên trình duyệt này.' : '')
  const resultRef = useRef<HTMLDivElement>(null)

  const handleCalculate = (bodyProfile: BodyProfile) => {
    const calculated = calcNutrition(bodyProfile)
    setProfile(bodyProfile)
    setResult(calculated)
    setAdjustedKcal(calculated.targetKcal)
    if (remember) {
      try {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(bodyProfile))
        setStorageMessage('Đã cập nhật và lưu hồ sơ trên trình duyệt này.')
      } catch { setStorageMessage('Đã tính kết quả nhưng không lưu được hồ sơ. Trình duyệt có thể đang chặn lưu trữ.') }
    } else setStorageMessage('Đã cập nhật hồ sơ cho phiên hiện tại; chưa lưu trên thiết bị.')
    // Cuộn mượt tới bảng kết quả sau khi tính
    requestAnimationFrame(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const mealResult = profile && result ? suggestMeals(meals, profile, adjustedKcal) : null
  const suggestedMeals = mealResult?.suggestions ?? []
  const recommendedVideos =
    profile && result ? recommendVideos(profile) : []

  return (
    <>
      {/* Header */}
      <section className="bg-forest-700 text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-forest-600 px-4 py-1.5 text-xs font-semibold text-sage-200">
            <Sparkles className="size-3.5 text-accent-400" aria-hidden />
            Hồ sơ dinh dưỡng cá nhân · tính toán trên thiết bị
          </span>
          <h1 className="max-w-2xl text-3xl leading-tight font-extrabold sm:text-4xl lg:text-5xl">
            Mỗi cơ thể, một chế độ dinh dưỡng riêng
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-sage-200">
            Nhập thông tin cơ thể để nhận gợi ý calo hằng ngày, gợi ý bữa trưa
            OffiMeal và những bài tập theo mục tiêu của bạn.
          </p>
        </div>
      </section>

      {/* Form */}
      <section aria-labelledby="nutrition-form-title" className="bg-cream-100">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 id="nutrition-form-title" className="sr-only">
            Nhập thông tin cơ thể
          </h2>
          <div className="mb-5 rounded-2xl bg-white p-4 text-sm text-forest-900">
            <label className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" checked={remember} onChange={e => {
                const checked = e.target.checked
                setRemember(checked)
                try {
                  if (!checked) localStorage.removeItem(PROFILE_KEY)
                  else if (profile) localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
                  setStorageMessage(checked ? (profile ? 'Đã lưu hồ sơ đang áp dụng.' : 'Hồ sơ sẽ được lưu khi bạn tính gợi ý.') : 'Đã tắt lưu và xóa bản lưu trên trình duyệt.')
                } catch { setStorageMessage('Không thể truy cập bộ nhớ trình duyệt. Vui lòng thử lại.') }
              }} />
              Lưu hồ sơ trên trình duyệt này để sử dụng lần sau (không đồng bộ tài khoản). Tránh bật trên máy dùng chung.
            </label>
            <p role="status" className="mt-2">{storageMessage}</p>
            <button type="button" className="mt-3 font-semibold underline" onClick={() => {
              try {
                localStorage.removeItem(PROFILE_KEY)
                setRemember(false)
                setStorageMessage('Đã xóa hồ sơ lưu trên thiết bị. Kết quả hiện tại chỉ còn trong phiên này.')
              } catch { setStorageMessage('Không thể xóa bản lưu. Hãy kiểm tra quyền lưu trữ của trình duyệt.') }
            }}>Xóa hồ sơ đã lưu</button>
          </div>
          <CalorieForm onCalculate={handleCalculate} initialProfile={initialProfile} />
        </div>
      </section>

      {/* Result + suggestions */}
      {profile && result && (
        <>
          <section
            aria-labelledby="nutrition-result-title"
            className="bg-cream-100 pb-16"
          >
            <div
              ref={resultRef}
              className="mx-auto max-w-5xl scroll-mt-24 px-4 sm:px-6 lg:px-8"
            >
              <h2
                id="nutrition-result-title"
                className="mb-6 text-2xl font-extrabold text-forest-900 sm:text-3xl"
              >
                Kết quả ước tính của bạn
              </h2>
              <CalorieResult
                profile={profile}
                result={result}
                adjustedKcal={adjustedKcal}
                onAdjust={setAdjustedKcal}
              />
            </div>
          </section>

          {/* Meal suggestions */}
          <section aria-labelledby="meal-suggestion-title" className="bg-white">
            <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2
                    id="meal-suggestion-title"
                    className="text-2xl font-extrabold text-forest-900 sm:text-3xl"
                  >
                    Ngân sách bữa trưa: {mealResult?.budget.toLocaleString('vi-VN')} kcal
                  </h2>
                  <p className="mt-2 max-w-xl text-base text-forest-900/70">
                    Bằng {profile.lunchPercent ?? 35}% mục tiêu {adjustedKcal.toLocaleString('vi-VN')} kcal cả ngày.
                    Ưu tiên món có năng lượng gần mức bữa trưa, phù hợp mục tiêu và sở thích của bạn.
                    Khẩu phần ước tính 0,75–1,25 suất, không phải tùy chọn đặt hàng đã xác nhận. Giá bên dưới là giá một suất chuẩn.
                  </p>
                </div>
                <Button to="/thuc-don" variant="outline" className="shrink-0">
                  Xem thực đơn
                  <ArrowRight className="size-4" aria-hidden />
                </Button>
              </div>

              {!suggestedMeals.length && <p role="status" className="rounded-2xl bg-cream-100 p-5 text-forest-900">{profile.allergies?.trim() ? 'Chưa có món với dữ liệu nguyên liệu và dị ứng đã xác minh để gợi ý. Hãy liên hệ bếp để xác nhận thành phần và nguy cơ nhiễm chéo.' : 'Chưa có món đáp ứng đồng thời ngân sách và lựa chọn ăn uống. Bạn có thể cập nhật hồ sơ hoặc tỷ lệ bữa trưa; hệ thống không tự bỏ bộ lọc.'}</p>}
              <ul className="grid gap-4 sm:grid-cols-3">
                {suggestedMeals.map(({ meal, portion, kcal, protein, preferred, goalMatch }) => (
                  <li
                    key={meal.id}
                    className="flex items-center gap-4 rounded-2xl bg-cream-100 p-4"
                  >
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-forest-700 text-white">
                      <Salad className="size-5" aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-forest-900">
                        {meal.name}
                      </p>
                      <p className="text-xs text-forest-900/60">
                        {portion.toLocaleString('vi-VN')} suất · {kcal} kcal · {protein} g đạm
                      </p>
                      <p className="mt-1 text-xs text-forest-900/60">Giá suất chuẩn: {formatPrice(meal.price)}</p>
                      <p className="mt-2 text-xs text-forest-700">{preferred ? 'Có nguyên liệu yêu thích. ' : ''}{goalMatch ? 'Phù hợp mục tiêu đã chọn. ' : ''}Trong ngân sách bữa trưa.</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Workout recommendations */}
          <section aria-labelledby="workout-rec-title" className="bg-cream-100">
            <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
              <div className="mb-8">
                <h2
                  id="workout-rec-title"
                  className="text-2xl font-extrabold text-forest-900 sm:text-3xl"
                >
                  Bài tập gợi ý theo mục tiêu
                </h2>
                <p className="mt-2 max-w-xl text-base text-forest-900/70">
                  Các video được gợi ý theo mục tiêu{' '}
                  <strong className="font-semibold text-forest-700">
                    {profile.goal === 'lose'
                      ? 'giảm cân'
                      : profile.goal === 'gain'
                        ? 'tăng cơ'
                        : 'duy trì cân nặng'}
                  </strong>{' '}
                  — bấm vào từng video để xem hướng dẫn ngay.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {recommendedVideos.map((video) => (
                  <WorkoutVideoCard key={video.id} video={video} />
                ))}
              </div>

              <div className="mt-10 text-center">
                <Button to="/bai-tap" variant="outline">
                  Khám phá thêm bài tập
                  <ArrowRight className="size-4" aria-hidden />
                </Button>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  )
}
