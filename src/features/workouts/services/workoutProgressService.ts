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

let activeUserId: number | null = null

// Account-scoped storage excludes legacy shared demo progress.
const progressStorage = {
  getItem(key: string) {
    return activeUserId === null ? null : localStorage.getItem(`${key}.user.${activeUserId}`)
  },
  setItem(key: string, value: string) {
    if (activeUserId !== null) localStorage.setItem(`${key}.user.${activeUserId}`, value)
  },
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

export const workoutProgressService = {
  setUser(userId: number | null) { activeUserId = userId },
  // Workout logs
  getWorkoutLogs(): WorkoutLog[] {
    try {
      const data = progressStorage.getItem(WORKOUT_LOGS_KEY)
      if (!data) {
        const initial = ([] as WorkoutLog[])
        progressStorage.setItem(WORKOUT_LOGS_KEY, JSON.stringify(initial))
        return initial
      }
      return JSON.parse(data)
    } catch {
      return ([] as WorkoutLog[])
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
      progressStorage.setItem(WORKOUT_LOGS_KEY, JSON.stringify(updated))
    } catch {
      // ignore
    }
    return newEntry
  },

  // Weight logs
  getWeightLogs(): WeightLog[] {
    try {
      const data = progressStorage.getItem(WEIGHT_LOGS_KEY)
      if (!data) {
        const initial = ([] as WeightLog[])
        progressStorage.setItem(WEIGHT_LOGS_KEY, JSON.stringify(initial))
        return initial
      }
      return JSON.parse(data)
    } catch {
      return ([] as WeightLog[])
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
      progressStorage.setItem(WEIGHT_LOGS_KEY, JSON.stringify(updated))
    } catch {
      // ignore
    }
    return newEntry
  },

  deleteWeightLog(id: string): void {
    const logs = this.getWeightLogs().filter((l) => l.id !== id)
    try {
      progressStorage.setItem(WEIGHT_LOGS_KEY, JSON.stringify(logs))
    } catch {
      // ignore
    }
  },

  // Meal confirmation logs (by date)
  getAllMealLogs(): MealLogItem[] {
    try {
      const data = progressStorage.getItem(MEAL_LOGS_KEY)
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
    const updated = [...all, ...defaultMeals]
    try {
      progressStorage.setItem(MEAL_LOGS_KEY, JSON.stringify(updated))
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
      progressStorage.setItem(MEAL_LOGS_KEY, JSON.stringify(all))
    } catch {
      // ignore
    }
    return target
  },

  // Notifications
  getNotifications(): InAppNotification[] {
    try {
      const data = progressStorage.getItem(NOTIFICATIONS_KEY)
      if (!data) {
        const initial = ([] as InAppNotification[])
        progressStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(initial))
        return initial
      }
      return JSON.parse(data)
    } catch {
      return ([] as InAppNotification[])
    }
  },

  markNotificationAsRead(id: string): void {
    const list = this.getNotifications()
    const target = list.find((n) => n.id === id)
    if (target) {
      target.isRead = true
      try {
        progressStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(list))
      } catch {
        // ignore
      }
    }
  },

  markAllNotificationsAsRead(): void {
    const list = this.getNotifications().map((n) => ({ ...n, isRead: true }))
    try {
      progressStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(list))
    } catch {
      // ignore
    }
  },

  // Reminders
  getReminderSettings(): ReminderSettings {
    try {
      const data = progressStorage.getItem(REMINDER_SETTINGS_KEY)
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
      progressStorage.setItem(REMINDER_SETTINGS_KEY, JSON.stringify(settings))
    } catch {
      // ignore
    }
  },
}
