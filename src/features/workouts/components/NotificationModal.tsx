import { useState } from 'react'
import {
  Bell,
  Truck,
  CheckCircle2,
  FileCheck,
  X,
  CheckCheck,
} from 'lucide-react'
import type { InAppNotification } from '../models/Workout'

interface NotificationModalProps {
  notifications: InAppNotification[]
  isOpen: boolean
  onClose: () => void
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
}

const typeIcons: Record<InAppNotification['type'], React.ReactNode> = {
  delivery: <Truck className="size-4.5 text-blue-600" />,
  order: <CheckCircle2 className="size-4.5 text-emerald-600" />,
  request: <FileCheck className="size-4.5 text-amber-600" />,
  reminder: <Bell className="size-4.5 text-accent-500" />,
}

export default function NotificationModal({
  notifications,
  isOpen,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
}: NotificationModalProps) {
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  if (!isOpen) return null

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.isRead
    return true
  })

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
      <div className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-sage-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sage-100 p-5">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Bell className="size-5 text-forest-800" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex size-3 items-center justify-center rounded-full bg-accent-500 text-[8px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </div>
            <h3 className="text-base font-bold text-forest-900">Thông báo website</h3>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={onMarkAllAsRead}
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-forest-700 hover:bg-sage-100"
              >
                <CheckCheck className="size-3.5" />
                Đọc tất cả
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1.5 text-forest-900/40 hover:bg-sage-100 hover:text-forest-900"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Filter Tab */}
        <div className="flex border-b border-sage-100 bg-cream-100/40 px-5 pt-2 text-xs">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`border-b-2 px-3 py-2 font-bold transition-all ${
              filter === 'all'
                ? 'border-forest-800 text-forest-800'
                : 'border-transparent text-forest-900/60 hover:text-forest-900'
            }`}
          >
            Tất cả ({notifications.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('unread')}
            className={`border-b-2 px-3 py-2 font-bold transition-all ${
              filter === 'unread'
                ? 'border-forest-800 text-forest-800'
                : 'border-transparent text-forest-900/60 hover:text-forest-900'
            }`}
          >
            Chưa đọc ({unreadCount})
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-sage-100 p-2">
          {filtered.length === 0 ? (
            <p className="py-12 text-center text-xs text-forest-900/50">
              Không có thông báo nào.
            </p>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => onMarkAsRead(item.id)}
                className={`flex cursor-pointer items-start gap-3.5 rounded-2xl p-4 transition-colors ${
                  item.isRead ? 'hover:bg-cream-100/60' : 'bg-sage-100/50 hover:bg-sage-100'
                }`}
              >
                <div className="mt-0.5 rounded-xl bg-white p-2 shadow-xs">
                  {typeIcons[item.type]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4
                      className={`text-xs font-bold ${item.isRead ? 'text-forest-900/80' : 'text-forest-900'}`}
                    >
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-forest-900/50">{item.timestamp}</span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-forest-900/70">
                    {item.message}
                  </p>
                </div>
                {!item.isRead && (
                  <span className="mt-1.5 size-2 shrink-0 rounded-full bg-accent-500" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
