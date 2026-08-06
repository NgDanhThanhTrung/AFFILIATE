'use client'

import { useEffect, useState } from 'react'
import { affiliateApi } from '../lib/affiliateApi'
import { LinkStats as LinkStatsType } from '../types/affiliate.types'
import { TrendingUp, MousePointer, ShoppingCart, DollarSign } from 'lucide-react'

export function LinkStats() {
  const [stats, setStats] = useState<LinkStatsType | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    setIsLoading(true)
    try {
      const data = await affiliateApi.getLinkStats()
      setStats(data)
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!stats) {
    return null
  }

  const statCards = [
    {
      label: 'Tổng Link',
      value: formatNumber(stats.totalLinks),
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'bg-blue-500',
    },
    {
      label: 'Tổng Clicks',
      value: formatNumber(stats.totalClicks),
      icon: <MousePointer className="w-5 h-5" />,
      color: 'bg-green-500',
    },
    {
      label: 'Chuyển đổi',
      value: formatNumber(stats.totalConversions),
      icon: <ShoppingCart className="w-5 h-5" />,
      color: 'bg-purple-500',
    },
    {
      label: 'Doanh thu',
      value: formatCurrency(stats.totalRevenue),
      icon: <DollarSign className="w-5 h-5" />,
      color: 'bg-orange-500',
    },
  ]

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Thống kê</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`${card.color} text-white p-2 rounded-lg`}>
                {card.icon}
              </div>
              <span className="text-sm text-gray-600">{card.label}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Theo nền tảng</h3>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-sm text-gray-600">
              Shopee: {stats.linksByPlatform.SHOPEE} link
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-black rounded-full"></div>
            <span className="text-sm text-gray-600">
              TikTok: {stats.linksByPlatform.TIKTOK} link
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}