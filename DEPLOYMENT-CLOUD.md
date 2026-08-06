# Cloud Deployment Guide

This guide covers deploying the Affiliate Marketing Platform to:
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: Neon.tech (PostgreSQL)

## Prerequisites

- Accounts on Vercel, Render, and Neon.tech
- Git repository with your code
- Node.js 18+ for local development

## 1. Database Setup (Neon.tech)

### Create Neon Database

1. Go to [Neon.tech](https://neon.tech) and sign up
2. Create a new project:
   - Choose a name (e.g., `affiliate-platform`)
   - Select a region (preferably close to your users)
   - Copy the connection string

### Get Connection String

The connection string will look like:
```
postgresql://username:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
```

**Important**: Copy this string - you'll need it for Render configuration.

### Run Database Migrations

Since Neon provides a managed PostgreSQL instance, you'll need to run migrations:

```bash
# Set DATABASE_URL to your Neon connection string
export DATABASE_URL="postgresql://username:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require"

# Generate Prisma client
cd backend
npx prisma generate --schema src/prisma/schema.prisma

# Run migrations
npx prisma migrate deploy --schema src/prisma/schema.prisma

# Seed database (optional)
npx prisma db seed --schema src/prisma/schema.prisma
```

## 2. Backend Deployment (Render)

### Create Render Service

1. Go to [Render.com](https://render.com) and sign up
2. Click "New +" → "Web Service"
3. Connect your Git repository
4. Configure the service:

**Build & Deploy Settings:**
- **Root Directory**: `backend`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Runtime**: Node 18+

**Environment Variables:**
Add the following environment variables:

```env
# Database
DATABASE_URL=your_neon_connection_string

# JWT Secrets (generate strong secrets)
JWT_SECRET=your_generated_jwt_secret_min_32_chars
JWT_REFRESH_SECRET=your_generated_refresh_secret_min_32_chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# API Configuration
NODE_ENV=production
API_BASE_URL=https://your-backend.onrender.com
API_PORT=3001

# Frontend URL (after Vercel deployment)
FRONTEND_URL=https://your-frontend.vercel.app

# Webhook Secrets
SHOPEE_WEBHOOK_SECRET=your_shopee_secret
TIKTOK_WEBHOOK_SECRET=your_tiktok_secret

# Admin Configuration
SUPER_ADMIN_PHONE_NUMBER=your_phone_number
SUPER_ADMIN_DEFAULT_PASSWORD=secure_password

# Affiliate Configuration
SHOPEE_COMMISSION_RATE=5.0
TIKTOK_COMMISSION_RATE=4.5

# Withdrawal Configuration
MIN_WITHDRAWAL_AMOUNT=50000
MAX_WITHDRAWAL_AMOUNT=10000000
WITHDRAWAL_FEE_PERCENT=0
WITHDRAWAL_PROCESSING_HOURS=24
```

### Health Check Endpoint

Render will automatically use the `/health` endpoint we've configured.

### Webhook Configuration

After deployment, your webhook URLs will be:
- Shopee: `https://your-backend.onrender.com/webhook/shopee`
- TikTok: `https://your-backend.onrender.com/webhook/tiktok`

Configure these in your respective affiliate platform dashboards.

## 3. Frontend Deployment (Vercel)

### Create Vercel Project

1. Go to [Vercel.com](https://vercel.com) and sign up
2. Click "Add New..." → "Project"
3. Import your Git repository
4. Configure the project:

**Framework Preset**: Next.js
**Root Directory**: `frontend`

**Environment Variables:**
```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
```

### Build Settings

Vercel will automatically detect Next.js and use these settings:
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### Deploy

Click "Deploy" and wait for the build to complete. Vercel will provide you with:
- Production URL: `https://your-frontend.vercel.app`
- Preview URLs for each branch

## 4. Post-Deployment Configuration

### Update Render with Vercel URL

After Vercel deployment, update the `FRONTEND_URL` environment variable in Render:
1. Go to your Render service
2. Environment tab
3. Update `FRONTEND_URL` to your Vercel URL
4. Redeploy the service

### Update Vercel with Render URL

After Render deployment, update the `NEXT_PUBLIC_API_URL` in Vercel:
1. Go to your Vercel project
2. Settings → Environment Variables
3. Update `NEXT_PUBLIC_API_URL` to your Render backend URL
4. Redeploy

### Setup Super Admin

Access the development endpoint to create the super admin (remove this in production):

```bash
curl -X POST https://your-backend.onrender.com/api/admin/dev-setup
```

Or manually create via the admin panel after logging in with the configured phone number.

## 5. Monitoring & Maintenance

### Backend Monitoring (Render)

- View logs in Render dashboard
- Monitor resource usage
- Set up alerts for failures

### Frontend Monitoring (Vercel)

- View logs in Vercel dashboard
- Monitor build times
- Check Analytics for performance

### Database Monitoring (Neon)

- Monitor database size and performance
- Set up backups (Neon handles this automatically)
- Monitor connection limits

## 6. Webhook Configuration

### Shopee

1. Go to Shopee Partner Center
2. Add webhook URL: `https://your-backend.onrender.com/webhook/shopee`
3. Set webhook secret from your environment variables
4. Enable order status notifications

### TikTok

1. Go to TikTok Shop Seller Center
2. Add webhook URL: `https://your-backend.onrender.com/webhook/tiktok`
3. Set webhook secret from your environment variables
4. Enable order notifications

## 7. Security Checklist

- [ ] Change default admin password immediately
- [ ] Use strong JWT secrets (minimum 32 characters)
- [ ] Enable HTTPS (automatic on Vercel and Render)
- [ ] Set up CORS correctly
- [ ] Implement rate limiting (already configured)
- [ ] Monitor logs for suspicious activity
- [ ] Keep dependencies updated
- [ ] Use environment-specific configurations

## 8. Troubleshooting

### Database Connection Issues

If you see database connection errors:
- Verify DATABASE_URL is correct
- Check Neon console for database status
- Ensure SSL mode is enabled in connection string

### Build Failures

- Check Node.js version compatibility
- Verify all dependencies are installed
- Check build logs for specific errors

### Webhook Failures

- Verify webhook URLs are accessible
- Check webhook secrets match platform configuration
- Review webhook logs in backend

### CORS Issues

- Ensure FRONTEND_URL matches your Vercel domain
- Check CORS configuration in backend
- Verify API URL in frontend is correct

## 9. Cost Optimization

### Render

- Use free tier for development
- Upgrade to paid for production
- Monitor resource usage

### Vercel

- Free tier includes sufficient resources
- Pro tier for custom domains and advanced features

### Neon

- Free tier available for development
- Scale based on usage for production
- Monitor storage and compute usage

## 10. Backup Strategy

Neon.tech provides automatic backups, but consider:
- Regular database exports
- Backup critical configuration
- Document any custom setup

## Support

For issues with:
- **Vercel**: https://vercel.com/docs
- **Render**: https://render.com/docs
- **Neon**: https://neon.tech/docs
