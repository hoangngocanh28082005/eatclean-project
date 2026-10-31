import { useState } from 'react'
import { Droplet, Bell, AlertCircle, Volume2, Check } from 'lucide-react'
import {
  workoutProgressService,
  type ReminderSettings,
} from '../services/workoutProgressService'

export default function ReminderWidget() {
  const [settings, setSettings] = useState<ReminderSettings>(
    workoutProgressService.getReminderSettings()
  )
  const [isSaved, setIsSaved] = useState(false)
  const [activeToast, setActiveToast] = useState<string | null>(null)

  const handleToggleWater = () => {
    const updated = { ...settings, waterReminderEnabled: !settings.waterReminderEnabled }
    setSettings(updated)
    workoutProgressService.saveReminderSettings(updated)
    flashSaved()
  }

  const handleToggleStretch = () => {
    const updated = { ...settings, stretchReminderEnabled: !settings.stretchReminderEnabled }
    setSettings(updated)
    workoutProgressService.saveReminderSettings(updated)
    flashSaved()
  }

  const handleIntervalChange = (key: 'waterIntervalMinutes' | 'stretchIntervalMinutes', val: number) => {
    const updated = { ...settings, [key]: val }
    setSettings(updated)
    workoutProgressService.saveReminderSettings(updated)
    flashSaved()
  }

  const flashSaved = () => {
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  const testReminder = (type: 'water' | 'stretch') => {
    if (type === 'water') {
      setActiveToast('💧 Đã đến giờ uống nước! Hãy uống một cốc 200-250ml nước ấm để tỉnh táo.')
    } else {
      setActiveToast('🧘 Hãy rời mắt khỏi màn hình! Đứng dậy xoay cổ, vươn vai 3 phút nhé.')
    }
    setTimeout(() => setActiveToast(null), 5000)
  }

  return (
    <div className="space-y-6">
      {/* Toast Alert Simulation */}
      {activeToast && (
        <div className="fixed top-24 right-6 z-50 flex max-w-sm items-center gap-3 rounded-2xl bg-forest-900 p-4 text-xs font-semibold text-white shadow-2xl ring-2 ring-accent-400 animate-bounce">
          <Bell className="size-5 shrink-0 text-accent-400" />
          <div className="flex-1">{activeToast}</div>
          <button
            type="button"
            onClick={() => setActiveToast(null)}
            className="text-white/60 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Limitation Notice from Spec 2.5 */}
      <div className="flex items-start gap-3 rounded-2xl bg-cream-100/80 p-4 ring-1 ring-sage-200">
        <AlertCircle className="mt-0.5 size-5 shrink-0 text-forest-700" />
        <div className="text-xs leading-relaxed text-forest-900">
          <strong className="font-bold">Cơ chế nhắc nhở phiên làm việc:</strong>
          <p className="mt-0.5">
            Tính năng nhắc lịch này hoạt động trực tiếp trong khi bạn đang mở trình duyệt làm việc.
            Hệ thống <em>không hứa hẹn nhắc nhở khi bạn đóng hoàn toàn trình duyệt</em> (tính năng gửi
            thông báo đẩy nền hoặc email nhắc nhở định kỳ sẽ nằm ở bản cập nhật tiếp theo).
          </p>
        </div>
      </div>

      {/* Reminder Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Water reminder */}
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-sage-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="rounded-2xl bg-blue-50 p-2.5 text-blue-600">
                <Droplet className="size-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-forest-900">Nhắc uống nước</h4>
                <p className="text-xs text-forest-900/60">Duy trì bù nước cho dân văn phòng</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggleWater}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.waterReminderEnabled ? 'bg-forest-800' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block size-4 transform rounded-full bg-white transition-transform ${
                  settings.waterReminderEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="mt-5 border-t border-sage-100 pt-4">
            <label className="block text-xs font-bold text-forest-700">Tần suất nhắc nhở</label>
            <div className="mt-2 flex gap-2">
              {[30, 45, 60].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => handleIntervalChange('waterIntervalMinutes', mins)}
                  className={`flex-1 rounded-xl py-1.5 text-xs font-semibold transition-all ${
                    settings.waterIntervalMinutes === mins
                      ? 'bg-forest-800 text-white'
                      : 'bg-cream-100 text-forest-900/70 hover:bg-sage-100'
                  }`}
                >
                  {mins} phút
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => testReminder('water')}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-forest-700 hover:text-forest-900"
            >
              <Volume2 className="size-3.5" />
              Thử chuông & thông báo mẫu
            </button>
          </div>
        </div>

        {/* Stretch reminder */}
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-sage-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="rounded-2xl bg-amber-50 p-2.5 text-amber-600">
                <Bell className="size-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-forest-900">Nhắc giãn cơ & Đứng dậy</h4>
                <p className="text-xs text-forest-900/60">Giảm tải áp lực đĩa đệm và cổ</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggleStretch}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.stretchReminderEnabled ? 'bg-forest-800' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block size-4 transform rounded-full bg-white transition-transform ${
                  settings.stretchReminderEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="mt-5 border-t border-sage-100 pt-4">
            <label className="block text-xs font-bold text-forest-700">Tần suất nhắc nhở</label>
            <div className="mt-2 flex gap-2">
              {[60, 90, 120].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => handleIntervalChange('stretchIntervalMinutes', mins)}
                  className={`flex-1 rounded-xl py-1.5 text-xs font-semibold transition-all ${
                    settings.stretchIntervalMinutes === mins
                      ? 'bg-forest-800 text-white'
                      : 'bg-cream-100 text-forest-900/70 hover:bg-sage-100'
                  }`}
                >
                  {mins} phút
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => testReminder('stretch')}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-forest-700 hover:text-forest-900"
            >
              <Volume2 className="size-3.5" />
              Thử chuông & thông báo mẫu
            </button>
          </div>
        </div>
      </div>

      {isSaved && (
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
          <Check className="size-3.5" />
          Đã lưu cài đặt nhắc nhở
        </div>
      )}
    </div>
  )
}
