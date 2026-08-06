# 🎯 Affiliate Marketing Platform

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-ISC-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.5.3-blue.svg)
![Next.js](https://img.shields.io/badge/next.js-14.2.5-black.svg)

*A comprehensive affiliate marketing platform with order tracking, cashback management, and admin dashboard*

[Features](#-features) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [Cloud Deployment](#-cloud-deployment) • [Documentation](#-documentation)

</div>

---

## ⚠️ Security Warning

**IMPORTANT**: This application requires environment variables to be set for security purposes. Never commit `.env` files to version control.

- For **development**: Copy `backend/.env.example` to `backend/.env` and set the values
- For **production**: Use `backend/.env.production.template` as a reference and set environment variables in Render
- Generate strong secrets using: `openssl rand -base64 32`

> See [SECURITY.md](./SECURITY.md) for detailed security guidelines.

---

## ✨ Features

### Core Features
- 🔐 **Authentication System** - Phone-based registration with JWT authentication
- 🔗 **Affiliate Link System** - Generate and track affiliate links with unique short URLs
- 💰 **Wallet & Transaction System** - Manage earnings, withdrawals, and bank accounts
- 📦 **Order Processing** - Track orders from Shopee and TikTok with webhook integration
- 👤 **Profile Management** - User profiles with PIN security for sensitive operations
- 🛡️ **Admin Dashboard** - Comprehensive admin panel with user, order, and webhook management

### Security Features
- JWT-based authentication with refresh tokens
- PIN verification for withdrawals
- Rate limiting (100 requests per 15 minutes)
- BCrypt password hashing
- Role-based access control (USER, ADMIN, SUPER_ADMIN)
- Input validation with Zod
- Webhook signature validation

---

## 🚀 Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with BCrypt
- **Validation**: Zod
- **Type Safety**: TypeScript

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Components**: Custom components with Tailwind CSS
- **State Management**: React Context API
- **Type Safety**: TypeScript
- **Icons**: Lucide React

### Cloud Deployment
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: Neon.tech (PostgreSQL)
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions

---

## 📁 Project Structure

```
AFFILIATE/
├── backend/                 # Express.js API
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Custom middleware
│   │   ├── prisma/         # Database schema & migrations
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Utility functions
│   │   └── index.ts        # Application entry point
│   ├── render.yaml         # Render deployment config
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
├── frontend/               # Next.js App
│   ├── src/
│   │   ├── app/           # Next.js app router pages
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts
│   │   ├── lib/           # Utility functions & API clients
│   │   └── types/         # TypeScript types
│   ├── vercel.json        # Vercel deployment config
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
├── scripts/               # Deployment scripts
├── .github/              # GitHub workflows & templates
│   ├── workflows/
│   │   └── ci.yml        # CI/CD pipeline
│   ├── ISSUE_TEMPLATE/   # Issue templates
│   └── pull_request_template.md
├── docker-compose.yml     # Production Docker Compose
├── docker-compose.dev.yml # Development Docker Compose
├── DEPLOYMENT.md         # Traditional deployment guide
├── DEPLOYMENT-CLOUD.md   # Cloud deployment guide
├── SECURITY.md           # Security guidelines
├── CONTRIBUTING.md       # Contribution guidelines
├── CODE_OF_CONDUCT.md     # Community guidelines
├── LICENSE               # ISC License
└── README.md             # This file
```

---

## 🛠️ Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+ (or Neon.tech)
- Git

### Development Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/NgDanhThanhTrung/AFFILIATE.git
cd AFFILIATE
```

#### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npx prisma generate
npx prisma migrate dev
npm run setup-admin
npm run dev
```

#### 3. Setup Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your backend URL
npm run dev
```

### Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Admin Dashboard: http://localhost:3000/admin

### Default Admin Credentials
- Phone: 0987654321 (or set in backend/.env)
- Password: admin123456 (or set in backend/.env)

> **⚠️ Important**: Change the default password immediately after first login!

---

## 📚 Available Scripts

### Backend
```bash
npm run dev              # Start development server
npm run build            # Build TypeScript
npm start                # Start production server
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:seed      # Seed database
npm run setup-admin      # Setup super admin account
npm run db:backup        # Backup database
npm run db:restore       # Restore database
```

### Frontend
```bash
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript type checking
```

---

## 🌐 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh-token` - Refresh access token

### Affiliate Links
- `POST /api/affiliate/links` - Create affiliate link
- `GET /api/affiliate/links` - Get user's links
- `GET /api/affiliate/links/:id` - Get link details
- `DELETE /api/affiliate/links/:id` - Delete link

### Wallet
- `GET /api/wallet` - Get wallet info
- `GET /api/wallet/transactions` - Get transaction history
- `POST /api/withdrawal` - Request withdrawal

### Orders
- `GET /api/orders` - Get user's orders
- `GET /api/orders/stats` - Get order statistics

### Profile
- `GET /api/profile` - Get user profile
- `PATCH /api/profile` - Update profile
- `POST /api/pin/create` - Create PIN
- `POST /api/pin/update` - Update PIN

### Admin
- `GET /api/admin/users` - Get all users
- `PATCH /api/admin/users/:id/role` - Update user role
- `GET /api/admin/stats` - Get system statistics

---

## 🔑 Environment Variables

### Backend (.env)
See [CONFIGURATION.md](./CONFIGURATION.md) for complete configuration guide.

Key environment variables:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/affiliate_db"
JWT_SECRET="your_jwt_secret_minimum_32_characters"
JWT_REFRESH_SECRET="your_refresh_secret_minimum_32_characters"
API_BASE_URL="http://localhost:3001"
FRONTEND_URL="http://localhost:3000"
SHOPEE_WEBHOOK_SECRET="your_shopee_secret"
TIKTOK_WEBHOOK_SECRET="your_tiktok_secret"
SUPER_ADMIN_PHONE_NUMBER="0987654321"
SUPER_ADMIN_DEFAULT_PASSWORD="admin123456"
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
```

---

## 🚀 Cloud Deployment

### Quick Cloud Setup (Recommended)

For production deployment to Vercel (frontend), Render (backend), and Neon.tech (database):

1. **Database Setup (Neon.tech)**
   - Create account at [Neon.tech](https://neon.tech)
   - Create PostgreSQL database
   - Copy connection string

2. **Backend Deployment (Render)**
   - Connect GitHub repository to Render
   - Use `backend/render.yaml` configuration
   - Set environment variables from `.env.production.template`
   - Deploy and get backend URL

3. **Frontend Deployment (Vercel)**
   - Connect GitHub repository to Vercel
   - Use `frontend/vercel.json` configuration
   - Set `NEXT_PUBLIC_API_URL` to Render backend URL
   - Deploy and get frontend URL

See [DEPLOYMENT-CLOUD.md](./DEPLOYMENT-CLOUD.md) for detailed cloud deployment guide.

### Traditional Docker Deployment

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

```bash
# Configure environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# Deploy
docker-compose up -d
```

---

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

---

## 📊 Database Migrations

```bash
# Create migration
cd backend
npx prisma migrate dev --name migration_name

# Apply migrations in production
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

---

## 🔍 Monitoring

### Health Checks
- Backend: `GET /health`
- Frontend: `GET /health`
- Readiness: `GET /ready`

### Logs
```bash
# PM2 logs
pm2 logs affiliate-backend
pm2 logs affiliate-frontend

# Docker logs
docker-compose logs -f
```

---

## 🛡️ Security

- All passwords are hashed with BCrypt
- PINs are hashed with BCrypt
- JWT tokens with expiration
- Rate limiting on all endpoints
- Input validation with Zod
- Role-based access control
- Environment-based configuration

> See [SECURITY.md](./SECURITY.md) for detailed security guidelines.

---

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Reporting Issues

Use our GitHub issue templates:
- 🐛 [Bug Report](https://github.com/NgDanhThanhTrung/AFFILIATE/issues/new?template=bug_report.md)
- ✨ [Feature Request](https://github.com/NgDanhThanhTrung/AFFILIATE/issues/new?template=feature_request.md)
- 🔒 [Security Issue](https://github.com/NgDanhThanhTrung/AFFILIATE/issues/new?template=security_issue.md)

---

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](./LICENSE) file for details.

---

## 📞 Support

For support:
- 🐛 Issues: [GitHub Issues](https://github.com/NgDanhThanhTrung/AFFILIATE/issues)
- 📖 Documentation: [Wiki](https://github.com/NgDanhThanhTrung/AFFILIATE/wiki)
- 💬 Discussions: [GitHub Discussions](https://github.com/NgDanhThanhTrung/AFFILIATE/discussions)

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Database powered by [Prisma](https://www.prisma.io/)
- UI components with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)
- Hosted on [Vercel](https://vercel.com/) and [Render](https://render.com/)
- Database by [Neon.tech](https://neon.tech/)

---

## 📈 Roadmap

- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Mobile app development
- [ ] Integration with more affiliate platforms
- [ ] Advanced fraud detection
- [ ] API rate limiting per user
- [ ] Email notifications
- [ ] SMS verification

---

<div align="center">

**⭐ Star this repository if it helped you!**

Made with ❤️ by NgDanhThanhTrung

</div>