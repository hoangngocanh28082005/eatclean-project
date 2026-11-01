import { test } from 'node:test'
import assert from 'node:assert/strict'
import { workoutProgressService as service } from '../src/features/workouts/services/workoutProgressService.ts'

test('guest and new accounts start clean; progress stays within its account', () => {
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
  const storage = new Map([
    ['offimeal.workout_logs.v1', JSON.stringify([{ id: 'legacy-demo' }])],
    ['offimeal.notifications.v1', JSON.stringify([{ id: 'sample-order' }])],
  ])
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
    getItem: key => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
  } })
  try {
    service.setUser(null)
    assert.deepEqual(service.getWorkoutLogs(), [])
    assert.deepEqual(service.getWeightLogs(), [])
    assert.deepEqual(service.getNotifications(), [])
    assert.ok(service.getMealLogsForDate().every(meal => !meal.isConsumed && !meal.confirmedAt))
    service.addWorkoutLog({ workoutId: 'guest', workoutTitle: 'Guest', durationMinutes: 5 })
    assert.deepEqual(service.getWorkoutLogs(), [])

    service.setUser(1)
    assert.deepEqual(service.getWorkoutLogs(), [])
    assert.deepEqual(service.getNotifications(), [])
    service.addWorkoutLog({ workoutId: 'real', workoutTitle: 'Real workout', durationMinutes: 10 })
    const meals = service.getMealLogsForDate()
    assert.ok(meals.every(meal => !meal.isConsumed))
    service.toggleMealConsumed(meals[0].id)
    service.setUser(2)
    assert.deepEqual(service.getWorkoutLogs(), [])
    assert.ok(service.getMealLogsForDate().every(meal => !meal.isConsumed))
    service.setUser(1)
    assert.equal(service.getWorkoutLogs()[0].workoutId, 'real')
    assert.equal(service.getMealLogsForDate()[0].isConsumed, true)
    service.setUser(null)
    assert.deepEqual(service.getWorkoutLogs(), [])
    assert.ok(service.getMealLogsForDate().every(meal => !meal.isConsumed))
  } finally {
    service.setUser(null)
    if (previous) Object.defineProperty(globalThis, 'localStorage', previous)
    else delete globalThis.localStorage
  }
})
