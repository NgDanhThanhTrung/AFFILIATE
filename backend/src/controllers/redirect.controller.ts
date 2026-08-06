import { Request, Response, NextFunction } from 'express'
import trackingService from '../services/tracking.service'
import affiliateService from '../services/affiliate.service'

export const redirectWithTracking = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const { subId } = req.params
    const userAgent = req.headers['user-agent']
    const ipAddress = req.ip || req.connection.remoteAddress

    // Track the click
    await trackingService.trackClick(subId, userAgent, ipAddress)

    // Get the original URL
    const link = await affiliateService.getLinkBySubId(subId)

    if (!link) {
      return res.status(404).json({
        success: false,
        message: 'Link không tồn tại',
      })
    }

    // Redirect to original URL
    res.redirect(link.originalUrl)
  } catch (error) {
    next(error)
  }
}