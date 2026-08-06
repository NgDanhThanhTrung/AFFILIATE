import { Platform, OrderStatus } from '@prisma/client'
import { AppError } from '../middleware/errorHandler.middleware'
import { OrderInput, OrderResponse, OrderStats } from '../types/order.types'
import walletService from './wallet.service'
import config from '../config'
import prisma from '../config/database'

// Commission rates from config
const COMMISSION_RATES = {
  SHOPEE: config.affiliate.shopeeCommissionRate / 100, // Convert percentage to decimal
  TIKTOK: config.affiliate.tiktokCommissionRate / 100,
}

// Cashback rate (percentage of commission that goes to user)
const CASHBACK_RATE = 0.8 // 80% of commission goes to user

export class OrderService {
  /**
   * Calculate commission and cashback amounts
   */
  private calculateAmounts(orderAmount: number, platform: Platform) {
    const commissionRate = COMMISSION_RATES[platform]
    const commissionAmount = orderAmount * commissionRate
    const cashbackAmount = commissionAmount * CASHBACK_RATE

    return {
      commissionRate,
      commissionAmount,
      cashbackAmount,
    }
  }

  /**
   * Create order from webhook or manual entry
   */
  async createOrder(
    userId: string,
    platformOrderId: string,
    platform: Platform,
    orderAmount: number,
    subId?: string,
    metadata?: any
  ): Promise<OrderResponse> {
    // Check if order already exists
    const existingOrder = await prisma.order.findUnique({
      where: { platformOrderId },
    })

    if (existingOrder) {
      throw new AppError('Đơn hàng đã tồn tại', 400)
    }

    // Find affiliate link by subId if provided
    let affiliateLinkId: string | null = null
    if (subId) {
      const affiliateLink = await prisma.affiliateLink.findUnique({
        where: { subId },
      })

      if (affiliateLink) {
        affiliateLinkId = affiliateLink.id
      }
    }

    // Calculate amounts
    const { commissionRate, commissionAmount, cashbackAmount } =
      this.calculateAmounts(orderAmount, platform)

    // Create order
    const order = await prisma.order.create({
      data: {
        userId,
        affiliateLinkId,
        platformOrderId,
        platform,
        subId,
        orderAmount,
        commissionRate,
        commissionAmount,
        cashbackAmount,
        status: OrderStatus.PENDING,
        orderDate: new Date(),
        metadata,
      },
    })

    return {
      id: order.id,
      userId: order.userId,
      affiliateLinkId: order.affiliateLinkId,
      platformOrderId: order.platformOrderId,
      platform: order.platform,
      subId: order.subId,
      orderAmount: Number(order.orderAmount),
      commissionRate: Number(order.commissionRate),
      commissionAmount: Number(order.commissionAmount),
      cashbackAmount: Number(order.cashbackAmount),
      status: order.status,
      orderDate: order.orderDate,
      shippedDate: order.shippedDate,
      completedDate: order.completedDate,
      cancelledDate: order.cancelledDate,
      metadata: order.metadata,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }
  }

  /**
   * Update order status
   */
  async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    metadata?: any
  ): Promise<OrderResponse> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    })

    if (!order) {
      throw new AppError('Không tìm thấy đơn hàng', 404)
    }

    const updateData: any = { status }

    // Update date fields based on status
    switch (status) {
      case OrderStatus.CONFIRMED:
        break
      case OrderStatus.SHIPPED:
        updateData.shippedDate = new Date()
        break
      case OrderStatus.COMPLETED:
        updateData.completedDate = new Date()
        break
      case OrderStatus.CANCELLED:
        updateData.cancelledDate = new Date()
        break
      case OrderStatus.FAILED:
        updateData.cancelledDate = new Date()
        break
    }

    if (metadata) {
      updateData.metadata = metadata
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
    })

    // If order is completed, process cashback
    if (status === OrderStatus.COMPLETED && order.status !== OrderStatus.COMPLETED) {
      await this.processCashback(updated.id, updated.userId, Number(updated.cashbackAmount))
    }

    // Update affiliate link conversion count if applicable
    if (order.affiliateLinkId && status === OrderStatus.COMPLETED) {
      await prisma.affiliateLink.update({
        where: { id: order.affiliateLinkId },
        data: {
          conversionCount: { increment: 1 },
          totalRevenue: { increment: Number(updated.commissionAmount) },
        },
      })
    }

    return {
      id: updated.id,
      userId: updated.userId,
      affiliateLinkId: updated.affiliateLinkId,
      platformOrderId: updated.platformOrderId,
      platform: updated.platform,
      subId: updated.subId,
      orderAmount: Number(updated.orderAmount),
      commissionRate: Number(updated.commissionRate),
      commissionAmount: Number(updated.commissionAmount),
      cashbackAmount: Number(updated.cashbackAmount),
      status: updated.status,
      orderDate: updated.orderDate,
      shippedDate: updated.shippedDate,
      completedDate: updated.completedDate,
      cancelledDate: updated.cancelledDate,
      metadata: updated.metadata,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    }
  }

  /**
   * Process cashback for completed order
   */
  private async processCashback(orderId: string, userId: string, cashbackAmount: number) {
    try {
      await walletService.addFunds(
        userId,
        cashbackAmount,
        'CASHBACK_IN',
        `Hoàn tiền từ đơn hàng #${orderId}`,
        orderId,
        'ORDER'
      )
    } catch (error) {
      console.error('Failed to process cashback:', error)
      // Log error but don't fail the order update
    }
  }

  /**
   * Get order by ID
   */
  async getOrderById(orderId: string, userId?: string): Promise<OrderResponse> {
    const where: any = { id: orderId }
    if (userId) where.userId = userId

    const order = await prisma.order.findFirst({
      where,
    })

    if (!order) {
      throw new AppError('Không tìm thấy đơn hàng', 404)
    }

    return {
      id: order.id,
      userId: order.userId,
      affiliateLinkId: order.affiliateLinkId,
      platformOrderId: order.platformOrderId,
      platform: order.platform,
      subId: order.subId,
      orderAmount: Number(order.orderAmount),
      commissionRate: Number(order.commissionRate),
      commissionAmount: Number(order.commissionAmount),
      cashbackAmount: Number(order.cashbackAmount),
      status: order.status,
      orderDate: order.orderDate,
      shippedDate: order.shippedDate,
      completedDate: order.completedDate,
      cancelledDate: order.cancelledDate,
      metadata: order.metadata,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }
  }

  /**
   * Get order by platform order ID
   */
  async getOrderByPlatformOrderId(platformOrderId: string) {
    return await prisma.order.findUnique({
      where: { platformOrderId },
    })
  }

  /**
   * Get orders for user
   */
  async getUserOrders(
    userId: string,
    page: number = 1,
    limit: number = 20,
    status?: OrderStatus,
    platform?: Platform,
    startDate?: Date,
    endDate?: Date
  ): Promise<{
    orders: OrderResponse[]
    total: number
    page: number
    totalPages: number
  }> {
    const skip = (page - 1) * limit

    const where: any = { userId }
    if (status) where.status = status
    if (platform) where.platform = platform
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = startDate
      if (endDate) where.createdAt.lte = endDate
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where }),
    ])

    return {
      orders: orders.map((o) => ({
        id: o.id,
        userId: o.userId,
        affiliateLinkId: o.affiliateLinkId,
        platformOrderId: o.platformOrderId,
        platform: o.platform,
        subId: o.subId,
        orderAmount: Number(o.orderAmount),
        commissionRate: Number(o.commissionRate),
        commissionAmount: Number(o.commissionAmount),
        cashbackAmount: Number(o.cashbackAmount),
        status: o.status,
        orderDate: o.orderDate,
        shippedDate: o.shippedDate,
        completedDate: o.completedDate,
        cancelledDate: o.cancelledDate,
        metadata: o.metadata,
        createdAt: o.createdAt,
        updatedAt: o.updatedAt,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }

  /**
   * Get order statistics
   */
  async getOrderStats(userId?: string, startDate?: Date, endDate?: Date): Promise<OrderStats> {
    const where: any = {}
    if (userId) where.userId = userId
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = startDate
      if (endDate) where.createdAt.lte = endDate
    }

    const orders = await prisma.order.findMany({
      where,
      select: {
        status: true,
        platform: true,
        orderAmount: true,
        commissionAmount: true,
        cashbackAmount: true,
      },
    })

    const stats = {
      totalOrders: orders.length,
      pendingOrders: 0,
      confirmedOrders: 0,
      shippedOrders: 0,
      completedOrders: 0,
      cancelledOrders: 0,
      failedOrders: 0,
      totalOrderAmount: 0,
      totalCommission: 0,
      totalCashback: 0,
      byPlatform: {
        SHOPEE: 0,
        TIKTOK: 0,
      },
    }

    orders.forEach((order) => {
      const orderAmount = Number(order.orderAmount)
      const commissionAmount = Number(order.commissionAmount)
      const cashbackAmount = Number(order.cashbackAmount)

      stats.totalOrderAmount += orderAmount
      stats.totalCommission += commissionAmount
      stats.totalCashback += cashbackAmount
      stats.byPlatform[order.platform] += 1

      switch (order.status) {
        case OrderStatus.PENDING:
          stats.pendingOrders += 1
          break
        case OrderStatus.CONFIRMED:
          stats.confirmedOrders += 1
          break
        case OrderStatus.SHIPPED:
          stats.shippedOrders += 1
          break
        case OrderStatus.COMPLETED:
          stats.completedOrders += 1
          break
        case OrderStatus.CANCELLED:
          stats.cancelledOrders += 1
          break
        case OrderStatus.FAILED:
          stats.failedOrders += 1
          break
      }
    })

    return stats
  }

  /**
   * Reconcile orders (find orders that should be cashed back but aren't)
   */
  async reconcileOrders() {
    // Find completed orders that haven't been cashed back
    const completedOrders = await prisma.order.findMany({
      where: {
        status: OrderStatus.COMPLETED,
      },
      include: {
        user: true,
      },
    })

    const reconciled = []

    for (const order of completedOrders) {
      // Check if cashback transaction exists
      const cashbackTransaction = await prisma.transaction.findFirst({
        where: {
          referenceId: order.id,
          referenceType: 'ORDER',
          type: 'CASHBACK_IN',
        },
      })

      if (!cashbackTransaction) {
        // Process missing cashback
        await this.processCashback(order.id, order.userId, Number(order.cashbackAmount))
        reconciled.push(order.id)
      }
    }

    return {
      totalChecked: completedOrders.length,
      reconciled: reconciled.length,
      orderIds: reconciled,
    }
  }
}

export default new OrderService()