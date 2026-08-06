import { apiClient } from './client'
import {
  UserProfile,
  UpdateProfileData,
  BankAccount,
  AddBankAccountData,
  UpdateBankAccountData,
} from '../../types/user'

export const userApi = {
  async getProfile(): Promise<UserProfile> {
    const response = await apiClient.getAxiosInstance().get<UserProfile>('/user/profile')
    return response.data.data
  },

  async updateProfile(data: UpdateProfileData): Promise<UserProfile> {
    const response = await apiClient.getAxiosInstance().put<UserProfile>('/user/profile', data)
    return response.data.data
  },

  async getBankAccounts(): Promise<BankAccount[]> {
    const response = await apiClient.getAxiosInstance().get<BankAccount[]>('/user/bank-accounts')
    return response.data.data
  },

  async addBankAccount(data: AddBankAccountData): Promise<BankAccount> {
    const response = await apiClient.getAxiosInstance().post<BankAccount>('/user/bank-accounts', data)
    return response.data.data
  },

  async updateBankAccount(id: string, data: UpdateBankAccountData): Promise<BankAccount> {
    const response = await apiClient.getAxiosInstance().put<BankAccount>(`/user/bank-accounts/${id}`, data)
    return response.data.data
  },

  async deleteBankAccount(id: string): Promise<void> {
    await apiClient.getAxiosInstance().delete(`/user/bank-accounts/${id}`)
  },

  async setDefaultBankAccount(id: string): Promise<void> {
    await apiClient.getAxiosInstance().put(`/user/bank-accounts/${id}/default`)
  },
}
