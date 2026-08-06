'use client'

import { Download } from 'lucide-react'

interface CSVExportButtonProps {
  onExport: () => void
  disabled?: boolean
  isLoading?: boolean
  label?: string
}

export function CSVExportButton({
  onExport,
  disabled = false,
  isLoading = false,
  label = 'Xuất CSV',
}: CSVExportButtonProps) {
  return (
    <button
      onClick={onExport}
      disabled={disabled || isLoading}
      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Download className="w-4 h-4" />
      <span>{isLoading ? 'Đang xuất...' : label}</span>
    </button>
  )
}