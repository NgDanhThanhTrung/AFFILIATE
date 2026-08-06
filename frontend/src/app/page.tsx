'use client'

import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import Link from 'next/link'
import { LinkConverter } from '../components/LinkConverter'
import { LinkHistory } from '../components/LinkHistory'
import { LinkStats } from '../components/LinkStats'
import { WalletCard } from '../components/WalletCard'
import { ThemeToggle } from '../components/ThemeToggle'
import { LanguageToggle } from '../components/LanguageToggle'

export default function Home() {
  const { user, isAuthenticated, logout, isLoading } = useAuth()
  const { t } = useLanguage()

  const handleLogout = async () => {
    await logout()
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

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Affiliate & Hoàn tiền
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Nhận hoàn tiền khi mua sắm qua link affiliate
              </p>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <LanguageToggle />
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <Link href="/wallet">
                    <button className="px-4 py-2 bg-white rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                      Ví
                    </button>
                  </Link>
                  <Link href="/orders">
                    <button className="px-4 py-2 bg-white rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                      Đơn hàng
                    </button>
                  </Link>
                  <Link href="/profile">
                    <button className="px-4 py-2 bg-white rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                      Hồ sơ
                    </button>
                  </Link>
                  {user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' ? (
                    <Link href="/admin">
                      <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                        Admin
                      </button>
                    </Link>
                  ) : null}
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Link href="/login">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Đăng nhập
                    </button>
                  </Link>
                  <Link href="/register">
                    <button className="px-4 py-2 bg-white rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                      Đăng ký
                    </button>
                  </Link>
                </div>
              )}
          </div>

          {/* Welcome message if authenticated */}
          {isAuthenticated && user && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-900">
                Xin chào, {user.name || user.phoneNumber}! 👋
              </p>
            </div>
          )}

          {/* Link Stats */}
          {isAuthenticated && <LinkStats />}

          {/* Wallet Card */}
          {isAuthenticated && <WalletCard />}

          {/* Link Converter */}
          {isAuthenticated ? (
            <LinkConverter />
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Chuyển đổi Link</h2>
              <p className="text-gray-500 text-center py-8">
                Vui lòng đăng nhập để sử dụng tính năng này
              </p>
            </div>
          )}

          {/* Link History */}
          {isAuthenticated ? (
            <LinkHistory />
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Lịch sử Link</h2>
              <p className="text-gray-500 text-center py-8">
                Đăng nhập để xem lịch sử
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
