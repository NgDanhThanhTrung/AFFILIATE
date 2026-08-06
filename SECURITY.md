# Security Guide

This document outlines security practices and requirements for the Affiliate Marketing Platform.

## 🔐 Environment Variables Security

### Required Variables (Production)

The following environment variables **MUST** be set in production:

- `DATABASE_URL` - Neon.tech PostgreSQL connection string
- `JWT_SECRET` - Strong secret for JWT access tokens (min 32 chars)
- `JWT_REFRESH_SECRET` - Strong secret for JWT refresh tokens (min 32 chars)
- `SHOPEE_WEBHOOK_SECRET` - Secret from Shopee Partner Center
- `TIKTOK_WEBHOOK_SECRET` - Secret from TikTok Shop Seller Center
- `SUPER_ADMIN_DEFAULT_PASSWORD` - Initial admin password (change immediately)

### Generating Secure Secrets

```bash
# Generate JWT secrets
openssl rand -base64 32

# Generate webhook secrets
openssl rand -hex 32
```

### Environment File Security

**DO NOT** commit these files to version control:
- `.env` (any directory)
- `.env.local`
- `.env.production`
- Any file containing actual secrets

**These files are in `.gitignore`:**
- `backend/.env`
- `frontend/.env.local`

## 🛡️ Security Features

### Authentication & Authorization

- **JWT Tokens**: Access tokens expire in 15 minutes, refresh tokens in 7 days
- **Password Hashing**: BCrypt with salt rounds
- **PIN Security**: Optional 6-digit PIN for sensitive operations
- **Role-Based Access**: USER, ADMIN, SUPER_ADMIN roles
- **Rate Limiting**: 100 requests per 15 minutes per IP

### Data Protection

- **Database**: SSL/TLS encryption for Neon.tech connections
- **API**: HTTPS required in production
- **CORS**: Configured to allow only specified origins
- **Input Validation**: Zod schema validation on all inputs
- **SQL Injection**: Protected by Prisma ORM

### Webhook Security

- **Signature Validation**: HMAC signatures for webhook authenticity
- **Secret Management**: Platform-specific webhook secrets
- **SSL Required**: Webhook endpoints require HTTPS

## 🔒 Production Security Checklist

Before deploying to production:

- [ ] All required environment variables are set
- [ ] JWT secrets are strong (min 32 characters)
- [ ] Database connection uses SSL (`sslmode=require`)
- [ ] Default admin password is changed immediately
- [ ] HTTPS is enabled on all endpoints
- [ ] CORS is configured for production domains only
- [ ] Webhook secrets match platform configurations
- [ ] Rate limiting is appropriately configured
- [ ] Database backups are enabled (Neon handles this)
- [ ] Monitoring and logging are enabled

## 🚨 Security Best Practices

### Development

1. **Never use production secrets in development**
2. **Use development-specific secrets** (can be less secure)
3. **Keep `.env` files local** and never commit them
4. **Rotate secrets regularly** in production
5. **Use different secrets** for different environments

### Production

1. **Use strong, randomly generated secrets**
2. **Rotate secrets periodically** (every 90 days recommended)
3. **Monitor for unauthorized access**
4. **Keep dependencies updated**
5. **Enable all security features**
6. **Use secure connection strings** (SSL enabled)

### Database Security

1. **Use connection pooling** (handled by Prisma)
2. **Enable SSL** for all database connections
3. **Use read replicas** for scaling (future enhancement)
4. **Regular backups** (Neon handles this automatically)
5. **Monitor database access logs**

### API Security

1. **Validate all inputs** using Zod schemas
2. **Sanitize user data** before processing
3. **Use parameterized queries** (Prisma handles this)
4. **Implement rate limiting** (already configured)
5. **Log security events** (logging configured)

## 🔍 Security Monitoring

### What to Monitor

- Failed login attempts
- Unusual API usage patterns
- Webhook signature failures
- Database connection errors
- Unauthorized access attempts

### Logging

The application uses Winston for logging:
- **Level**: Configurable via `LOG_LEVEL` environment variable
- **Output**: Console in development, file in production
- **Format**: JSON structured logs

### Alerts

Set up alerts for:
- Multiple failed login attempts from same IP
- Webhook signature validation failures
- Database connection failures
- High error rates

## 🚨 Incident Response

If you suspect a security breach:

1. **Immediately rotate all secrets** (JWT, webhooks, database)
2. **Review access logs** for unauthorized activity
3. **Force password resets** for all users
4. **Enable additional monitoring**
5. **Review webhook configurations**
6. **Check database integrity**

## 📋 Compliance

### Data Protection

- **User Data**: Phone numbers, emails, financial data
- **Encryption**: TLS for data in transit
- **Storage**: PostgreSQL with encryption at rest (Neon)
- **Retention**: Configurable via `TRANSACTION_RETENTION_DAYS`

### Privacy

- **Data Minimization**: Collect only necessary data
- **User Consent**: Phone verification process
- **Data Access**: Role-based access controls
- **Data Deletion**: Account deactivation feature

## 🔧 Security Updates

### Regular Updates

- **Dependencies**: Keep all npm packages updated
- **Security Patches**: Apply security updates immediately
- **Prisma**: Keep Prisma client updated
- **Node.js**: Use LTS version

### Vulnerability Scanning

```bash
# Run npm audit
npm audit

# Fix vulnerabilities
npm audit fix

# Check for outdated packages
npm outdated
```

## 📞 Security Contacts

For security concerns:
- Review code for potential vulnerabilities
- Report security issues privately via GitHub Security
- Follow responsible disclosure practices

---

**Remember**: Security is an ongoing process, not a one-time setup. Regular reviews and updates are essential.
