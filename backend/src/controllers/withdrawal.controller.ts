import { Request, Response, NextFunction } from 'express'
import withdrawalService from '../services/withdrawal.service'
import { WithdrawalStatus } from '@prisma/client'

export const createBankAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId
    const account = await withdrawalService.createBankAccount(userId, req.body)

    res.json({
      success: true,
      data: account,
      message: 'Đã thêm tài khoản ngân hàng thành công',
    })
  } catch (error) {
    next(error)
  }
}

export const getBankAccounts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId
    const accounts = await withdrawalService.getBankAccounts(userId)

    res.json({
      success: true,
      data: accounts,
    })
  } catch (error) {
    next(error)
  }
}

export const getBankAccountById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId
    const { accountId } = req.params

    const account = await withdrawalService.getBankAccountById(accountId, userId)

    res.json({
      success: true,
      data: account,
    })
  } catch (error) {
    next(error)
  }
}

export const updateBankAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId
    const { accountId } = req.params

    const account = await withdrawalService.updateBankAccount(accountId, userId, req.body)

    res.json({
      success: true,
      data: account,
      message: 'Đã cập nhật tài khoản ngân hàng thành công',
    })
  } catch (error) {
    next(error)
  }
}

export const deleteBankAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId
    const { accountId } = req.params

    await withdrawalService.deleteBankAccount(accountId, userId)

    res.json({
      success: true,
      message: 'Đã xóa tài khoản ngân hàng thành công',
    })
  } catch (error) {
    next(error)
  }
}

export const createWithdrawalRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId
    const withdrawal = await withdrawalService.createWithdrawalRequest(userId, req.body)

    res.json({
      success: true,
      data: withdrawal,
      message: 'Đã tạo yêu cầu rút tiền thành công',
    })
  } catch (error) {
    next(error)
  }
}

export const getWithdrawalRequests = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20
    const status = req.query.status as WithdrawalStatus | undefined

    const result = await withdrawalService.getWithdrawalRequests(userId, page, limit, status)

    res.json({
      success: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const cancelWithdrawalRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId
    const { withdrawalId } = req.params

    await withdrawalService.cancelWithdrawalRequest(userId, withdrawalId)

    res.json({
      success: true,
      message: 'Đã hủy yêu cầu rút tiền thành công',
    })
  } catch (error) {
    next(error)
  }
}

export const getWithdrawalStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId
    const stats = await withdrawalService.getWithdrawalStats(userId)

    res.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    next(error)
  }
}