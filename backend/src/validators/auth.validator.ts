import { z } from 'zod'

export const registerSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, 'Số điện thoại phải có ít nhất 10 số')
    .max(11, 'Số điện thoại không được quá 11 số')
    .regex(/^(0|\+84)[3-9]\d{8}$/, 'Số điện thoại không hợp lệ'),
  password: z
    .string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .max(100, 'Mật khẩu không được quá 100 ký tự'),
  name: z.string().min(1, 'Tên không được để trống').max(100).optional(),
  email: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
})

export const loginSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, 'Số điện thoại phải có ít nhất 10 số')
    .max(11, 'Số điện thoại không được quá 11 số')
    .regex(/^(0|\+84)[3-9]\d{8}$/, 'Số điện thoại không hợp lệ'),
  password: z.string().min(1, 'Mật khẩu không được để trống'),
})

export const verifyPinSchema = z.object({
  pin: z
    .string()
    .length(6, 'Mã PIN phải có đúng 6 số')
    .regex(/^\d{6}$/, 'Mã PIN phải là 6 chữ số'),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Mật khẩu hiện tại không được để trống'),
  newPassword: z
    .string()
    .min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự')
    .max(100, 'Mật khẩu mới không được quá 100 ký tự'),
})

export const changePinSchema = z.object({
  currentPin: z
    .string()
    .length(6, 'Mã PIN hiện tại phải có đúng 6 số')
    .regex(/^\d{6}$/, 'Mã PIN hiện tại phải là 6 chữ số'),
  newPin: z
    .string()
    .length(6, 'Mã PIN mới phải có đúng 6 số')
    .regex(/^\d{6}$/, 'Mã PIN mới phải là 6 chữ số'),
})

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token không được để trống'),
})
