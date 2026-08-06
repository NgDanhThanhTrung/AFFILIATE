'use client'

import { useEffect, useState } from 'react'
import { webhookApi } from '../../lib/webhookApi'
import { Button } from '../ui/Button'
import { RefreshCw, CheckCircle, XCircle, Clock, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react'

export function WebhookMonitoring() {
  const [logs, setLogs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [platformFilter, setPlatformFilter] = useState<string>('')

  const fetchLogs = async (currentPage: number = page) => {
    setIsLoading(true)
    try {
      const params: any = { page: currentPage, limit: 10 }
      if (platformFilter) params.platform = platformFilter

      const response = await webhookApi.getWebhookLogs(params)
      setLogs(response.logs)
      setTotalPages(response.totalPages)
      setTotal(response.total)
    } catch (err) {
      console.error('Failed to fetch webhook logs:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [platformFilter])

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
      fetchLogs(newPage)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const getStatusIcon = (isValid: boolean | null, processed: boolean) => {
    if (isValid === false) {
      return <XCircle className="w-5 h-5 text-red-600" />
    }
    if (processed) {
      return <CheckCircle className="w-5 h-5 text-green-600" />
    }
    return <Clock className="w-5 h-5 text-yellow-600" />
  }

  const getStatusLabel = (isValid: boolean | null, processed: boolean) => {
    if (isValid === false) return 'Invalid'
    if (processed) return 'Processed'
    return 'Pending'
  }

  const getStatusColor = (isValid: boolean | null, processed: boolean) => {
    if (isValid === false) return 'bg-red-100 text-red-800'
    if (processed) return 'bg-green-100 text-green-800'
    return 'bg-yellow-100 text-yellow-800'
  }

  if (isLoading && logs.length === 0) {
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
        <h2 className="text-xl font-semibold">Webhook Monitoring</h2>
        <div className="flex items-center gap-2">
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
            onClick={() => fetchLogs()}
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
              <th className="text-left py-3 px-4 font-medium text-gray-600">ID</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Nền tảng</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Event Type</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Trạng thái</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Thời gian</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Lỗi</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-mono text-sm">
                  {log.id.slice(0, 8)}...
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    log.platform === 'SHOPEE'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-black text-white'
                  }`}>
                    {log.platform === 'SHOPEE' ? 'Shopee' : 'TikTok'}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm">
                  {log.eventType}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(log.isValid, log.processed)}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(log.isValid, log.processed)}`}>
                      {getStatusLabel(log.isValid, log.processed)}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm">
                  {formatDate(log.createdAt)}
                </td>
                <td className="py-3 px-4 text-sm text-red-600">
                  {log.errorMessage || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <span className="text-sm text-gray-500">
            Tổng {total} webhooks
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