import { Flame, Info } from 'lucide-react'
import {
  MIN_KCAL_LIMIT,
  calcMacros,
  goalLabels,
  type BodyProfile,
  type NutritionResult,
} from '@/features/nutrition/services/nutritionCalculator'

interface CalorieResultProps {
  profile: BodyProfile
  result: NutritionResult
  adjustedKcal: number
  onAdjust: (kcal: number) => void
}

function MacroBar({
  label,
  grams,
  percent,
  colorClass,
}: {
  label: string
  grams: number
  percent: number
  colorClass: string
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between text-sm">
        <span className="font-semibold text-forest-900">{label}</span>
        <span className="text-forest-900/70">
          {grams}g · {percent}%
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-cream-200">
        <div
          className={`h-full rounded-full ${colorClass}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

const adviceByGoal: Record<BodyProfile['goal'], string> = {
  lose:
    'Mục tiêu giảm cân được tính bằng TDEE trừ 400 kcal. Công cụ giới hạn kết quả từ 1.200 kcal/ngày; mức này không phù hợp cho tất cả mọi người.',
  maintain:
    'Mục tiêu duy trì được ước tính từ TDEE. Bạn có thể phân bổ năng lượng giữa các bữa và theo dõi cân nặng để điều chỉnh phù hợp.',
  gain:
    'Mục tiêu tăng cơ được tính bằng TDEE cộng 250 kcal. Kết quả thực tế còn phụ thuộc chế độ tập luyện và thể trạng.',
}

export default function CalorieResult({
  profile,
  result,
  adjustedKcal,
  onAdjust,
}: CalorieResultProps) {
  const macros = calcMacros(adjustedKcal)
  const goalAdvice = adviceByGoal[profile.goal]

  return (
    <div className="grid gap-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-sage-200 sm:p-8 lg:grid-cols-[300px_1fr] lg:gap-10">
      {/* Big kcal number + adjustment */}
      <div className="flex flex-col items-center gap-4 rounded-3xl bg-forest-700 p-6 text-center text-white lg:items-start lg:text-left">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-accent-500 text-forest-900">
          <Flame className="size-6" aria-hidden />
        </span>
        <div>
          <p className="text-sm text-sage-200">Lượng calo gợi ý / ngày</p>
          <p className="text-5xl font-extrabold tracking-tight">
            {adjustedKcal.toLocaleString('vi-VN')}
            <span className="ml-1 text-xl font-bold text-sage-300">kcal</span>
          </p>
          <p className="mt-1 text-xs text-sage-200">
            Mục tiêu: {goalLabels[profile.goal]} · TDEE{' '}
            {result.tdee.toLocaleString('vi-VN')} kcal
          </p>
        </div>

        <label htmlFor="kcal-slider" className="w-full text-xs font-semibold text-sage-200">
          Điều chỉnh theo nhu cầu của bạn
        </label>
        <input
          id="kcal-slider"
          type="range"
          min={MIN_KCAL_LIMIT}
          max={Math.max(3500, result.targetKcal)}
          step={10}
          value={adjustedKcal}
          onChange={(e) => onAdjust(Number(e.target.value))}
          className="w-full cursor-pointer accent-accent-500"
        />
        <p className="text-[11px] leading-relaxed text-sage-300/80">
          Mục tiêu tính ban đầu: {result.targetKcal.toLocaleString('vi-VN')} kcal/ngày.
          Thanh trượt thay đổi mục tiêu cả ngày, không lưu vào hồ sơ.
        </p>
      </div>

      {/* Macro breakdown + advice */}
      <div className="flex flex-col gap-6">
        <dl className="grid gap-4 rounded-2xl bg-cream-100 p-4 sm:grid-cols-2">
          <div><dt className="font-semibold">BMR — năng lượng lúc nghỉ (ước tính)</dt><dd>{result.bmr.toLocaleString('vi-VN')} kcal/ngày</dd></div>
          <div><dt className="font-semibold">TDEE — tiêu hao cả ngày (ước tính)</dt><dd>{result.tdee.toLocaleString('vi-VN')} kcal/ngày, đã tính mức vận động</dd></div>
        </dl>
        <p className="text-sm text-forest-900/70">Các chất dinh dưỡng bên dưới được tính cho cả ngày, theo gam (g) và phần trăm năng lượng. Tỷ lệ tham khảo: 30% chất đạm, 35% chất bột đường và 35% chất béo; không áp dụng như chế độ ăn điều trị bệnh.</p>
        <div className="flex flex-col gap-4">
          <MacroBar
            label="Protein (chất đạm)"
            grams={macros.proteinGrams}
            percent={macros.proteinPct}
            colorClass="bg-forest-600"
          />
          <MacroBar
            label="Carbohydrate (chất bột đường)"
            grams={macros.carbGrams}
            percent={macros.carbPct}
            colorClass="bg-sage-500"
          />
          <MacroBar
            label="Fat (chất béo)"
            grams={macros.fatGrams}
            percent={macros.fatPct}
            colorClass="bg-accent-500"
          />
        </div>

        <p className="flex items-start gap-2.5 rounded-2xl bg-cream-100 p-4 text-sm leading-relaxed text-forest-900/80">
          <Info className="mt-0.5 size-4 shrink-0 text-forest-500" aria-hidden />
          {goalAdvice}
        </p>
        <p className="text-xs leading-relaxed text-forest-900/70">Ước tính theo <a href="https://pubmed.ncbi.nlm.nih.gov/2305711/" target="_blank" rel="noreferrer" className="underline">Mifflin–St Jeor</a>, kết hợp hệ số vận động và cách điều chỉnh mục tiêu của công cụ. Không thay thế tư vấn chuyên môn; người mang thai, cho con bú hoặc có bệnh lý cần được hướng dẫn riêng.</p>
      </div>
    </div>
  )
}
