import { Request, Response, NextFunction } from 'express'
import walletService from '../services/wallet.service'

export const getWallet = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId
    const wallet = await walletService.getOrCreateWallet(userId)

    res.json({
      success: true,
      data: wallet,
    })
  } catch (error) {
    next(error)
  }
}

export const getBalance = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId
    const balance = await walletService.getBalance(userId)

    res.json({
      success: true,
      data: { balance },
    })
  } catch (error) {
    next(error)
  }
}

export const getWalletStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId
    const stats = await walletService.getWalletStats(userId)

    res.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    next(error)
  }
}