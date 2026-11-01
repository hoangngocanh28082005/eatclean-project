export interface ManagedOrder {
  orderId: number
  deliveryDate: string
  deliverySlot: string | null
  status: string
  note: string | null
  customerName: string
  customerEmail: string
  recipientName: string
  recipientPhone: string
  addressLine: string
  ward: string | null
  district: string | null
  city: string
  items: { mealName: string; quantity: number }[]
}
