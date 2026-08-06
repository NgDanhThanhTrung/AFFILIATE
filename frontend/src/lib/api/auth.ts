import { apiClient } from './client'
import {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  PinCredentials,
  ChangePasswordCredentials,
  ChangePinCredentials,
  ApiResponse,
} from '../../types/auth'

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.getAxiosInstance().post<ApiResponse<AuthResponse>>('/auth/login', credentials)
    const { user, tokens } = response.data.data

    // Store tokens
    apiClient.setAuthTokens(tokens.accessToken, tokens.refreshToken)

    return response.data.data
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await apiClient.getAxiosInstance().post<ApiResponse<AuthResponse>>('/auth/register', credentials)
    const { user, tokens } = response.data.data

    // Store tokens
    apiClient.setAuthTokens(tokens.accessToken, tokens.refreshToken)

    return response.data.data
  },

  async logout(): Promise<void> {
    await apiClient.getAxiosInstance().post('/auth/logout')
    apiClient.clearAuthTokens()
  },

  async verifyPin(credentials: PinCredentials): Promise<{ verified: boolean }> {
    const response = await apiClient.getAxiosInstance().post<ApiResponse<{ verified: boolean }>>('/auth/verify-pin', credentials)
    return response.data.data
  },

  async setupPin(pin: string): Promise<void> {
    await apiClient.getAxiosInstance().post('/auth/setup-pin', { pin })
  },

  async changePassword(credentials: ChangePasswordCredentials): Promise<void> {
    await apiClient.getAxiosInstance().post('/auth/change-password', credentials)
  },

  async changePin(credentials: ChangePinCredentials): Promise<void> {
    await apiClient.getAxiosInstance().post('/auth/change-pin', credentials)
  },

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const response = await apiClient.getAxiosInstance().post<ApiResponse<{ accessToken: string; refreshToken: string }>>('/auth/refresh-token', { refreshToken })
    return response.data.data
  },
}
