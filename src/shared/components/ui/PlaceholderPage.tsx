import type { ReactNode } from 'react'
import { Construction } from 'lucide-react'
import Button from '@/shared/components/ui/Button'

interface PlaceholderPageProps {
  title: string
  description: string
  children?: ReactNode
}

/** Simple branded placeholder page used for routes not yet implemented. */
export default function PlaceholderPage({
  title,
  description,
  children,
}: PlaceholderPageProps) {
  return (
    <section className="bg-cream-100">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 py-24 text-center sm:px-6 lg:px-8">
        <span className="flex size-16 items-center justify-center rounded-3xl bg-forest-700 text-white">
          <Construction className="size-8" aria-hidden />
        </span>
        <h1 className="text-4xl font-extrabold text-forest-900">{title}</h1>
        <p className="max-w-md text-base leading-relaxed text-forest-900/70">
          {description}
        </p>
        {children}
        <Button to="/" variant="outline">
          Về trang chủ
        </Button>
      </div>
    </section>
  )
}
