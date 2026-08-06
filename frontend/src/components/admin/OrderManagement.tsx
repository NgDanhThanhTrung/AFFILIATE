'use client'

import { useEffect, useState } from 'react'
import { orderApi } from '../../lib/orderApi'
import { OrderResponse } from '../../types/order.types'
import { Button } from '../ui/Button'
import { Search, Filter, RefreshCw, ChevronLeft, ChevronRight, Package, CheckCircle, XCircle, Clock, Truck, AlertCircle } from 'lucide-react'

export function OrderManagement() {
  const [orders, setOrders] = useState<OrderResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [platformFilter, setPlatformFilter] = useState<string>('')

  const fetchOrders = async (currentPage: number = page) => {
    setIsLoading(true)
    try {
      const params: any = { page: currentPage, limit: 10 }
      if (statusFilter) params.status = statusFilter
      if (platformFilter) params.platform = platformFilter

      const response = await orderApi.getUserOrders(params)
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
  }, [statusFilter, platformFilter])

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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Quản lý đơn hàng</h2>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="PENDING">Chờ xử lý</option>
            <option value="CONFIRMED">Đã xác nhận</option>
            <option value="SHIPPED">Đang giao</option>
            <option value="COMPLETED">Hoàn thành</option>
            <option value="CANCELLED">Đã hủy</option>
            <option value="FAILED">Thất bại</option>
          </select>
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tất cả nền tảng</option>
            <option value="SHOPEE">Shopee</option>
            <option value="TIKTOK">TikTok</option>
          </select>
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
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-medium text-gray-600">Mã đơn</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Nền tảng</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Trạng thái</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Giá trị</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Hoàn tiền</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Ngày đặt</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Hoàn thành</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    <span className="font-medium">{order.platformOrderId}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    order.platform === 'SHOPEE'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-black text-white'
                  }`}>
                    {order.platform === 'SHOPEE' ? 'Shopee' : 'TikTok'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </td>
                <td className="py-3 px-4 font-medium">
                  {formatCurrency(order.orderAmount)}
                </td>
                <td className="py-3 px-4 font-medium text-green-600">
                  {formatCurrency(order.cashbackAmount)}
                </td>
                <td className="py-3 px-4 text-sm">
                  {formatDate(order.orderDate)}
                </td>
                <td className="py-3 px-4 text-sm">
                  {formatDate(order.completedDate)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
    </div>
  )
}