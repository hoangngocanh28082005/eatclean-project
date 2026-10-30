export interface AccountUser {
  userId: number
  fullName: string
  email: string
  phone: string | null
  role: 'Customer' | 'Admin' | 'Staff'
  emailConfirmed: boolean
}

export interface Address {
  addressId: number
  recipientName: string
  recipientPhone: string
  addressLine: string
  ward: string | null
  district: string | null
  city: string
  note: string | null
  isDefault: boolean
}

export interface Order {
  orderId: number
  deliveryDate: string
  status: string
  totalAmount: number
}

export type AuthMode = 'login' | 'register' | 'forgot' | 'reset' | 'verify'
export type FormValues = Record<string, FormDataEntryValue>
export interface MessageResponse { message: string }
