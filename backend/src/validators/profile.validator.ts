import { z } from 'zod'

export const updateProfileSchema = z.object({
  name: z.string().min(1, 'Tên không được để trống').max(100, 'Tên không được quá 100 ký tự').optional(),
  email: z.string().email('Email không hợp lệ').optional(),
  avatar: z.string().url('URL avatar không hợp lệ').optional(),
})

export const createPinSchema = z.object({
  pin: z.string().length(6, 'PIN phải có 6 chữ số').regex(/^\d+$/, 'PIN phải là số'),
  confirmPin: z.string().length(6, 'PIN xác nhận phải có 6 chữ số').regex(/^\d+$/, 'PIN xác nhận phải là số'),
}).refine((data) => data.pin === data.confirmPin, {
  message: 'PIN không khớp',
  path: ['confirmPin'],
})

export const updatePinSchema = z.object({
  currentPin: z.string().length(6, 'PIN hiện tại phải có 6 chữ số').regex(/^\d+$/, 'PIN hiện tại phải là số'),
  newPin: z.string().length(6, 'PIN mới phải có 6 chữ số').regex(/^\d+$/, 'PIN mới phải là số'),
  confirmPin: z.string().length(6, 'PIN xác nhận phải có 6 chữ số').regex(/^\d+$/, 'PIN xác nhận phải là số'),
}).refine((data) => data.newPin === data.confirmPin, {
  message: 'PIN mới không khớp',
  path: ['confirmPin'],
}).refine((data) => data.currentPin !== data.newPin, {
  message: 'PIN mới phải khác PIN hiện tại',
  path: ['newPin'],
})

export const resetPinSchema = z.object({
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type CreatePinInput = z.infer<typeof createPinSchema>
export type UpdatePinInput = z.infer<typeof updatePinSchema>
export type ResetPinInput = z.infer<typeof resetPinSchema>