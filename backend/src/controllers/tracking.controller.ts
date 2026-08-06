import { Request, Response, NextFunction } from 'express'
import trackingService from '../services/tracking.service'

export const trackClick = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { subId } = req.params
    const userAgent = req.headers['user-agent']
    const ipAddress = req.ip || req.connection.remoteAddress

    const result = await trackingService.trackClick(subId, userAgent, ipAddress)

    res.json({
      success: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const getLinkClicks = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId
    const { linkId } = req.params

    const analytics = await trackingService.getLinkClicks(linkId, userId)

    res.json({
      success: true,
      data: analytics,
    })
  } catch (error) {
    next(error)
  }
}

export const getUserClickAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined

    const analytics = await trackingService.getUserClickAnalytics(userId, startDate, endDate)

    res.json({
      success: true,
      data: analytics,
    })
  } catch (error) {
    next(error)
  }
}