'use client'

import { useState } from 'react'
import { authApi } from '../../../../lib/api/auth'
import { Input } from '../../../../components/ui/Input'
import { Button } from '../../../../components/ui/Button'

export default function SecurityPage() {
  const [activeTab, setActiveTab] = useState<'password' | 'pin'>('password')
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [pinForm, setPinForm] = useState({
    currentPin: '',
    newPin: '',
    confirmPin: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}

    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = 'Mật khẩu hiện tại không được để trống'
    }
    if (!passwordForm.newPassword) {
      newErrors.newPassword = 'Mật khẩu mới không được để trống'
    } else if (passwordForm.newPassword.length < 6) {
      newErrors.newPassword = 'Mật khẩu mới phải có ít nhất 6 ký tự'
    }
    if (!passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới'
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp'
    }

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setIsLoading(true)
    setMessage(null)

    try {
      await authApi.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      })

      setMessage({ type: 'success', text: 'Đổi mật khẩu thành công' })
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Đổi mật khẩu thất bại' })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}

    if (!pinForm.currentPin) {
      newErrors.currentPin = 'Mã PIN hiện tại không được để trống'
    } else if (!/^\d{6}$/.test(pinForm.currentPin)) {
      newErrors.currentPin = 'Mã PIN phải là 6 chữ số'
    }
    if (!pinForm.newPin) {
      newErrors.newPin = 'Mã PIN mới không được để trống'
    } else if (!/^\d{6}$/.test(pinForm.newPin)) {
      newErrors.newPin = 'Mã PIN phải là 6 chữ số'
    }
    if (!pinForm.confirmPin) {
      newErrors.confirmPin = 'Vui lòng xác nhận mã PIN mới'
    } else if (pinForm.newPin !== pinForm.confirmPin) {
      newErrors.confirmPin = 'Mã PIN xác nhận không khớp'
    }

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setIsLoading(true)
    setMessage(null)

    try {
      await authApi.changePin({
        currentPin: pinForm.currentPin,
        newPin: pinForm.newPin,
      })

      setMessage({ type: 'success', text: 'Đổi mã PIN thành công' })
      setPinForm({ currentPin: '', newPin: '', confirmPin: '' })
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Đổi mã PIN thất bại' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => (window.location.href = '/profile')}
              className="text-blue-600 hover:text-blue-700 mb-4 inline-block"
            >
              ← Quay lại
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Bảo mật</h1>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex border-b mb-6">
              <button
                onClick={() => setActiveTab('password')}
                className={`px-4 py-3 font-medium ${
                  activeTab === 'password'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Đổi mật khẩu
              </button>
              <button
                onClick={() => setActiveTab('pin')}
                className={`px-4 py-3 font-medium ${
                  activeTab === 'pin'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Đổi mã PIN
              </button>
            </div>

            {message && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  message.type === 'success'
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                }`}
              >
                <p
                  className={`text-sm ${
                    message.type === 'success' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {message.text}
                </p>
              </div>
            )}

            {activeTab === 'password' ? (
              <form onSubmit={handlePasswordSubmit}>
                <Input
                  label="Mật khẩu hiện tại"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                  }
                  error={errors.currentPassword}
                  required
                />

                <Input
                  label="Mật khẩu mới"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                  }
                  error={errors.newPassword}
                  required
                />

                <Input
                  label="Xác nhận mật khẩu mới"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                  }
                  error={errors.confirmPassword}
                  required
                />

                <Button type="submit" isLoading={isLoading} className="w-full mt-6">
                  Đổi mật khẩu
                </Button>
              </form>
            ) : (
              <form onSubmit={handlePinSubmit}>
                <Input
                  label="Mã PIN hiện tại"
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  value={pinForm.currentPin}
                  onChange={(e) => setPinForm({ ...pinForm, currentPin: e.target.value })}
                  error={errors.currentPin}
                  required
                />

                <Input
                  label="Mã PIN mới"
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  value={pinForm.newPin}
                  onChange={(e) => setPinForm({ ...pinForm, newPin: e.target.value })}
                  error={errors.newPin}
                  required
                />

                <Input
                  label="Xác nhận mã PIN mới"
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  value={pinForm.confirmPin}
                  onChange={(e) => setPinForm({ ...pinForm, confirmPin: e.target.value })}
                  error={errors.confirmPin}
                  required
                />

                <Button type="submit" isLoading={isLoading} className="w-full mt-6">
                  Đổi mã PIN
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
