'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authApi } from '../../../lib/api/auth'
import { PinInput } from '../../../components/auth/PinInput'
import { Button } from '../../../components/ui/Button'

export default function SetupPinPage() {
  const router = useRouter()
  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [step, setStep] = useState(1) // 1: enter PIN, 2: confirm PIN
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handlePinComplete = (value: string) => {
    if (step === 1) {
      setPin(value)
      setStep(2)
      setError('')
    } else {
      setConfirmPin(value)
    }
  }

  const handleConfirm = async () => {
    if (pin !== confirmPin) {
      setError('Mã PIN không khớp')
      setStep(1)
      setPin('')
      setConfirmPin('')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      await authApi.setupPin(pin)
      router.push('/')
    } catch (error: any) {
      setError(error.response?.data?.message || 'Thiết lập mã PIN thất bại')
      setStep(1)
      setPin('')
      setConfirmPin('')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    if (step === 2) {
      setStep(1)
      setPin('')
      setConfirmPin('')
      setError('')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {step === 1 ? 'Thiết lập Mã PIN' : 'Xác nhận Mã PIN'}
            </h1>
            <p className="text-gray-600">
              {step === 1
                ? 'Nhập mã PIN 6 chữ số để bảo mật tài khoản'
                : 'Nhập lại mã PIN để xác nhận'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="mb-8">
            <PinInput onComplete={handlePinComplete} error={error} />
          </div>

          {step === 2 && (
            <div className="space-y-4">
              <Button onClick={handleConfirm} isLoading={isLoading} className="w-full">
                Xác nhận
              </Button>
              <Button
                onClick={handleReset}
                variant="secondary"
                className="w-full"
                disabled={isLoading}
              >
                Nhập lại
              </Button>
            </div>
          )}

          {step === 1 && (
            <p className="text-center text-sm text-gray-500 mt-4">
              Mã PIN sẽ được yêu cầu khi rút tiền hoặc thực hiện các giao dịch quan trọng
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
