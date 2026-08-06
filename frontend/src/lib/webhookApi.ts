import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export const webhookApi = {
  /**
   * Get webhook logs
   */
  async getWebhookLogs(params?: {
    page?: number
    limit?: number
    platform?: string
    eventType?: string
    startDate?: string
    endDate?: string
  }) {
    const response = await axios.get(`${API_BASE_URL}/webhook/admin/logs`, { params })
    return response.data.data
  },

  /**
   * Get webhook statistics
   */
  async getWebhookStats(params?: {
    startDate?: string
    endDate?: string
  }) {
    const response = await axios.get(`${API_BASE_URL}/webhook/admin/stats`, { params })
    return response.data.data
  },

  /**
   * Reprocess failed webhooks
   */
  async reprocessFailedWebhooks(limit: number = 10) {
    const response = await axios.post(`${API_BASE_URL}/webhook/admin/reprocess`, null, { params: { limit } })
    return response.data.data
  },
}