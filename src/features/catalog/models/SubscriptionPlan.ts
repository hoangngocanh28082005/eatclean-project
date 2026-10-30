export interface SubscriptionPlan {
  id: string
  name: string
  priceLabel: string
  periodLabel: string
  description: string
  features: string[]
  highlight?: boolean
}
