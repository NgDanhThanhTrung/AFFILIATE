import { z } from 'zod'
import { TransactionType, WithdrawalStatus } from '@prisma/client'

export const createBankAccountSchema = z.object({
  bankName: z.string().min(1, 'Tên ngân hàng không được để trống'),
  bankCode: z.string().min(1, 'Mã ngân hàng không được để trống'),
  accountNumber: z.string().min(1, 'Số tài khoản không được để trống'),
  accountName: z.string().min(1, 'Tên chủ tài khoản không được để trống'),
  isDefault: z.boolean().optional(),
})

export const updateBankAccountSchema = z.object({
  bankName: z.string().min(1, 'Tên ngân hàng không được để trống').optional(),
  bankCode: z.string().min(1, 'Mã ngân hàng không được để trống').optional(),
  accountNumber: z.string().min(1, 'Số tài khoản không được để trống').optional(),
  accountName: z.string().min(1, 'Tên chủ tài khoản không được để trống').optional(),
  isDefault: z.boolean().optional(),
})

export const createWithdrawalSchema = z.object({
  bankAccountId: z.string().min(1, 'ID tài khoản ngân hàng không được để trống'),
  amount: z.number().min(50000, 'Số tiền rút tối thiểu là 50,000 VND').max(10000000, 'Số tiền rút tối đa là 10,000,000 VND'),
  pin: z.string().length(6, 'PIN phải có 6 ký tự'),
})

export const getTransactionHistorySchema = z.object({
  page: z.string().optional().transform((val) => val ? parseInt(val) : 1),
  limit: z.string().optional().transform((val) => val ? parseInt(val) : 20),
  type: z.enum(['CASHBACK_IN', 'WITHDRAWAL_OUT', 'REFUND_IN', 'ADJUSTMENT_IN', 'ADJUSTMENT_OUT']).optional(),
  status: z.enum(['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

export const getWithdrawalHistorySchema = z.object({
  page: z.string().optional().transform((val) => val ? parseInt(val) : 1),
  limit: z.string().optional().transform((val) => val ? parseInt(val) : 20),
  status: z.enum(['PENDING', 'APPROVED', 'PROCESSING', 'COMPLETED', 'REJECTED', 'FAILED']).optional(),
})

export type CreateBankAccountInput = z.infer<typeof createBankAccountSchema>
export type UpdateBankAccountInput = z.infer<typeof updateBankAccountSchema>
export type CreateWithdrawalInput = z.infer<typeof createWithdrawalSchema>
export type GetTransactionHistoryInput = z.infer<typeof getTransactionHistorySchema>
export type GetWithdrawalHistoryInput = z.infer<typeof getWithdrawalHistorySchema>