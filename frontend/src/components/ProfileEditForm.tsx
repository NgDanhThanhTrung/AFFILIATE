'use client'

import { useState, useEffect } from 'react'
import { profileApi } from '../lib/profileApi'
import { ProfileResponse, ProfileUpdateInput } from '../types/profile.types'
import { Button } from './ui/Button'
import { User, Mail, Camera, AlertCircle, Check } from 'lucide-react'

interface ProfileEditFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function ProfileEditForm({ onSuccess, onCancel }: ProfileEditFormProps) {
  const [profile, setProfile] = useState<ProfileResponse | null>(null)
  const [formData, setFormData] = useState<ProfileUpdateInput>({
    name: '',
    email: '',
    avatar: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    setIsFetching(true)
    try {
      const data = await profileApi.getProfile()
      setProfile(data)
      setFormData({
        name: data.name || '',
        email: data.email || '',
        avatar: data.avatar || '',
      })
    } catch (err) {
      console.error('Failed to fetch profile:', err)
    } finally {
      setIsFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await profileApi.updateProfile(formData)
      onSuccess?.()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật hồ sơ')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
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

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Chỉnh sửa hồ sơ</h3>
        {onCancel && (
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <User className="w-5 h-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Avatar */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Avatar URL
          </label>
          <div className="flex items-center gap-4">
            {formData.avatar && (
              <img
                src={formData.avatar}
                alt="Avatar"
                className="w-16 h-16 rounded-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            )}
            <div className="flex-1">
              <input
                type="url"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                placeholder="https://example.com/avatar.jpg"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tên hiển thị
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nhập tên của bạn"
            maxLength={100}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="email@example.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {profile?.email && formData.email !== profile.email && (
            <p className="mt-2 text-sm text-orange-600">
              Thay đổi email sẽ cần xác thực lại
            </p>
          )}
        </div>

        {/* Phone (read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Số điện thoại
          </label>
          <input
            type="text"
            value={profile?.phoneNumber || ''}
            disabled
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
          />
          <p className="mt-2 text-sm text-gray-500">
            Số điện thoại không thể thay đổi
          </p>
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
          className="w-full"
        >
          Lưu thay đổi
        </Button>
      </form>
    </div>
  )
}