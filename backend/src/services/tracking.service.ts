import { AppError } from '../middleware/errorHandler.middleware'
import prisma from '../config/database'

export class TrackingService {
  /**
   * Track click on affiliate link
   */
  async trackClick(subId: string, userAgent?: string, ipAddress?: string) {
    const link = await prisma.affiliateLink.findUnique({
      where: { subId },
    })

    if (!link) {
      throw new AppError('Link không tồn tại', 404)
    }

    if (!link.isActive) {
      throw new AppError('Link đã bị vô hiệu hóa', 410)
    }

    // Increment click count
    await prisma.affiliateLink.update({
      where: { id: link.id },
      data: { clickCount: { increment: 1 } },
    })

    // Log click details (optional - can be stored in a separate Click model for detailed analytics)
    // For now, we'll just increment the counter

    return {
      success: true,
      linkId: link.id,
      originalUrl: link.originalUrl,
      affiliateUrl: link.affiliateUrl,
    }
  }

  /**
   * Get click analytics for a link
   */
  async getLinkClicks(linkId: string, userId: string) {
    const link = await prisma.affiliateLink.findFirst({
      where: { id: linkId, userId },
      select: {
        clickCount: true,
        conversionCount: true,
        totalRevenue: true,
        createdAt: true,
      },
    })

    if (!link) {
      throw new AppError('Link không tồn tại', 404)
    }

    return link
  }

  /**
   * Get user's overall click analytics
   */
  async getUserClickAnalytics(userId: string, startDate?: Date, endDate?: Date) {
    const where: any = { userId }
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = startDate
      if (endDate) where.createdAt.lte = endDate
    }

    const links = await prisma.affiliateLink.findMany({
      where,
      select: {
        clickCount: true,
        conversionCount: true,
        totalRevenue: true,
        createdAt: true,
      },
    })

    const totalClicks = links.reduce((sum, link) => sum + link.clickCount, 0)
    const totalConversions = links.reduce((sum, link) => sum + link.conversionCount, 0)
    const totalRevenue = links.reduce((sum, link) => sum + Number(link.totalRevenue), 0)

    // Calculate conversion rate
    const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0

    return {
      totalClicks,
      totalConversions,
      totalRevenue,
      conversionRate: conversionRate.toFixed(2),
      totalLinks: links.length,
    }
  }
}

export default new TrackingService()