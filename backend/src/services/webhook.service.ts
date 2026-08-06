import { Platform } from '@prisma/client'
import { AppError } from '../middleware/errorHandler.middleware'
import shopeeWebhookHandler from '../integrations/shopee.webhook'
import tiktokWebhookHandler from '../integrations/tiktok.webhook'
import prisma from '../config/database'

// Webhook secrets (must be set in environment variables for production)
const isProduction = process.env.NODE_ENV === 'production'
const WEBHOOK_SECRETS = {
  SHOPEE: process.env.SHOPEE_WEBHOOK_SECRET || (isProduction ? undefined : 'dev_shopee_secret'),
  TIKTOK: process.env.TIKTOK_WEBHOOK_SECRET || (isProduction ? undefined : 'dev_tiktok_secret'),
}

if (isProduction && (!WEBHOOK_SECRETS.SHOPEE || !WEBHOOK_SECRETS.TIKTOK)) {
  throw new Error('SHOPEE_WEBHOOK_SECRET and TIKTOK_WEBHOOK_SECRET must be set in environment variables for production')
}

// Type assertion for development defaults
const SECRETS = WEBHOOK_SECRETS as { SHOPEE: string; TIKTOK: string }

export class WebhookService {
  /**
   * Process incoming webhook
   */
  async processWebhook(
    platform: Platform,
    payload: any,
    signature?: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Log webhook
      const webhookLog = await prisma.webhookLog.create({
        data: {
          platform,
          eventType: payload.event_type || 'UNKNOWN',
          payload,
          signature,
          isValid: null,
          processed: false,
        },
      })

      // Validate signature
      const secret = SECRETS[platform]
      let isValid = false

      if (signature && secret) {
        isValid = this.validateSignature(platform, payload, signature, secret)
      } else {
        // In development, skip signature validation
        isValid = true
      }

      // Update webhook log with validation result
      await prisma.webhookLog.update({
        where: { id: webhookLog.id },
        data: { isValid },
      })

      if (!isValid) {
        await prisma.webhookLog.update({
          where: { id: webhookLog.id },
          data: {
            errorMessage: 'Invalid signature',
          },
        })
        throw new AppError('Invalid webhook signature', 401)
      }

      // Parse and process payload based on platform
      const handler = this.getHandler(platform)
      const parsedPayload = handler.parsePayload(payload)

      await handler.processWebhook(parsedPayload)

      // Mark webhook as processed
      await prisma.webhookLog.update({
        where: { id: webhookLog.id },
        data: { processed: true },
      })

      return {
        success: true,
        message: 'Webhook processed successfully',
      }
    } catch (error) {
      console.error('Webhook processing error:', error)
      throw error
    }
  }

  /**
   * Validate webhook signature
   */
  private validateSignature(
    platform: Platform,
    payload: any,
    signature: string,
    secret: string
  ): boolean {
    const handler = this.getHandler(platform)
    return handler.validateSignature(payload, signature, secret)
  }

  /**
   * Get appropriate webhook handler for platform
   */
  private getHandler(platform: Platform) {
    switch (platform) {
      case Platform.SHOPEE:
        return shopeeWebhookHandler
      case Platform.TIKTOK:
        return tiktokWebhookHandler
      default:
        throw new AppError('Unsupported platform', 400)
    }
  }

  /**
   * Get webhook logs
   */
  async getWebhookLogs(
    page: number = 1,
    limit: number = 50,
    platform?: Platform,
    eventType?: string,
    startDate?: Date,
    endDate?: Date
  ) {
    const skip = (page - 1) * limit

    const where: any = {}
    if (platform) where.platform = platform
    if (eventType) where.eventType = eventType
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = startDate
      if (endDate) where.createdAt.lte = endDate
    }

    const [logs, total] = await Promise.all([
      prisma.webhookLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.webhookLog.count({ where }),
    ])

    return {
      logs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }

  /**
   * Get webhook statistics
   */
  async getWebhookStats(startDate?: Date, endDate?: Date) {
    const where: any = {}
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = startDate
      if (endDate) where.createdAt.lte = endDate
    }

    const logs = await prisma.webhookLog.findMany({
      where,
      select: {
        platform: true,
        isValid: true,
        processed: true,
        eventType: true,
      },
    })

    const stats = {
      totalWebhooks: logs.length,
      validWebhooks: logs.filter((l) => l.isValid).length,
      invalidWebhooks: logs.filter((l) => l.isValid === false).length,
      processedWebhooks: logs.filter((l) => l.processed).length,
      failedWebhooks: logs.filter((l) => !l.processed).length,
      byPlatform: {
        SHOPEE: logs.filter((l) => l.platform === Platform.SHOPEE).length,
        TIKTOK: logs.filter((l) => l.platform === Platform.TIKTOK).length,
      },
      byEventType: {} as { [key: string]: number },
    }

    logs.forEach((log) => {
      stats.byEventType[log.eventType] = (stats.byEventType[log.eventType] || 0) + 1
    })

    return stats
  }

  /**
   * Reprocess failed webhooks
   */
  async reprocessFailedWebhooks(limit: number = 10) {
    const failedLogs = await prisma.webhookLog.findMany({
      where: {
        processed: false,
        isValid: true,
      },
      take: limit,
      orderBy: { createdAt: 'asc' },
    })

    const results = []

    for (const log of failedLogs) {
      try {
        await this.processWebhook(log.platform, log.payload, log.signature || undefined)
        results.push({ id: log.id, success: true })
      } catch (error) {
        results.push({ id: log.id, success: false, error: String(error) })
      }
    }

    return {
      totalProcessed: results.length,
      successful: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
      results,
    }
  }
}

export default new WebhookService()