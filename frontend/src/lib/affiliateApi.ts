import axios from 'axios'
import { ConvertLinkRequest, ConvertLinkResponse, LinkHistoryResponse, LinkStats } from '../types/affiliate.types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export const affiliateApi = {
  /**
   * Convert URL to affiliate link
   */
  async convertLink(data: ConvertLinkRequest): Promise<ConvertLinkResponse> {
    const response = await axios.post(`${API_BASE_URL}/affiliate/convert`, data)
    return response.data.data
  },

  /**
   * Get link history
   */
  async getLinkHistory(params?: {
    page?: number
    limit?: number
    platform?: 'SHOPEE' | 'TIKTOK'
  }): Promise<LinkHistoryResponse> {
    const response = await axios.get(`${API_BASE_URL}/affiliate/history`, { params })
    return response.data.data
  },

  /**
   * Get link statistics
   */
  async getLinkStats(params?: {
    startDate?: string
    endDate?: string
  }): Promise<LinkStats> {
    const response = await axios.get(`${API_BASE_URL}/affiliate/stats`, { params })
    return response.data.data
  },

  /**
   * Delete link
   */
  async deleteLink(linkId: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/affiliate/${linkId}`)
  },

  /**
   * Update link status
   */
  async updateLinkStatus(linkId: string, isActive: boolean): Promise<void> {
    await axios.patch(`${API_BASE_URL}/affiliate/${linkId}/status`, { isActive })
  },

  /**
   * Track click (public endpoint)
   */
  async trackClick(subId: string): Promise<void> {
    await axios.get(`${API_BASE_URL}/affiliate/track/${subId}`)
  },
}