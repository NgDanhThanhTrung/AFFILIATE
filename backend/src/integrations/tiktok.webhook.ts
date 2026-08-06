import { Platform, OrderStatus } from '@prisma/client'
import { WebhookPayload } from '../types/order.types'
import orderService from '../services/order.service'
import { AppError } from '../middleware/errorHandler.middleware'

export class TikTokWebhookHandler {
  /**
   * Validate TikTok webhook signature
   */
  validateSignature(payload: any, signature: string, secret: string): boolean {
    // In production, implement actual signature validation
    // TikTok uses HMAC-SHA256 for webhook signatures
    // For now, we'll return true for development
    return true
  }

  /**
   * Parse TikTok webhook payload
   */
  parsePayload(rawPayload: any): WebhookPayload {
    try {
      // TikTok webhook structure may vary, adapt as needed
      return {
        platform: Platform.TIKTOK,
        eventType: rawPayload.event_type || 'ORDER_UPDATE',
        orderId: rawPayload.order_id || rawPayload.order_id,
        status: this.mapTikTokStatus(rawPayload.order_status),
        amount: rawPayload.total_amount || rawPayload.payment_amount,
        timestamp: rawPayload.update_time || new Date().toISOString(),
        data: rawPayload,
      }
    } catch (error) {
      throw new AppError('Invalid TikTok webhook payload', 400)
    }
  }

  /**
   * Map TikTok order status to our OrderStatus
   */
  private mapTikTokStatus(tiktokStatus: string): OrderStatus {
    const statusMap: { [key: string]: OrderStatus } = {
      'UNPAID': OrderStatus.PENDING,
      'AWAITING_SHIPMENT': OrderStatus.CONFIRMED,
      'IN_PROGRESS': OrderStatus.SHIPPED,
      'COMPLETED': OrderStatus.COMPLETED,
      'CANCELLED': OrderStatus.CANCELLED,
      'REFUNDED': OrderStatus.FAILED,
      'FAILED': OrderStatus.FAILED,
    }

    return statusMap[tiktokStatus] || OrderStatus.PENDING
  }

  /**
   * Process TikTok webhook
   */
  async processWebhook(payload: WebhookPayload): Promise<void> {
    try {
      // Find order by platform order ID
      const existingOrder = await orderService.getOrderByPlatformOrderId(payload.orderId)

      if (existingOrder) {
        // Update existing order status
        await orderService.updateOrderStatus(
          existingOrder.id,
          payload.status as OrderStatus,
          payload.data
        )
      } else {
        // Create new order if subId is provided
        if (payload.data?.sub_id && payload.amount) {
          // Extract userId from subId or other mechanism
          // This would need proper implementation based on your tracking system
          // For now, we'll skip order creation from webhooks
          console.log('Cannot create order from webhook without user context')
        }
      }
    } catch (error) {
      console.error('Error processing TikTok webhook:', error)
      throw error
    }
  }
}

export default new TikTokWebhookHandler()