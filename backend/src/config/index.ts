/**
 * Application Configuration
 * Centralized configuration management using environment variables
 * SECURITY: Sensitive values MUST be set in environment variables
 */

const isProduction = process.env.NODE_ENV === 'production'

// Validate required environment variables in production
if (isProduction) {
  const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET', 'JWT_REFRESH_SECRET', 'SHOPEE_WEBHOOK_SECRET', 'TIKTOK_WEBHOOK_SECRET', 'SUPER_ADMIN_DEFAULT_PASSWORD']
  const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName])

  if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables for production: ${missingEnvVars.join(', ')}`)
  }
}

export const config = {
  // Database
  database: {
    url: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/affiliate_db',
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'dev_jwt_secret_change_in_production',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_change_in_production',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  // API
  api: {
    baseUrl: process.env.API_BASE_URL || 'http://localhost:3001',
    port: parseInt(process.env.API_PORT || '3001', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
  },

  // Frontend
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:3000',
    port: parseInt(process.env.FRONTEND_PORT || '3000', 10),
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },

  // Webhook
  webhook: {
    shopee: {
      secret: process.env.SHOPEE_WEBHOOK_SECRET || 'dev_shopee_secret',
      path: process.env.SHOPEE_WEBHOOK_PATH || '/webhook/shopee',
    },
    tiktok: {
      secret: process.env.TIKTOK_WEBHOOK_SECRET || 'dev_tiktok_secret',
      path: process.env.TIKTOK_WEBHOOK_PATH || '/webhook/tiktok',
    },
  },

  // Admin
  admin: {
    superAdminPhone: process.env.SUPER_ADMIN_PHONE_NUMBER || '0987654321',
    defaultPassword: process.env.SUPER_ADMIN_DEFAULT_PASSWORD || 'admin123456',
  },

  // Affiliate
  affiliate: {
    shopeeCommissionRate: parseFloat(process.env.SHOPEE_COMMISSION_RATE || '5.0'),
    tiktokCommissionRate: parseFloat(process.env.TIKTOK_COMMISSION_RATE || '4.5'),
  },

  // Withdrawal
  withdrawal: {
    minAmount: parseInt(process.env.MIN_WITHDRAWAL_AMOUNT || '50000', 10),
    maxAmount: parseInt(process.env.MAX_WITHDRAWAL_AMOUNT || '10000000', 10),
    feePercent: parseFloat(process.env.WITHDRAWAL_FEE_PERCENT || '0'),
    processingHours: parseInt(process.env.WITHDRAWAL_PROCESSING_HOURS || '24', 10),
  },

  // Transaction
  transaction: {
    retentionDays: parseInt(process.env.TRANSACTION_RETENTION_DAYS || '365', 10),
  },

  // Link
  link: {
    expirationDays: parseInt(process.env.LINK_EXPIRATION_DAYS || '0', 10),
    idLength: parseInt(process.env.LINK_ID_LENGTH || '10', 10),
  },

  // Email
  email: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
    from: process.env.SMTP_FROM,
    fromName: process.env.SMTP_FROM_NAME || 'Affiliate Platform',
  },

  // SMS
  sms: {
    apiKey: process.env.SMS_API_KEY,
    apiSecret: process.env.SMS_API_SECRET,
    senderId: process.env.SMS_SENDER_ID,
  },

  // Redis
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || '',
    db: parseInt(process.env.REDIS_DB || '0', 10),
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    filePath: process.env.LOG_FILE_PATH || './logs',
    maxFiles: parseInt(process.env.LOG_MAX_FILES || '7', 10),
    maxSize: process.env.LOG_MAX_SIZE || '10m',
  },

  // CORS
  cors: {
    origins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:3000'],
  },

  // Security
  security: {
    maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5', 10),
    loginLockoutMinutes: parseInt(process.env.LOGIN_LOCKOUT_MINUTES || '15', 10),
    minPasswordLength: parseInt(process.env.MIN_PASSWORD_LENGTH || '8', 10),
    requirePasswordSpecialChar: process.env.REQUIRE_PASSWORD_SPECIAL_CHAR === 'true',
    requirePasswordNumber: process.env.REQUIRE_PASSWORD_NUMBER === 'true',
    requirePasswordUppercase: process.env.REQUIRE_PASSWORD_UPPERCASE === 'true',
  },

  // Upload
  upload: {
    maxSize: parseInt(process.env.MAX_UPLOAD_SIZE || '5242880', 10), // 5MB default
    allowedTypes: process.env.ALLOWED_FILE_TYPES
      ? process.env.ALLOWED_FILE_TYPES.split(',')
      : ['jpg', 'jpeg', 'png', 'pdf'],
  },

  // Monitoring
  monitoring: {
    healthCheckEnabled: process.env.HEALTH_CHECK_ENABLED === 'true',
    metricsEnabled: process.env.METRICS_ENABLED === 'true',
  },
}

export default config