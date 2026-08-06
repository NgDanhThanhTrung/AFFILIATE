'use client'

import { useState } from 'react'
import { walletApi } from '../lib/walletApi'
import { BankAccountInput } from '../types/wallet.types'
import { Button } from './ui/Button'
import { X, Plus } from 'lucide-react'

interface BankAccountFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function BankAccountForm({ onSuccess, onCancel }: BankAccountFormProps) {
  const [formData, setFormData] = useState<BankAccountInput>({
    bankName: '',
    bankCode: '',
    accountNumber: '',
    accountName: '',
    isDefault: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await walletApi.createBankAccount(formData)
      onSuccess?.()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi thêm tài khoản ngân hàng')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Thêm tài khoản ngân hàng</h3>
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
            Tên ngân hàng
          </label>
          <input
            type="text"
            name="bankName"
            value={formData.bankName}
            onChange={handleChange}
            placeholder="Ví dụ: Vietcombank"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mã ngân hàng
          </label>
          <input
            type="text"
            name="bankCode"
            value={formData.bankCode}
            onChange={handleChange}
            placeholder="Ví dụ: VCB"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Số tài khoản
          </label>
          <input
            type="text"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            placeholder="Nhập số tài khoản"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tên chủ tài khoản
          </label>
          <input
            type="text"
            name="accountName"
            value={formData.accountName}
            onChange={handleChange}
            placeholder="Nhập tên chủ tài khoản"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isDefault"
            name="isDefault"
            checked={formData.isDefault}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="isDefault" className="text-sm text-gray-700">
            Đặt làm tài khoản mặc định
          </label>
        </div>

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm tài khoản
        </Button>
      </form>
    </div>
  )
}