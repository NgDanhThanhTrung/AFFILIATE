'use client'

import { useEffect, useState } from 'react'
import { adminApi } from '../../lib/adminApi'
import { AdminUser } from '../../types/admin.types'
import { Button } from '../ui/Button'
import { Search, Filter, MoreVertical, Shield, Ban, Check, User as UserIcon } from 'lucide-react'

export function UserManagement() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('')

  const fetchUsers = async (currentPage: number = page) => {
    setIsLoading(true)
    try {
      const params: any = { page: currentPage, limit: 10 }
      if (search) params.search = search
      if (roleFilter) params.role = roleFilter
      if (statusFilter) params.isActive = statusFilter === 'active'

      const response = await adminApi.getAllUsers(params)
      setUsers(response.users)
      setTotalPages(response.totalPages)
      setTotal(response.total)
    } catch (err) {
      console.error('Failed to fetch users:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [search, roleFilter, statusFilter])

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await adminApi.toggleUserStatus(userId, !currentStatus)
      fetchUsers()
    } catch (err) {
      console.error('Failed to toggle user status:', err)
    }
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await adminApi.updateUserRole(userId, newRole)
      fetchUsers()
    } catch (err) {
      console.error('Failed to update user role:', err)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  if (isLoading && users.length === 0) {
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Quản lý người dùng</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tất cả vai trò</option>
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
            <option value="SUPER_ADMIN">Super Admin</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Đã khóa</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-medium text-gray-600">Người dùng</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Vai trò</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Trạng thái</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Ví</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Hoạt động</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Ngày tham gia</th>
              <th className="text-right py-3 px-4 font-medium text-gray-600">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    {user.avatar ? (
                      <img src={user.avatar} alt="" className="w-8 h-8 rounded-full" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                        {user.name?.charAt(0) || user.phoneNumber.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{user.name || 'Chưa đặt tên'}</p>
                      <p className="text-sm text-gray-500">{user.phoneNumber}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                  </select>
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleToggleStatus(user.id, user.isActive)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {user.isActive ? 'Đang hoạt động' : 'Đã khóa'}
                  </button>
                </td>
                <td className="py-3 px-4">
                  {user.wallet ? (
                    <div>
                      <p className="font-medium">{formatCurrency(user.wallet.balance)}</p>
                      <p className="text-xs text-gray-500">{formatCurrency(user.wallet.totalEarned)} thu</p>
                    </div>
                  ) : (
                    <span className="text-gray-400">Chưa có ví</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm">
                    <p>{user._count.orders} đơn</p>
                    <p className="text-gray-500">{user._count.affiliateLinks} link</p>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm">
                  {formatDate(user.createdAt)}
                </td>
                <td className="py-3 px-4 text-right">
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <span className="text-sm text-gray-500">
            Tổng {total} người dùng
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Trước
            </Button>
            <span className="text-sm text-gray-600">
              Trang {page} / {totalPages}
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              Sau
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}