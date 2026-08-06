import { z } from 'zod'

export const updateProfileSchema = z.object({
  name: z.string().min(1, 'Tên không được để trống').max(100).optional(),
  email: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
  avatar: z.string().url('URL avatar không hợp lệ').optional(),
})

export const bankAccountSchema = z.object({
  bankName: z.string().min(1, 'Tên ngân hàng không được để trống').max(100),
  bankCode: z.string().min(1, 'Mã ngân hàng không được để trống').max(20),
  accountNumber: z.string().min(1, 'Số tài khoản không được để trống').max(50),
  accountName: z.string().min(1, 'Tên chủ tài khoản không được để trống').max(100),
  isDefault: z.boolean().optional(),
})

export const updateBankAccountSchema = bankAccountSchema.partial()
