import { Request, Response, NextFunction } from 'express'
import affiliateService from '../services/affiliate.service'
import { AppError } from '../middleware/errorHandler.middleware'

export const convertLink = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { url } = req.body
    const userId = req.user!.userId

    const result = await affiliateService.convertLink(userId, url)

    res.json({
      success: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const getLinkHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const platform = req.query.platform as 'SHOPEE' | 'TIKTOK' | undefined

    const result = await affiliateService.getLinkHistory(userId, page, limit, platform)

    res.json({
      success: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const getLinkStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined

    const stats = await affiliateService.getLinkStats(userId, startDate, endDate)

    res.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteLink = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId
    const { linkId } = req.params

    await affiliateService.deleteLink(userId, linkId)

    res.json({
      success: true,
      message: 'Đã xóa link thành công',
    })
  } catch (error) {
    next(error)
  }
}

export const updateLinkStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId
    const { linkId } = req.params
    const { isActive } = req.body

    await affiliateService.updateLinkStatus(userId, linkId, isActive)

    res.json({
      success: true,
      message: 'Đã cập nhật trạng thái link',
    })
  } catch (error) {
    next(error)
  }
}