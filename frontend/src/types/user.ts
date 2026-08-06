export interface UserProfile {
  id: string
  phoneNumber: string
  name: string | null
  email: string | null
  avatar: string | null
  role?: 'USER' | 'ADMIN' | 'SUPER_ADMIN'
  isPhoneVerified: boolean
  hasPin: boolean
  createdAt: string
  lastLoginAt: string | null
}

export interface UpdateProfileData {
  name?: string
  email?: string
  avatar?: string
}

export interface BankAccount {
  id: string
  bankName: string
  bankCode: string
  accountNumber: string
  accountName: string
  isDefault: boolean
}

export interface AddBankAccountData {
  bankName: string
  bankCode: string
  accountNumber: string
  accountName: string
  isDefault?: boolean
}

export interface UpdateBankAccountData {
  bankName?: string
  bankCode?: string
  accountNumber?: string
  accountName?: string
  isDefault?: boolean
}
