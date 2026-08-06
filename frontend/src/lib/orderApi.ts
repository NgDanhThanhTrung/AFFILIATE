import axios from 'axios'
import { OrderResponse, OrderHistoryResponse, OrderStats } from '../types/order.types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export const orderApi = {
  /**
   * Create order (manual entry)
   */
  async createOrder(data: {
    platformOrderId: string
    platform: 'SHOPEE' | 'TIKTOK'
    orderAmount: number
    subId?: string
    metadata?: any
  }): Promise<OrderResponse> {
    const response = await axios.post(`${API_BASE_URL}/orders`, data)
    return response.data.data
  },

  /**
   * Get user's orders
   */
  async getUserOrders(params?: {
    page?: number
    limit?: number
    status?: string
    platform?: string
    startDate?: string
    endDate?: string
  }): Promise<OrderHistoryResponse> {
    const response = await axios.get(`${API_BASE_URL}/orders`, { params })
    return response.data.data
  },

  /**
   * Get order by ID
   */
  async getOrderById(orderId: string): Promise<OrderResponse> {
    const response = await axios.get(`${API_BASE_URL}/orders/${orderId}`)
    return response.data.data
  },

  /**
   * Get order statistics
   */
  async getOrderStats(params?: {
    startDate?: string
    endDate?: string
  }): Promise<OrderStats> {
    const response = await axios.get(`${API_BASE_URL}/orders/stats/summary`, { params })
    return response.data.data
  },
}