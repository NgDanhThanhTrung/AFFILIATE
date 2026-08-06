export interface RegisterInput {
  phoneNumber: string
  password: string
  name?: string
  email?: string
}

export interface LoginInput {
  phoneNumber: string
  password: string
}

export interface VerifyPinInput {
  pin: string
}

export interface ChangePasswordInput {
  currentPassword: string
  newPassword: string
}

export interface ChangePinInput {
  currentPin: string
  newPin: string
}

export interface AuthResponse {
  user: {
    id: string
    phoneNumber: string
    name: string | null
    email: string | null
    avatar: string | null
    isPhoneVerified: boolean
    hasPin: boolean
    role: string
  }
  tokens: {
    accessToken: string
    refreshToken: string
  }
}

export interface RefreshTokenInput {
  refreshToken: string
}

export interface JwtPayload {
  userId: string
  phoneNumber: string
  role?: string
  iat?: number
  exp?: number
}
