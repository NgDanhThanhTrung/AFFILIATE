import axios from 'axios'
import { UsersResponse, SystemStats, RecentActivity } from '../types/admin.types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export const adminApi = {
  /**
   * Development-only endpoint to setup super admin
   * REMOVE IN PRODUCTION
   */
  async devSetupAdmin(): Promise<{ success: boolean; message: string }> {
    const response = await axios.post(`${API_BASE_URL}/admin/dev-setup`)
    return response.data
  },

  /**
   * Get all users
   */
  async getAllUsers(params?: {
    page?: number
    limit?: number
    role?: string
    isActive?: boolean
    search?: string
  }): Promise<UsersResponse> {
    const response = await axios.get(`${API_BASE_URL}/admin/users`, { params })
    return response.data.data
  },

  /**
   * Get user by ID
   */
  async getUserById(userId: string) {
    const response = await axios.get(`${API_BASE_URL}/admin/users/${userId}`)
    return response.data.data
  },

  /**
   * Update user role
   */
  async updateUserRole(userId: string, role: string) {
    const response = await axios.patch(`${API_BASE_URL}/admin/users/${userId}/role`, { role })
    return response.data.data
  },

  /**
   * Toggle user status
   */
  async toggleUserStatus(userId: string, isActive: boolean) {
    const response = await axios.patch(`${API_BASE_URL}/admin/users/${userId}/status`, { isActive })
    return response.data.data
  },

  /**
   * Reset user password
   */
  async resetUserPassword(userId: string, newPassword: string) {
    await axios.post(`${API_BASE_URL}/admin/users/${userId}/reset-password`, { newPassword })
  },

  /**
   * Get system statistics
   */
  async getSystemStats(): Promise<SystemStats> {
    const response = await axios.get(`${API_BASE_URL}/admin/stats`)
    return response.data.data
  },

  /**
   * Get recent activity
   */
  async getRecentActivity(limit: number = 20): Promise<RecentActivity> {
    const response = await axios.get(`${API_BASE_URL}/admin/activity`, { params: { limit } })
    return response.data.data
  },
}