export interface Subscription {
  subscriptionId: number
  packageId: number
  packageName: string
  mealCount: number
  remainingMeals: number
  startDate: string
  endDate: string
  status: string
  totalPrice: number
}

export interface Payment {
  paymentId: number
  orderId: number | null
  subscriptionId: number | null
  amount: number
  paymentMethod: string
  status: string
}

export interface OrderItem {
  mealId: number
  mealName: string
  quantity: number
}

export interface MealOrder {
  orderId: number
  deliveryDate: string
  status: string
  note: string | null
  items: OrderItem[]
}

export interface CreateOrderInput {
  subscriptionId: number
  addressId: number
  deliveryDate: string
  note: string
  items: { mealId: number; quantity: number }[]
}
