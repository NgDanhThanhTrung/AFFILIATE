# Development setup script for Affiliate Marketing Platform (Windows)
# This script sets up the development environment

Write-Host "🛠️ Setting up development environment..." -ForegroundColor Green

# Check if Docker is installed
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker is not installed. Please install Docker first." -ForegroundColor Red
    exit 1
}

# Check if Docker Compose is installed
if (-not (Get-Command docker-compose -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker Compose is not installed. Please install Docker Compose first." -ForegroundColor Red
    exit 1
}

# Start PostgreSQL
Write-Host "🗄️ Starting PostgreSQL..."
docker-compose -f docker-compose.dev.yml up -d
Write-Host "✅ PostgreSQL started" -ForegroundColor Green

# Wait for PostgreSQL to be ready
Write-Host "⏳ Waiting for PostgreSQL to be ready..."
Start-Sleep -Seconds 5

# Setup backend
Write-Host "🔧 Setting up backend..."
cd backend

# Install dependencies
Write-Host "📦 Installing backend dependencies..."
npm ci

# Generate Prisma client
Write-Host "🔮 Generating Prisma client..."
npx prisma generate

# Run migrations
Write-Host "🗄️ Running database migrations..."
npx prisma migrate dev --name init

# Seed database
Write-Host "🌱 Seeding database..."
npm run prisma:seed

cd ..
Write-Host "✅ Backend setup completed" -ForegroundColor Green

# Setup frontend
Write-Host "🔧 Setting up frontend..."
cd frontend

# Install dependencies
Write-Host "📦 Installing frontend dependencies..."
npm ci

cd ..
Write-Host "✅ Frontend setup completed" -ForegroundColor Green

# Setup admin
Write-Host "👑 Setting up admin account..."
cd backend
npm run setup-admin
cd ..
Write-Host "✅ Admin setup completed" -ForegroundColor Green

Write-Host "🎉 Development environment setup completed!" -ForegroundColor Green
Write-Host ""
Write-Host "To start the development servers:"
Write-Host "  Backend:  cd backend && npm run dev"
Write-Host "  Frontend: cd frontend && npm run dev"
Write-Host ""
Write-Host "Or use Docker Compose:"
Write-Host "  docker-compose up"