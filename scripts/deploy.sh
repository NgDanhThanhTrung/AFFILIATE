#!/bin/bash

# Deployment script for Affiliate Marketing Platform
# This script handles the deployment process for production

set -e

echo "🚀 Starting deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check if .env file exists
if [ ! -f "backend/.env" ]; then
    print_error "backend/.env file not found!"
    print_warning "Please copy backend/.env.example to backend/.env and configure it"
    exit 1
fi

if [ ! -f "frontend/.env.local" ]; then
    print_error "frontend/.env.local file not found!"
    print_warning "Please copy frontend/.env.example to frontend/.env.local and configure it"
    exit 1
fi

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main
print_success "Latest changes pulled"

# Build backend
echo "🔨 Building backend..."
cd backend
npm ci
npm run build
cd ..
print_success "Backend built successfully"

# Build frontend
echo "🔨 Building frontend..."
cd frontend
npm ci
npm run build
cd ..
print_success "Frontend built successfully"

# Run database migrations
echo "🗄️ Running database migrations..."
cd backend
npx prisma migrate deploy
cd ..
print_success "Database migrations completed"

# Restart services
echo "🔄 Restarting services..."
docker-compose down
docker-compose up -d
print_success "Services restarted"

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check health
echo "🏥 Checking service health..."
BACKEND_HEALTH=$(curl -s http://localhost:3001/health || echo "failed")
FRONTEND_HEALTH=$(curl -s http://localhost:3000/health || echo "failed")

if [[ $BACKEND_HEALTH == *"healthy"* ]]; then
    print_success "Backend is healthy"
else
    print_error "Backend health check failed"
fi

if [[ $FRONTEND_HEALTH == *"healthy"* ]]; then
    print_success "Frontend is healthy"
else
    print_error "Frontend health check failed"
fi

echo "🎉 Deployment completed successfully!"
echo "📊 Dashboard: http://localhost:3000"
echo "🔧 API: http://localhost:3001"