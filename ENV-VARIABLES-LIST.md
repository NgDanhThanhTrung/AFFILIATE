# 📋 Environment Variables List by File and Host

## 📁 File: `backend/.env.example` → Máy chủ: **Render (Backend)**

| Biến Môi Trường | Giá Trị Default | Bắt Buộc | Mô Tả |
|----------------|-------------------|----------|---------|
| `DATABASE_URL` | `postgresql://affiliate_user:affiliate_password@localhost:5432/affiliate_db` | ✅ | Connection string PostgreSQL (Neon.tech trong production) |
| `JWT_SECRET` | `dev_jwt_secret_change_in_production_minimum_32_chars` | ✅ | Secret cho JWT access tokens |
| `JWT_REFRESH_SECRET` | `dev_refresh_secret_change_in_production_minimum_32_chars` | ✅ | Secret cho JWT refresh tokens |
| `JWT_EXPIRES_IN` | `15m` | ❌ | Thời gian hết hạn access token |
| `JWT_REFRESH_EXPIRES_IN` | `7d` | ❌ | Thời gian hết hạn refresh token |
| `NODE_ENV` | `development` | ❌ | Môi trường (development/production) |
| `API_BASE_URL` | `http://localhost:3001` | ❌ | URL backend API |
| `API_PORT` | `3001` | ❌ | Port backend server |
| `FRONTEND_URL` | `http://localhost:3000` | ❌ | URL frontend (Vercel trong production) |
| `SHOPEE_WEBHOOK_SECRET` | `dev_shopee_secret` | ✅ | Secret từ Shopee Partner Center |
| `TIKTOK_WEBHOOK_SECRET` | `dev_tiktok_secret` | ✅ | Secret từ TikTok Shop Seller Center |
| `SUPER_ADMIN_PHONE_NUMBER` | `0987654321` | ❌ | Số điện thoại admin |
| `SUPER_ADMIN_DEFAULT_PASSWORD` | `admin123456` | ✅ | Mật khẩu admin mặc định |
| `SHOPEE_COMMISSION_RATE` | `5.0` | ❌ | Tỷ lệ hoa hồng Shopee (%) |
| `TIKTOK_COMMISSION_RATE` | `4.5` | ❌ | Tỷ lệ hoa hồng TikTok (%) |
| `MIN_WITHDRAWAL_AMOUNT` | `50000` | ❌ | Số tiền rút tối thiểu (VND) |
| `MAX_WITHDRAWAL_AMOUNT` | `10000000` | ❌ | Số tiền rút tối đa (VND) |
| `WITHDRAWAL_FEE_PERCENT` | `0` | ❌ | Phí rút tiền (%) |
| `WITHDRAWAL_PROCESSING_HOURS` | `24` | ❌ | Thời gian xử lý rút (giờ) |

---

## 📁 File: `frontend/.env.example` → Máy chủ: **Vercel (Frontend)**

| Biến Môi Trường | Giá Trí Default | Bắt Buộc | Mô Tả |
|----------------|-------------------|----------|---------|
| `NEXT_PUBLIC_API_URL` | `https://your-backend.onrender.com/api` | ✅ | URL backend API (Render) |

---

## 📁 File: `backend/.env.production.template` → Máy chủ: **Render (Backend)**

| Biến Môi Trường | Giá Trí Example | Bắt Buộc | Mô Tả |
|----------------|-------------------|----------|---------|
| `DATABASE_URL` | `your_neon_connection_string_here` | ✅ | Connection string Neon.tech PostgreSQL |
| `JWT_SECRET` | `your_generated_jwt_secret_minimum_32_characters` | ✅ | Secret JWT access tokens (generate mới) |
| `JWT_REFRESH_SECRET` | `your_generated_refresh_secret_minimum_32_characters` | ✅ | Secret JWT refresh tokens (generate mới) |
| `JWT_EXPIRES_IN` | `15m` | ❌ | Thời gian hết hạn access token |
| `JWT_REFRESH_EXPIRES_IN` | `7d` | ❌ | Thời gian hết hạn refresh token |
| `API_BASE_URL` | `https://your-backend.onrender.com` | ❌ | URL backend (Render) |
| `API_PORT` | `3001` | ❌ | Port backend server |
| `FRONTEND_URL` | `https://your-frontend.vercel.app` | ❌ | URL frontend (Vercel) |
| `SHOPEE_WEBHOOK_SECRET` | `your_shopee_webhook_secret_from_partner_center` | ✅ | Secret từ Shopee Partner Center |
| `TIKTOK_WEBHOOK_SECRET` | `your_tiktok_webhook_secret_from_seller_center` | ✅ | Secret từ TikTok Shop Seller Center |
| `SUPER_ADMIN_PHONE_NUMBER` | `your_phone_number` | ❌ | Số điện thoại admin |
| `SUPER_ADMIN_DEFAULT_PASSWORD` | `secure_password_change_immediately` | ✅ | Mật khẩu admin mặc định |
| `SHOPEE_COMMISSION_RATE` | `5.0` | ❌ | Tỷ lệ hoa hồng Shopee (%) |
| `TIKTOK_COMMISSION_RATE` | `4.5` | ❌ | Tỷ lệ hoa hồng TikTok (%) |
| `MIN_WITHDRAWAL_AMOUNT` | `50000` | ❌ | Số tiền rút tối thiểu (VND) |
| `MAX_WITHDRAWAL_AMOUNT` | `10000000` | ❌ | Số tiền rút tối đa (VND) |
| `WITHDRAWAL_FEE_PERCENT` | `0` | ❌ | Phí rút tiền (%) |
| `WITHDRAWAL_PROCESSING_HOURS` | `24` | ❌ | Thời gian xử lý rút (giờ) |

---

## 📁 File: `.env.docker` → Máy chủ: **Docker Compose (Local)**

| Biến Môi Trường | Giá Trí Example | Bắt Buộc | Mô Tả |
|----------------|-------------------|----------|---------|
| `JWT_SECRET` | `your_jwt_secret_minimum_32_characters` | ✅ | Secret JWT access tokens |
| `JWT_REFRESH_SECRET` | `your_refresh_secret_minimum_32_characters` | ✅ | Secret JWT refresh tokens |
| `SHOPEE_WEBHOOK_SECRET` | `your_shopee_webhook_secret` | ✅ | Secret từ Shopee Partner Center |
| `TIKTOK_WEBHOOK_SECRET` | `your_tiktok_webhook_secret` | ✅ | Secret từ TikTok Shop Seller Center |
| `SUPER_ADMIN_PHONE_NUMBER` | `0987654321` | ❌ | Số điện thoại admin |
| `SUPER_ADMIN_DEFAULT_PASSWORD` | `admin123456` | ✅ | Mật khẩu admin mặc định |

---

## 🎯 Tóm Tắt Theo Máy Chủ

### 🟢 Vercel (Frontend)
**File**: `frontend/.env.example`
- **Biến**: `NEXT_PUBLIC_API_URL` (1 biến)
- **Chức năng**: Kết nối với backend Render

### 🔴 Render (Backend)
**File**: `backend/.env.example` (development) hoặc `backend/.env.production.template` (production)
- **Biến bắt buộc**: 6 biến
  - `DATABASE_URL` (kết nối Neon.tech)
  - `JWT_SECRET`
  - `JWT_REFRESH_SECRET`
  - `SHOPEE_WEBHOOK_SECRET`
  - `TIKTOK_WEBHOOK_SECRET`
  - `SUPER_ADMIN_DEFAULT_PASSWORD`
- **Biến tùy chọn**: 11 biến (có giá trị default)

### 🟡 Neon.tech (Database)
- **Không có file riêng**
- **Connection string**: Được set trong Render biến `DATABASE_URL`
- **Chức năng**: Lưu trữ dữ liệu PostgreSQL

---

## 📊 Biến Sẽ Thực Sự Set Trong Production

### Render (Backend Environment Variables)
```env
DATABASE_URL=postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
JWT_SECRET=<openssl rand -base64 32>
JWT_REFRESH_SECRET=<openssl rand -base64 32>
SHOPEE_WEBHOOK_SECRET=<lấy từ Shopee Partner Center>
TIKTOK_WEBHOOK_SECRET=<lấy từ TikTok Shop Seller Center>
SUPER_ADMIN_DEFAULT_PASSWORD=<mật khẩu mạnh>
FRONTEND_URL=https://your-frontend.vercel.app
```

### Vercel (Frontend Environment Variables)
```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
```

---

## 🔐 Security Reminders

### ⚠️ Trong Production:
- Generate mới JWT secrets (không dùng default)
- Lấy thật webhook secrets từ platform dashboards
- Đổi admin password ngay sau setup
- Database URL phải có `sslmode=require`

### 🛡️ Trong Development:
- Có thể dùng giá trị default cho test
- Không quan trọng security cho local development