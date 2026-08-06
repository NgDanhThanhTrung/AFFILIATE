import { Request, Response, NextFunction } from 'express'
import profileService from '../services/profile.service'

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId
    const profile = await profileService.getProfile(userId)

    res.json({
      success: true,
      data: profile,
    })
  } catch (error) {
    next(error)
  }
}

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId
    const profile = await profileService.updateProfile(userId, req.body)

    res.json({
      success: true,
      data: profile,
      message: 'Đã cập nhật hồ sơ thành công',
    })
  } catch (error) {
    next(error)
  }
}

export const getUserStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId
    const stats = await profileService.getUserStats(userId)

    res.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    next(error)
  }
}

export const deactivateAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId
    const { password } = req.body

    await profileService.deactivateAccount(userId, password)

    res.json({
      success: true,
      message: 'Đã vô hiệu hóa tài khoản thành công',
    })
  } catch (error) {
    next(error)
  }
}