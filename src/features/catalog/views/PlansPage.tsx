import { useCallback, useEffect, useState } from 'react'
import { Feedback, panelClass } from '@/shared/components/forms/AccountFields'
import Button from '@/shared/components/ui/Button'
import SectionHeading from '@/shared/components/ui/SectionHeading'
import { errorMessage } from '@/shared/services/httpClient'
import { formatPrice } from '../data/labels'
import type { MealPackage } from '../models/MealPackage'
import { catalogService } from '../services/catalogService'

export default function PlansPage() {
  const [packages, setPackages] = useState<MealPackage[] | null>(null)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setError('')
    try {
      setPackages(await catalogService.packages())
    } catch (e) {
      setError(errorMessage(e))
    }
  }, [])

  useEffect(() => {
    void Promise.resolve().then(load)
  }, [load])

  return (
    <section className="bg-cream-100">
      <div className="mx-auto max-w-4xl space-y-10 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <SectionHeading
          eyebrow="Gói ăn"
          title="Chọn gói phù hợp với lịch làm việc"
          description="Thanh toán trước, sau đó bạn chọn món và ngày giao cho từng bữa trong gói."
        />

        {error ? (
          <div className="space-y-4">
            <Feedback error={error} />
            <Button onClick={() => void load()}>Thử lại</Button>
          </div>
        ) : !packages ? (
          <p role="status" className="text-center">Đang tải gói ăn…</p>
        ) : packages.length ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {packages.map((item) => (
              <article key={item.id} className={`${panelClass} flex flex-col`}>
                <div>
                  <h2 className="text-xl font-bold text-forest-900">{item.name}</h2>
                  {item.description && <p className="mt-1 text-sm text-forest-900/70">{item.description}</p>}
                </div>
                <div>
                  <p className="text-4xl font-extrabold text-forest-700">{formatPrice(item.price)}</p>
                  <p className="mt-1 text-sm font-medium text-forest-900/60">
                    {item.mealCount} bữa trong {item.durationDays} ngày · {formatPrice(Math.round(item.price / item.mealCount))}/bữa
                  </p>
                </div>
                <Button to={`/dat-goi/${item.id}`} className="mt-auto w-full">Đăng ký gói</Button>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-center">Hiện chưa có gói ăn đang mở bán.</p>
        )}
      </div>
    </section>
  )
}
