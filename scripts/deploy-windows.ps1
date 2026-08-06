# Deployment script for Affiliate Marketing Platform (Windows)
# This script handles the deployment process for production

Write-Host "🚀 Starting deployment..." -ForegroundColor Green

# Check if .env file exists
if (-not (Test-Path "backend\.env")) {
    Write-Host "❌ backend\.env file not found!" -ForegroundColor Red
    Write-Host "⚠️  Please copy backend\.env.example to backend\.env and configure it" -ForegroundColor Yellow
    exit 1
}

if (-not (Test-Path "frontend\.env.local")) {
    Write-Host "❌ frontend\.env.local file not found!" -ForegroundColor Red
    Write-Host "⚠️  Please copy frontend\.env.example to frontend\.env.local and configure it" -ForegroundColor Yellow
    exit 1
}

# Pull latest changes
Write-Host "📥 Pulling latest changes..."
git pull origin main
Write-Host "✅ Latest changes pulled" -ForegroundColor Green

# Build backend
Write-Host "🔨 Building backend..."
cd backend
npm ci
npm run build
cd ..
Write-Host "✅ Backend built successfully" -ForegroundColor Green

# Build frontend
Write-Host "🔨 Building frontend..."
cd frontend
npm ci
npm run build
cd ..
Write-Host "✅ Frontend built successfully" -ForegroundColor Green

# Run database migrations
Write-Host "🗄️ Running database migrations..."
cd backend
npx prisma migrate deploy
cd ..
Write-Host "✅ Database migrations completed" -ForegroundColor Green

# Restart services
Write-Host "🔄 Restarting services..."
docker-compose down
docker-compose up -d
Write-Host "✅ Services restarted" -ForegroundColor Green

# Wait for services to be healthy
Write-Host "⏳ Waiting for services to be healthy..."
Start-Sleep -Seconds 10

# Check health
Write-Host "🏥 Checking service health..."
try {
    $backendHealth = Invoke-WebRequest -Uri "http://localhost:3001/health" -UseBasicParsing | Select-Object -ExpandProperty Content
    if ($backendHealth -like "*healthy*") {
        Write-Host "✅ Backend is healthy" -ForegroundColor Green
    } else {
        Write-Host "❌ Backend health check failed" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Backend health check failed" -ForegroundColor Red
}

try {
    $frontendHealth = Invoke-WebRequest -Uri "http://localhost:3000/health" -UseBasicParsing | Select-Object -ExpandProperty Content
    if ($frontendHealth -like "*healthy*") {
        Write-Host "✅ Frontend is healthy" -ForegroundColor Green
    } else {
        Write-Host "❌ Frontend health check failed" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Frontend health check failed" -ForegroundColor Red
}

Write-Host "🎉 Deployment completed successfully!" -ForegroundColor Green
Write-Host "📊 Dashboard: http://localhost:3000"
Write-Host "🔧 API: http://localhost:3001"