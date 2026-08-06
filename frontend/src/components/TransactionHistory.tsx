'use client'

import { useEffect, useState } from 'react'
import { walletApi } from '../lib/walletApi'
import { TransactionResponse } from '../types/wallet.types'
import { Button } from './ui/Button'
import { RefreshCw, ChevronLeft, ChevronRight, ArrowUp, ArrowDown, RotateCcw, GitCompare } from 'lucide-react'

export function TransactionHistory() {
  const [transactions, setTransactions] = useState<TransactionResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const fetchTransactions = async (currentPage: number = page) => {
    setIsLoading(true)
    try {
      const response = await walletApi.getTransactionHistory({ page: currentPage, limit: 10 })
      setTransactions(response.transactions)
      setTotalPages(response.totalPages)
      setTotal(response.total)
    } catch (err) {
      console.error('Failed to fetch transactions:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
      fetchTransactions(newPage)
    }
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

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'CASHBACK_IN':
        return <ArrowUp className="w-5 h-5 text-green-600" />
      case 'WITHDRAWAL_OUT':
        return <ArrowDown className="w-5 h-5 text-red-600" />
      case 'REFUND_IN':
        return <RotateCcw className="w-5 h-5 text-blue-600" />
      case 'ADJUSTMENT_IN':
        return <GitCompare className="w-5 h-5 text-purple-600" />
      case 'ADJUSTMENT_OUT':
        return <GitCompare className="w-5 h-5 text-orange-600" />
      default:
        return <GitCompare className="w-5 h-5 text-gray-600" />
    }
  }

  const getTransactionLabel = (type: string) => {
    switch (type) {
      case 'CASHBACK_IN':
        return 'Hoàn tiền'
      case 'WITHDRAWAL_OUT':
        return 'Rút tiền'
      case 'REFUND_IN':
        return 'Hoàn lại'
      case 'ADJUSTMENT_IN':
        return 'Điều chỉnh (+)'
      case 'ADJUSTMENT_OUT':
        return 'Điều chỉnh (-)'
      default:
        return type
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'FAILED':
        return 'bg-red-100 text-red-800'
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'Hoàn thành'
      case 'PENDING':
        return 'Đang xử lý'
      case 'FAILED':
        return 'Thất bại'
      case 'CANCELLED':
        return 'Đã hủy'
      default:
        return status
    }
  }

  if (isLoading && transactions.length === 0) {
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
        <h2 className="text-xl font-semibold">Lịch sử giao dịch</h2>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => fetchTransactions()}
          isLoading={isLoading}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Làm mới
        </Button>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Chưa có giao dịch nào</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">
                          {getTransactionLabel(transaction.type)}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(transaction.status)}`}>
                          {getStatusLabel(transaction.status)}
                        </span>
                      </div>
                      {transaction.description && (
                        <p className="text-sm text-gray-600 mb-1">
                          {transaction.description}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        {formatDate(transaction.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.type === 'CASHBACK_IN' ||
                      transaction.type === 'REFUND_IN' ||
                      transaction.type === 'ADJUSTMENT_IN'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}>
                      {transaction.type === 'CASHBACK_IN' ||
                       transaction.type === 'REFUND_IN' ||
                       transaction.type === 'ADJUSTMENT_IN'
                        ? '+'
                        : '-'}
                      {formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Số dư: {formatCurrency(transaction.balanceAfter)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <span className="text-sm text-gray-500">
                Tổng {total} giao dịch
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