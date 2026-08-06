#!/bin/bash

# Development setup script for Affiliate Marketing Platform
# This script sets up the development environment

set -e

echo "🛠️ Setting up development environment..."

# Colors for output
GREEN='\033[0;32m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Start PostgreSQL
echo "🗄️ Starting PostgreSQL..."
docker-compose -f docker-compose.dev.yml up -d
print_success "PostgreSQL started"

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Setup backend
echo "🔧 Setting up backend..."
cd backend

# Install dependencies
echo "📦 Installing backend dependencies..."
npm ci

# Generate Prisma client
echo "🔮 Generating Prisma client..."
npx prisma generate

# Run migrations
echo "🗄️ Running database migrations..."
npx prisma migrate dev --name init

# Seed database
echo "🌱 Seeding database..."
npm run prisma:seed

cd ..
print_success "Backend setup completed"

# Setup frontend
echo "🔧 Setting up frontend..."
cd frontend

# Install dependencies
echo "📦 Installing frontend dependencies..."
npm ci

cd ..
print_success "Frontend setup completed"

# Setup admin
echo "👑 Setting up admin account..."
cd backend
npm run setup-admin
cd ..
print_success "Admin setup completed"

echo "🎉 Development environment setup completed!"
echo ""
echo "To start the development servers:"
echo "  Backend:  cd backend && npm run dev"
echo "  Frontend: cd frontend && npm run dev"
echo ""
echo "Or use Docker Compose:"
echo "  docker-compose up"