import jwt from 'jsonwebtoken'

const isProduction = process.env.NODE_ENV === 'production'
const JWT_SECRET = process.env.JWT_SECRET || (isProduction ? undefined : 'dev_jwt_secret_change_in_production')
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || (isProduction ? undefined : 'dev_refresh_secret_change_in_production')
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m'
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d'

if (isProduction && (!JWT_SECRET || !JWT_REFRESH_SECRET)) {
  throw new Error('JWT_SECRET and JWT_REFRESH_SECRET must be set in environment variables for production')
}

export interface JwtPayload {
  userId: string
  phoneNumber: string
  role?: string
}

export function generateAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET!, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions)
}

export function generateRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET!, { expiresIn: JWT_REFRESH_EXPIRES_IN } as jwt.SignOptions)
}

export function verifyAccessToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, JWT_SECRET!) as JwtPayload
  return decoded
}

export function verifyRefreshToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, JWT_REFRESH_SECRET!) as JwtPayload
  return decoded
}

export function decodeToken(token: string): JwtPayload | null {
  try {
    return jwt.decode(token) as JwtPayload
  } catch {
    return null
  }
}
