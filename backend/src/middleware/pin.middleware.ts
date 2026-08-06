import { Request, Response, NextFunction } from 'express'
import { verifyPin } from '../utils/crypto'
import prisma from '../config/database'
import { AppError } from './errorHandler.middleware'

export const requirePin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Không tìm thấy thông tin người dùng', 401)
    }

    const { pin } = req.body

    if (!pin) {
      throw new AppError('Vui lòng nhập mã PIN', 400)
    }

    // Get user with PIN hash
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { pinHash: true, phoneNumber: true },
    })

    if (!user || !user.pinHash) {
      throw new AppError('Mã PIN chưa được thiết lập', 400)
    }

    // Verify PIN
    const isPinValid = await verifyPin(pin, user.pinHash)

    if (!isPinValid) {
      throw new AppError('Mã PIN không đúng', 401)
    }

    // Remove PIN from body after verification
    delete req.body.pin

    next()
  } catch (error) {
    next(error)
  }
}
