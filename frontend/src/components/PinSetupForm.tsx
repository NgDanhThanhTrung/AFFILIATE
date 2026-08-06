'use client'

import { useState } from 'react'
import { profileApi } from '../lib/profileApi'
import { PinCreateInput } from '../types/profile.types'
import { Button } from './ui/Button'
import { Lock, AlertCircle, Check } from 'lucide-react'

interface PinSetupFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function PinSetupForm({ onSuccess, onCancel }: PinSetupFormProps) {
  const [formData, setFormData] = useState<PinCreateInput>({
    pin: '',
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
      await profileApi.createPin(formData)
      onSuccess?.()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi thiết lập PIN')
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

  const isPinValid = validatePin(formData.pin)
  const isPinMatch = formData.pin === formData.confirmPin && formData.pin.length === 6

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Thiết lập PIN</h3>
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
            PIN (6 chữ số)
          </label>
          <div className="relative">
            <input
              type={showPin ? 'text' : 'password'}
              name="pin"
              value={formData.pin}
              onChange={handleChange}
              placeholder="Nhập 6 chữ số PIN"
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
          {formData.pin.length > 0 && (
            <div className="mt-2 flex items-center gap-2 text-sm">
              {isPinValid ? (
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
            Xác nhận PIN
          </label>
          <input
            type="password"
            name="confirmPin"
            value={formData.confirmPin}
            onChange={handleChange}
            placeholder="Nhập lại PIN"
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

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Lưu ý quan trọng:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>PIN được dùng để xác nhận các giao dịch rút tiền</li>
                <li>Nhớ giữ PIN bí mật và không chia sẻ với ai</li>
                <li>Sử dụng PIN có độ khó cao để bảo mật tài khoản</li>
                <li>Không sử dụng các số đơn giản như 123456</li>
              </ul>
            </div>
          </div>
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
          disabled={!isPinValid || !isPinMatch}
          className="w-full"
        >
          Thiết lập PIN
        </Button>
      </form>
    </div>
  )
}