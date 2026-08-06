'use client'

import { useEffect, useState } from 'react'
import { walletApi } from '../lib/walletApi'
import { WithdrawalInput, BankAccountResponse } from '../types/wallet.types'
import { Button } from './ui/Button'
import { X, Wallet, AlertCircle, Info } from 'lucide-react'

interface WithdrawalFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function WithdrawalForm({ onSuccess, onCancel }: WithdrawalFormProps) {
  const [bankAccounts, setBankAccounts] = useState<BankAccountResponse[]>([])
  const [formData, setFormData] = useState<WithdrawalInput>({
    bankAccountId: '',
    amount: 0,
    pin: '',
  })
  const [balance, setBalance] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState('')

  const MIN_AMOUNT = 50000
  const MAX_AMOUNT = 10000000
  const FEE_PERCENT = 0.02

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsFetching(true)
    try {
      const [accounts, walletData] = await Promise.all([
        walletApi.getBankAccounts(),
        walletApi.getWallet(),
      ])
      setBankAccounts(accounts)
      setBalance(walletData.balance)

      // Set default bank account if available
      if (accounts.length > 0) {
        const defaultAccount = accounts.find(acc => acc.isDefault) || accounts[0]
        setFormData(prev => ({ ...prev, bankAccountId: defaultAccount.id }))
      }
    } catch (err) {
      console.error('Failed to fetch data:', err)
    } finally {
      setIsFetching(false)
    }
  }

  const calculateFee = (amount: number) => {
    return Math.floor(amount * FEE_PERCENT)
  }

  const calculateNetAmount = (amount: number) => {
    return amount - calculateFee(amount)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await walletApi.createWithdrawalRequest(formData)
      onSuccess?.()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi tạo yêu cầu rút tiền')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value,
    }))
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount)
  }

  if (isFetching) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (bankAccounts.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="text-center py-8">
          <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Bạn chưa có tài khoản ngân hàng nào</p>
          <p className="text-sm text-gray-500">Vui lòng thêm tài khoản ngân hàng để rút tiền</p>
        </div>
      </div>
    )
  }

  const fee = calculateFee(formData.amount)
  const netAmount = calculateNetAmount(formData.amount)
  const isValidAmount = formData.amount >= MIN_AMOUNT && formData.amount <= MAX_AMOUNT
  const hasSufficientBalance = formData.amount <= balance

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Yêu cầu rút tiền</h3>
        {onCancel && (
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tài khoản ngân hàng
          </label>
          <select
            name="bankAccountId"
            value={formData.bankAccountId}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            {bankAccounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.bankName} - {account.accountNumber} ({account.accountName})
                {account.isDefault && ' - Mặc định'}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Số tiền rút
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount || ''}
            onChange={handleChange}
            placeholder="Nhập số tiền muốn rút"
            min={MIN_AMOUNT}
            max={MAX_AMOUNT}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <div className="flex items-center gap-2 mt-2 text-sm">
            <Info className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">
              Số dư khả dụng: {formatCurrency(balance)}
            </span>
          </div>
        </div>

        {formData.amount > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Số tiền rút:</span>
              <span className="font-medium">{formatCurrency(formData.amount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Phí ({(FEE_PERCENT * 100).toFixed(0)}%):</span>
              <span className="font-medium text-red-600">-{formatCurrency(fee)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between">
              <span className="font-medium">Số tiền nhận được:</span>
              <span className="font-bold text-green-600">{formatCurrency(netAmount)}</span>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            PIN xác thực
          </label>
          <input
            type="password"
            name="pin"
            value={formData.pin}
            onChange={handleChange}
            placeholder="Nhập 6 chữ số PIN"
            maxLength={6}
            pattern="[0-9]{6}"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {!isValidAmount && formData.amount > 0 && (
          <div className="flex items-center gap-2 text-orange-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            Số tiền rút phải từ {formatCurrency(MIN_AMOUNT)} đến {formatCurrency(MAX_AMOUNT)}
          </div>
        )}

        {!hasSufficientBalance && formData.amount > 0 && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            Số dư không đủ
          </div>
        )}

        <Button
          type="submit"
          isLoading={isLoading}
          disabled={!isValidAmount || !hasSufficientBalance || !formData.pin}
          className="w-full"
        >
          Xác nhận rút tiền
        </Button>
      </form>
    </div>
  )
}