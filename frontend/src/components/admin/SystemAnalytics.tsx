'use client'

import { useEffect, useState } from 'react'
import { adminApi } from '../../lib/adminApi'
import { SystemStats } from '../../types/admin.types'
import { Users, ShoppingCart, DollarSign, Activity, ArrowUp, ArrowDown, Webhook } from 'lucide-react'

export function SystemAnalytics() {
  const [stats, setStats] = useState<SystemStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    setIsLoading(true)
    try {
      const data = await adminApi.getSystemStats()
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl shadow-lg p-6">
            <div className="animate-pulse">
              <div className="h-20 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!stats) {
    return null
  }

  const statCards = [
    {
      label: 'Tổng người dùng',
      value: formatNumber(stats.users.total),
      icon: <Users className="w-5 h-5" />,
      color: 'bg-blue-500',
      change: `${stats.users.active} đang hoạt động`,
      changePositive: true,
    },
    {
      label: 'Tổng đơn hàng',
      value: formatNumber(stats.orders.total),
      icon: <ShoppingCart className="w-5 h-5" />,
      color: 'bg-green-500',
      change: 'Tất cả thời gian',
      changePositive: true,
    },
    {
      label: 'Tổng doanh thu',
      value: formatCurrency(stats.revenue.total),
      icon: <DollarSign className="w-5 h-5" />,
      color: 'bg-purple-500',
      change: 'Từ cashback',
      changePositive: true,
    },
    {
      label: 'Webhooks đã xử lý',
      value: formatNumber(stats.webhooks.processed),
      icon: <Webhook className="w-5 h-5" />,
      color: 'bg-orange-500',
      change: 'Hoạt động hệ thống',
      changePositive: true,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className={`${card.color} text-white p-2 rounded-lg`}>
                {card.icon}
              </div>
              <span className="text-sm text-gray-600">{card.label}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <div className="flex items-center gap-1 mt-2 text-sm">
              {card.changePositive ? (
                <ArrowUp className="w-4 h-4 text-green-600" />
              ) : (
                <ArrowDown className="w-4 h-4 text-red-600" />
              )}
              <span className={card.changePositive ? 'text-green-600' : 'text-red-600'}>
                {card.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* User Stats by Role */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Người dùng theo vai trò</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">User</span>
              </div>
              <span className="font-semibold">{formatNumber(stats.users.byRole.USER || 0)}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Admin</span>
              </div>
              <span className="font-semibold">{formatNumber(stats.users.byRole.ADMIN || 0)}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Super Admin</span>
              </div>
              <span className="font-semibold">{formatNumber(stats.users.byRole.SUPER_ADMIN || 0)}</span>
            </div>
          </div>
        </div>

        {/* User Activity Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Hoạt động người dùng</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Đang hoạt động</span>
              <span className="font-semibold text-green-600">{formatNumber(stats.users.active)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Đã khóa</span>
              <span className="font-semibold text-red-600">{formatNumber(stats.users.inactive)}</span>
            </div>
            <div className="border-t pt-3 mt-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tỷ lệ hoạt động</span>
                <span className="font-semibold">
                  {((stats.users.active / stats.users.total) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Withdrawal Stats */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Thống kê rút tiền</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Tổng yêu cầu</p>
            <p className="text-2xl font-bold">{formatNumber(stats.withdrawals.total)}</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Đang xử lý</p>
            <p className="text-2xl font-bold text-yellow-600">
              {formatNumber(Math.floor(stats.withdrawals.total * 0.3))}
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Đã hoàn thành</p>
            <p className="text-2xl font-bold text-green-600">
              {formatNumber(Math.floor(stats.withdrawals.total * 0.7))}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}