import { TransactionType, TransactionStatus, WithdrawalStatus } from '@prisma/client'

export interface WalletResponse {
  id: string
  userId: string
  balance: number
  totalEarned: number
  totalWithdrawn: number
  currency: string
  createdAt: Date
  updatedAt: Date
}

export interface TransactionInput {
  type: TransactionType
  amount: number
  description?: string
  referenceId?: string
  referenceType?: string
  metadata?: any
}

export interface TransactionResponse {
  id: string
  userId: string
  walletId: string
  type: TransactionType
  amount: number
  balanceBefore: number
  balanceAfter: number
  description: string | null
  referenceId: string | null
  referenceType: string | null
  status: TransactionStatus
  metadata: any
  createdAt: Date
}

export interface WithdrawalInput {
  bankAccountId: string
  amount: number
  pin: string
}

export interface WithdrawalResponse {
  id: string
  userId: string
  bankAccountId: string
  amount: number
  fee: number
  netAmount: number
  status: WithdrawalStatus
  pinVerified: boolean
  verifiedAt: Date | null
  processedAt: Date | null
  rejectionReason: string | null
  transactionId: string | null
  metadata: any
  createdAt: Date
  updatedAt: Date
}

export interface BankAccountInput {
  bankName: string
  bankCode: string
  accountNumber: string
  accountName: string
  isDefault?: boolean
}

export interface BankAccountResponse {
  id: string
  userId: string
  bankName: string
  bankCode: string
  accountNumber: string
  accountName: string
  isDefault: boolean
  createdAt: Date
  updatedAt: Date
}