import axios from 'axios'
import {
  WalletResponse,
  TransactionHistoryResponse,
  BankAccountResponse,
  BankAccountInput,
  WithdrawalInput,
  WithdrawalHistoryResponse,
} from '../types/wallet.types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export const walletApi = {
  /**
   * Get wallet details
   */
  async getWallet(): Promise<WalletResponse> {
    const response = await axios.get(`${API_BASE_URL}/wallet`)
    return response.data.data
  },

  /**
   * Get balance
   */
  async getBalance(): Promise<{ balance: number }> {
    const response = await axios.get(`${API_BASE_URL}/wallet/balance`)
    return response.data.data
  },

  /**
   * Get wallet statistics
   */
  async getWalletStats(): Promise<any> {
    const response = await axios.get(`${API_BASE_URL}/wallet/stats`)
    return response.data.data
  },

  /**
   * Get transaction history
   */
  async getTransactionHistory(params?: {
    page?: number
    limit?: number
    type?: string
    status?: string
    startDate?: string
    endDate?: string
  }): Promise<TransactionHistoryResponse> {
    const response = await axios.get(`${API_BASE_URL}/transactions/history`, { params })
    return response.data.data
  },

  /**
   * Get transaction by ID
   */
  async getTransactionById(transactionId: string) {
    const response = await axios.get(`${API_BASE_URL}/transactions/${transactionId}`)
    return response.data.data
  },

  /**
   * Get transaction statistics
   */
  async getTransactionStats(params?: {
    startDate?: string
    endDate?: string
  }): Promise<any> {
    const response = await axios.get(`${API_BASE_URL}/transactions/stats/summary`, { params })
    return response.data.data
  },

  /**
   * Get recent transactions
   */
  async getRecentTransactions(limit: number = 5) {
    const response = await axios.get(`${API_BASE_URL}/transactions/recent/list`, {
      params: { limit },
    })
    return response.data.data
  },

  /**
   * Create bank account
   */
  async createBankAccount(data: BankAccountInput): Promise<BankAccountResponse> {
    const response = await axios.post(`${API_BASE_URL}/withdrawal/bank-accounts`, data)
    return response.data.data
  },

  /**
   * Get bank accounts
   */
  async getBankAccounts(): Promise<BankAccountResponse[]> {
    const response = await axios.get(`${API_BASE_URL}/withdrawal/bank-accounts`)
    return response.data.data
  },

  /**
   * Get bank account by ID
   */
  async getBankAccountById(accountId: string): Promise<BankAccountResponse> {
    const response = await axios.get(`${API_BASE_URL}/withdrawal/bank-accounts/${accountId}`)
    return response.data.data
  },

  /**
   * Update bank account
   */
  async updateBankAccount(accountId: string, data: Partial<BankAccountInput>): Promise<BankAccountResponse> {
    const response = await axios.patch(`${API_BASE_URL}/withdrawal/bank-accounts/${accountId}`, data)
    return response.data.data
  },

  /**
   * Delete bank account
   */
  async deleteBankAccount(accountId: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/withdrawal/bank-accounts/${accountId}`)
  },

  /**
   * Create withdrawal request
   */
  async createWithdrawalRequest(data: WithdrawalInput): Promise<WithdrawalResponse> {
    const response = await axios.post(`${API_BASE_URL}/withdrawal/requests`, data)
    return response.data.data
  },

  /**
   * Get withdrawal requests
   */
  async getWithdrawalRequests(params?: {
    page?: number
    limit?: number
    status?: string
  }): Promise<WithdrawalHistoryResponse> {
    const response = await axios.get(`${API_BASE_URL}/withdrawal/requests`, { params })
    return response.data.data
  },

  /**
   * Cancel withdrawal request
   */
  async cancelWithdrawalRequest(withdrawalId: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/withdrawal/requests/${withdrawalId}`)
  },

  /**
   * Get withdrawal statistics
   */
  async getWithdrawalStats(): Promise<any> {
    const response = await axios.get(`${API_BASE_URL}/withdrawal/stats`)
    return response.data.data
  },
}