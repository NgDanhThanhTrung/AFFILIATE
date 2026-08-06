import { TransactionType, TransactionStatus } from '@prisma/client'
import { AppError } from '../middleware/errorHandler.middleware'
import { TransactionResponse } from '../types/wallet.types'
import prisma from '../config/database'

export class TransactionService {
  /**
   * Get transaction history for user
   */
  async getTransactionHistory(
    userId: string,
    page: number = 1,
    limit: number = 20,
    type?: TransactionType,
    status?: TransactionStatus,
    startDate?: Date,
    endDate?: Date
  ): Promise<{
    transactions: TransactionResponse[]
    total: number
    page: number
    totalPages: number
  }> {
    const skip = (page - 1) * limit

    const where: any = { userId }
    if (type) where.type = type
    if (status) where.status = status
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = startDate
      if (endDate) where.createdAt.lte = endDate
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.transaction.count({ where }),
    ])

    return {
      transactions: transactions.map((t) => ({
        id: t.id,
        userId: t.userId,
        walletId: t.walletId,
        type: t.type,
        amount: Number(t.amount),
        balanceBefore: Number(t.balanceBefore),
        balanceAfter: Number(t.balanceAfter),
        description: t.description,
        referenceId: t.referenceId,
        referenceType: t.referenceType,
        status: t.status,
        metadata: t.metadata,
        createdAt: t.createdAt,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }

  /**
   * Get transaction by ID
   */
  async getTransactionById(transactionId: string, userId: string): Promise<TransactionResponse> {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId,
      },
    })

    if (!transaction) {
      throw new AppError('Không tìm thấy giao dịch', 404)
    }

    return {
      id: transaction.id,
      userId: transaction.userId,
      walletId: transaction.walletId,
      type: transaction.type,
      amount: Number(transaction.amount),
      balanceBefore: Number(transaction.balanceBefore),
      balanceAfter: Number(transaction.balanceAfter),
      description: transaction.description,
      referenceId: transaction.referenceId,
      referenceType: transaction.referenceType,
      status: transaction.status,
      metadata: transaction.metadata,
      createdAt: transaction.createdAt,
    }
  }

  /**
   * Get transactions by reference ID
   */
  async getTransactionsByReference(referenceId: string, userId: string) {
    const transactions = await prisma.transaction.findMany({
      where: {
        referenceId,
        userId,
      },
      orderBy: { createdAt: 'desc' },
    })

    return transactions.map((t) => ({
      id: t.id,
      userId: t.userId,
      walletId: t.walletId,
      type: t.type,
      amount: Number(t.amount),
      balanceBefore: Number(t.balanceBefore),
      balanceAfter: Number(t.balanceAfter),
      description: t.description,
      referenceId: t.referenceId,
      referenceType: t.referenceType,
      status: t.status,
      metadata: t.metadata,
      createdAt: t.createdAt,
    }))
  }

  /**
   * Get transaction statistics
   */
  async getTransactionStats(userId: string, startDate?: Date, endDate?: Date) {
    const where: any = { userId }
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = startDate
      if (endDate) where.createdAt.lte = endDate
    }

    const transactions = await prisma.transaction.findMany({
      where,
      select: {
        type: true,
        amount: true,
        status: true,
        createdAt: true,
      },
    })

    const stats = {
      totalTransactions: transactions.length,
      byType: {
        CASHBACK_IN: 0,
        WITHDRAWAL_OUT: 0,
        REFUND_IN: 0,
        ADJUSTMENT_IN: 0,
        ADJUSTMENT_OUT: 0,
      },
      byStatus: {
        PENDING: 0,
        COMPLETED: 0,
        FAILED: 0,
        CANCELLED: 0,
      },
      totalAmount: 0,
      totalIn: 0,
      totalOut: 0,
    }

    transactions.forEach((t) => {
      const amount = Number(t.amount)
      stats.totalAmount += amount
      stats.byType[t.type] += amount
      stats.byStatus[t.status] += 1

      if (t.type === 'CASHBACK_IN' || t.type === 'REFUND_IN' || t.type === 'ADJUSTMENT_IN') {
        stats.totalIn += amount
      } else {
        stats.totalOut += amount
      }
    })

    return stats
  }

  /**
   * Get recent transactions
   */
  async getRecentTransactions(userId: string, limit: number = 5) {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      take: limit,
      orderBy: { createdAt: 'desc' },
    })

    return transactions.map((t) => ({
      id: t.id,
      userId: t.userId,
      walletId: t.walletId,
      type: t.type,
      amount: Number(t.amount),
      balanceBefore: Number(t.balanceBefore),
      balanceAfter: Number(t.balanceAfter),
      description: t.description,
      referenceId: t.referenceId,
      referenceType: t.referenceType,
      status: t.status,
      metadata: t.metadata,
      createdAt: t.createdAt,
    }))
  }
}

export default new TransactionService()