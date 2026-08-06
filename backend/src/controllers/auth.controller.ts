import { Request, Response, NextFunction } from 'express'
import authService from '../services/auth.service'
import { AppError } from '../middleware/errorHandler.middleware'

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.register(req.body)

      res.status(201).json({
        success: true,
        message: 'Đăng ký thành công',
        data: result,
      })
    } catch (error) {
      next(error)
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.login(req.body)

      res.status(200).json({
        success: true,
        message: 'Đăng nhập thành công',
        data: result,
      })
    } catch (error) {
      next(error)
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // In a real app, you might want to invalidate the token
      // For now, we'll just return success
      // The client should delete the token from storage

      res.status(200).json({
        success: true,
        message: 'Đăng xuất thành công',
      })
    } catch (error) {
      next(error)
    }
  }

  async verifyPin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Không tìm thấy thông tin người dùng', 401)
      }

      const result = await authService.verifyPin(req.user.userId, req.body)

      res.status(200).json({
        success: true,
        message: 'Xác thực mã PIN thành công',
        data: { verified: result },
      })
    } catch (error) {
      next(error)
    }
  }

  async setupPin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Không tìm thấy thông tin người dùng', 401)
      }

      const { pin } = req.body

      await authService.setupPin(req.user.userId, pin)

      res.status(200).json({
        success: true,
        message: 'Thiết lập mã PIN thành công',
      })
    } catch (error) {
      next(error)
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Không tìm thấy thông tin người dùng', 401)
      }

      await authService.changePassword(req.user.userId, req.body)

      res.status(200).json({
        success: true,
        message: 'Đổi mật khẩu thành công',
      })
    } catch (error) {
      next(error)
    }
  }

  async changePin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Không tìm thấy thông tin người dùng', 401)
      }

      await authService.changePin(req.user.userId, req.body)

      res.status(200).json({
        success: true,
        message: 'Đổi mã PIN thành công',
      })
    } catch (error) {
      next(error)
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body

      const tokens = await authService.refreshToken(refreshToken)

      res.status(200).json({
        success: true,
        message: 'Làm mới token thành công',
        data: tokens,
      })
    } catch (error) {
      next(error)
    }
  }
}

export default new AuthController()
