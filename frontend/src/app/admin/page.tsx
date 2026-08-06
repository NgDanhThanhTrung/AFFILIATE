'use client'

import { useAuth } from '../../contexts/AuthContext'
import { useState } from 'react'
import { SystemAnalytics } from '../../components/admin/SystemAnalytics'
import { UserManagement } from '../../components/admin/UserManagement'
import { OrderManagement } from '../../components/admin/OrderManagement'
import { WebhookMonitoring } from '../../components/admin/WebhookMonitoring'
import { adminApi } from '../../lib/adminApi'
import { LayoutDashboard, Users, ShoppingCart, Webhook, BarChart3, Shield, AlertTriangle } from 'lucide-react'

export default function AdminPage() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isSettingUp, setIsSettingUp] = useState(false)
  const [setupMessage, setSetupMessage] = useState('')

  const handleDevSetup = async () => {
    setIsSettingUp(true)
    setSetupMessage('')
    try {
      const result = await adminApi.devSetupAdmin()
      setSetupMessage(result.message)
    } catch (err: any) {
      setSetupMessage(err.response?.data?.message || 'Setup failed')
    } finally {
      setIsSettingUp(false)
    }
  }

  if (isLoading) {
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
          <p className="text-gray-600 mb-4">Vui lòng đăng nhập để truy cập trang quản trị</p>
        </div>
      </div>
    )
  }

  // Check if user has admin role
  if (user?.role !== 'ADMIN' && user?.role !== 'SUPER_ADMIN') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không có quyền truy cập</h2>
          <p className="text-gray-600 mb-4">Bạn không có quyền truy cập trang quản trị</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'users', label: 'Người dùng', icon: <Users className="w-4 h-4" /> },
    { id: 'orders', label: 'Đơn hàng', icon: <ShoppingCart className="w-4 h-4" /> },
    { id: 'webhooks', label: 'Webhooks', icon: <Webhook className="w-4 h-4" /> },
    { id: 'analytics', label: 'Phân tích', icon: <BarChart3 className="w-4 h-4" /> },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                  <p className="text-gray-600">Quản lý hệ thống Affiliate Marketing</p>
                </div>
              </div>
              {/* Development setup button */}
              {process.env.NODE_ENV === 'development' && (
                <button
                  onClick={handleDevSetup}
                  disabled={isSettingUp}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
                >
                  {isSettingUp ? 'Đang setup...' : 'Setup Admin'}
                </button>
              )}
            </div>
            {setupMessage && (
              <div className={`mb-4 p-4 rounded-lg ${
                setupMessage.includes('success') || setupMessage.includes('completed')
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                <div className="flex items-center gap-2">
                  {setupMessage.includes('success') || setupMessage.includes('completed') ? (
                    <Shield className="w-5 h-5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5" />
                  )}
                  <p>{setupMessage}</p>
                </div>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-lg mb-6">
            <div className="flex items-center gap-1 p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {activeTab === 'dashboard' && <SystemAnalytics />}
            {activeTab === 'users' && <UserManagement />}
            {activeTab === 'orders' && <OrderManagement />}
            {activeTab === 'webhooks' && <WebhookMonitoring />}
            {activeTab === 'analytics' && <SystemAnalytics />}
          </div>
        </div>
      </div>
    </main>
  )
}