import { Request, Response, NextFunction } from 'express'
import pinService from '../services/pin.service'

export const createPin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId
    const result = await pinService.createPin(userId, req.body)

    res.json({
      success: true,
      data: result,
      message: 'Đã thiết lập PIN thành công',
    })
  } catch (error) {
    next(error)
  }
}

export const updatePin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId
    const result = await pinService.updatePin(userId, req.body)

    res.json({
      success: true,
      data: result,
      message: 'Đã cập nhật PIN thành công',
    })
  } catch (error) {
    next(error)
  }
}

export const resetPin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId
    const { password } = req.body

    await pinService.resetPin(userId, password)

    res.json({
      success: true,
      message: 'Đã reset PIN thành công',
    })
  } catch (error) {
    next(error)
  }
}

export const checkPinStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId
    const status = await pinService.hasPin(userId)

    res.json({
      success: true,
      data: status,
    })
  } catch (error) {
    next(error)
  }
}