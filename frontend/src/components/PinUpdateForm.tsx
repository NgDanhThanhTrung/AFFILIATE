'use client'

import { useState } from 'react'
import { profileApi } from '../lib/profileApi'
import { PinUpdateInput } from '../types/profile.types'
import { Button } from './ui/Button'
import { Lock, AlertCircle, Check } from 'lucide-react'

interface PinUpdateFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function PinUpdateForm({ onSuccess, onCancel }: PinUpdateFormProps) {
  const [formData, setFormData] = useState<PinUpdateInput>({
    currentPin: '',
    newPin: '',
    confirmPin: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPin, setShowPin] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await profileApi.updatePin(formData)
      onSuccess?.()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật PIN')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    // Only allow numbers
    const numericValue = value.replace(/\D/g, '').slice(0, 6)
    setFormData(prev => ({
      ...prev,
      [name]: numericValue,
    }))
  }

  const validatePin = (pin: string) => {
    if (pin.length !== 6) return false
    // Check for common PINs
    const commonPins = ['123456', '111111', '000000', '222222', '333333', '444444', '555555', '666666', '777777', '888888', '999999']
    if (commonPins.includes(pin)) return false
    // Check for sequential numbers
    const isSequential = pin.split('').every((char, i, arr) => i === 0 || parseInt(char) === parseInt(arr[i-1]) + 1)
    if (isSequential) return false
    return true
  }

  const isNewPinValid = validatePin(formData.newPin)
  const isPinMatch = formData.newPin === formData.confirmPin && formData.newPin.length === 6
  const isDifferent = formData.currentPin !== formData.newPin && formData.newPin.length === 6

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Đổi PIN</h3>
        {onCancel && (
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Lock className="w-5 h-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            PIN hiện tại
          </label>
          <div className="relative">
            <input
              type={showPin ? 'text' : 'password'}
              name="currentPin"
              value={formData.currentPin}
              onChange={handleChange}
              placeholder="Nhập PIN hiện tại"
              maxLength={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <button
              type="button"
              onClick={() => setShowPin(!showPin)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPin ? 'Ẩn' : 'Hiện'}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            PIN mới
          </label>
          <input
            type="password"
            name="newPin"
            value={formData.newPin}
            onChange={handleChange}
            placeholder="Nhập PIN mới (6 chữ số)"
            maxLength={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          {formData.newPin.length > 0 && (
            <div className="mt-2 flex items-center gap-2 text-sm">
              {isNewPinValid ? (
                <span className="text-green-600 flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  PIN hợp lệ
                </span>
              ) : (
                <span className="text-orange-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  PIN không được dùng các số đơn giản
                </span>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Xác nhận PIN mới
          </label>
          <input
            type="password"
            name="confirmPin"
            value={formData.confirmPin}
            onChange={handleChange}
            placeholder="Nhập lại PIN mới"
            maxLength={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          {formData.confirmPin.length > 0 && (
            <div className="mt-2 flex items-center gap-2 text-sm">
              {isPinMatch ? (
                <span className="text-green-600 flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  PIN khớp
                </span>
              ) : (
                <span className="text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  PIN không khớp
                </span>
              )}
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <Button
          type="submit"
          isLoading={isLoading}
          disabled={!isNewPinValid || !isPinMatch || !isDifferent}
          className="w-full"
        >
          Cập nhật PIN
        </Button>
      </form>
    </div>
  )
}