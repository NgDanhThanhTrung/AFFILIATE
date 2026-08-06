import prisma from '../config/database'
import { hashPassword, hashPin, verifyPassword, verifyPin, validatePinFormat } from '../utils/crypto'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt'
import { AppError } from '../middleware/errorHandler.middleware'
import { RegisterInput, LoginInput, VerifyPinInput, ChangePasswordInput, ChangePinInput, AuthResponse } from '../types/auth.types'
import { logger } from '../config/logger'

export class AuthService {
  async register(data: RegisterInput): Promise<AuthResponse> {
    const { phoneNumber, password, name, email } = data

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { phoneNumber },
    })

    if (existingUser) {
      throw new AppError('Số điện thoại đã được đăng ký', 400)
    }

    if (email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email },
      })

      if (existingEmail) {
        throw new AppError('Email đã được sử dụng', 400)
      }
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user
    const superAdminPhone = process.env.SUPER_ADMIN_PHONE_NUMBER
    const userRole = phoneNumber === superAdminPhone ? 'SUPER_ADMIN' : 'USER'

    const user = await prisma.user.create({
      data: {
        phoneNumber,
        passwordHash,
        name,
        email,
        role: userRole,
        isPhoneVerified: false, // In production, you'd verify phone via OTP
      },
    })

    // Create wallet for user
    await prisma.wallet.create({
      data: {
        userId: user.id,
        balance: 0,
        totalEarned: 0,
        totalWithdrawn: 0,
        currency: 'VND',
      },
    })

    logger.info(`User registered: ${user.phoneNumber}`)

    // Generate tokens
    const tokens = this.generateTokens(user.id, user.phoneNumber, user.role)

    return {
      user: {
        id: user.id,
        phoneNumber: user.phoneNumber,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isPhoneVerified: user.isPhoneVerified,
        hasPin: !!user.pinHash,
        role: user.role,
      },
      tokens,
    }
  }

  async login(data: LoginInput): Promise<AuthResponse> {
    const { phoneNumber, password } = data

    // Find user by phone number
    const user = await prisma.user.findUnique({
      where: { phoneNumber },
    })

    if (!user) {
      throw new AppError('Số điện thoại hoặc mật khẩu không đúng', 401)
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.passwordHash)

    if (!isPasswordValid) {
      throw new AppError('Số điện thoại hoặc mật khẩu không đúng', 401)
    }

    // Check if user is active
    if (!user.isActive) {
      throw new AppError('Tài khoản đã bị khóa', 403)
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })

    logger.info(`User logged in: ${user.phoneNumber}`)

    // Generate tokens
    const tokens = this.generateTokens(user.id, user.phoneNumber, user.role)

    return {
      user: {
        id: user.id,
        phoneNumber: user.phoneNumber,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isPhoneVerified: user.isPhoneVerified,
        hasPin: !!user.pinHash,
        role: user.role,
      },
      tokens,
    }
  }

  async verifyPin(userId: string, data: VerifyPinInput): Promise<boolean> {
    const { pin } = data

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user || !user.pinHash) {
      throw new AppError('Mã PIN chưa được thiết lập', 400)
    }

    // Verify PIN
    const isPinValid = await verifyPin(pin, user.pinHash)

    if (!isPinValid) {
      throw new AppError('Mã PIN không đúng', 401)
    }

    logger.info(`PIN verified for user: ${user.phoneNumber}`)

    return true
  }

  async setupPin(userId: string, pin: string): Promise<void> {
    // Validate PIN format
    if (!validatePinFormat(pin)) {
      throw new AppError('Mã PIN phải là 6 chữ số', 400)
    }

    // Check if PIN already exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new AppError('Người dùng không tồn tại', 404)
    }

    if (user.pinHash) {
      throw new AppError('Mã PIN đã được thiết lập', 400)
    }

    // Hash PIN
    const pinHash = await hashPin(pin)

    // Update user
    await prisma.user.update({
      where: { id: userId },
      data: { pinHash },
    })

    logger.info(`PIN setup for user: ${user.phoneNumber}`)
  }

  async changePassword(userId: string, data: ChangePasswordInput): Promise<void> {
    const { currentPassword, newPassword } = data

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new AppError('Người dùng không tồn tại', 404)
    }

    // Verify current password
    const isPasswordValid = await verifyPassword(currentPassword, user.passwordHash)

    if (!isPasswordValid) {
      throw new AppError('Mật khẩu hiện tại không đúng', 401)
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword)

    // Update user
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
    })

    logger.info(`Password changed for user: ${user.phoneNumber}`)
  }

  async changePin(userId: string, data: ChangePinInput): Promise<void> {
    const { currentPin, newPin } = data

    // Validate new PIN format
    if (!validatePinFormat(newPin)) {
      throw new AppError('Mã PIN mới phải là 6 chữ số', 400)
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user || !user.pinHash) {
      throw new AppError('Mã PIN chưa được thiết lập', 400)
    }

    // Verify current PIN
    const isPinValid = await verifyPin(currentPin, user.pinHash)

    if (!isPinValid) {
      throw new AppError('Mã PIN hiện tại không đúng', 401)
    }

    // Hash new PIN
    const newPinHash = await hashPin(newPin)

    // Update user
    await prisma.user.update({
      where: { id: userId },
      data: { pinHash: newPinHash },
    })

    logger.info(`PIN changed for user: ${user.phoneNumber}`)
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      // Verify refresh token
      const payload = verifyRefreshToken(refreshToken)

      // Check if user still exists and is active
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
      })

      if (!user || !user.isActive) {
        throw new AppError('Token không hợp lệ', 401)
      }

      // Generate new tokens
      const tokens = this.generateTokens(user.id, user.phoneNumber, user.role)

      logger.info(`Token refreshed for user: ${user.phoneNumber}`)

      return tokens
    } catch (error) {
      throw new AppError('Refresh token không hợp lệ hoặc đã hết hạn', 401)
    }
  }

  private generateTokens(userId: string, phoneNumber: string, role?: string) {
    const accessToken = generateAccessToken({ userId, phoneNumber, role })
    const refreshToken = generateRefreshToken({ userId, phoneNumber, role })

    return { accessToken, refreshToken }
  }
}

export default new AuthService()
