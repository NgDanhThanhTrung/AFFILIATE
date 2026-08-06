import prisma from '../config/database'
import { AppError } from '../middleware/errorHandler.middleware'
import { UpdateProfileInput, BankAccountInput } from '../types/user.types'
import { logger } from '../config/logger'

export class UserService {
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        phoneNumber: true,
        name: true,
        email: true,
        avatar: true,
        isPhoneVerified: true,
        pinHash: true,
        createdAt: true,
        lastLoginAt: true,
      },
    })

    if (!user) {
      throw new AppError('Người dùng không tồn tại', 404)
    }

    return {
      id: user.id,
      phoneNumber: user.phoneNumber,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      isPhoneVerified: user.isPhoneVerified,
      hasPin: !!user.pinHash,
      createdAt: user.createdAt.toISOString(),
      lastLoginAt: user.lastLoginAt?.toISOString() || null,
    }
  }

  async updateProfile(userId: string, data: UpdateProfileInput) {
    const { name, email, avatar } = data

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          NOT: { id: userId },
        },
      })

      if (existingUser) {
        throw new AppError('Email đã được sử dụng', 400)
      }
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(avatar !== undefined && { avatar }),
      },
      select: {
        id: true,
        phoneNumber: true,
        name: true,
        email: true,
        avatar: true,
        isPhoneVerified: true,
        pinHash: true,
        createdAt: true,
        lastLoginAt: true,
      },
    })

    logger.info(`Profile updated for user: ${user.phoneNumber}`)

    return {
      id: user.id,
      phoneNumber: user.phoneNumber,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      isPhoneVerified: user.isPhoneVerified,
      hasPin: !!user.pinHash,
      createdAt: user.createdAt.toISOString(),
      lastLoginAt: user.lastLoginAt?.toISOString() || null,
    }
  }

  async getBankAccounts(userId: string) {
    const accounts = await prisma.bankAccount.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    })

    return accounts.map((account) => ({
      id: account.id,
      bankName: account.bankName,
      bankCode: account.bankCode,
      accountNumber: account.accountNumber,
      accountName: account.accountName,
      isDefault: account.isDefault,
    }))
  }

  async addBankAccount(userId: string, data: BankAccountInput) {
    const { bankName, bankCode, accountNumber, accountName, isDefault = false } = data

    // Check if account number already exists for this user
    const existingAccount = await prisma.bankAccount.findFirst({
      where: {
        userId,
        accountNumber,
      },
    })

    if (existingAccount) {
      throw new AppError('Số tài khoản ngân hàng đã tồn tại', 400)
    }

    // If this is the first account or isDefault is true, make it default
    const existingAccounts = await prisma.bankAccount.findMany({
      where: { userId },
    })

    const shouldBeDefault = isDefault || existingAccounts.length === 0

    // If shouldBeDefault is true, remove default from other accounts
    if (shouldBeDefault && existingAccounts.length > 0) {
      await prisma.bankAccount.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      })
    }

    const account = await prisma.bankAccount.create({
      data: {
        userId,
        bankName,
        bankCode,
        accountNumber,
        accountName,
        isDefault: shouldBeDefault,
      },
    })

    logger.info(`Bank account added for user: ${userId}`)

    return {
      id: account.id,
      bankName: account.bankName,
      bankCode: account.bankCode,
      accountNumber: account.accountNumber,
      accountName: account.accountName,
      isDefault: account.isDefault,
    }
  }

  async updateBankAccount(userId: string, accountId: string, data: Partial<BankAccountInput>) {
    // Verify account belongs to user
    const account = await prisma.bankAccount.findFirst({
      where: {
        id: accountId,
        userId,
      },
    })

    if (!account) {
      throw new AppError('Tài khoản ngân hàng không tồn tại', 404)
    }

    // If setting as default, remove default from other accounts
    if (data.isDefault) {
      await prisma.bankAccount.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      })
    }

    const updatedAccount = await prisma.bankAccount.update({
      where: { id: accountId },
      data,
    })

    logger.info(`Bank account updated: ${accountId}`)

    return {
      id: updatedAccount.id,
      bankName: updatedAccount.bankName,
      bankCode: updatedAccount.bankCode,
      accountNumber: updatedAccount.accountNumber,
      accountName: updatedAccount.accountName,
      isDefault: updatedAccount.isDefault,
    }
  }

  async deleteBankAccount(userId: string, accountId: string) {
    // Verify account belongs to user
    const account = await prisma.bankAccount.findFirst({
      where: {
        id: accountId,
        userId,
      },
    })

    if (!account) {
      throw new AppError('Tài khoản ngân hàng không tồn tại', 404)
    }

    // Check if there are pending withdrawal requests
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

    logger.info(`Bank account deleted: ${accountId}`)

    return { success: true }
  }

  async setDefaultBankAccount(userId: string, accountId: string) {
    // Verify account belongs to user
    const account = await prisma.bankAccount.findFirst({
      where: {
        id: accountId,
        userId,
      },
    })

    if (!account) {
      throw new AppError('Tài khoản ngân hàng không tồn tại', 404)
    }

    // Remove default from all accounts
    await prisma.bankAccount.updateMany({
      where: { userId },
      data: { isDefault: false },
    })

    // Set default on selected account
    await prisma.bankAccount.update({
      where: { id: accountId },
      data: { isDefault: true },
    })

    logger.info(`Default bank account set: ${accountId}`)

    return { success: true }
  }
}

export default new UserService()
