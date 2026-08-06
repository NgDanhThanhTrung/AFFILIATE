import { Request, Response, NextFunction } from 'express'
import webhookService from '../services/webhook.service'
import { Platform } from '@prisma/client'

export const processWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const platform = req.params.platform as Platform
    const signature = req.headers['x-signature'] as string | undefined

    const result = await webhookService.processWebhook(platform, req.body, signature)

    res.json({
      success: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const getWebhookLogs = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 50
    const platform = req.query.platform as Platform | undefined
    const eventType = req.query.eventType as string | undefined
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined

    const result = await webhookService.getWebhookLogs(
      page,
      limit,
      platform,
      eventType,
      startDate,
      endDate
    )

    res.json({
      success: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const getWebhookStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined

    const stats = await webhookService.getWebhookStats(startDate, endDate)

    res.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    next(error)
  }
}

export const reprocessFailedWebhooks = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 10

    const result = await webhookService.reprocessFailedWebhooks(limit)

    res.json({
      success: true,
      data: result,
      message: 'Đã hoàn tất xử lý lại webhooks thất bại',
    })
  } catch (error) {
    next(error)
  }
}