import { TransactionType } from '@prisma/client'
import { AppError } from '../middleware/errorHandler.middleware'
import { WalletResponse, TransactionInput } from '../types/wallet.types'
import prisma from '../config/database'

export class WalletService {
  /**
   * Get or create wallet for user
   */
  async getOrCreateWallet(userId: string): Promise<WalletResponse> {
    let wallet = await prisma.wallet.findUnique({
      where: { userId },
    })

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: { userId },
      })
    }

    return {
      id: wallet.id,
      userId: wallet.userId,
      balance: Number(wallet.balance),
      totalEarned: Number(wallet.totalEarned),
      totalWithdrawn: Number(wallet.totalWithdrawn),
      currency: wallet.currency,
      createdAt: wallet.createdAt,
      updatedAt: wallet.updatedAt,
    }
  }

  /**
   * Get wallet balance
   */
  async getBalance(userId: string): Promise<number> {
    const wallet = await this.getOrCreateWallet(userId)
    return wallet.balance
  }

  /**
   * Check if user has sufficient balance
   */
  async hasSufficientBalance(userId: string, amount: number): Promise<boolean> {
    const balance = await this.getBalance(userId)
    return balance >= amount
  }

  /**
   * Add funds to wallet (cashback, refunds, adjustments)
   */
  async addFunds(
    userId: string,
    amount: number,
    type: TransactionType,
    description?: string,
    referenceId?: string,
    referenceType?: string,
    metadata?: any
  ): Promise<void> {
    if (amount <= 0) {
      throw new AppError('Số tiền phải lớn hơn 0', 400)
    }

    const wallet = await this.getOrCreateWallet(userId)
    const balanceBefore = wallet.balance
    const balanceAfter = balanceBefore + amount

    await prisma.$transaction(async (tx) => {
      // Update wallet balance
      await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: balanceAfter,
          totalEarned: { increment: amount },
        },
      })

      // Create transaction record
      await tx.transaction.create({
        data: {
          userId,
          walletId: wallet.id,
          type,
          amount,
          balanceBefore,
          balanceAfter,
          description,
          referenceId,
          referenceType,
          metadata,
        },
      })
    })
  }

  /**
   * Deduct funds from wallet (withdrawals, adjustments)
   */
  async deductFunds(
    userId: string,
    amount: number,
    type: TransactionType,
    description?: string,
    referenceId?: string,
    referenceType?: string,
    metadata?: any
  ): Promise<void> {
    if (amount <= 0) {
      throw new AppError('Số tiền phải lớn hơn 0', 400)
    }

    const wallet = await this.getOrCreateWallet(userId)

    if (wallet.balance < amount) {
      throw new AppError('Số dư không đủ', 400)
    }

    const balanceBefore = wallet.balance
    const balanceAfter = balanceBefore - amount

    await prisma.$transaction(async (tx) => {
      // Update wallet balance
      await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: balanceAfter,
          // Only increment totalWithdrawn for withdrawal transactions
          ...(type === 'WITHDRAWAL_OUT' ? { totalWithdrawn: { increment: amount } } : {}),
        },
      })

      // Create transaction record
      await tx.transaction.create({
        data: {
          userId,
          walletId: wallet.id,
          type,
          amount,
          balanceBefore,
          balanceAfter,
          description,
          referenceId,
          referenceType,
          metadata,
        },
      })
    })
  }

  /**
   * Lock funds for withdrawal (create pending transaction)
   */
  async lockFunds(
    userId: string,
    amount: number,
    referenceId: string,
    referenceType: string = 'WITHDRAWAL'
  ): Promise<void> {
    const wallet = await this.getOrCreateWallet(userId)

    if (wallet.balance < amount) {
      throw new AppError('Số dư không đủ', 400)
    }

    const balanceBefore = wallet.balance
    const balanceAfter = balanceBefore - amount

    await prisma.$transaction(async (tx) => {
      // Update wallet balance
      await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: balanceAfter,
          totalWithdrawn: { increment: amount },
        },
      })

      // Create pending transaction
      await tx.transaction.create({
        data: {
          userId,
          walletId: wallet.id,
          type: 'WITHDRAWAL_OUT',
          amount,
          balanceBefore,
          balanceAfter,
          description: 'Yêu cầu rút tiền đang xử lý',
          referenceId,
          referenceType,
          status: 'PENDING',
        },
      })
    })
  }

  /**
   * Release locked funds (if withdrawal fails)
   */
  async releaseFunds(
    userId: string,
    amount: number,
    referenceId: string,
    reason: string
  ): Promise<void> {
    const wallet = await this.getOrCreateWallet(userId)
    const balanceBefore = wallet.balance
    const balanceAfter = balanceBefore + amount

    await prisma.$transaction(async (tx) => {
      // Update wallet balance and decrement totalWithdrawn
      await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: balanceAfter,
          totalWithdrawn: { decrement: amount },
        },
      })

      // Update transaction to failed
      await tx.transaction.updateMany({
        where: {
          referenceId,
          userId,
          status: 'PENDING',
        },
        data: {
          status: 'FAILED',
          description: reason,
        },
      })

      // Create refund transaction
      await tx.transaction.create({
        data: {
          userId,
          walletId: wallet.id,
          type: 'REFUND_IN',
          amount,
          balanceBefore,
          balanceAfter,
          description: reason,
          referenceId,
          referenceType: 'WITHDRAWAL_REFUND',
        },
      })
    })
  }

  /**
   * Confirm withdrawal (mark transaction as completed)
   */
  async confirmWithdrawal(
    userId: string,
    referenceId: string,
    transactionId: string
  ): Promise<void> {
    await prisma.transaction.updateMany({
      where: {
        referenceId,
        userId,
        status: 'PENDING',
      },
      data: {
        status: 'COMPLETED',
        description: 'Rút tiền thành công',
      },
    })
  }

  /**
   * Get wallet statistics
   */
  async getWalletStats(userId: string) {
    const wallet = await this.getOrCreateWallet(userId)

    const [cashbackIn, withdrawalOut, refunds] = await Promise.all([
      prisma.transaction.aggregate({
        where: {
          userId,
          type: 'CASHBACK_IN',
          status: 'COMPLETED',
        },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: {
          userId,
          type: 'WITHDRAWAL_OUT',
          status: 'COMPLETED',
        },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: {
          userId,
          type: 'REFUND_IN',
          status: 'COMPLETED',
        },
        _sum: { amount: true },
      }),
    ])

    return {
      currentBalance: wallet.balance,
      totalEarned: wallet.totalEarned,
      totalWithdrawn: wallet.totalWithdrawn,
      totalCashback: Number(cashbackIn._sum.amount || 0),
      totalRefunds: Number(refunds._sum.amount || 0),
      pendingWithdrawals: Number(withdrawalOut._sum.amount || 0),
    }
  }
}

export default new WalletService()