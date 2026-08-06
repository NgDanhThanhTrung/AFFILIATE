import { AppError } from '../middleware/errorHandler.middleware'
import { ProfileUpdateInput, ProfileResponse } from '../types/profile.types'
import prisma from '../config/database'

export class ProfileService {
  /**
   * Get user profile
   */
  async getProfile(userId: string): Promise<ProfileResponse> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        phoneNumber: true,
        name: true,
        email: true,
        avatar: true,
        isPhoneVerified: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        pinHash: true,
      },
    })

    if (!user) {
      throw new AppError('Không tìm thấy người dùng', 404)
    }

    return {
      id: user.id,
      phoneNumber: user.phoneNumber,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      isPhoneVerified: user.isPhoneVerified,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      hasPin: !!user.pinHash,
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, data: ProfileUpdateInput): Promise<ProfileResponse> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new AppError('Không tìm thấy người dùng', 404)
    }

    // Check if email is already taken by another user
    if (data.email && data.email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      })

      if (existingUser) {
        throw new AppError('Email đã được sử dụng', 400)
      }
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    })

    return {
      id: updated.id,
      phoneNumber: updated.phoneNumber,
      name: updated.name,
      email: updated.email,
      avatar: updated.avatar,
      isPhoneVerified: updated.isPhoneVerified,
      isActive: updated.isActive,
      lastLoginAt: updated.lastLoginAt,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
      hasPin: !!updated.pinHash,
    }
  }

  /**
   * Deactivate account
   */
  async deactivateAccount(userId: string, password: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new AppError('Không tìm thấy người dùng', 404)
    }

    // Verify password
    const bcrypt = require('bcryptjs')
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)

    if (!isPasswordValid) {
      throw new AppError('Mật khẩu không đúng', 401)
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        isActive: false,
        updatedAt: new Date(),
      },
    })
  }

  /**
   * Update last login
   */
  async updateLastLogin(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        lastLoginAt: new Date(),
      },
    })
  }

  /**
   * Get user statistics
   */
  async getUserStats(userId: string) {
    const [wallet, orders, links] = await Promise.all([
      prisma.wallet.findUnique({
        where: { userId },
        select: {
          balance: true,
          totalEarned: true,
          totalWithdrawn: true,
        },
      }),
      prisma.order.findMany({
        where: { userId },
        select: {
          status: true,
          orderAmount: true,
          cashbackAmount: true,
        },
      }),
      prisma.affiliateLink.findMany({
        where: { userId },
        select: {
          clickCount: true,
          conversionCount: true,
          totalRevenue: true,
        },
      }),
    ])

    const orderStats = {
      total: orders.length,
      completed: orders.filter((o) => o.status === 'COMPLETED').length,
      pending: orders.filter((o) => o.status === 'PENDING').length,
      totalAmount: orders.reduce((sum, o) => sum + Number(o.orderAmount), 0),
      totalCashback: orders.reduce((sum, o) => sum + Number(o.cashbackAmount), 0),
    }

    const linkStats = {
      total: links.length,
      totalClicks: links.reduce((sum, l) => sum + l.clickCount, 0),
      totalConversions: links.reduce((sum, l) => sum + l.conversionCount, 0),
      totalRevenue: links.reduce((sum, l) => sum + Number(l.totalRevenue), 0),
    }

    return {
      wallet: wallet ? {
        balance: Number(wallet.balance),
        totalEarned: Number(wallet.totalEarned),
        totalWithdrawn: Number(wallet.totalWithdrawn),
      } : null,
      orders: orderStats,
      links: linkStats,
    }
  }
}

export default new ProfileService()