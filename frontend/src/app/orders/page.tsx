'use client'

import { useAuth } from '../../contexts/AuthContext'
import { OrderHistory } from '../../components/OrderHistory'
import { OrderStats } from '../../components/OrderStats'

export default function OrdersPage() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Vui lòng đăng nhập để xem đơn hàng</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Đơn hàng của tôi</h1>
            <p className="text-gray-600">Theo dõi và quản lý đơn hàng affiliate</p>
          </div>

          <div className="space-y-6">
            <OrderStats />
            <OrderHistory />
          </div>
        </div>
      </div>
    </main>
  )
}