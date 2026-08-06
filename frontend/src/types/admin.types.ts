export interface AdminUser {
  id: string
  phoneNumber: string
  name: string | null
  email: string | null
  avatar: string | null
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN'
  isPhoneVerified: boolean
  isActive: boolean
  lastLoginAt: string | null
  createdAt: string
  updatedAt: string
  hasPin: boolean
  wallet: {
    balance: number
    totalEarned: number
    totalWithdrawn: number
  } | null
  _count: {
    orders: number
    affiliateLinks: number
    withdrawalRequests: number
  }
}

export interface UsersResponse {
  users: AdminUser[]
  total: number
  page: number
  totalPages: number
}

export interface SystemStats {
  users: {
    total: number
    active: number
    inactive: number
    byRole: Record<string, number>
  }
  orders: {
    total: number
  }
  withdrawals: {
    total: number
  }
  revenue: {
    total: number
  }
  webhooks: {
    processed: number
  }
}

export interface RecentActivity {
  users: Array<{
    id: string
    phoneNumber: string
    name: string | null
    createdAt: string
  }>
  orders: Array<{
    id: string
    platformOrderId: string
    platform: string
    status: string
    orderAmount: number
    createdAt: string
    user: {
      phoneNumber: string
      name: string | null
    }
  }>
  withdrawals: Array<{
    id: string
    amount: number
    status: string
    createdAt: string
    user: {
      phoneNumber: string
      name: string | null
    }
  }>
}