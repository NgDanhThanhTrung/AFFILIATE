export interface ConvertLinkRequest {
  url: string
}

export interface ConvertLinkResponse {
  affiliateUrl: string
  originalUrl: string
  platform: 'SHOPEE' | 'TIKTOK'
  subId: string
  linkId: string
}

export interface LinkHistoryItem {
  id: string
  originalUrl: string
  affiliateUrl: string
  platform: 'SHOPEE' | 'TIKTOK'
  clickCount: number
  conversionCount: number
  totalRevenue: number
  createdAt: string
}

export interface LinkHistoryResponse {
  links: LinkHistoryItem[]
  total: number
  page: number
  totalPages: number
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