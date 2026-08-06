'use client'

import { useState } from 'react'
import { MoreVertical, Trash, Shield, Ban, CheckCircle } from 'lucide-react'

interface BatchOperationsProps {
  selectedIds: string[]
  onBatchDelete: (ids: string[]) => Promise<void>
  onBatchActivate: (ids: string[]) => Promise<void>
  onBatchDeactivate: (ids: string[]) => Promise<void>
  onBatchPromote: (ids: string[]) => Promise<void>
  onClearSelection: () => void
}

export function BatchOperations({
  selectedIds,
  onBatchDelete,
  onBatchActivate,
  onBatchDeactivate,
  onBatchPromote,
  onClearSelection,
}: BatchOperationsProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleAction = async (action: () => Promise<void>) => {
    setIsLoading(true)
    try {
      await action()
      onClearSelection()
    } catch (error) {
      console.error('Batch action failed:', error)
    } finally {
      setIsLoading(false)
      setIsMenuOpen(false)
    }
  }

  if (selectedIds.length === 0) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-4 z-50">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            Đã chọn {selectedIds.length} mục
          </span>
        </div>

        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />

        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <MoreVertical className="w-4 h-4" />
            <span className="text-sm font-medium">Thao tác hàng loạt</span>
          </button>

          {isMenuOpen && (
            <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-2 min-w-[200px]">
              <button
                onClick={() => handleAction(() => onBatchActivate(selectedIds))}
                disabled={isLoading}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4 text-green-600" />
                Kích hoạt
              </button>
              <button
                onClick={() => handleAction(() => onBatchDeactivate(selectedIds))}
                disabled={isLoading}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <Ban className="w-4 h-4 text-red-600" />
                Vô hiệu hóa
              </button>
              <button
                onClick={() => handleAction(() => onBatchPromote(selectedIds))}
                disabled={isLoading}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <Shield className="w-4 h-4 text-purple-600" />
                Thăng Admin
              </button>
              <div className="border-t border-gray-200 dark:border-gray-700 my-2" />
              <button
                onClick={() => handleAction(() => onBatchDelete(selectedIds))}
                disabled={isLoading}
                className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
              >
                <Trash className="w-4 h-4" />
                Xóa
              </button>
            </div>
          )}
        </div>

        <button
          onClick={onClearSelection}
          disabled={isLoading}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
        >
          Bỏ chọn
        </button>
      </div>
    </div>
  )
}