import { Request, Response, NextFunction } from 'express'
import userService from '../services/user.service'
import { AppError } from '../middleware/errorHandler.middleware'

export class UserController {
  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Không tìm thấy thông tin người dùng', 401)
      }

      const profile = await userService.getProfile(req.user.userId)

      res.status(200).json({
        success: true,
        data: profile,
      })
    } catch (error) {
      next(error)
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Không tìm thấy thông tin người dùng', 401)
      }

      const profile = await userService.updateProfile(req.user.userId, req.body)

      res.status(200).json({
        success: true,
        message: 'Cập nhật thông tin thành công',
        data: profile,
      })
    } catch (error) {
      next(error)
    }
  }

  async getBankAccounts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Không tìm thấy thông tin người dùng', 401)
      }

      const accounts = await userService.getBankAccounts(req.user.userId)

      res.status(200).json({
        success: true,
        data: accounts,
      })
    } catch (error) {
      next(error)
    }
  }

  async addBankAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Không tìm thấy thông tin người dùng', 401)
      }

      const account = await userService.addBankAccount(req.user.userId, req.body)

      res.status(201).json({
        success: true,
        message: 'Thêm tài khoản ngân hàng thành công',
        data: account,
      })
    } catch (error) {
      next(error)
    }
  }

  async updateBankAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Không tìm thấy thông tin người dùng', 401)
      }

      const { id } = req.params
      const account = await userService.updateBankAccount(req.user.userId, id, req.body)

      res.status(200).json({
        success: true,
        message: 'Cập nhật tài khoản ngân hàng thành công',
        data: account,
      })
    } catch (error) {
      next(error)
    }
  }

  async deleteBankAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Không tìm thấy thông tin người dùng', 401)
      }

      const { id } = req.params
      await userService.deleteBankAccount(req.user.userId, id)

      res.status(200).json({
        success: true,
        message: 'Xóa tài khoản ngân hàng thành công',
      })
    } catch (error) {
      next(error)
    }
  }

  async setDefaultBankAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Không tìm thấy thông tin người dùng', 401)
      }

      const { id } = req.params
      await userService.setDefaultBankAccount(req.user.userId, id)

      res.status(200).json({
        success: true,
        message: 'Đặt tài khoản mặc định thành công',
      })
    } catch (error) {
      next(error)
    }
  }
}

export default new UserController()
