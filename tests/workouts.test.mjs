import { test } from 'node:test'
import assert from 'node:assert/strict'
import { workoutVideos } from '../src/features/workouts/data/workouts.ts'
import { getWorkoutRecommendations } from '../src/features/workouts/services/workoutRecommendation.ts'

test('workout catalog contains valid videos with tags, youtubeId and duration', () => {
  assert.ok(workoutVideos.length >= 8)
  for (const video of workoutVideos) {
    assert.ok(video.id)
    assert.ok(video.name)
    assert.ok(video.durationMinutes > 0)
    assert.ok(['low', 'medium', 'high'].includes(video.intensity))
    assert.ok(['Beginner', 'Intermediate', 'Advanced'].includes(video.difficulty))
    assert.ok(['stretch', 'cardio', 'strength', 'yoga'].includes(video.category))
    assert.ok(video.youtubeId.length > 5)
    assert.ok(video.estimatedCalories > 0)
  }
})

test('workout recommendations for sedentary office worker prioritizes stretches and gentle cardio', () => {
  const profile = {
    gender: 'female',
    age: 26,
    heightCm: 160,
    weightKg: 55,
    goal: 'lose',
    activity: 'sedentary',
  }

  const rec = getWorkoutRecommendations(profile)
  assert.ok(rec.recommendedVideos.length > 0)
  assert.ok(rec.officeStretch !== null)
  assert.ok(rec.reason.includes('ngồi một chỗ nhiều'))
  assert.ok(rec.dailyRoutineTip.length > 10)
  // Check that recommended videos match the goal
  assert.ok(rec.recommendedVideos.every((v) => v.goals.includes('lose')))
})

test('workout recommendations for muscle gain prioritizes strength and core workouts', () => {
  const rec = getWorkoutRecommendations(null, 'gain', 'sedentary')
  assert.ok(rec.recommendedVideos.length > 0)
  assert.ok(rec.reason.includes('cơ bắp'))
  assert.ok(rec.recommendedVideos.every((v) => v.goals.includes('gain')))
})
