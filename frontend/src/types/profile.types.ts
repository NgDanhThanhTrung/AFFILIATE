export interface ProfileResponse {
  id: string
  phoneNumber: string
  name: string | null
  email: string | null
  avatar: string | null
  isPhoneVerified: boolean
  isActive: boolean
  lastLoginAt: string | null
  createdAt: string
  updatedAt: string
  hasPin: boolean
}

export interface ProfileUpdateInput {
  name?: string
  email?: string
  avatar?: string
}

export interface PinCreateInput {
  pin: string
  confirmPin: string
}

export interface PinUpdateInput {
  currentPin: string
  newPin: string
  confirmPin: string
}

export interface PinResponse {
  hasPin: boolean
  pinSetAt: string | null
}

export interface UserStats {
  wallet: {
    balance: number
    totalEarned: number
    totalWithdrawn: number
  } | null
  orders: {
    total: number
    completed: number
    pending: number
    totalAmount: number
    totalCashback: number
  }
  links: {
    total: number
    totalClicks: number
    totalConversions: number
    totalRevenue: number
  }
}