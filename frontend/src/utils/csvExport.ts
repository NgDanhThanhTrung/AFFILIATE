/**
 * CSV Export Utility
 */

export interface CSVExportData {
  [key: string]: string | number | boolean | null | undefined
}

export function exportToCSV(
  data: CSVExportData[],
  filename: string,
  headers?: string[]
) {
  if (!data || data.length === 0) {
    console.warn('No data to export')
    return
  }

  // Use provided headers or extract from first row
  const columns = headers || Object.keys(data[0])

  // Create CSV content
  const csvContent = [
    // Header row
    columns.join(','),
    // Data rows
    ...data.map(row =>
      columns.map(column => {
        const value = row[column]
        // Handle different data types
        if (value === null || value === undefined) {
          return ''
        }
        if (typeof value === 'string') {
          // Escape quotes and wrap in quotes if contains comma
          const escaped = value.replace(/"/g, '""')
          return escaped.includes(',') || escaped.includes('"') ? `"${escaped}"` : escaped
        }
        return String(value)
      }).join(',')
    ),
  ].join('\n')

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

export function exportUsersToCSV(users: any[]) {
  const csvData = users.map(user => ({
    'ID': user.id,
    'Số điện thoại': user.phoneNumber,
    'Tên': user.name || '',
    'Email': user.email || '',
    'Vai trò': user.role,
    'Trạng thái': user.isActive ? 'Đang hoạt động' : 'Đã khóa',
    'Số dư': user.wallet?.balance || 0,
    'Tổng thu': user.wallet?.totalEarned || 0,
    'Ngày tham gia': new Date(user.createdAt).toLocaleDateString('vi-VN'),
    'Đăng nhập lần cuối': user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('vi-VN') : '',
  }))

  exportToCSV(csvData, `users_${new Date().toISOString().split('T')[0]}`)
}

export function exportOrdersToCSV(orders: any[]) {
  const csvData = orders.map(order => ({
    'ID': order.id,
    'Mã đơn hàng': order.platformOrderId,
    'Nền tảng': order.platform,
    'Trạng thái': order.status,
    'Giá trị đơn': order.orderAmount,
    'Hoàn tiền': order.cashbackAmount,
    'Ngày đặt': new Date(order.orderDate).toLocaleDateString('vi-VN'),
    'Ngày hoàn thành': order.completedDate ? new Date(order.completedDate).toLocaleDateString('vi-VN') : '',
  }))

  exportToCSV(csvData, `orders_${new Date().toISOString().split('T')[0]}`)
}

export function exportTransactionsToCSV(transactions: any[]) {
  const csvData = transactions.map(tx => ({
    'ID': tx.id,
    'Loại': tx.type,
    'Số tiền': tx.amount,
    'Trạng thái': tx.status,
    'Mô tả': tx.description || '',
    'Ngày tạo': new Date(tx.createdAt).toLocaleDateString('vi-VN'),
  }))

  exportToCSV(csvData, `transactions_${new Date().toISOString().split('T')[0]}`)
}