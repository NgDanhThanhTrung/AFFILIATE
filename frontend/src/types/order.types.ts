export interface OrderResponse {
  id: string
  userId: string
  affiliateLinkId: string | null
  platformOrderId: string
  platform: 'SHOPEE' | 'TIKTOK'
  subId: string | null
  orderAmount: number
  commissionRate: number
  commissionAmount: number
  cashbackAmount: number
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED' | 'FAILED'
  orderDate: string | null
  shippedDate: string | null
  completedDate: string | null
  cancelledDate: string | null
  metadata: any
  createdAt: string
  updatedAt: string
}

export interface OrderHistoryResponse {
  orders: OrderResponse[]
  total: number
  page: number
  totalPages: number
}

export interface OrderStats {
  totalOrders: number
  pendingOrders: number
  confirmedOrders: number
  shippedOrders: number
  completedOrders: number
  cancelledOrders: number
  failedOrders: number
  totalOrderAmount: number
  totalCommission: number
  totalCashback: number
  byPlatform: {
    SHOPEE: number
    TIKTOK: number
  }
}