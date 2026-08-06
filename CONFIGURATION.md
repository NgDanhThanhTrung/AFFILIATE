# Configuration Guide

This document explains all configurable environment variables for the Affiliate Marketing Platform.

## Environment Variables

### Database Configuration
```env
DATABASE_URL="postgresql://user:password@host:port/database"
```
- PostgreSQL connection string
- Required for database connection
- Format: `postgresql://username:password@hostname:port/database_name`

### JWT Configuration
```env
JWT_SECRET="your_jwt_secret_minimum_32_characters"
JWT_REFRESH_SECRET="your_refresh_secret_minimum_32_characters"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
```
- `JWT_SECRET`: Secret key for access tokens (generate with `openssl rand -base64 32`)
- `JWT_REFRESH_SECRET`: Secret key for refresh tokens
- `JWT_EXPIRES_IN`: Access token expiration time (default: 15m)
- `JWT_REFRESH_EXPIRES_IN`: Refresh token expiration time (default: 7d)

### API Configuration
```env
API_BASE_URL="https://your-api-domain.com"
API_PORT=3001
NODE_ENV="production"
```
- `API_BASE_URL`: Base URL for API (used in webhook redirects)
- `API_PORT`: Port for backend server (default: 3001)
- `NODE_ENV`: Environment mode (development/production)

### Frontend Configuration
```env
FRONTEND_URL="https://your-frontend-domain.com"
FRONTEND_PORT=3000
```
- `FRONTEND_URL`: Frontend URL for CORS and redirects
- `FRONTEND_PORT`: Port for frontend server (default: 3000)

### Rate Limiting
```env
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```
- `RATE_LIMIT_WINDOW_MS`: Time window in milliseconds (default: 15 minutes)
- `RATE_LIMIT_MAX_REQUESTS`: Max requests per window per IP (default: 100)

### Webhook Configuration
```env
SHOPEE_WEBHOOK_SECRET="your_shopee_webhook_secret"
TIKTOK_WEBHOOK_SECRET="your_tiktok_webhook_secret"
SHOPEE_WEBHOOK_PATH="/webhook/shopee"
TIKTOK_WEBHOOK_PATH="/webhook/tiktok"
```
- `SHOPEE_WEBHOOK_SECRET`: Secret from Shopee Partner Center
- `TIKTOK_WEBHOOK_SECRET`: Secret from TikTok Shop Seller Center
- `SHOPEE_WEBHOOK_PATH`: Path for Shopee webhook endpoint
- `TIKTOK_WEBHOOK_PATH`: Path for TikTok webhook endpoint

### Admin Configuration
```env
SUPER_ADMIN_PHONE_NUMBER="0987654321"
SUPER_ADMIN_DEFAULT_PASSWORD="admin123456"
```
- `SUPER_ADMIN_PHONE_NUMBER`: Phone number for super admin account
- `SUPER_ADMIN_DEFAULT_PASSWORD`: Default password (change immediately after setup)

### Affiliate Configuration
```env
SHOPEE_COMMISSION_RATE=5.0
TIKTOK_COMMISSION_RATE=4.5
```
- `SHOPEE_COMMISSION_RATE`: Shopee commission rate percentage (default: 5.0%)
- `TIKTOK_COMMISSION_RATE`: TikTok commission rate percentage (default: 4.5%)

### Withdrawal Configuration
```env
MIN_WITHDRAWAL_AMOUNT=50000
MAX_WITHDRAWAL_AMOUNT=10000000
WITHDRAWAL_FEE_PERCENT=0
WITHDRAWAL_PROCESSING_HOURS=24
```
- `MIN_WITHDRAWAL_AMOUNT`: Minimum withdrawal amount in VND (default: 50,000)
- `MAX_WITHDRAWAL_AMOUNT`: Maximum withdrawal amount in VND (default: 10,000,000)
- `WITHDRAWAL_FEE_PERCENT`: Withdrawal fee percentage (default: 0%)
- `WITHDRAWAL_PROCESSING_HOURS`: Processing time in hours (default: 24)

### Transaction Configuration
```env
TRANSACTION_RETENTION_DAYS=365
```
- `TRANSACTION_RETENTION_DAYS`: Days to keep transaction records (default: 365)

### Link Configuration
```env
LINK_EXPIRATION_DAYS=0
LINK_ID_LENGTH=10
```
- `LINK_EXPIRATION_DAYS`: Link expiration in days (0 = never expire)
- `LINK_ID_LENGTH`: Length of generated link IDs (default: 10)

### Email Configuration (Optional)
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
SMTP_FROM="noreply@yourdomain.com"
SMTP_FROM_NAME="Affiliate Platform"
```
- Email settings for sending notifications
- All fields are optional

### SMS Configuration (Optional)
```env
SMS_API_KEY="your_sms_api_key"
SMS_API_SECRET="your_sms_api_secret"
SMS_SENDER_ID="your_sender_id"
```
- SMS settings for OTP verification
- All fields are optional

### Redis Configuration (Optional)
```env
REDIS_HOST="localhost"
REDIS_PORT=6379
REDIS_PASSWORD=""
REDIS_DB=0
```
- Redis settings for caching
- All fields are optional

### Logging Configuration
```env
LOG_LEVEL="info"
LOG_FILE_PATH="./logs"
LOG_MAX_FILES=7
LOG_MAX_SIZE="10m"
```
- `LOG_LEVEL`: Logging level (debug/info/warn/error)
- `LOG_FILE_PATH`: Path to log files
- `LOG_MAX_FILES`: Maximum number of log files to keep
- `LOG_MAX_SIZE`: Maximum size of each log file

### CORS Configuration
```env
CORS_ORIGINS="https://your-frontend-domain.com,https://www.your-frontend-domain.com"
```
- Comma-separated list of allowed origins for CORS

### Security Configuration
```env
MAX_LOGIN_ATTEMPTS=5
LOGIN_LOCKOUT_MINUTES=15
MIN_PASSWORD_LENGTH=8
REQUIRE_PASSWORD_SPECIAL_CHAR=true
REQUIRE_PASSWORD_NUMBER=true
REQUIRE_PASSWORD_UPPERCASE=true
```
- `MAX_LOGIN_ATTEMPTS`: Maximum failed login attempts (default: 5)
- `LOGIN_LOCKOUT_MINUTES`: Lockout time in minutes (default: 15)
- `MIN_PASSWORD_LENGTH`: Minimum password length (default: 8)
- `REQUIRE_PASSWORD_SPECIAL_CHAR`: Require special character in password
- `REQUIRE_PASSWORD_NUMBER`: Require number in password
- `REQUIRE_PASSWORD_UPPERCASE`: Require uppercase letter in password

### Upload Configuration
```env
MAX_UPLOAD_SIZE=5242880
ALLOWED_FILE_TYPES="jpg,jpeg,png,pdf"
```
- `MAX_UPLOAD_SIZE`: Maximum file upload size in bytes (default: 5MB)
- `ALLOWED_FILE_TYPES`: Comma-separated list of allowed file types

### Monitoring Configuration
```env
HEALTH_CHECK_ENABLED=true
METRICS_ENABLED=false
```
- `HEALTH_CHECK_ENABLED`: Enable health check endpoints
- `METRICS_ENABLED`: Enable metrics collection

## Configuration Priority

Configuration is loaded in the following order (higher priority overrides lower):

1. Environment variables
2. `.env` file
3. Default values in code

## Example Configurations

### Development
```env
DATABASE_URL="postgresql://user:password@localhost:5432/affiliate_db"
JWT_SECRET="dev_jwt_secret"
JWT_REFRESH_SECRET="dev_refresh_secret"
API_BASE_URL="http://localhost:3001"
API_PORT=3001
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
LOG_LEVEL="debug"
```

### Production
```env
DATABASE_URL="postgresql://prod_user:secure_password@prod-db:5432/affiliate_db"
JWT_SECRET="generated_strong_secret_32_chars_minimum"
JWT_REFRESH_SECRET="generated_strong_secret_32_chars_minimum"
API_BASE_URL="https://api.yourdomain.com"
API_PORT=3001
NODE_ENV="production"
FRONTEND_URL="https://yourdomain.com"
LOG_LEVEL="info"
```

## Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use strong secrets** (minimum 32 characters for JWT secrets)
3. **Rotate secrets regularly** in production
4. **Use different secrets** for different environments
5. **Store secrets securely** in production (use secret management tools)
6. **Change default passwords** immediately after setup

## Testing Configuration Changes

After changing configuration:

1. Restart the application
2. Check logs for any configuration errors
3. Test affected features
4. Verify health check endpoints

## Docker Compose Configuration

For Docker deployments, use `.env.docker` file:

```env
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
SHOPEE_WEBHOOK_SECRET=your_shopee_secret
TIKTOK_WEBHOOK_SECRET=your_tiktok_secret
SUPER_ADMIN_PHONE_NUMBER=0987654321
SUPER_ADMIN_DEFAULT_PASSWORD=admin123456
```

Then run:
```bash
docker-compose up -d
```