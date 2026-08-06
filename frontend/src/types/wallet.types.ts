export interface WalletResponse {
  id: string
  userId: string
  balance: number
  totalEarned: number
  totalWithdrawn: number
  currency: string
  createdAt: string
  updatedAt: string
}

export interface TransactionResponse {
  id: string
  userId: string
  walletId: string
  type: 'CASHBACK_IN' | 'WITHDRAWAL_OUT' | 'REFUND_IN' | 'ADJUSTMENT_IN' | 'ADJUSTMENT_OUT'
  amount: number
  balanceBefore: number
  balanceAfter: number
  description: string | null
  referenceId: string | null
  referenceType: string | null
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
  metadata: any
  createdAt: string
}

export interface TransactionHistoryResponse {
  transactions: TransactionResponse[]
  total: number
  page: number
  totalPages: number
}

export interface BankAccountResponse {
  id: string
  userId: string
  bankName: string
  bankCode: string
  accountNumber: string
  accountName: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface WithdrawalResponse {
  id: string
  userId: string
  bankAccountId: string
  amount: number
  fee: number
  netAmount: number
  status: 'PENDING' | 'APPROVED' | 'PROCESSING' | 'COMPLETED' | 'REJECTED' | 'FAILED'
  pinVerified: boolean
  verifiedAt: string | null
  processedAt: string | null
  rejectionReason: string | null
  transactionId: string | null
  metadata: any
  createdAt: string
  updatedAt: string
}

export interface WithdrawalHistoryResponse {
  withdrawals: WithdrawalResponse[]
  total: number
  page: number
  totalPages: number
}

export interface BankAccountInput {
  bankName: string
  bankCode: string
  accountNumber: string
  accountName: string
  isDefault?: boolean
}

export interface WithdrawalInput {
  bankAccountId: string
  amount: number
  pin: string
}