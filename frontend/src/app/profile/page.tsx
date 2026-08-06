'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { profileApi } from '../../lib/profileApi'
import { ProfileResponse, UserStats } from '../../types/profile.types'
import { ProfileEditForm } from '../../components/ProfileEditForm'
import { PinSetupForm } from '../../components/PinSetupForm'
import { PinUpdateForm } from '../../components/PinUpdateForm'
import { Button } from '../../components/ui/Button'
import { User, Lock, Edit, Settings, Shield, Calendar, Phone, Mail, AlertTriangle } from 'lucide-react'

export default function ProfilePage() {
  const { isAuthenticated, isLoading } = useAuth()
  const [profile, setProfile] = useState<ProfileResponse | null>(null)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showPinSetup, setShowPinSetup] = useState(false)
  const [showPinUpdate, setShowPinUpdate] = useState(false)
  const [isProfileLoading, setIsProfileLoading] = useState(true)

  useEffect(() => {
    if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated])

  const fetchData = async () => {
    setIsProfileLoading(true)
    try {
      const [profileData, statsData] = await Promise.all([
        profileApi.getProfile(),
        profileApi.getUserStats(),
      ])
      setProfile(profileData)
      setStats(statsData)
    } catch (err) {
      console.error('Failed to fetch profile:', err)
    } finally {
      setIsProfileLoading(false)
    }
  }

  const handleProfileUpdate = () => {
    setShowEditForm(false)
    fetchData()
  }

  const handlePinSetup = () => {
    setShowPinSetup(false)
    fetchData()
  }

  const handlePinUpdate = () => {
    setShowPinUpdate(false)
    fetchData()
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Chưa đăng nhập'
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount)
  }

  if (isLoading || isProfileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Vui lòng đăng nhập để xem hồ sơ</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Hồ sơ của tôi</h1>
            <p className="text-gray-600">Quản lý thông tin cá nhân và cài đặt bảo mật</p>
          </div>

          <div className="space-y-6">
            {/* Profile Edit Form */}
            {showEditForm ? (
              <ProfileEditForm
                onSuccess={handleProfileUpdate}
                onCancel={() => setShowEditForm(false)}
              />
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Thông tin cá nhân</h2>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowEditForm(true)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Chỉnh sửa
                  </Button>
                </div>

                <div className="flex items-start gap-6">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {profile?.avatar ? (
                      <img
                        src={profile.avatar}
                        alt="Avatar"
                        className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                        {profile?.name?.charAt(0).toUpperCase() || profile?.phoneNumber.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <User className="w-4 h-4" />
                        <span>Tên hiển thị</span>
                      </div>
                      <p className="font-medium text-gray-900">
                        {profile?.name || 'Chưa đặt tên'}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <Phone className="w-4 h-4" />
                        <span>Số điện thoại</span>
                      </div>
                      <p className="font-medium text-gray-900">
                        {profile?.phoneNumber}
                        {profile?.isPhoneVerified && (
                          <span className="ml-2 text-green-600 text-sm">✓ Đã xác thực</span>
                        )}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <Mail className="w-4 h-4" />
                        <span>Email</span>
                      </div>
                      <p className="font-medium text-gray-900">
                        {profile?.email || 'Chưa thiết lập'}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <Calendar className="w-4 h-4" />
                        <span>Đăng nhập lần cuối</span>
                      </div>
                      <p className="font-medium text-gray-900">
                        {formatDate(profile?.lastLoginAt || null)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PIN Management */}
            {showPinSetup ? (
              <PinSetupForm
                onSuccess={handlePinSetup}
                onCancel={() => setShowPinSetup(false)}
              />
            ) : showPinUpdate ? (
              <PinUpdateForm
                onSuccess={handlePinUpdate}
                onCancel={() => setShowPinUpdate(false)}
              />
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Lock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">Bảo mật PIN</h2>
                      <p className="text-sm text-gray-500">
                        {profile?.hasPin ? 'PIN đã được thiết lập' : 'Chưa thiết lập PIN'}
                      </p>
                    </div>
                  </div>
                  {profile?.hasPin ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setShowPinUpdate(true)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Đổi PIN
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => setShowPinSetup(true)}
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Thiết lập PIN
                    </Button>
                  )}
                </div>

                {!profile?.hasPin && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-4">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                      <div className="text-sm text-orange-800">
                        <p className="font-medium mb-1">Bạn chưa thiết lập PIN</p>
                        <p>PIN được yêu cầu để thực hiện các giao dịch rút tiền. Hãy thiết lập PIN để bảo vệ tài khoản của bạn.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Statistics */}
            {stats && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Thống kê hoạt động</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {/* Wallet Stats */}
                  {stats.wallet && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-700 mb-3">Ví</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Số dư</span>
                          <span className="font-medium">{formatCurrency(stats.wallet.balance)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Tổng thu</span>
                          <span className="font-medium text-green-600">{formatCurrency(stats.wallet.totalEarned)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Đã rút</span>
                          <span className="font-medium">{formatCurrency(stats.wallet.totalWithdrawn)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Order Stats */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-700 mb-3">Đơn hàng</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Tổng đơn</span>
                        <span className="font-medium">{stats.orders.total}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Hoàn thành</span>
                        <span className="font-medium text-green-600">{stats.orders.completed}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Đang xử lý</span>
                        <span className="font-medium text-yellow-600">{stats.orders.pending}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Hoàn tiền</span>
                        <span className="font-medium">{formatCurrency(stats.orders.totalCashback)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Link Stats */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-700 mb-3">Link Affiliate</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Tổng link</span>
                        <span className="font-medium">{stats.links.total}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Clicks</span>
                        <span className="font-medium">{stats.links.totalClicks}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Chuyển đổi</span>
                        <span className="font-medium text-green-600">{stats.links.totalConversions}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Doanh thu</span>
                        <span className="font-medium">{formatCurrency(stats.links.totalRevenue)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}