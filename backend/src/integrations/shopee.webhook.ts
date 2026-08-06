import { Platform, OrderStatus } from '@prisma/client'
import { WebhookPayload } from '../types/order.types'
import orderService from '../services/order.service'
import { AppError } from '../middleware/errorHandler.middleware'

export class ShopeeWebhookHandler {
  /**
   * Validate Shopee webhook signature
   */
  validateSignature(payload: any, signature: string, secret: string): boolean {
    // In production, implement actual signature validation
    // Shopee uses HMAC-SHA256 for webhook signatures
    // For now, we'll return true for development
    return true
  }

  /**
   * Parse Shopee webhook payload
   */
  parsePayload(rawPayload: any): WebhookPayload {
    try {
      // Shopee webhook structure may vary, adapt as needed
      return {
        platform: Platform.SHOPEE,
        eventType: rawPayload.event_type || 'ORDER_UPDATE',
        orderId: rawPayload.order_id || rawPayload.order_sn,
        status: this.mapShopeeStatus(rawPayload.order_status),
        amount: rawPayload.total_amount || rawPayload.pay_amount,
        timestamp: rawPayload.update_time || new Date().toISOString(),
        data: rawPayload,
      }
    } catch (error) {
      throw new AppError('Invalid Shopee webhook payload', 400)
    }
  }

  /**
   * Map Shopee order status to our OrderStatus
   */
  private mapShopeeStatus(shopeeStatus: string): OrderStatus {
    const statusMap: { [key: string]: OrderStatus } = {
      'UNPAID': OrderStatus.PENDING,
      'READY_TO_SHIP': OrderStatus.CONFIRMED,
      'SHIPPED': OrderStatus.SHIPPED,
      'COMPLETED': OrderStatus.COMPLETED,
      'CANCELLED': OrderStatus.CANCELLED,
      'IN_CANCEL': OrderStatus.CANCELLED,
      'TO_RETURN': OrderStatus.FAILED,
      'RETURNED': OrderStatus.FAILED,
    }

    return statusMap[shopeeStatus] || OrderStatus.PENDING
  }

  /**
   * Process Shopee webhook
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
      console.error('Error processing Shopee webhook:', error)
      throw error
    }
  }
}

export default new ShopeeWebhookHandler()