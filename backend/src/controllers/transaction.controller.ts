import { Request, Response, NextFunction } from 'express'
import transactionService from '../services/transaction.service'
import { TransactionType, TransactionStatus } from '@prisma/client'

export const getTransactionHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20
    const type = req.query.type as TransactionType | undefined
    const status = req.query.status as TransactionStatus | undefined
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined

    const result = await transactionService.getTransactionHistory(
      userId,
      page,
      limit,
      type,
      status,
      startDate,
      endDate
    )

    res.json({
      success: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const getTransactionById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId
    const { transactionId } = req.params

    const transaction = await transactionService.getTransactionById(transactionId, userId)

    res.json({
      success: true,
      data: transaction,
    })
  } catch (error) {
    next(error)
  }
}

export const getTransactionStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined

    const stats = await transactionService.getTransactionStats(userId, startDate, endDate)

    res.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    next(error)
  }
}

export const getRecentTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId
    const limit = parseInt(req.query.limit as string) || 5

    const transactions = await transactionService.getRecentTransactions(userId, limit)

    res.json({
      success: true,
      data: transactions,
    })
  } catch (error) {
    next(error)
  }
}