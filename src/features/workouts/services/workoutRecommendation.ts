import type { BodyProfile, Goal, ActivityLevel } from '../../nutrition/models/nutrition.ts'
import { workoutVideos, type WorkoutVideo } from '../data/workouts.ts'

export interface RecommendationResult {
  recommendedVideos: WorkoutVideo[]
  officeStretch: WorkoutVideo | null
  reason: string
  dailyRoutineTip: string
}

export function getWorkoutRecommendations(
  profile: BodyProfile | null,
  overrideGoal?: Goal,
  overrideActivity?: ActivityLevel
): RecommendationResult {
  const goal: Goal = overrideGoal || profile?.goal || 'lose'
  const activity: ActivityLevel = overrideActivity || profile?.activity || 'sedentary'

  // 1. Pick suitable office stretch
  const officeStretch =
    workoutVideos.find((v) => v.category === 'stretch' || v.category === 'yoga') || null

  // 2. Filter & rank workouts based on goal and activity level
  const matches = workoutVideos.filter((v) => {
    const matchesGoal = v.goals.includes(goal)
    const matchesActivity = !v.recommendedFor || v.recommendedFor.includes(activity)
    return matchesGoal && matchesActivity
  })

  // Prioritize matching, fallback to all videos if too narrow
  const finalPool = matches.length >= 2 ? matches : workoutVideos.filter((v) => v.goals.includes(goal))
  const recommendedVideos = finalPool.slice(0, 4)

  // 3. Formulate explanation based on profile parameters
  let reason = ''
  let dailyRoutineTip = ''

  if (activity === 'sedentary') {
    if (goal === 'lose') {
      reason =
        'Vì bạn làm việc ngồi một chỗ nhiều và đang muốn giảm mỡ, OffiMeal ưu tiên các bài tập ngắt quãng nhẹ đến vừa (Low-Impact) kết hợp giải phóng khớp gối và cột sống. Điều này kích thích tuần hoàn máu và đốt cháy calo mà không gây chấn thương.'
      dailyRoutineTip =
        'Gợi ý: Dành 10 phút giãn cơ cổ vai gáy vào giờ nghỉ trưa và thực hiện bài tập cardio 15 phút tại nhà trước bữa tối.'
    } else if (goal === 'gain') {
      reason =
        'Với đặc thù ngồi văn phòng nhiều và mục tiêu săn chắc cơ bắp, các bài tập kích hoạt nhóm cơ trung tâm (Core) và cơ mông là quan trọng nhất nhằm cải thiện tư thế đứng ngồi và tăng khối lượng cơ nạc an toàn.'
      dailyRoutineTip =
        'Gợi ý: Tập trung các động tác kháng lực trọng lượng cơ thể 15-20 phút, 3 buổi mỗi tuần.'
    } else {
      reason =
        'Vì bạn ngồi làm việc liên tục trên 6 tiếng mỗi ngày, ưu tiên số 1 là giãn nở lồng ngực, giải tỏa áp lực đĩa đệm và duy trì nhịp tim ổn định bằng các bài tập ngắn linh hoạt.'
      dailyRoutineTip =
        'Gợi ý: Cứ sau 90 phút làm việc, đứng lên xoay khớp vai 2 phút và uống một ly nước ấm.'
    }
  } else if (activity === 'light') {
    if (goal === 'lose') {
      reason =
        'Bạn đã có thói quen đi lại nhẹ nhàng, việc kết hợp thêm các bài Cardio 10-15 phút sẽ thúc đẩy cơ thể đạt vùng nhịp tim đốt mỡ tối ưu, đẩy nhanh hiệu quả kiểm soát cân nặng.'
      dailyRoutineTip =
        'Gợi ý: Kết hợp bữa trưa Eat Clean cân bằng và hoàn thành 1 video cardio 15 phút 4 ngày/tuần.'
    } else {
      reason =
        'Thể trạng vận động nhẹ của bạn rất thích hợp để nâng dần cường độ với các bài tập tăng cường sức bền và độ săn chắc toàn thân.'
      dailyRoutineTip =
        'Gợi ý: Luân phiên giữa 1 ngày tập cơ bắp và 1 ngày giãn cơ yoga nhẹ nhàng.'
    }
  } else {
    // Moderate
    reason =
      'Với mức độ vận động tích cực, bạn hoàn toàn có thể chinh phục các bài tập toàn thân cường độ cao (HIIT) hoặc bài tập kháng lực nâng cao để tối đa hóa hiệu suất trao đổi chất.'
    dailyRoutineTip =
      'Gợi ý: Duy trì 20 phút cardio/kháng lực mỗi ngày kết hợp bổ sung đầy đủ protein từ thực đơn OffiMeal.'
  }

  return {
    recommendedVideos,
    officeStretch,
    reason,
    dailyRoutineTip,
  }
}
