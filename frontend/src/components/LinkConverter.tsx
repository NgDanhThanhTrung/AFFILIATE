'use client'

import { useState } from 'react'
import { affiliateApi } from '../lib/affiliateApi'
import { Button } from './ui/Button'
import { Copy, Check, ExternalLink, AlertCircle } from 'lucide-react'

export function LinkConverter() {
  const [url, setUrl] = useState('')
  const [affiliateUrl, setAffiliateUrl] = useState('')
  const [platform, setPlatform] = useState<'SHOPEE' | 'TIKTOK' | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const detectPlatform = (inputUrl: string): 'SHOPEE' | 'TIKTOK' | null => {
    const shopeeRegex = /^https?:\/\/(shopee\.vn|shopee\.com)/
    const tiktokRegex = /^https?:\/\/(tiktok\.com|vt\.tiktok\.com)/

    if (shopeeRegex.test(inputUrl)) return 'SHOPEE'
    if (tiktokRegex.test(inputUrl)) return 'TIKTOK'
    return null
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setUrl(value)
    setAffiliateUrl('')
    setPlatform(detectPlatform(value))
    setError('')
  }

  const handleConvert = async () => {
    if (!url.trim()) {
      setError('Vui lòng nhập URL')
      return
    }

    const detectedPlatform = detectPlatform(url)
    if (!detectedPlatform) {
      setError('Chỉ hỗ trợ link từ Shopee hoặc TikTok')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const result = await affiliateApi.convertLink({ url })
      setAffiliateUrl(result.affiliateUrl)
      setPlatform(result.platform)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi chuyển đổi link')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(affiliateUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleOpenLink = () => {
    if (affiliateUrl) {
      window.open(affiliateUrl, '_blank')
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Chuyển đổi Link</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nhập link Shopee hoặc TikTok
          </label>
          <input
            type="url"
            value={url}
            onChange={handleUrlChange}
            placeholder="https://shopee.vn/... hoặc https://tiktok.com/..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          {platform && (
            <div className="mt-2 flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {platform === 'SHOPEE' ? 'Shopee' : 'TikTok'}
              </span>
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <Button
          onClick={handleConvert}
          isLoading={isLoading}
          disabled={!url.trim() || isLoading}
          className="w-full"
        >
          Chuyển đổi
        </Button>

        {affiliateUrl && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-800">
                Link Affiliate:
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                  title="Sao chép"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleOpenLink}
                  className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                  title="Mở link"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-sm text-green-700 break-all">
              {affiliateUrl}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}