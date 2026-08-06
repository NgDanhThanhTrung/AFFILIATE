export interface ProfileUpdateInput {
  name?: string
  email?: string
  avatar?: string
}

export interface ProfileResponse {
  id: string
  phoneNumber: string
  name: string | null
  email: string | null
  avatar: string | null
  isPhoneVerified: boolean
  isActive: boolean
  lastLoginAt: Date | null
  createdAt: Date
  updatedAt: Date
  hasPin: boolean
}

export interface PinCreateInput {
  pin: string
  confirmPin: string
}

export interface PinUpdateInput {
  currentPin: string
  newPin: string
  confirmPin: string
}

export interface PinResponse {
  hasPin: boolean
  pinSetAt: Date | null
}