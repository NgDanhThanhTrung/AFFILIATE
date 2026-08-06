import { Platform } from '@prisma/client'

export interface AffiliateLinkInput {
  originalUrl: string
  platform: Platform
  campaignId?: string
}

export interface AffiliateLinkResponse {
  id: string
  userId: string
  originalUrl: string
  affiliateUrl: string
  platform: Platform
  subId: string
  campaignId: string | null
  clickCount: number
  conversionCount: number
  totalRevenue: number
  isActive: boolean
  expiresAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface ConvertLinkRequest {
  url: string
}

export interface ConvertLinkResponse {
  affiliateUrl: string
  originalUrl: string
  platform: Platform
  subId: string
  linkId: string
}

export interface LinkStats {
  totalLinks: number
  totalClicks: number
  totalConversions: number
  totalRevenue: number
  linksByPlatform: {
    SHOPEE: number
    TIKTOK: number
  }
}

export interface LinkHistoryItem {
  id: string
  originalUrl: string
  affiliateUrl: string
  platform: Platform
  clickCount: number
  conversionCount: number
  totalRevenue: number
  createdAt: Date
}