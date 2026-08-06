import axios from 'axios'
import {
  ProfileResponse,
  ProfileUpdateInput,
  PinCreateInput,
  PinUpdateInput,
  PinResponse,
  UserStats,
} from '../types/profile.types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export const profileApi = {
  /**
   * Get user profile
   */
  async getProfile(): Promise<ProfileResponse> {
    const response = await axios.get(`${API_BASE_URL}/profile`)
    return response.data.data
  },

  /**
   * Update user profile
   */
  async updateProfile(data: ProfileUpdateInput): Promise<ProfileResponse> {
    const response = await axios.patch(`${API_BASE_URL}/profile`, data)
    return response.data.data
  },

  /**
   * Get user statistics
   */
  async getUserStats(): Promise<UserStats> {
    const response = await axios.get(`${API_BASE_URL}/profile/stats`)
    return response.data.data
  },

  /**
   * Deactivate account
   */
  async deactivateAccount(password: string): Promise<void> {
    await axios.post(`${API_BASE_URL}/profile/deactivate`, { password })
  },

  /**
   * Check PIN status
   */
  async checkPinStatus(): Promise<PinResponse> {
    const response = await axios.get(`${API_BASE_URL}/pin/status`)
    return response.data.data
  },

  /**
   * Create PIN
   */
  async createPin(data: PinCreateInput): Promise<PinResponse> {
    const response = await axios.post(`${API_BASE_URL}/pin/create`, data)
    return response.data.data
  },

  /**
   * Update PIN
   */
  async updatePin(data: PinUpdateInput): Promise<PinResponse> {
    const response = await axios.post(`${API_BASE_URL}/pin/update`, data)
    return response.data.data
  },

  /**
   * Reset PIN
   */
  async resetPin(password: string): Promise<void> {
    await axios.post(`${API_BASE_URL}/pin/reset`, { password })
  },
}