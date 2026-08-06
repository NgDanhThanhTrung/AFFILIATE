import { z } from 'zod'

export const convertLinkSchema = z.object({
  url: z.string().url('URL không hợp lệ').refine(
    (url) => {
      const shopeeRegex = /^https?:\/\/(shopee\.vn|shopee\.com)/
      const tiktokRegex = /^https?:\/\/(tiktok\.com|vt\.tiktok\.com)/
      return shopeeRegex.test(url) || tiktokRegex.test(url)
    },
    { message: 'Chỉ hỗ trợ link từ Shopee hoặc TikTok' }
  ),
})

export const getLinkHistorySchema = z.object({
  page: z.string().optional().transform((val) => val ? parseInt(val) : 1),
  limit: z.string().optional().transform((val) => val ? parseInt(val) : 10),
  platform: z.enum(['SHOPEE', 'TIKTOK']).optional(),
})

export const getLinkStatsSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

export type ConvertLinkInput = z.infer<typeof convertLinkSchema>
export type GetLinkHistoryInput = z.infer<typeof getLinkHistorySchema>
export type GetLinkStatsInput = z.infer<typeof getLinkStatsSchema>