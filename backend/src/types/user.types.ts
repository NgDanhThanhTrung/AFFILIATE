export interface UpdateProfileInput {
  name?: string
  email?: string
  avatar?: string
}

export interface UserProfile {
  id: string
  phoneNumber: string
  name: string | null
  email: string | null
  avatar: string | null
  isPhoneVerified: boolean
  hasPin: boolean
  createdAt: string
  lastLoginAt: string | null
}

export interface BankAccountInput {
  bankName: string
  bankCode: string
  accountNumber: string
  accountName: string
  isDefault?: boolean
}

export interface BankAccount {
  id: string
  bankName: string
  bankCode: string
  accountNumber: string
  accountName: string
  isDefault: boolean
}
