import { Platform, OrderStatus } from '@prisma/client'

export interface OrderInput {
  platformOrderId: string
  platform: Platform
  subId?: string
  orderAmount: number
  commissionRate: number
  commissionAmount: number
  cashbackAmount: number
  metadata?: any
}

export interface OrderResponse {
  id: string
  userId: string
  affiliateLinkId: string | null
  platformOrderId: string
  platform: Platform
  subId: string | null
  orderAmount: number
  commissionRate: number
  commissionAmount: number
  cashbackAmount: number
  status: OrderStatus
  orderDate: Date | null
  shippedDate: Date | null
  completedDate: Date | null
  cancelledDate: Date | null
  metadata: any
  createdAt: Date
  updatedAt: Date
}

export interface WebhookPayload {
  platform: Platform
  eventType: string
  orderId: string
  status: string
  amount?: number
  timestamp: string
  data?: any
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