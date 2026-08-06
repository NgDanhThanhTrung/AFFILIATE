import { Platform } from '@prisma/client'
import { nanoid } from 'nanoid'
import { AffiliateLinkInput, AffiliateLinkResponse, ConvertLinkResponse, LinkStats, LinkHistoryItem } from '../types/affiliate.types'
import { AppError } from '../middleware/errorHandler.middleware'
import prisma from '../config/database'

export class AffiliateService {
  /**
   * Parse URL to determine platform
   */
  private detectPlatform(url: string): Platform {
    const shopeeRegex = /^https?:\/\/(shopee\.vn|shopee\.com)/
    const tiktokRegex = /^https?:\/\/(tiktok\.com|vt\.tiktok\.com)/

    if (shopeeRegex.test(url)) {
      return 'SHOPEE'
    } else if (tiktokRegex.test(url)) {
      return 'TIKTOK'
    }

    throw new AppError('Không nhận diện được nền tảng từ URL', 400)
  }

  /**
   * Generate unique subId for tracking
   */
  private generateSubId(): string {
    return nanoid(12)
  }

  /**
   * Convert Shopee URL to affiliate URL
   */
  private convertShopeeUrl(originalUrl: string, subId: string): string {
    // Use our tracking redirect URL
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:3001'
    return `${baseUrl}/api/tracking/r/${subId}`
  }

  /**
   * Convert TikTok URL to affiliate URL
   */
  private convertTikTokUrl(originalUrl: string, subId: string): string {
    // Use our tracking redirect URL
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:3001'
    return `${baseUrl}/api/tracking/r/${subId}`
  }

  /**
   * Convert original URL to affiliate URL
   */
  async convertLink(userId: string, originalUrl: string, campaignId?: string): Promise<ConvertLinkResponse> {
    const platform = this.detectPlatform(originalUrl)
    const subId = this.generateSubId()

    let affiliateUrl: string
    switch (platform) {
      case 'SHOPEE':
        affiliateUrl = this.convertShopeeUrl(originalUrl, subId)
        break
      case 'TIKTOK':
        affiliateUrl = this.convertTikTokUrl(originalUrl, subId)
        break
      default:
        throw new AppError('Nền tảng không được hỗ trợ', 400)
    }

    // Save to database
    const affiliateLink = await prisma.affiliateLink.create({
      data: {
        userId,
        originalUrl,
        affiliateUrl,
        platform,
        subId,
        campaignId,
      },
    })

    return {
      affiliateUrl,
      originalUrl,
      platform,
      subId,
      linkId: affiliateLink.id,
    }
  }

  /**
   * Get user's link history
   */
  async getLinkHistory(
    userId: string,
    page: number = 1,
    limit: number = 10,
    platform?: Platform
  ): Promise<{ links: LinkHistoryItem[]; total: number; page: number; totalPages: number }> {
    const skip = (page - 1) * limit

    const where: any = { userId }
    if (platform) {
      where.platform = platform
    }

    const [links, total] = await Promise.all([
      prisma.affiliateLink.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          originalUrl: true,
          affiliateUrl: true,
          platform: true,
          clickCount: true,
          conversionCount: true,
          totalRevenue: true,
          createdAt: true,
        },
      }),
      prisma.affiliateLink.count({ where }),
    ])

    const convertedLinks = links.map(link => ({
      ...link,
      totalRevenue: Number(link.totalRevenue),
    }))

    return {
      links: convertedLinks,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }

  /**
   * Get link statistics
   */
  async getLinkStats(userId: string, startDate?: Date, endDate?: Date): Promise<LinkStats> {
    const where: any = { userId }
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = startDate
      if (endDate) where.createdAt.lte = endDate
    }

    const links = await prisma.affiliateLink.findMany({
      where,
      select: {
        platform: true,
        clickCount: true,
        conversionCount: true,
        totalRevenue: true,
      },
    })

    const totalLinks = links.length
    const totalClicks = links.reduce((sum, link) => sum + link.clickCount, 0)
    const totalConversions = links.reduce((sum, link) => sum + link.conversionCount, 0)
    const totalRevenue = links.reduce((sum, link) => sum + Number(link.totalRevenue), 0)

    const linksByPlatform = {
      SHOPEE: links.filter((l) => l.platform === 'SHOPEE').length,
      TIKTOK: links.filter((l) => l.platform === 'TIKTOK').length,
    }

    return {
      totalLinks,
      totalClicks,
      totalConversions,
      totalRevenue,
      linksByPlatform,
    }
  }

  /**
   * Get link by subId
   */
  async getLinkBySubId(subId: string) {
    return await prisma.affiliateLink.findUnique({
      where: { subId },
      include: {
        user: {
          select: {
            id: true,
            phoneNumber: true,
            name: true,
          },
        },
      },
    })
  }

  /**
   * Delete affiliate link
   */
  async deleteLink(userId: string, linkId: string): Promise<void> {
    const link = await prisma.affiliateLink.findFirst({
      where: { id: linkId, userId },
    })

    if (!link) {
      throw new AppError('Không tìm thấy link', 404)
    }

    await prisma.affiliateLink.delete({
      where: { id: linkId },
    })
  }

  /**
   * Update link status (active/inactive)
   */
  async updateLinkStatus(userId: string, linkId: string, isActive: boolean): Promise<void> {
    const link = await prisma.affiliateLink.findFirst({
      where: { id: linkId, userId },
    })

    if (!link) {
      throw new AppError('Không tìm thấy link', 404)
    }

    await prisma.affiliateLink.update({
      where: { id: linkId },
      data: { isActive },
    })
  }
}

export default new AffiliateService()