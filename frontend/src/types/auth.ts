export interface User {
  id: string
  phoneNumber: string
  name: string | null
  email: string | null
  avatar: string | null
  role?: 'USER' | 'ADMIN' | 'SUPER_ADMIN'
  isPhoneVerified: boolean
  hasPin: boolean
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthResponse {
  user: User
  tokens: AuthTokens
}

export interface LoginCredentials {
  phoneNumber: string
  password: string
}

export interface RegisterCredentials {
  phoneNumber: string
  password: string
  name?: string
  email?: string
}

export interface PinCredentials {
  pin: string
}

export interface ChangePasswordCredentials {
  currentPassword: string
  newPassword: string
}

export interface ChangePinCredentials {
  currentPin: string
  newPin: string
}
