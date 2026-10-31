import type { ActivityLevel, Goal } from '../../nutrition/models/nutrition.ts'

export type WorkoutIntensity = 'low' | 'medium' | 'high'
export type WorkoutDifficulty = 'Beginner' | 'Intermediate' | 'Advanced'
export type WorkoutCategory = 'stretch' | 'cardio' | 'strength' | 'yoga'

export interface WorkoutPreview {
  id: string
  name: string
  description: string
  durationLabel: string
  levelLabel: string
  imageUrl: string
  imageAlt: string
}

export interface WorkoutVideo {
  id: string
  name: string
  description: string
  durationMinutes: number
  durationLabel: string
  intensity: WorkoutIntensity
  difficulty: WorkoutDifficulty
  category: WorkoutCategory
  goals: Goal[]
  targetArea: string
  youtubeId: string
  estimatedCalories: number
  recommendedFor?: ActivityLevel[]
}

export interface WorkoutLog {
  id: string
  userId?: number
  workoutPlanId?: number
  workoutId: string
  workoutTitle: string
  durationMinutes: number
  completedAt: string // ISO date string
  note?: string
  caloriesBurned?: number
}

export interface WeightLog {
  id: string
  userId?: number
  date: string // YYYY-MM-DD
  weightKg: number
  note?: string
  createdAt: string
}

export interface MealLogItem {
  id: string
  date: string // YYYY-MM-DD
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  mealTitle: string
  calories?: number
  isConsumed: boolean
  confirmedAt?: string
  note?: string
}

export interface InAppNotification {
  id: string
  title: string
  message: string
  type: 'order' | 'delivery' | 'request' | 'reminder'
  timestamp: string
  isRead: boolean
  link?: string
}
