import { WithdrawalStatus } from '@prisma/client'
import { AppError } from '../middleware/errorHandler.middleware'
import { WithdrawalInput, WithdrawalResponse, BankAccountInput, BankAccountResponse } from '../types/wallet.types'
import walletService from './wallet.service'
import pinService from './pin.service'
import bcrypt from 'bcryptjs'
import type { Prisma } from '@prisma/client'
import * as walletServiceModule from './wallet.service'
import config from '../config'
import prisma from '../config/database'

const WITHDRAWAL_FEE_PERCENT = config.withdrawal.feePercent
const MIN_WITHDRAWAL_AMOUNT = config.withdrawal.minAmount
const MAX_WITHDRAWAL_AMOUNT = config.withdrawal.maxAmount

export class WithdrawalService {
  /**
   * Create bank account
   */
  async createBankAccount(userId: string, data: BankAccountInput): Promise<BankAccountResponse> {
    // If this is set as default, unset other default accounts
    if (data.isDefault) {
      await prisma.bankAccount.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      })
    }

    const bankAccount = await prisma.bankAccount.create({
      data: {
        userId,
        ...data,
      },
    })

    return {
      id: bankAccount.id,
      userId: bankAccount.userId,
      bankName: bankAccount.bankName,
      bankCode: bankAccount.bankCode,
      accountNumber: bankAccount.accountNumber,
      accountName: bankAccount.accountName,
      isDefault: bankAccount.isDefault,
      createdAt: bankAccount.createdAt,
      updatedAt: bankAccount.updatedAt,
    }
  }

  /**
   * Get user's bank accounts
   */
  async getBankAccounts(userId: string): Promise<BankAccountResponse[]> {
    const accounts = await prisma.bankAccount.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    })

    return accounts.map((acc) => ({
      id: acc.id,
      userId: acc.userId,
      bankName: acc.bankName,
      bankCode: acc.bankCode,
      accountNumber: acc.accountNumber,
      accountName: acc.accountName,
      isDefault: acc.isDefault,
      createdAt: acc.createdAt,
      updatedAt: acc.updatedAt,
    }))
  }

  /**
   * Get bank account by ID
   */
  async getBankAccountById(accountId: string, userId: string): Promise<BankAccountResponse> {
    const account = await prisma.bankAccount.findFirst({
      where: { id: accountId, userId },
    })

    if (!account) {
      throw new AppError('Không tìm thấy tài khoản ngân hàng', 404)
    }

    return {
      id: account.id,
      userId: account.userId,
      bankName: account.bankName,
      bankCode: account.bankCode,
      accountNumber: account.accountNumber,
      accountName: account.accountName,
      isDefault: account.isDefault,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    }
  }

  /**
   * Update bank account
   */
  async updateBankAccount(
    accountId: string,
    userId: string,
    data: Partial<BankAccountInput>
  ): Promise<BankAccountResponse> {
    const account = await prisma.bankAccount.findFirst({
      where: { id: accountId, userId },
    })

    if (!account) {
      throw new AppError('Không tìm thấy tài khoản ngân hàng', 404)
    }

    // If setting as default, unset other defaults
    if (data.isDefault) {
      await prisma.bankAccount.updateMany({
        where: { userId, isDefault: true, id: { not: accountId } },
        data: { isDefault: false },
      })
    }

    const updated = await prisma.bankAccount.update({
      where: { id: accountId },
      data,
    })

    return {
      id: updated.id,
      userId: updated.userId,
      bankName: updated.bankName,
      bankCode: updated.bankCode,
      accountNumber: updated.accountNumber,
      accountName: updated.accountName,
      isDefault: updated.isDefault,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    }
  }

  /**
   * Delete bank account
   */
  async deleteBankAccount(accountId: string, userId: string): Promise<void> {
    const account = await prisma.bankAccount.findFirst({
      where: { id: accountId, userId },
    })

    if (!account) {
      throw new AppError('Không tìm thấy tài khoản ngân hàng', 404)
    }

    // Check if account has pending withdrawals
    const pendingWithdrawals = await prisma.withdrawalRequest.findFirst({
      where: {
        bankAccountId: accountId,
        status: { in: ['PENDING', 'APPROVED', 'PROCESSING'] },
      },
    })

    if (pendingWithdrawals) {
      throw new AppError('Không thể xóa tài khoản đang có yêu cầu rút tiền đang xử lý', 400)
    }

    await prisma.bankAccount.delete({
      where: { id: accountId },
    })
  }

  /**
   * Validate PIN
   */
  private async validatePin(userId: string, pin: string): Promise<boolean> {
    const hasPin = await pinService.hasPin(userId)
    if (!hasPin.hasPin) {
      throw new AppError('Vui lòng thiết lập PIN để thực hiện giao dịch', 400)
    }

    return await pinService.validatePin(userId, pin)
  }

  /**
   * Calculate withdrawal fee
   */
  private calculateFee(amount: number): number {
    return Math.floor(amount * WITHDRAWAL_FEE_PERCENT)
  }

  /**
   * Check daily withdrawal limit
   */
  private async checkDailyLimit(userId: string, newAmount: number): Promise<boolean> {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const todayWithdrawals = await prisma.withdrawalRequest.findMany({
      where: {
        userId,
        createdAt: { gte: today, lt: tomorrow },
        status: { not: 'FAILED' },
      },
    })

    const totalWithdrawnToday = todayWithdrawals.reduce(
      (sum, w) => sum + Number(w.amount),
      0
    )

    return totalWithdrawnToday + newAmount <= MAX_WITHDRAWAL_AMOUNT
  }

  /**
   * Create withdrawal request
   */
  async createWithdrawalRequest(
    userId: string,
    data: WithdrawalInput
  ): Promise<WithdrawalResponse> {
    // Validate amount
    if (data.amount < MIN_WITHDRAWAL_AMOUNT) {
      throw new AppError(`Số tiền rút tối thiểu là ${MIN_WITHDRAWAL_AMOUNT.toLocaleString()} VND`, 400)
    }

    if (data.amount > MAX_WITHDRAWAL_AMOUNT) {
      throw new AppError(`Số tiền rút tối đa là ${MAX_WITHDRAWAL_AMOUNT.toLocaleString()} VND`, 400)
    }

    // Validate PIN
    const isPinValid = await this.validatePin(userId, data.pin)
    if (!isPinValid) {
      throw new AppError('PIN không đúng', 400)
    }

    // Check balance
    const hasBalance = await walletService.hasSufficientBalance(userId, data.amount)
    if (!hasBalance) {
      throw new AppError('Số dư không đủ', 400)
    }

    // Check daily limit
    const withinLimit = await this.checkDailyLimit(userId, data.amount)
    if (!withinLimit) {
      throw new AppError('Đạt giới hạn rút tiền hàng ngày', 400)
    }

    // Get bank account
    const bankAccount = await prisma.bankAccount.findFirst({
      where: { id: data.bankAccountId, userId },
    })

    if (!bankAccount) {
      throw new AppError('Không tìm thấy tài khoản ngân hàng', 404)
    }

    // Calculate fee
    const fee = this.calculateFee(data.amount)
    const netAmount = data.amount - fee

    // Create withdrawal request
    const withdrawal = await prisma.$transaction(async (tx) => {
      // Create withdrawal request first to get ID
      const withdrawal = await tx.withdrawalRequest.create({
        data: {
          userId,
          bankAccountId: data.bankAccountId,
          amount: data.amount,
          fee,
          netAmount,
          pinVerified: true,
          verifiedAt: new Date(),
        },
      })

      // Lock funds using withdrawal ID as reference
      const wallet = await tx.wallet.findUnique({
        where: { userId },
      })

      if (!wallet) {
        throw new AppError('Không tìm thấy ví', 404)
      }

      const balanceBefore = Number(wallet.balance)
      const balanceAfter = balanceBefore - data.amount

      await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: balanceAfter,
          totalWithdrawn: { increment: data.amount },
        },
      })

      await tx.transaction.create({
        data: {
          userId,
          walletId: wallet.id,
          type: 'WITHDRAWAL_OUT',
          amount: data.amount,
          balanceBefore,
          balanceAfter,
          description: 'Yêu cầu rút tiền đang xử lý',
          referenceId: withdrawal.id,
          referenceType: 'WITHDRAWAL',
          status: 'PENDING',
        },
      })

      return withdrawal
    })

    return {
      id: withdrawal.id,
      userId: withdrawal.userId,
      bankAccountId: withdrawal.bankAccountId,
      amount: Number(withdrawal.amount),
      fee: Number(withdrawal.fee),
      netAmount: Number(withdrawal.netAmount),
      status: withdrawal.status,
      pinVerified: withdrawal.pinVerified,
      verifiedAt: withdrawal.verifiedAt,
      processedAt: withdrawal.processedAt,
      rejectionReason: withdrawal.rejectionReason,
      transactionId: withdrawal.transactionId,
      metadata: withdrawal.metadata,
      createdAt: withdrawal.createdAt,
      updatedAt: withdrawal.updatedAt,
    }
  }

  /**
   * Get withdrawal requests for user
   */
  async getWithdrawalRequests(
    userId: string,
    page: number = 1,
    limit: number = 20,
    status?: WithdrawalStatus
  ): Promise<{
    withdrawals: WithdrawalResponse[]
    total: number
    page: number
    totalPages: number
  }> {
    const skip = (page - 1) * limit

    const where: any = { userId }
    if (status) where.status = status

    const [withdrawals, total] = await Promise.all([
      prisma.withdrawalRequest.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          bankAccount: {
            select: {
              bankName: true,
              accountNumber: true,
              accountName: true,
            },
          },
        },
      }),
      prisma.withdrawalRequest.count({ where }),
    ])

    return {
      withdrawals: withdrawals.map((w) => ({
        id: w.id,
        userId: w.userId,
        bankAccountId: w.bankAccountId,
        amount: Number(w.amount),
        fee: Number(w.fee),
        netAmount: Number(w.netAmount),
        status: w.status,
        pinVerified: w.pinVerified,
        verifiedAt: w.verifiedAt,
        processedAt: w.processedAt,
        rejectionReason: w.rejectionReason,
        transactionId: w.transactionId,
        metadata: w.metadata,
        createdAt: w.createdAt,
        updatedAt: w.updatedAt,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }

  /**
   * Cancel withdrawal request
   */
  async cancelWithdrawalRequest(userId: string, withdrawalId: string): Promise<void> {
    const withdrawal = await prisma.withdrawalRequest.findFirst({
      where: { id: withdrawalId, userId },
    })

    if (!withdrawal) {
      throw new AppError('Không tìm thấy yêu cầu rút tiền', 404)
    }

    if (withdrawal.status !== 'PENDING') {
      throw new AppError('Chỉ có thể hủy yêu cầu đang chờ xử lý', 400)
    }

    await prisma.$transaction(async (tx) => {
      // Update withdrawal status
      await tx.withdrawalRequest.update({
        where: { id: withdrawalId },
        data: {
          status: 'FAILED',
        },
      })

      // Release funds back to wallet
      await walletService.releaseFunds(
        userId,
        Number(withdrawal.amount),
        withdrawalId,
        'Yêu cầu rút tiền đã bị hủy'
      )
    })
  }

  /**
   * Get withdrawal statistics
   */
  async getWithdrawalStats(userId: string) {
    const withdrawals = await prisma.withdrawalRequest.findMany({
      where: { userId },
      select: {
        amount: true,
        fee: true,
        status: true,
        createdAt: true,
      },
    })

    const stats = {
      totalRequests: withdrawals.length,
      pending: 0,
      approved: 0,
      processing: 0,
      completed: 0,
      rejected: 0,
      failed: 0,
      totalAmount: 0,
      totalFees: 0,
      totalNetAmount: 0,
    }

    withdrawals.forEach((w) => {
      const amount = Number(w.amount)
      const fee = Number(w.fee)
      stats.totalAmount += amount
      stats.totalFees += fee
      stats.totalNetAmount += (amount - fee)
      stats[w.status.toLowerCase() as keyof typeof stats] += 1
    })

    return stats
  }
}

export default new WithdrawalService()