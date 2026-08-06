import { Request, Response, NextFunction } from 'express'
import { AppError } from './errorHandler.middleware'

export const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      throw new AppError('Không tìm thấy thông tin xác thực', 401)
    }

    // Check if user has admin role
    if (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
      throw new AppError('Bạn không có quyền truy cập trang này', 403)
    }

    next()
  } catch (error) {
    next(error)
  }
}

export const requireSuperAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      throw new AppError('Không tìm thấy thông tin xác thực', 401)
    }

    // Check if user has super admin role
    if (req.user.role !== 'SUPER_ADMIN') {
      throw new AppError('Bạn không có quyền truy cập trang này', 403)
    }

    next()
  } catch (error) {
    next(error)
  }
}