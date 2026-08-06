'use client'

import { useState, useEffect } from 'react'
import { userApi } from '../../../../lib/api/user'
import { BankAccount, AddBankAccountData } from '../../../../types/user'
import { Input } from '../../../../components/ui/Input'
import { Button } from '../../../../components/ui/Button'

export default function BankAccountsPage() {
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState<AddBankAccountData>({
    bankName: '',
    bankCode: '',
    accountNumber: '',
    accountName: '',
    isDefault: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    loadAccounts()
  }, [])

  const loadAccounts = async () => {
    try {
      const data = await userApi.getBankAccounts()
      setAccounts(data)
    } catch (error) {
      setMessage({ type: 'error', text: 'Không thể tải danh sách tài khoản ngân hàng' })
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}

    if (!formData.bankName) newErrors.bankName = 'Tên ngân hàng không được để trống'
    if (!formData.bankCode) newErrors.bankCode = 'Mã ngân hàng không được để trống'
    if (!formData.accountNumber) newErrors.accountNumber = 'Số tài khoản không được để trống'
    if (!formData.accountName) newErrors.accountName = 'Tên chủ tài khoản không được để trống'

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setIsLoading(true)
    setMessage(null)

    try {
      await userApi.addBankAccount(formData)
      await loadAccounts()
      setIsAdding(false)
      setFormData({
        bankName: '',
        bankCode: '',
        accountNumber: '',
        accountName: '',
        isDefault: false,
      })
      setMessage({ type: 'success', text: 'Thêm tài khoản ngân hàng thành công' })
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Thêm tài khoản thất bại' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSetDefault = async (id: string) => {
    try {
      await userApi.setDefaultBankAccount(id)
      await loadAccounts()
      setMessage({ type: 'success', text: 'Đặt tài khoản mặc định thành công' })
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Thao tác thất bại' })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa tài khoản ngân hàng này?')) return

    try {
      await userApi.deleteBankAccount(id)
      await loadAccounts()
      setMessage({ type: 'success', text: 'Xóa tài khoản ngân hàng thành công' })
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Xóa tài khoản thất bại' })
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
            <h1 className="text-2xl font-bold text-gray-900">Tài khoản ngân hàng</h1>
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

          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Danh sách tài khoản</h2>
              <Button onClick={() => setIsAdding(!isAdding)} variant="secondary">
                {isAdding ? 'Hủy' : '+ Thêm tài khoản'}
              </Button>
            </div>

            {isAdding && (
              <form onSubmit={handleAdd} className="mb-6 p-4 bg-gray-50 rounded-lg">
                <Input
                  label="Tên ngân hàng"
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  placeholder="VD: Vietcombank"
                  error={errors.bankName}
                  required
                />

                <Input
                  label="Mã ngân hàng"
                  type="text"
                  value={formData.bankCode}
                  onChange={(e) => setFormData({ ...formData, bankCode: e.target.value })}
                  placeholder="VD: VCB"
                  error={errors.bankCode}
                  required
                />

                <Input
                  label="Số tài khoản"
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  placeholder="Nhập số tài khoản"
                  error={errors.accountNumber}
                  required
                />

                <Input
                  label="Tên chủ tài khoản"
                  type="text"
                  value={formData.accountName}
                  onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                  placeholder="Nhập tên chủ tài khoản"
                  error={errors.accountName}
                  required
                />

                <label className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Đặt làm tài khoản mặc định</span>
                </label>

                <Button type="submit" isLoading={isLoading} className="w-full">
                  Thêm tài khoản
                </Button>
              </form>
            )}

            {accounts.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Chưa có tài khoản ngân hàng nào</p>
            ) : (
              <div className="space-y-4">
                {accounts.map((account) => (
                  <div
                    key={account.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{account.bankName}</h3>
                          {account.isDefault && (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              Mặc định
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          Số tài khoản: {account.accountNumber}
                        </p>
                        <p className="text-sm text-gray-600">Chủ tài khoản: {account.accountName}</p>
                      </div>
                      <div className="flex gap-2">
                        {!account.isDefault && (
                          <Button
                            onClick={() => handleSetDefault(account.id)}
                            variant="secondary"
                            size="sm"
                          >
                            Đặt mặc định
                          </Button>
                        )}
                        <Button
                          onClick={() => handleDelete(account.id)}
                          variant="danger"
                          size="sm"
                        >
                          Xóa
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Lưu ý quan trọng</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Tài khoản ngân hàng sẽ được dùng để nhận tiền khi rút</li>
              <li>• Vui lòng cung cấp thông tin chính xác</li>
              <li>• Không thể xóa tài khoản đang có yêu cầu rút tiền đang xử lý</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
