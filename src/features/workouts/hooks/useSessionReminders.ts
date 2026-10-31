import { useState, useEffect, useCallback, useRef } from 'react'
import {
  workoutProgressService,
  type ReminderSettings,
} from '../services/workoutProgressService.ts'

export interface ActiveReminder {
  id: string
  type: 'water' | 'stretch'
  message: string
  actionLabel?: string
  link?: string
}

/** Simple, clean Web Audio API chime tone without needing external MP3 files */
function playChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AudioContextClass) return
    const ctx = new AudioContextClass()
    const now = ctx.currentTime

    // First tone (E5 ~ 659Hz)
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(659.25, now)
    gain1.gain.setValueAtTime(0.08, now)
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.35)
    osc1.connect(gain1)
    gain1.connect(ctx.destination)
    osc1.start(now)
    osc1.stop(now + 0.35)

    // Second tone (G5 ~ 783Hz)
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(783.99, now + 0.15)
    gain2.gain.setValueAtTime(0.08, now + 0.15)
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.55)
    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.start(now + 0.15)
    osc2.stop(now + 0.55)
  } catch {
    // Ignore audio permission or context restrictions
  }
}

export function useSessionReminders() {
  const [activeReminder, setActiveReminder] = useState<ActiveReminder | null>(null)
  const [settings, setSettings] = useState<ReminderSettings>(() =>
    workoutProgressService.getReminderSettings()
  )

  const settingsRef = useRef(settings)

  useEffect(() => {
    settingsRef.current = settings
  }, [settings])

  const triggerReminder = useCallback((type: 'water' | 'stretch', isManualTest = false) => {
    playChime()
    const newSettings = { ...settingsRef.current }
    const now = Date.now()

    if (type === 'water') {
      setActiveReminder({
        id: 'rem-water-' + now,
        type: 'water',
        message: '💧 Đã đến giờ uống nước! Uống một cốc nước 200ml để bù khoáng và tỉnh táo làm việc.',
      })
      if (!isManualTest) {
        newSettings.lastWaterReminderTimestamp = now
        workoutProgressService.saveReminderSettings(newSettings)
        setSettings(newSettings)
      }
    } else {
      setActiveReminder({
        id: 'rem-stretch-' + now,
        type: 'stretch',
        message: '🧘 Rời mắt khỏi màn hình! Hãy đứng dậy xoay khớp cổ, vươn vai 3 phút nhé.',
      })
      if (!isManualTest) {
        newSettings.lastStretchReminderTimestamp = now
        workoutProgressService.saveReminderSettings(newSettings)
        setSettings(newSettings)
      }
    }
  }, [])

  const dismissReminder = useCallback(() => {
    setActiveReminder(null)
  }, [])

  // Background interval loop (checks every 10 seconds while tab is open)
  useEffect(() => {
    const timer = setInterval(() => {
      const current = settingsRef.current
      const now = Date.now()

      // Water check
      if (current.waterReminderEnabled) {
        const lastWater = current.lastWaterReminderTimestamp || now
        const elapsedMinutes = (now - lastWater) / (1000 * 60)
        if (elapsedMinutes >= current.waterIntervalMinutes) {
          triggerReminder('water')
        }
      }

      // Stretch check
      if (current.stretchReminderEnabled) {
        const lastStretch = current.lastStretchReminderTimestamp || now
        const elapsedMinutes = (now - lastStretch) / (1000 * 60)
        if (elapsedMinutes >= current.stretchIntervalMinutes) {
          triggerReminder('stretch')
        }
      }
    }, 10000)

    return () => clearInterval(timer)
  }, [triggerReminder])

  const updateSettings = useCallback((newSettings: ReminderSettings) => {
    setSettings(newSettings)
    workoutProgressService.saveReminderSettings(newSettings)
  }, [])

  return {
    activeReminder,
    triggerReminder,
    dismissReminder,
    settings,
    updateSettings,
  }
}
