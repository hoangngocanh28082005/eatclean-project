import type {
  WorkoutLog,
  WeightLog,
  MealLogItem,
  InAppNotification,
} from '../models/Workout.ts'

const WORKOUT_LOGS_KEY = 'offimeal.workout_logs.v1'
const WEIGHT_LOGS_KEY = 'offimeal.weight_logs.v1'
const MEAL_LOGS_KEY = 'offimeal.meal_logs.v1'
const NOTIFICATIONS_KEY = 'offimeal.notifications.v1'
const REMINDER_SETTINGS_KEY = 'offimeal.reminder_settings.v1'

export interface ReminderSettings {
  waterReminderEnabled: boolean
  waterIntervalMinutes: number
  lastWaterReminderTimestamp?: number
  stretchReminderEnabled: boolean
  stretchIntervalMinutes: number
  lastStretchReminderTimestamp?: number
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
      date: formatDate(28),
      weightKg: 65.0,
      note: 'Khởi đầu đăng ký gói Eat Clean OffiMeal',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'w-2',
      date: formatDate(21),
      weightKg: 64.3,
      note: 'Tuần 1: Bắt đầu tập cardio nhẹ 5-10 phút',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'w-3',
      date: formatDate(14),
      weightKg: 63.6,
      note: 'Tuần 2: Giảm mỏi lưng, ăn uống đúng giờ',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'w-4',
      date: formatDate(7),
      weightKg: 63.0,
      note: 'Tuần 3: Cơ thể nhẹ nhõm, bớt thèm đồ ngọt',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'w-5',
      date: formatDate(0),
      weightKg: 62.4,
      note: 'Cân vào sáng sớm trước khi ăn sáng',
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

function getDefaultDayMeals(dateStr: string): MealLogItem[] {
  return [
    {
      id: `ml-${dateStr}-1`,
      date: dateStr,
      mealType: 'breakfast',
      mealTitle: 'Bánh mì ngũ cốc nguyên cám trứng chần bơ',
      calories: 380,
      isConsumed: false,
      note: 'Bữa sáng cung cấp năng lượng chậm và chất béo tốt',
    },
    {
      id: `ml-${dateStr}-2`,
      date: dateStr,
      mealType: 'lunch',
      mealTitle: 'OffiMeal: Ức gà nướng thảo mộc, gạo lứt & bông cải xanh',
      calories: 520,
      isConsumed: false,
      note: 'Bữa trưa Healthy OffiMeal giao trước 11:30',
    },
    {
      id: `ml-${dateStr}-3`,
      date: dateStr,
      mealType: 'snack',
      mealTitle: 'Táo tươi giòn & hạt hạnh nhân nướng mộc',
      calories: 160,
      isConsumed: false,
      note: 'Bữa phụ xế chiều 15:30 giảm cơn buồn ngủ',
    },
    {
      id: `ml-${dateStr}-4`,
      date: dateStr,
      mealType: 'dinner',
      mealTitle: 'Salad cá hồi áp chảo sốt chanh leo & hạt chia',
      calories: 450,
      isConsumed: false,
      note: 'Bữa tối nhẹ nhàng giàu Omega-3, hỗ trợ phục hồi cơ',
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

  // Meal confirmation logs (by date)
  getAllMealLogs(): MealLogItem[] {
    try {
      const data = localStorage.getItem(MEAL_LOGS_KEY)
      if (!data) return []
      return JSON.parse(data)
    } catch {
      return []
    }
  },

  getMealLogsForDate(targetDate?: string): MealLogItem[] {
    const dateStr = targetDate || new Date().toISOString().split('T')[0]
    const all = this.getAllMealLogs()
    const forDay = all.filter((m) => m.date === dateStr)

    if (forDay.length > 0) {
      return forDay
    }

    // Initialize clean default day meals if not present
    const defaultMeals = getDefaultDayMeals(dateStr)
    // If today, mark breakfast/lunch as sample confirmed for demo
    const todayStr = new Date().toISOString().split('T')[0]
    if (dateStr === todayStr) {
      defaultMeals[0].isConsumed = true
      defaultMeals[0].confirmedAt = '07:45'
      defaultMeals[1].isConsumed = true
      defaultMeals[1].confirmedAt = '12:15'
    }

    const updated = [...all, ...defaultMeals]
    try {
      localStorage.setItem(MEAL_LOGS_KEY, JSON.stringify(updated))
    } catch {
      // ignore
    }
    return defaultMeals
  },

  toggleMealConsumed(id: string): MealLogItem | null {
    const all = this.getAllMealLogs()
    const target = all.find((m) => m.id === id)
    if (!target) return null

    target.isConsumed = !target.isConsumed
    if (target.isConsumed) {
      const now = new Date()
      target.confirmedAt = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    } else {
      delete target.confirmedAt
    }

    try {
      localStorage.setItem(MEAL_LOGS_KEY, JSON.stringify(all))
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
      lastWaterReminderTimestamp: Date.now(),
      stretchReminderEnabled: true,
      stretchIntervalMinutes: 90,
      lastStretchReminderTimestamp: Date.now(),
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
