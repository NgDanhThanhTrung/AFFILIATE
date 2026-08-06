'use client'

import { useEffect, useState } from 'react'
import { orderApi } from '../lib/orderApi'
import { OrderStats as OrderStatsType } from '../types/order.types'
import { Package, CheckCircle, XCircle, Truck, Clock, AlertCircle, TrendingUp, DollarSign, ShoppingCart } from 'lucide-react'

export function OrderStats() {
  const [stats, setStats] = useState<OrderStatsType | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    setIsLoading(true)
    try {
      const data = await orderApi.getOrderStats()
      setStats(data)
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num)
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
      label: 'Tổng đơn hàng',
      value: formatNumber(stats.totalOrders),
      icon: <ShoppingCart className="w-5 h-5" />,
      color: 'bg-blue-500',
    },
    {
      label: 'Đã hoàn thành',
      value: formatNumber(stats.completedOrders),
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'bg-green-500',
    },
    {
      label: 'Đang xử lý',
      value: formatNumber(stats.pendingOrders + stats.confirmedOrders + stats.shippedOrders),
      icon: <Clock className="w-5 h-5" />,
      color: 'bg-yellow-500',
    },
    {
      label: 'Tổng hoàn tiền',
      value: formatCurrency(stats.totalCashback),
      icon: <DollarSign className="w-5 h-5" />,
      color: 'bg-purple-500',
    },
  ]

  const statusBreakdown = [
    { label: 'Chờ xử lý', count: stats.pendingOrders, icon: <Clock className="w-4 h-4" />, color: 'text-yellow-600' },
    { label: 'Đã xác nhận', count: stats.confirmedOrders, icon: <Package className="w-4 h-4" />, color: 'text-blue-600' },
    { label: 'Đang giao', count: stats.shippedOrders, icon: <Truck className="w-4 h-4" />, color: 'text-purple-600' },
    { label: 'Hoàn thành', count: stats.completedOrders, icon: <CheckCircle className="w-4 h-4" />, color: 'text-green-600' },
    { label: 'Đã hủy', count: stats.cancelledOrders, icon: <XCircle className="w-4 h-4" />, color: 'text-red-600' },
    { label: 'Thất bại', count: stats.failedOrders, icon: <AlertCircle className="w-4 h-4" />, color: 'text-red-600' },
  ]

  return (
    <div className="space-y-6">
      {/* Main Stats Cards */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Thống kê đơn hàng</h2>
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
      </div>

      {/* Detailed Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Status Breakdown */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Chi tiết trạng thái</h3>
          <div className="space-y-3">
            {statusBreakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={item.color}>{item.icon}</span>
                  <span className="text-sm text-gray-600">{item.label}</span>
                </div>
                <span className="font-semibold">{formatNumber(item.count)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Platform & Revenue Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Theo nền tảng & Doanh thu</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Theo nền tảng</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Shopee</span>
                  </div>
                  <span className="font-semibold">{formatNumber(stats.byPlatform.SHOPEE)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-black rounded-full"></div>
                    <span className="text-sm text-gray-600">TikTok</span>
                  </div>
                  <span className="font-semibold">{formatNumber(stats.byPlatform.TIKTOK)}</span>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Doanh thu</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tổng giá trị đơn hàng</span>
                  <span className="font-semibold">{formatCurrency(stats.totalOrderAmount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tổng hoa hồng</span>
                  <span className="font-semibold">{formatCurrency(stats.totalCommission)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tổng hoàn tiền</span>
                  <span className="font-semibold text-green-600">{formatCurrency(stats.totalCashback)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}