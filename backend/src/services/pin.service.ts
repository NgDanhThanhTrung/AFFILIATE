import { AppError } from '../middleware/errorHandler.middleware'
import { PinCreateInput, PinUpdateInput, PinResponse } from '../types/profile.types'
import bcrypt from 'bcryptjs'
import prisma from '../config/database'

const SALT_ROUNDS = 10

export class PinService {
  /**
   * Create PIN for user
   */
  async createPin(userId: string, data: PinCreateInput): Promise<PinResponse> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new AppError('Không tìm thấy người dùng', 404)
    }

    // Check if user already has a PIN
    if (user.pinHash) {
      throw new AppError('Bạn đã thiết lập PIN rồi', 400)
    }

    // Validate PIN format (6 digits)
    if (!this.validatePinFormat(data.pin)) {
      throw new AppError('PIN phải là 6 chữ số', 400)
    }

    // Validate PIN match
    if (data.pin !== data.confirmPin) {
      throw new AppError('PIN không khớp', 400)
    }

    // Validate PIN is not common
    if (this.isCommonPin(data.pin)) {
      throw new AppError('PIN không được sử dụng các số đơn giản như 123456', 400)
    }

    // Hash PIN
    const pinHash = await bcrypt.hash(data.pin, SALT_ROUNDS)

    // Update user with PIN
    await prisma.user.update({
      where: { id: userId },
      data: {
        pinHash,
        updatedAt: new Date(),
      },
    })

    return {
      hasPin: true,
      pinSetAt: new Date(),
    }
  }

  /**
   * Update PIN for user
   */
  async updatePin(userId: string, data: PinUpdateInput): Promise<PinResponse> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new AppError('Không tìm thấy người dùng', 404)
    }

    // Check if user has a PIN
    if (!user.pinHash) {
      throw new AppError('Bạn chưa thiết lập PIN', 400)
    }

    // Validate current PIN
    const isCurrentPinValid = await bcrypt.compare(data.currentPin, user.pinHash)
    if (!isCurrentPinValid) {
      throw new AppError('PIN hiện tại không đúng', 401)
    }

    // Validate new PIN format
    if (!this.validatePinFormat(data.newPin)) {
      throw new AppError('PIN mới phải là 6 chữ số', 400)
    }

    // Validate new PIN match
    if (data.newPin !== data.confirmPin) {
      throw new AppError('PIN mới không khớp', 400)
    }

    // Validate new PIN is not same as current
    if (data.currentPin === data.newPin) {
      throw new AppError('PIN mới phải khác PIN hiện tại', 400)
    }

    // Validate new PIN is not common
    if (this.isCommonPin(data.newPin)) {
      throw new AppError('PIN không được sử dụng các số đơn giản như 123456', 400)
    }

    // Hash new PIN
    const newPinHash = await bcrypt.hash(data.newPin, SALT_ROUNDS)

    // Update user with new PIN
    await prisma.user.update({
      where: { id: userId },
      data: {
        pinHash: newPinHash,
        updatedAt: new Date(),
      },
    })

    return {
      hasPin: true,
      pinSetAt: new Date(),
    }
  }

  /**
   * Validate PIN
   */
  async validatePin(userId: string, pin: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { pinHash: true },
    })

    if (!user || !user.pinHash) {
      return false
    }

    return await bcrypt.compare(pin, user.pinHash)
  }

  /**
   * Reset PIN (admin function or with password verification)
   */
  async resetPin(userId: string, password: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new AppError('Không tìm thấy người dùng', 404)
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
    if (!isPasswordValid) {
      throw new AppError('Mật khẩu không đúng', 401)
    }

    // Remove PIN
    await prisma.user.update({
      where: { id: userId },
      data: {
        pinHash: null,
        updatedAt: new Date(),
      },
    })
  }

  /**
   * Check if user has PIN
   */
  async hasPin(userId: string): Promise<PinResponse> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { pinHash: true, updatedAt: true },
    })

    if (!user) {
      throw new AppError('Không tìm thấy người dùng', 404)
    }

    return {
      hasPin: !!user.pinHash,
      pinSetAt: user.pinHash ? user.updatedAt : null,
    }
  }

  /**
   * Validate PIN format (6 digits)
   */
  private validatePinFormat(pin: string): boolean {
    return /^\d{6}$/.test(pin)
  }

  /**
   * Check if PIN is common/simple
   */
  private isCommonPin(pin: string): boolean {
    const commonPins = [
      '123456',
      '111111',
      '000000',
      '222222',
      '333333',
      '444444',
      '555555',
      '666666',
      '777777',
      '888888',
      '999999',
    ]

    return commonPins.includes(pin)
  }
}

export default new PinService()