import { UserRole } from '@prisma/client'
import { AppError } from '../middleware/errorHandler.middleware'
import bcrypt from 'bcryptjs'
import prisma from '../config/database'

export class AdminService {
  /**
   * Get all users with pagination
   */
  async getAllUsers(
    page: number = 1,
    limit: number = 20,
    role?: UserRole,
    isActive?: boolean,
    search?: string
  ) {
    const skip = (page - 1) * limit

    const where: any = {}
    if (role) where.role = role
    if (isActive !== undefined) where.isActive = isActive
    if (search) {
      where.OR = [
        { phoneNumber: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          phoneNumber: true,
          name: true,
          email: true,
          avatar: true,
          role: true,
          isPhoneVerified: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
          pinHash: true,
          wallet: {
            select: {
              balance: true,
              totalEarned: true,
              totalWithdrawn: true,
            },
          },
          _count: {
            select: {
              orders: true,
              affiliateLinks: true,
              withdrawalRequests: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ])

    return {
      users: users.map((user) => ({
        ...user,
        hasPin: !!user.pinHash,
        wallet: user.wallet ? {
          balance: Number(user.wallet.balance),
          totalEarned: Number(user.wallet.totalEarned),
          totalWithdrawn: Number(user.wallet.totalWithdrawn),
        } : null,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        phoneNumber: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        isPhoneVerified: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        pinHash: true,
        wallet: {
          select: {
            balance: true,
            totalEarned: true,
            totalWithdrawn: true,
          },
        },
        _count: {
          select: {
            orders: true,
            affiliateLinks: true,
            withdrawalRequests: true,
          },
        },
      },
    })

    if (!user) {
      throw new AppError('Không tìm thấy người dùng', 404)
    }

    return {
      ...user,
      hasPin: !!user.pinHash,
      wallet: user.wallet ? {
        balance: Number(user.wallet.balance),
        totalEarned: Number(user.wallet.totalEarned),
        totalWithdrawn: Number(user.wallet.totalWithdrawn),
      } : null,
    }
  }

  /**
   * Update user role
   */
  async updateUserRole(userId: string, role: UserRole) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new AppError('Không tìm thấy người dùng', 404)
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role },
    })

    return updated
  }

  /**
   * Activate/deactivate user
   */
  async toggleUserStatus(userId: string, isActive: boolean) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new AppError('Không tìm thấy người dùng', 404)
    }

    // Prevent deactivating super admin
    if (user.role === 'SUPER_ADMIN' && !isActive) {
      throw new AppError('Không thể vô hiệu hóa Super Admin', 403)
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { isActive },
    })

    return updated
  }

  /**
   * Reset user password
   */
  async resetUserPassword(userId: string, newPassword: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new AppError('Không tìm thấy người dùng', 404)
    }

    const passwordHash = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    })
  }

  /**
   * Get system statistics
   */
  async getSystemStats() {
    const [
      totalUsers,
      activeUsers,
      totalOrders,
      totalWithdrawals,
      totalRevenue,
      webhooksProcessed,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.withdrawalRequest.count(),
      prisma.transaction.aggregate({
        _sum: { amount: true },
        where: { type: 'CASHBACK_IN', status: 'COMPLETED' },
      }),
      prisma.webhookLog.count({ where: { processed: true } }),
    ])

    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: true,
    })

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
        inactive: totalUsers - activeUsers,
        byRole: usersByRole.reduce((acc, item) => {
          acc[item.role] = item._count
          return acc
        }, {} as Record<string, number>),
      },
      orders: {
        total: totalOrders,
      },
      withdrawals: {
        total: totalWithdrawals,
      },
      revenue: {
        total: Number(totalRevenue._sum.amount || 0),
      },
      webhooks: {
        processed: webhooksProcessed,
      },
    }
  }

  /**
   * Get recent activity
   */
  async getRecentActivity(limit: number = 20) {
    const [recentUsers, recentOrders, recentWithdrawals] = await Promise.all([
      prisma.user.findMany({
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          phoneNumber: true,
          name: true,
          createdAt: true,
        },
      }),
      prisma.order.findMany({
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          platformOrderId: true,
          platform: true,
          status: true,
          orderAmount: true,
          createdAt: true,
          user: {
            select: {
              phoneNumber: true,
              name: true,
            },
          },
        },
      }),
      prisma.withdrawalRequest.findMany({
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          amount: true,
          status: true,
          createdAt: true,
          user: {
            select: {
              phoneNumber: true,
              name: true,
            },
          },
        },
      }),
    ])

    return {
      users: recentUsers,
      orders: recentOrders,
      withdrawals: recentWithdrawals,
    }
  }
}

export default new AdminService()