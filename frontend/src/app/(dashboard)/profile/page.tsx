'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { userApi } from '../../../lib/api/user'
import { UserProfile } from '../../../types/user'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'

export default function ProfilePage() {
  const { user, refreshUser } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const data = await userApi.getProfile()
      setProfile(data)
      setFormData({
        name: data.name || '',
        email: data.email || '',
      })
    } catch (error) {
      setMessage({ type: 'error', text: 'Không thể tải thông tin profile' })
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    setMessage(null)

    try {
      await userApi.updateProfile({
        name: formData.name || undefined,
        email: formData.email || undefined,
      })

      await loadProfile()
      await refreshUser()
      setIsEditing(false)
      setMessage({ type: 'success', text: 'Cập nhật thông tin thành công' })
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Cập nhật thất bại' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: profile?.name || '',
      email: profile?.email || '',
    })
    setIsEditing(false)
    setMessage(null)
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Thông tin cá nhân</h1>
              {!isEditing && (
                <Button onClick={() => setIsEditing(true)} variant="secondary">
                  Chỉnh sửa
                </Button>
              )}
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

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <p className="text-gray-900">{profile.phoneNumber}</p>
                {profile.isPhoneVerified && (
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 mt-1">
                    Đã xác minh
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mã PIN
                </label>
                <p className="text-gray-900">
                  {profile.hasPin ? 'Đã thiết lập' : 'Chưa thiết lập'}
                </p>
                {!profile.hasPin && (
                  <button
                    onClick={() => (window.location.href = '/setup-pin')}
                    className="text-blue-600 hover:text-blue-700 text-sm mt-1"
                  >
                    Thiết lập ngay
                  </button>
                )}
              </div>

              {isEditing ? (
                <>
                  <Input
                    label="Tên"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nhập tên của bạn"
                  />

                  <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="example@email.com"
                  />

                  <div className="flex gap-3">
                    <Button onClick={handleSave} isLoading={isLoading}>
                      Lưu thay đổi
                    </Button>
                    <Button onClick={handleCancel} variant="secondary" disabled={isLoading}>
                      Hủy
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên
                    </label>
                    <p className="text-gray-900">{profile.name || 'Chưa cập nhật'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <p className="text-gray-900">{profile.email || 'Chưa cập nhật'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngày tham gia
                    </label>
                    <p className="text-gray-900">
                      {new Date(profile.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>

                  {profile.lastLoginAt && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Đăng nhập lần cuối
                      </label>
                      <p className="text-gray-900">
                        {new Date(profile.lastLoginAt).toLocaleString('vi-VN')}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Bảo mật</h2>
            <div className="space-y-3">
              <button
                onClick={() => (window.location.href = '/profile/security')}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between"
              >
                <span className="text-gray-900">Đổi mật khẩu</span>
                <span className="text-gray-400">→</span>
              </button>
              <button
                onClick={() => (window.location.href = '/profile/bank-accounts')}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between"
              >
                <span className="text-gray-900">Quản lý tài khoản ngân hàng</span>
                <span className="text-gray-400">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
