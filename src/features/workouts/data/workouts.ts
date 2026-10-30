import type { WorkoutPreview, WorkoutVideo } from '../models/Workout'
export type { WorkoutPreview, WorkoutVideo } from '../models/Workout'

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
// Video catalog for the personalized recommendation page
// ---------------------------------------------------------------------------

/** Real YouTube videos (English content, Vietnamese card copy). Source: tự tổng hợp. */
export const workoutVideos: WorkoutVideo[] = [
  {
    id: 'cardio-5-beginner',
    name: 'Cardio 5 phút cho người mới bắt đầu',
    description:
      'Không thiết bị, không nhảy — dễ chịu cho ngày đầu làm quen với vận động.',
    durationLabel: '5 phút',
    intensity: 'low',
    goals: ['lose', 'maintain', 'gain'],
    youtubeId: 'q2NZyW5EP5A',
  },
  {
    id: 'cardio-5-do-mo',
    name: 'Cardio 5 phút đốt mỡ toàn thân',
    description:
      '5 bài đơn giản đánh thức cơ thể, hợp để làm ngay trước giờ làm việc.',
    durationLabel: '5 phút',
    intensity: 'high',
    goals: ['lose', 'maintain'],
    youtubeId: 'l2ADeM1HD88',
  },
  {
    id: 'full-body-15',
    name: 'Bài tập toàn thân 15 phút tại nhà',
    description:
      'Chuỗi toàn thân không lặp lại động tác, phù hợp không gian căn hộ nhỏ.',
    durationLabel: '15 phút',
    intensity: 'medium',
    goals: ['lose', 'maintain'],
    youtubeId: '9PCGvkXV-Bo',
  },
  {
    id: 'strength-15-beginner',
    name: 'Sức mạnh toàn thân 15 phút (người mới)',
    description:
      'Bài tập cho cơ mông, cơ trung tâm, vai và lưng dành cho người mới bắt đầu.',
    durationLabel: '15 phút',
    intensity: 'medium',
    goals: ['gain', 'maintain'],
    youtubeId: 'dcKwz_C8pkg',
  },
  {
    id: 'strength-20-bodyweight',
    name: 'Tăng cơ 20 phút với trọng lượng cơ thể',
    description:
      'Chuỗi bài tập sức mạnh toàn thân sử dụng trọng lượng cơ thể, không cần dụng cụ.',
    durationLabel: '20 phút',
    intensity: 'medium',
    goals: ['gain', 'maintain'],
    youtubeId: 'bM2ueLV0A4I',
  },
  {
    id: 'strength-20-low-impact',
    name: 'Bài tập sức mạnh ít bật nhảy 20 phút',
    description:
      'Ưu tiên động tác ít bật nhảy. Hãy chọn cường độ phù hợp và dừng khi thấy đau hoặc khó chịu.',
    durationLabel: '20 phút',
    intensity: 'low',
    goals: ['gain', 'lose', 'maintain'],
    youtubeId: '0DWkbOGQQXA',
  },
  {
    id: 'stretch-office-10',
    name: 'Giãn cơ nghỉ trưa văn phòng 10 phút',
    description:
      'Xả stress và căng cơ sau nửa ngày ngồi làm việc, không cần rời khỏi ghế.',
    durationLabel: '10 phút',
    intensity: 'low',
    goals: ['lose', 'maintain', 'gain'],
    youtubeId: 'kcK0niStxLM',
  },
  {
    id: 'stretch-anti-desk-10',
    name: 'Yoga giãn cơ cho người ngồi nhiều, 10 phút',
    description:
      'Các động tác yoga giúp bạn dành thời gian giãn cơ sau khi ngồi làm việc.',
    durationLabel: '10 phút',
    intensity: 'low',
    goals: ['maintain', 'gain'],
    youtubeId: 'pmJ4n4emj6o',
  },
]

export const youtubeThumb = (youtubeId: string, big = false) =>
  `https://i.ytimg.com/vi/${youtubeId}/${big ? 'maxresdefault' : 'hqdefault'}.jpg`

export const youtubeUrl = (youtubeId: string) =>
  `https://www.youtube.com/watch?v=${youtubeId}`
