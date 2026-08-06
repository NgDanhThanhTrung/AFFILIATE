import { Request, Response, NextFunction } from 'express'
import adminService from '../services/admin.service'
import { UserRole } from '@prisma/client'

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20
    const role = req.query.role as UserRole | undefined
    const isActive = req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined
    const search = req.query.search as string | undefined

    const result = await adminService.getAllUsers(page, limit, role, isActive, search)

    res.json({
      success: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params
    const user = await adminService.getUserById(userId)

    res.json({
      success: true,
      data: user,
    })
  } catch (error) {
    next(error)
  }
}

export const updateUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params
    const { role } = req.body

    const user = await adminService.updateUserRole(userId, role)

    res.json({
      success: true,
      data: user,
      message: 'Đã cập nhật vai trò người dùng',
    })
  } catch (error) {
    next(error)
  }
}

export const toggleUserStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params
    const { isActive } = req.body

    const user = await adminService.toggleUserStatus(userId, isActive)

    res.json({
      success: true,
      data: user,
      message: isActive ? 'Đã kích hoạt tài khoản' : 'Đã vô hiệu hóa tài khoản',
    })
  } catch (error) {
    next(error)
  }
}

export const resetUserPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params
    const { newPassword } = req.body

    await adminService.resetUserPassword(userId, newPassword)

    res.json({
      success: true,
      message: 'Đã reset mật khẩu người dùng',
    })
  } catch (error) {
    next(error)
  }
}

export const getSystemStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const stats = await adminService.getSystemStats()

    res.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    next(error)
  }
}

export const getRecentActivity = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 20
    const activity = await adminService.getRecentActivity(limit)

    res.json({
      success: true,
      data: activity,
    })
  } catch (error) {
    next(error)
  }
}