'use client'

import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { WalletCard } from '../../components/WalletCard'
import { TransactionHistory } from '../../components/TransactionHistory'
import { BankAccountForm } from '../../components/BankAccountForm'
import { WithdrawalForm } from '../../components/WithdrawalForm'
import { Button } from '../../components/ui/Button'
import { Plus, ArrowDownToLine, CreditCard } from 'lucide-react'

export default function WalletPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const [showBankForm, setShowBankForm] = useState(false)
  const [showWithdrawalForm, setShowWithdrawalForm] = useState(false)

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
          <p className="text-gray-600 mb-4">Vui lòng đăng nhập để xem ví</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Ví của tôi</h1>
            <p className="text-gray-600">Quản lý số dư và giao dịch</p>
          </div>

          <div className="space-y-6">
            {/* Wallet Card */}
            <WalletCard />

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="secondary"
                onClick={() => setShowBankForm(!showBankForm)}
                className="w-full"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Thêm tài khoản ngân hàng
              </Button>
              <Button
                onClick={() => setShowWithdrawalForm(!showWithdrawalForm)}
                className="w-full"
              >
                <ArrowDownToLine className="w-4 h-4 mr-2" />
                Rút tiền
              </Button>
            </div>

            {/* Bank Account Form */}
            {showBankForm && (
              <BankAccountForm
                onSuccess={() => {
                  setShowBankForm(false)
                }}
                onCancel={() => setShowBankForm(false)}
              />
            )}

            {/* Withdrawal Form */}
            {showWithdrawalForm && (
              <WithdrawalForm
                onSuccess={() => {
                  setShowWithdrawalForm(false)
                }}
                onCancel={() => setShowWithdrawalForm(false)}
              />
            )}

            {/* Transaction History */}
            <TransactionHistory />
          </div>
        </div>
      </div>
    </main>
  )
}