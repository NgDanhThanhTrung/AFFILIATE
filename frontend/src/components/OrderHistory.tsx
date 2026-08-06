'use client'

import { useEffect, useState } from 'react'
import { orderApi } from '../lib/orderApi'
import { OrderResponse } from '../types/order.types'
import { Button } from './ui/Button'
import { RefreshCw, ChevronLeft, ChevronRight, Package, CheckCircle, XCircle, Clock, Truck, AlertCircle } from 'lucide-react'

export function OrderHistory() {
  const [orders, setOrders] = useState<OrderResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const fetchOrders = async (currentPage: number = page) => {
    setIsLoading(true)
    try {
      const response = await orderApi.getUserOrders({ page: currentPage, limit: 10 })
      setOrders(response.orders)
      setTotalPages(response.totalPages)
      setTotal(response.total)
    } catch (err) {
      console.error('Failed to fetch orders:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
      fetchOrders(newPage)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-600" />
      case 'CONFIRMED':
        return <Package className="w-5 h-5 text-blue-600" />
      case 'SHIPPED':
        return <Truck className="w-5 h-5 text-purple-600" />
      case 'COMPLETED':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'CANCELLED':
        return <XCircle className="w-5 h-5 text-red-600" />
      case 'FAILED':
        return <AlertCircle className="w-5 h-5 text-red-600" />
      default:
        return <Package className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Chờ xử lý'
      case 'CONFIRMED':
        return 'Đã xác nhận'
      case 'SHIPPED':
        return 'Đang giao'
      case 'COMPLETED':
        return 'Hoàn thành'
      case 'CANCELLED':
        return 'Đã hủy'
      case 'FAILED':
        return 'Thất bại'
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800'
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800'
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      case 'FAILED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading && orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Lịch sử đơn hàng</h2>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => fetchOrders()}
          isLoading={isLoading}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Làm mới
        </Button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p>Chưa có đơn hàng nào</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {getStatusIcon(order.status)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">
                          Đơn hàng #{order.platformOrderId}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.platform === 'SHOPEE'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-black text-white'
                        }`}>
                          {order.platform === 'SHOPEE' ? 'Shopee' : 'TikTok'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Giá trị:</span>
                          <span className="ml-2 font-medium">{formatCurrency(order.orderAmount)}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Hoàn tiền:</span>
                          <span className="ml-2 font-medium text-green-600">{formatCurrency(order.cashbackAmount)}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Ngày đặt:</span>
                          <span className="ml-2">{formatDate(order.orderDate)}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Hoàn thành:</span>
                          <span className="ml-2">{formatDate(order.completedDate)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <span className="text-sm text-gray-500">
                Tổng {total} đơn hàng
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-gray-600">
                  Trang {page} / {totalPages}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}