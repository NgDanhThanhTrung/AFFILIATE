# Affiliate Marketing Platform - Production Deployment Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Setup](#database-setup)
4. [Deployment Options](#deployment-options)
5. [Configuration](#configuration)
6. [Production Deployment](#production-deployment)
7. [Monitoring & Maintenance](#monitoring--maintenance)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software
- **Node.js** >= 18.x
- **Docker** >= 20.x
- **Docker Compose** >= 2.x
- **PostgreSQL** >= 15.x (if not using Docker)
- **Git**
- **pm2** (for process management, optional but recommended)

### System Requirements
- **RAM**: Minimum 2GB, Recommended 4GB+
- **Disk Space**: Minimum 20GB, Recommended 50GB+
- **CPU**: Minimum 2 cores, Recommended 4+ cores

## Environment Setup

### 1. Clone the Repository
```bash
git clone https://github.com/NgDanhThanhTrung/AFFILIATE.git
cd AFFILIATE
```

### 2. Backend Environment Configuration

Copy the example environment file:
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your production values:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/affiliate_db"

# JWT (Generate strong secrets with: openssl rand -base64 32)
JWT_SECRET="your_strong_jwt_secret_minimum_32_characters"
JWT_REFRESH_SECRET="your_strong_refresh_secret_minimum_32_characters"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# API
API_BASE_URL="https://your-api-domain.com"
PORT=3001
NODE_ENV="production"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Webhook Secrets (Get from your affiliate platforms)
SHOPEE_WEBHOOK_SECRET="your_shopee_webhook_secret"
TIKTOK_WEBHOOK_SECRET="your_tiktok_webhook_secret"

# Admin Configuration
SUPER_ADMIN_PHONE_NUMBER="0987654321"
SUPER_ADMIN_DEFAULT_PASSWORD="admin123456"
```

### 3. Frontend Environment Configuration

Copy the example environment file:
```bash
cp frontend/.env.example frontend/.env.local
```

Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL="https://your-api-domain.com/api"
```

### 4. Generate Secrets

Generate secure secrets for production:
```bash
# Generate JWT secrets
openssl rand -base64 32
openssl rand -base64 32

# Generate webhook secrets (from platform dashboards)
# Shopee: Get from Shopee Partner Center
# TikTok: Get from TikTok Shop Seller Center
```

## Database Setup

### Option 1: Using Docker (Recommended)

```bash
# Start PostgreSQL
docker-compose -f docker-compose.dev.yml up -d

# Run migrations
cd backend
npx prisma migrate deploy

# Seed database (optional, for initial data)
npx prisma db seed
```

### Option 2: Using External PostgreSQL

```bash
# Create database
createdb affiliate_db

# Run migrations
cd backend
npx prisma migrate deploy

# Seed database (optional)
npx prisma db seed
```

### Database Backup & Restore

```bash
# Backup
cd backend
npm run db:backup

# Restore from backup
npm run db:restore backups/affiliate-backup-2024-01-01T00-00-00.sql.gz
```

## Deployment Options

### Option 1: Docker Compose (Recommended for Single Server)

```bash
# Build and start all services
docker-compose up -d

# Check logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Option 2: Manual Deployment with PM2

#### Backend Deployment
```bash
cd backend

# Install dependencies
npm ci --only=production

# Generate Prisma client
npx prisma generate

# Build TypeScript
npm run build

# Start with PM2
pm2 start dist/index.js --name affiliate-backend

# Save PM2 configuration
pm2 save
pm2 startup
```

#### Frontend Deployment
```bash
cd frontend

# Install dependencies
npm ci --only=production

# Build Next.js
npm run build

# Start with PM2
pm2 start npm --name affiliate-frontend -- start

# Save PM2 configuration
pm2 save
```

### Option 3: Using Deployment Scripts

#### Linux/Mac
```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

#### Windows
```powershell
.\scripts\deploy-windows.ps1
```

## Configuration

### Nginx Reverse Proxy Configuration

Create `/etc/nginx/sites-available/affiliate`:

```nginx
# Frontend
server {
    listen 80;
    server_name AFFILIATE.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Backend API
server {
    listen 80;
    server_name api.AFFILIATE.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the configuration:
```bash
sudo ln -s /etc/nginx/sites-available/affiliate /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### SSL Configuration with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d AFFILIATE.com -d api.AFFILIATE.com

# Auto-renewal is configured automatically
```

## Production Deployment

### Step-by-Step Deployment

1. **Prepare the Server**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose

# Install PM2
sudo npm install -g pm2
```

2. **Clone and Setup**
```bash
git clone https://github.com/NgDanhThanhTrung/AFFILIATE.git
cd AFFILIATE

# Configure environment files (see Environment Setup)
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
# Edit the files with your values
```

3. **Setup Database**
```bash
# Using Docker
docker-compose -f docker-compose.dev.yml up -d

# Run migrations
cd backend
npx prisma migrate deploy
```

4. **Build and Deploy**
```bash
# Using Docker Compose
docker-compose up -d

# Or using PM2
cd backend
npm ci --only=production
npx prisma generate
npm run build
pm2 start dist/index.js --name affiliate-backend

cd ../frontend
npm ci --only=production
npm run build
pm2 start npm --name affiliate-frontend -- start
```

5. **Setup Admin Account**
```bash
cd backend
npm run setup-admin
```

6. **Configure Nginx** (see Nginx Configuration section)

7. **Verify Deployment**
```bash
# Check health endpoints
curl http://localhost:3000/health
curl http://localhost:3001/health

# Check PM2 status (if using PM2)
pm2 status

# Check Docker containers (if using Docker)
docker-compose ps
```

## Monitoring & Maintenance

### Health Checks

```bash
# Backend health
curl http://localhost:3001/health

# Frontend health
curl http://localhost:3000/health

# Readiness check
curl http://localhost:3001/ready
```

### Log Management

```bash
# PM2 logs
pm2 logs affiliate-backend
pm2 logs affiliate-frontend

# Docker logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Application logs (if configured)
tail -f logs/backend.log
tail -f logs/frontend.log
```

### Database Maintenance

```bash
# Regular backups (add to cron)
0 2 * * * cd /opt/affiliate/backend && npm run db:backup

# View database size
cd backend
npx prisma db execute --stdin
SELECT pg_size_pretty(pg_database_size('affiliate_db'));

# Optimize database
npx prisma db execute --stdin
VACUUM ANALYZE;
```

### Update Process

```bash
# Pull latest changes
git pull origin main

# Backup database
cd backend
npm run db:backup

# Update dependencies
cd backend
npm ci
npx prisma migrate deploy
npm run build
pm2 restart affiliate-backend

cd ../frontend
npm ci
npm run build
pm2 restart affiliate-frontend
```

## Troubleshooting

### Common Issues

#### 1. Database Connection Failed
```bash
# Check PostgreSQL status
docker-compose ps postgres

# Check database logs
docker-compose logs postgres

# Verify DATABASE_URL in .env
```

#### 2. Port Already in Use
```bash
# Find process using port
sudo lsof -i :3000
sudo lsof -i :3001

# Kill process
sudo kill -9 <PID>
```

#### 3. Migration Failed
```bash
# Reset database (WARNING: This deletes all data)
cd backend
npx prisma migrate reset

# Or manually resolve migration
npx prisma migrate resolve --applied <migration-name>
```

#### 4. PM2 Application Not Starting
```bash
# Check PM2 logs
pm2 logs affiliate-backend --lines 100

# Restart application
pm2 restart affiliate-backend

# Delete and recreate
pm2 delete affiliate-backend
pm2 start dist/index.js --name affiliate-backend
```

#### 5. Docker Container Not Starting
```bash
# Check container logs
docker-compose logs backend
docker-compose logs frontend

# Rebuild containers
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Getting Help

- Check application logs for detailed error messages
- Verify all environment variables are set correctly
- Ensure database is accessible and migrations are applied
- Check firewall settings and port availability
- Review system resources (RAM, CPU, Disk)

## Security Checklist

- [ ] Change default admin password immediately
- [ ] Use strong JWT secrets (32+ characters)
- [ ] Enable SSL/HTTPS
- [ ] Configure firewall rules
- [ ] Regular security updates
- [ ] Database backups configured
- [ ] Log rotation configured
- [ ] Rate limiting enabled
- [ ] CORS configured correctly
- [ ] Webhook secrets from official platforms

## Performance Optimization

1. **Enable caching** (Redis integration recommended)
2. **Use CDN** for static assets
3. **Enable gzip compression** in Nginx
4. **Configure database connection pooling**
5. **Use PM2 cluster mode** for multi-core servers
6. **Monitor resource usage** and scale accordingly

## Backup Strategy

- **Daily database backups** with 7-day retention
- **Weekly full backups** stored off-site
- **Application code backups** via Git
- **Configuration backups** (.env files)

## Contact Support

For deployment issues or questions, refer to:
- GitHub Issues: <your-repo-url>/issues
- Documentation: <your-docs-url>
- Email: support@AFFILIATE.com