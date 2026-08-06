import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 10

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export async function hashPin(pin: string): Promise<string> {
  return bcrypt.hash(pin, SALT_ROUNDS)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function verifyPin(pin: string, hash: string): Promise<boolean> {
  return bcrypt.compare(pin, hash)
}

export function validatePinFormat(pin: string): boolean {
  // PIN must be 6 digits
  return /^\d{6}$/.test(pin)
}

export function validatePhoneNumber(phone: string): boolean {
  // Vietnamese phone number format
  return /^(0|\+84)[3-9]\d{8}$/.test(phone)
}

export function validatePassword(password: string): boolean {
  // Password must be at least 6 characters
  return password.length >= 6
}
