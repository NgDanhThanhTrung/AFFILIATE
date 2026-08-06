'use client'

import { useEffect, useState } from 'react'
import { affiliateApi } from '../lib/affiliateApi'
import { LinkHistoryItem } from '../types/affiliate.types'
import { Button } from './ui/Button'
import { Copy, Check, ExternalLink, Trash2, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react'

export function LinkHistory() {
  const [links, setLinks] = useState<LinkHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchLinks = async (currentPage: number = page) => {
    setIsLoading(true)
    try {
      const response = await affiliateApi.getLinkHistory({ page: currentPage, limit: 10 })
      setLinks(response.links)
      setTotalPages(response.totalPages)
      setTotal(response.total)
    } catch (err) {
      console.error('Failed to fetch links:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLinks()
  }, [])

  const handleCopy = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa link này?')) return

    setDeletingId(id)
    try {
      await affiliateApi.deleteLink(id)
      setLinks(links.filter(link => link.id !== id))
      setTotal(total - 1)
    } catch (err) {
      console.error('Failed to delete link:', err)
    } finally {
      setDeletingId(null)
    }
  }

  const handleOpenLink = (url: string) => {
    window.open(url, '_blank')
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
      fetchLinks(newPage)
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (isLoading && links.length === 0) {
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
        <h2 className="text-xl font-semibold">Lịch sử Link</h2>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => fetchLinks()}
          isLoading={isLoading}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Làm mới
        </Button>
      </div>

      {links.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Chưa có link nào được chuyển đổi</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {links.map((link) => (
              <div
                key={link.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        link.platform === 'SHOPEE'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-black text-white'
                      }`}>
                        {link.platform === 'SHOPEE' ? 'Shopee' : 'TikTok'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(link.createdAt)}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 truncate mb-2">
                      {link.originalUrl}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{link.clickCount} clicks</span>
                      <span>{link.conversionCount} chuyển đổi</span>
                      <span className="text-green-600 font-medium">
                        {formatCurrency(link.totalRevenue)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(link.affiliateUrl, link.id)}
                      className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Sao chép"
                    >
                      {copiedId === link.id ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleOpenLink(link.affiliateUrl)}
                      className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Mở link"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(link.id)}
                      disabled={deletingId === link.id}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Xóa"
                    >
                      {deletingId === link.id ? (
                        <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <span className="text-sm text-gray-500">
                Tổng {total} link
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