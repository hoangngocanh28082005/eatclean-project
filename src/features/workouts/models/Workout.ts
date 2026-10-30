import type { Goal } from '../../nutrition/models/nutrition'

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
  durationLabel: string
  intensity: 'low' | 'medium' | 'high'
  goals: Goal[]
  youtubeId: string
}
