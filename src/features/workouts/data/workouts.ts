import type { WorkoutPreview, WorkoutVideo } from '../models/Workout.ts'
export type { WorkoutPreview, WorkoutVideo } from '../models/Workout.ts'

/** Workouts used on the homepage preview cards (photo-based). */
export const workoutPreviews: WorkoutPreview[] = [
  {
    id: 'cardio-5-phut',
    name: 'Cardio 5 phút',
    description:
      'Chuỗi động tác nhanh bắt nhịp tim, đủ cho một buổi sáng tràn đầy năng lượng.',
    durationLabel: '5 phút',
    levelLabel: 'Mọi trình độ',
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Người tập cardio chạy bộ ngoài trời',
  },
  {
    id: 'cardio-tai-nha-15-phut',
    name: 'Cardio tại nhà 15 phút',
    description:
      'Không cần thiết bị, chỉ cần rộng một cánh tay. Thiết kế riêng cho không gian nhà.',
    durationLabel: '15 phút',
    levelLabel: 'Trung bình',
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Người tập hít đất tại nhà trên thảm tập',
  },
  {
    id: 'van-dong-nhe-van-phong',
    name: 'Vận động nhẹ cho dân văn phòng',
    description:
      'Các động tác vươn vai, xoay cổ và giãn cơ cổ vai gáy làm ngay tại ghế.',
    durationLabel: '10 phút',
    levelLabel: 'Nhẹ nhàng',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Người tập yoga tư thế giãn cơ nhẹ nhàng giữa không gian phòng',
  },
]

// ---------------------------------------------------------------------------
// Video catalog for the workouts library & recommendation engine
// ---------------------------------------------------------------------------

export const workoutVideos: WorkoutVideo[] = [
  {
    id: 'stretch-office-10',
    name: 'Giãn cơ nghỉ trưa văn phòng 10 phút',
    description:
      'Xả stress và giải phóng căng cứng cổ vai gáy sau nửa ngày ngồi máy tính. Làm trực tiếp tại bàn làm việc không cần thảm.',
    durationMinutes: 10,
    durationLabel: '10 phút',
    intensity: 'low',
    difficulty: 'Beginner',
    category: 'stretch',
    goals: ['lose', 'maintain', 'gain'],
    targetArea: 'Cổ, vai, gáy & lưng trên',
    youtubeId: 'kcK0niStxLM',
    estimatedCalories: 35,
    recommendedFor: ['sedentary', 'light', 'moderate'],
  },
  {
    id: 'stretch-anti-desk-10',
    name: 'Yoga phục hồi cột sống cho người ngồi nhiều',
    description:
      'Các động tác yoga kéo giãn thắt lưng, mở rộng lồng ngực và hông giúp giảm đau mỏi do ngồi sai tư thế suốt ngày dài.',
    durationMinutes: 10,
    durationLabel: '10 phút',
    intensity: 'low',
    difficulty: 'Beginner',
    category: 'yoga',
    goals: ['maintain', 'gain', 'lose'],
    targetArea: 'Thắt lưng & hông',
    youtubeId: 'pmJ4n4emj6o',
    estimatedCalories: 40,
    recommendedFor: ['sedentary', 'light'],
  },
  {
    id: 'cardio-5-beginner',
    name: 'Cardio 5 phút cho người mới bắt đầu',
    description:
      'Không thiết bị, không nhảy (Low Impact) — an toàn cho khớp gối, dễ chịu cho ngày đầu làm quen lại với vận động thể chất.',
    durationMinutes: 5,
    durationLabel: '5 phút',
    intensity: 'low',
    difficulty: 'Beginner',
    category: 'cardio',
    goals: ['lose', 'maintain', 'gain'],
    targetArea: 'Toàn thân nhẹ nhàng',
    youtubeId: 'q2NZyW5EP5A',
    estimatedCalories: 45,
    recommendedFor: ['sedentary', 'light'],
  },
  {
    id: 'cardio-5-do-mo',
    name: 'Cardio 5 phút đốt mỡ & đánh thức năng lượng',
    description:
      '5 động tác năng động tăng nhịp tim nhanh chóng, xua tan cảm giác uể oải buổi chiều hoặc khởi động trước giờ làm việc.',
    durationMinutes: 5,
    durationLabel: '5 phút',
    intensity: 'high',
    difficulty: 'Intermediate',
    category: 'cardio',
    goals: ['lose', 'maintain'],
    targetArea: 'Tim mạch & đốt mỡ toàn thân',
    youtubeId: 'l2ADeM1HD88',
    estimatedCalories: 65,
    recommendedFor: ['light', 'moderate'],
  },
  {
    id: 'full-body-15',
    name: 'Cardio HIIT 15 phút tại nhà không dụng cụ',
    description:
      'Chuỗi toàn thân không lặp lại động tác, tối ưu đốt mỡ dư thừa và duy trì trao đổi chất cao suốt cả ngày.',
    durationMinutes: 15,
    durationLabel: '15 phút',
    intensity: 'medium',
    difficulty: 'Intermediate',
    category: 'cardio',
    goals: ['lose', 'maintain'],
    targetArea: 'Đùi, bụng & tim mạch',
    youtubeId: '9PCGvkXV-Bo',
    estimatedCalories: 130,
    recommendedFor: ['light', 'moderate'],
  },
  {
    id: 'strength-15-beginner',
    name: 'Tập săn chắc cơ thể 15 phút (Core & Mông)',
    description:
      'Kích hoạt nhóm cơ trung tâm (core) và cơ mông bị ức chế do ngồi làm việc nhiều tiếng liên tục. Phù hợp người mới.',
    durationMinutes: 15,
    durationLabel: '15 phút',
    intensity: 'medium',
    difficulty: 'Beginner',
    category: 'strength',
    goals: ['gain', 'maintain'],
    targetArea: 'Cơ bụng, lưng dưới & mông',
    youtubeId: 'dcKwz_C8pkg',
    estimatedCalories: 110,
    recommendedFor: ['sedentary', 'light', 'moderate'],
  },
  {
    id: 'strength-20-low-impact',
    name: 'Sức mạnh toàn thân Low-Impact 20 phút',
    description:
      'Tập sức mạnh kiểm soát nhịp thở, không bật nhảy, giữ an toàn tối đa cho cột sống và khớp gối.',
    durationMinutes: 20,
    durationLabel: '20 phút',
    intensity: 'low',
    difficulty: 'Beginner',
    category: 'strength',
    goals: ['gain', 'lose', 'maintain'],
    targetArea: 'Cơ bắp toàn thân & độ dẻo dai',
    youtubeId: '0DWkbOGQQXA',
    estimatedCalories: 140,
    recommendedFor: ['sedentary', 'light'],
  },
  {
    id: 'strength-20-bodyweight',
    name: 'Kháng lực trọng lượng cơ thể 20 phút nâng cao',
    description:
      'Tập trung phát triển sức bền và cơ bắp với các biến thể chống đẩy, squat, lunge và plank nâng cao.',
    durationMinutes: 20,
    durationLabel: '20 phút',
    intensity: 'high',
    difficulty: 'Advanced',
    category: 'strength',
    goals: ['gain', 'maintain'],
    targetArea: 'Ngực, vai, tay & chân',
    youtubeId: 'bM2ueLV0A4I',
    estimatedCalories: 180,
    recommendedFor: ['moderate'],
  },
]

export const categoryLabels: Record<WorkoutVideo['category'], string> = {
  stretch: 'Giãn cơ văn phòng',
  cardio: 'Cardio đốt mỡ',
  strength: 'Sức mạnh & cơ bắp',
  yoga: 'Yoga phục hồi',
}

export const difficultyLabels: Record<WorkoutVideo['difficulty'], string> = {
  Beginner: 'Người mới (Dễ)',
  Intermediate: 'Trung bình',
  Advanced: 'Nâng cao',
}

export const intensityLabels: Record<WorkoutVideo['intensity'], string> = {
  low: 'Nhẹ',
  medium: 'Vừa',
  high: 'Cao',
}

export const youtubeThumb = (youtubeId: string, big = false) =>
  `https://i.ytimg.com/vi/${youtubeId}/${big ? 'maxresdefault' : 'hqdefault'}.jpg`

export const youtubeUrl = (youtubeId: string) =>
  `https://www.youtube.com/watch?v=${youtubeId}`
