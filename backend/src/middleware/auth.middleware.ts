import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken, JwtPayload } from '../utils/jwt'
import { AppError } from './errorHandler.middleware'

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Không tìm thấy token xác thực', 401)
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    // Verify token
    const decoded = verifyAccessToken(token)

    // Attach user info to request including role
    req.user = decoded

    next()
  } catch (error) {
    next(new AppError('Token không hợp lệ hoặc đã hết hạn', 401))
  }
}

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      const decoded = verifyAccessToken(token)
      req.user = {
        userId: decoded.userId,
        phoneNumber: decoded.phoneNumber,
        role: decoded.role,
      }
    }

    next()
  } catch (error) {
    // If token is invalid, just continue without user info
    next()
  }
}

export const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Không tìm thấy thông tin người dùng', 401)
    }

    if (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
      throw new AppError('Bạn không có quyền truy cập', 403)
    }

    next()
  } catch (error) {
    next(error)
  }
}
