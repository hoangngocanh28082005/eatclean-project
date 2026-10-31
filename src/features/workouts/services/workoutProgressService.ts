import type {
  WorkoutLog,
  WeightLog,
  MealLogItem,
  InAppNotification,
} from '../models/Workout'

const WORKOUT_LOGS_KEY = 'offimeal.workout_logs.v1'
const WEIGHT_LOGS_KEY = 'offimeal.weight_logs.v1'
const MEAL_LOGS_KEY = 'offimeal.meal_logs.v1'
const NOTIFICATIONS_KEY = 'offimeal.notifications.v1'
const REMINDER_SETTINGS_KEY = 'offimeal.reminder_settings.v1'

export interface ReminderSettings {
  waterReminderEnabled: boolean
  waterIntervalMinutes: number
  stretchReminderEnabled: boolean
  stretchIntervalMinutes: number
}

// ---------------------------------------------------------------------------
// Seed sample data for realistic first-time view
// ---------------------------------------------------------------------------

function getInitialWeightLogs(): WeightLog[] {
  const today = new Date()
  const formatDate = (offsetDays: number) => {
    const d = new Date(today)
    d.setDate(d.getDate() - offsetDays)
    return d.toISOString().split('T')[0]
  }

  return [
    {
      id: 'w-1',
      date: formatDate(21),
      weightKg: 64.5,
      note: 'Bắt đầu dùng gói Eat Clean tuần 1',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'w-2',
      date: formatDate(14),
      weightKg: 63.8,
      note: 'Sau 1 tuần tập giãn cơ và ăn đúng bữa',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'w-3',
      date: formatDate(7),
      weightKg: 63.1,
      note: 'Cơ thể nhẹ nhàng hơn, bớt mỏi lưng',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'w-4',
      date: formatDate(0),
      weightKg: 62.4,
      note: 'Cân vào sáng sớm trước khi ăn',
      createdAt: new Date().toISOString(),
    },
  ]
}

function getInitialWorkoutLogs(): WorkoutLog[] {
  const today = new Date()
  const formatDate = (offsetDays: number, hours = 12) => {
    const d = new Date(today)
    d.setDate(d.getDate() - offsetDays)
    d.setHours(hours, 15, 0, 0)
    return d.toISOString()
  }

  return [
    {
      id: 'wl-1',
      workoutId: 'stretch-office-10',
      workoutTitle: 'Giãn cơ nghỉ trưa văn phòng 10 phút',
      durationMinutes: 10,
      completedAt: formatDate(2, 12),
      caloriesBurned: 35,
      note: 'Tập ngay tại ghế làm việc, rất thoải mái',
    },
    {
      id: 'wl-2',
      workoutId: 'cardio-5-do-mo',
      workoutTitle: 'Cardio 5 phút đốt mỡ & đánh thức năng lượng',
      durationMinutes: 5,
      completedAt: formatDate(1, 17),
      caloriesBurned: 65,
      note: 'Tập trước khi tan làm về nhà',
    },
    {
      id: 'wl-3',
      workoutId: 'full-body-15',
      workoutTitle: 'Cardio HIIT 15 phút tại nhà không dụng cụ',
      durationMinutes: 15,
      completedAt: formatDate(0, 7),
      caloriesBurned: 130,
      note: 'Tập buổi sáng trước khi đi làm',
    },
  ]
}

function getInitialMealLogs(): MealLogItem[] {
  const todayStr = new Date().toISOString().split('T')[0]
  return [
    {
      id: 'ml-1',
      date: todayStr,
      mealType: 'breakfast',
      mealTitle: 'Bánh mì ngũ cốc nguyên cám trứng chần bơ',
      calories: 380,
      isConsumed: true,
      confirmedAt: '07:45',
      note: 'Ăn tại nhà trước giờ đi làm',
    },
    {
      id: 'ml-2',
      date: todayStr,
      mealType: 'lunch',
      mealTitle: 'OffiMeal: Ức gà nướng thảo mộc, gạo lứt & bông cải xanh',
      calories: 520,
      isConsumed: true,
      confirmedAt: '12:15',
      note: 'Nhận cơm lúc 11:20 tại sảnh văn phòng, ăn ngon miệng',
    },
    {
      id: 'ml-3',
      date: todayStr,
      mealType: 'snack',
      mealTitle: 'Táo tươi & hạnh nhân nướng mộc',
      calories: 160,
      isConsumed: false,
      note: 'Bữa phụ buổi chiều lúc 15:30',
    },
    {
      id: 'ml-4',
      date: todayStr,
      mealType: 'dinner',
      mealTitle: 'Salad cá hồi áp chảo sốt chanh leo',
      calories: 450,
      isConsumed: false,
    },
  ]
}

function getInitialNotifications(): InAppNotification[] {
  return [
    {
      id: 'notif-1',
      title: 'Lịch giao bữa trưa hôm nay',
      message: 'Bữa trưa Healthy OffiMeal dự kiến giao tới sảnh văn phòng bạn lúc 11:15 - 11:30.',
      type: 'delivery',
      timestamp: 'Hôm nay, 09:30',
      isRead: false,
    },
    {
      id: 'notif-2',
      title: 'Yêu cầu đổi món đã được duyệt',
      message: 'Yêu cầu đổi món cá hồi cho thứ Ba tuần tới của bạn đã được bếp trưởng xác nhận.',
      type: 'request',
      timestamp: 'Hôm qua, 16:45',
      isRead: false,
    },
    {
      id: 'notif-3',
      title: 'Đơn đăng ký gói tuần #OM-2026',
      message: 'Gói ăn tuần của bạn đã được kích hoạt thành công. Chúc bạn có những bữa trưa ngon miệng!',
      type: 'order',
      timestamp: '3 ngày trước',
      isRead: true,
    },
  ]
}

// ---------------------------------------------------------------------------
// Storage API
// ---------------------------------------------------------------------------

export const workoutProgressService = {
  // Workout logs
  getWorkoutLogs(): WorkoutLog[] {
    try {
      const data = localStorage.getItem(WORKOUT_LOGS_KEY)
      if (!data) {
        const initial = getInitialWorkoutLogs()
        localStorage.setItem(WORKOUT_LOGS_KEY, JSON.stringify(initial))
        return initial
      }
      return JSON.parse(data)
    } catch {
      return getInitialWorkoutLogs()
    }
  },

  addWorkoutLog(log: Omit<WorkoutLog, 'id' | 'completedAt'> & { completedAt?: string }): WorkoutLog {
    const logs = this.getWorkoutLogs()
    const newEntry: WorkoutLog = {
      ...log,
      id: 'wl-' + Date.now(),
      completedAt: log.completedAt || new Date().toISOString(),
    }
    const updated = [newEntry, ...logs]
    try {
      localStorage.setItem(WORKOUT_LOGS_KEY, JSON.stringify(updated))
    } catch {
      // ignore
    }
    return newEntry
  },

  // Weight logs
  getWeightLogs(): WeightLog[] {
    try {
      const data = localStorage.getItem(WEIGHT_LOGS_KEY)
      if (!data) {
        const initial = getInitialWeightLogs()
        localStorage.setItem(WEIGHT_LOGS_KEY, JSON.stringify(initial))
        return initial
      }
      return JSON.parse(data)
    } catch {
      return getInitialWeightLogs()
    }
  },

  addWeightLog(weightKg: number, date?: string, note?: string): WeightLog {
    const logs = this.getWeightLogs()
    const dateStr = date || new Date().toISOString().split('T')[0]
    // Filter out duplicate date if any, or update it
    const filtered = logs.filter((l) => l.date !== dateStr)
    const newEntry: WeightLog = {
      id: 'w-' + Date.now(),
      date: dateStr,
      weightKg,
      note,
      createdAt: new Date().toISOString(),
    }
    const updated = [...filtered, newEntry].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )
    try {
      localStorage.setItem(WEIGHT_LOGS_KEY, JSON.stringify(updated))
    } catch {
      // ignore
    }
    return newEntry
  },

  deleteWeightLog(id: string): void {
    const logs = this.getWeightLogs().filter((l) => l.id !== id)
    try {
      localStorage.setItem(WEIGHT_LOGS_KEY, JSON.stringify(logs))
    } catch {
      // ignore
    }
  },

  // Meal confirmation logs
  getMealLogs(): MealLogItem[] {
    try {
      const data = localStorage.getItem(MEAL_LOGS_KEY)
      if (!data) {
        const initial = getInitialMealLogs()
        localStorage.setItem(MEAL_LOGS_KEY, JSON.stringify(initial))
        return initial
      }
      return JSON.parse(data)
    } catch {
      return getInitialMealLogs()
    }
  },

  toggleMealConsumed(id: string): MealLogItem | null {
    const meals = this.getMealLogs()
    const target = meals.find((m) => m.id === id)
    if (!target) return null

    target.isConsumed = !target.isConsumed
    if (target.isConsumed) {
      const now = new Date()
      target.confirmedAt = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    } else {
      delete target.confirmedAt
    }

    try {
      localStorage.setItem(MEAL_LOGS_KEY, JSON.stringify(meals))
    } catch {
      // ignore
    }
    return target
  },

  // Notifications
  getNotifications(): InAppNotification[] {
    try {
      const data = localStorage.getItem(NOTIFICATIONS_KEY)
      if (!data) {
        const initial = getInitialNotifications()
        localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(initial))
        return initial
      }
      return JSON.parse(data)
    } catch {
      return getInitialNotifications()
    }
  },

  markNotificationAsRead(id: string): void {
    const list = this.getNotifications()
    const target = list.find((n) => n.id === id)
    if (target) {
      target.isRead = true
      try {
        localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(list))
      } catch {
        // ignore
      }
    }
  },

  markAllNotificationsAsRead(): void {
    const list = this.getNotifications().map((n) => ({ ...n, isRead: true }))
    try {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(list))
    } catch {
      // ignore
    }
  },

  // Reminders
  getReminderSettings(): ReminderSettings {
    try {
      const data = localStorage.getItem(REMINDER_SETTINGS_KEY)
      if (data) return JSON.parse(data)
    } catch {
      // fallback
    }
    return {
      waterReminderEnabled: true,
      waterIntervalMinutes: 45,
      stretchReminderEnabled: true,
      stretchIntervalMinutes: 90,
    }
  },

  saveReminderSettings(settings: ReminderSettings): void {
    try {
      localStorage.setItem(REMINDER_SETTINGS_KEY, JSON.stringify(settings))
    } catch {
      // ignore
    }
  },
}
