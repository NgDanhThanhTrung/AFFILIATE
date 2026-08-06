'use client'

import { useEffect, useState } from 'react'
import { walletApi } from '../lib/walletApi'
import { WalletResponse } from '../types/wallet.types'
import { Wallet, TrendingUp, ArrowDownToLine, AlertCircle } from 'lucide-react'

export function WalletCard() {
  const [wallet, setWallet] = useState<WalletResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchWallet()
  }, [])

  const fetchWallet = async () => {
    setIsLoading(true)
    try {
      const data = await walletApi.getWallet()
      setWallet(data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra')
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

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
        <div className="animate-pulse">
          <div className="h-20 bg-white/20 rounded-lg mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-white/20 rounded"></div>
            <div className="h-4 bg-white/20 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (!wallet) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wallet className="w-6 h-6" />
          <span className="font-semibold">Ví của tôi</span>
        </div>
        <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
          {wallet.currency}
        </span>
      </div>

      <div className="mb-6">
        <p className="text-sm text-white/80 mb-1">Số dư khả dụng</p>
        <p className="text-3xl font-bold">{formatCurrency(wallet.balance)}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/10 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm text-white/80">Tổng thu</span>
          </div>
          <p className="font-semibold">{formatCurrency(wallet.totalEarned)}</p>
        </div>

        <div className="bg-white/10 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <ArrowDownToLine className="w-4 h-4" />
            <span className="text-sm text-white/80">Đã rút</span>
          </div>
          <p className="font-semibold">{formatCurrency(wallet.totalWithdrawn)}</p>
        </div>
      </div>
    </div>
  )
}