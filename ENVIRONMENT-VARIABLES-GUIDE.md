# 🌐 Environment Variables Mapping Guide

## 📋 Environment Variables Distribution

### 🖥️ Frontend (Vercel)
**File**: `frontend/.env.local` (được set trong Vercel Environment Variables)

```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
```

**Lưu ý**: Chỉ cần biến `NEXT_PUBLIC_API_URL` trỏ đến Render backend URL.

---

### ⚙️ Backend (Render)
**File**: Được set trong Render Environment Variables

#### 🔴 BẮT BUỘ (Must have)
```env
DATABASE_URL=postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
JWT_SECRET=your_generated_jwt_secret_minimum_32_characters
JWT_REFRESH_SECRET=your_generated_refresh_secret_minimum_32_characters
SHOPEE_WEBHOOK_SECRET=your_shopee_webhook_secret_from_partner_center
TIKTOK_WEBHOOK_SECRET=your_tiktok_webhook_secret_from_seller_center
SUPER_ADMIN_DEFAULT_PASSWORD=secure_password_change_immediately
```

#### 🟡 TÙY CHỌN (Optional - có giá trị mặc định)
```env
NODE_ENV=production
API_BASE_URL=https://your-backend.onrender.com
API_PORT=3001
FRONTEND_URL=https://your-frontend.vercel.app
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
SHOPEE_COMMISSION_RATE=5.0
TIKTOK_COMMISSION_RATE=4.5
MIN_WITHDRAWAL_AMOUNT=50000
MAX_WITHDRAWAL_AMOUNT=10000000
WITHDRAWAL_FEE_PERCENT=0
WITHDRAWAL_PROCESSING_HOURS=24
```

#### 🟢 KHÔNG CẦN (Optional - không cần trong production)
```env
SUPER_ADMIN_PHONE_NUMBER=0987654321
# Các biến email, SMS, Redis, logging, CORS, security, upload, monitoring
```

---

### 🗄️ Database (Neon.tech)
**File**: `DATABASE_URL` (được set trong Render, nhưng kết nối đến Neon.tech)

```env
DATABASE_URL=postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
```

**Lưu ý**: 
- Biến này được set trong Render Environment Variables
- Nhưng giá trị là connection string đến Neon.tech database
- Format: `postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require`

---

## 📊 Tóm Tắt Phân Phối

| Biến Môi Trường | Máy Chủ | Bắt Buộc | Mô Tả |
|----------------|----------|----------|---------|
| `NEXT_PUBLIC_API_URL` | Vercel (Frontend) | ✅ | URL backend API (Render) |
| `DATABASE_URL` | Render (Backend) | ✅ | Connection string đến Neon.tech |
| `JWT_SECRET` | Render (Backend) | ✅ | Secret cho JWT access tokens |
| `JWT_REFRESH_SECRET` | Render (Backend) | ✅ | Secret cho JWT refresh tokens |
| `SHOPEE_WEBHOOK_SECRET` | Render (Backend) | ✅ | Secret từ Shopee Partner Center |
| `TIKTOK_WEBHOOK_SECRET` | Render (Backend) | ✅ | Secret từ TikTok Shop Seller Center |
| `SUPER_ADMIN_DEFAULT_PASSWORD` | Render (Backend) | ✅ | Mật khẩu admin mặc định |
| `NODE_ENV` | Render (Backend) | ❌ | Môi trường (default: production) |
| `API_BASE_URL` | Render (Backend) | ❌ | URL backend (default: Render URL) |
| `FRONTEND_URL` | Render (Backend) | ❌ | URL frontend (default: Vercel URL) |
| `SHOPEE_COMMISSION_RATE` | Render (Backend) | ❌ | Tỷ lệ hoa hồng Shopee (default: 5.0) |
| `TIKTOK_COMMISSION_RATE` | Render (Backend) | ❌ | Tỷ lệ hoa hồng TikTok (default: 4.5) |
| `MIN_WITHDRAWAL_AMOUNT` | Render (Backend) | ❌ | Số tiền rút tối thiểu (default: 50000) |
| `MAX_WITHDRAWAL_AMOUNT` | Render (Backend) | ❌ | Số tiền rút tối đa (default: 10000000) |
| `WITHDRAWAL_FEE_PERCENT` | Render (Backend) | ❌ | Phí rút tiền (default: 0) |
| `WITHDRAWAL_PROCESSING_HOURS` | Render (Backend) | ❌ | Thời gian xử lý rút (default: 24) |

---

## 🚀 Hướng Thiết Lập Từng Bước

### Bước 1: Neon.tech (Database)
1. Tạo database trên Neon.tech
2. Copy connection string: `postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require`
3. **Lưu lại** - sẽ dùng cho Render

### Bước 2: Render (Backend)
1. Tạo service mới trên Render
2. Connect GitHub repository: `https://github.com/NgDanhThanhTrung/AFFILIATE.git`
3. Set environment variables:

**BẮT BUỘ** (copy từ Neon.tech và generate mới):
```
DATABASE_URL=postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
JWT_SECRET=<generate với openssl rand -base64 32>
JWT_REFRESH_SECRET=<generate với openssl rand -base64 32>
SHOPEE_WEBHOOK_SECRET=<lấy từ Shopee Partner Center>
TIKTOK_WEBHOOK_SECRET=<lấy từ TikTok Shop Seller Center>
SUPER_ADMIN_DEFAULT_PASSWORD=<mật khẩu mạnh>
```

**TÙY CHỌN** (có thể bỏ qua):
```
FRONTEND_URL=https://your-frontend.vercel.app
SUPER_ADMIN_PHONE_NUMBER=0987654321
```

4. Deploy và lấy backend URL: `https://your-backend.onrender.com`

### Bước 3: Vercel (Frontend)
1. Tạo project mới trên Vercel
2. Connect GitHub repository: `https://github.com/NgDanhThanhTrung/AFFILIATE.git`
3. Set environment variable:
```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
```
4. Deploy và lấy frontend URL: `https://your-frontend.vercel.app`

### Bước 4: Cập nhật lại (Optional)
Nếu cần, quay lại Render cập nhật:
```
FRONTEND_URL=https://your-frontend.vercel.app
```

---

## 🔐 Security Notes

### ⚠️ QUAN TRỌNG:
- **Generate mới** các JWT secrets (không dùng default)
- **Lấy thật** webhook secrets từ platform dashboards
- **Đổi ngay** admin password sau khi setup
- **Không bao giờ** commit file `.env` với secrets thật

### 🛡️ Best Practices:
- Use `openssl rand -base64 32` để generate strong secrets
- Rotate secrets định kỳ (mỗi 90 ngày)
- Use connection strings với `sslmode=require`
- Monitor logs cho suspicious activity

---

## 📝 Quick Reference Card

### Vercel (Frontend)
```bash
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
```

### Render (Backend)
```bash
DATABASE_URL=postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
JWT_SECRET=<generate strong secret>
JWT_REFRESH_SECRET=<generate strong secret>
SHOPEE_WEBHOOK_SECRET=<from Shopee>
TIKTOK_WEBHOOK_SECRET=<from TikTok>
SUPER_ADMIN_DEFAULT_PASSWORD=<strong password>
```

### Neon.tech (Database)
- Tạo database → Copy connection string → Paste vào Render

---

## 🎯 Checklist Trước Khi Deploy

- [ ] Database tạo trên Neon.tech
- [ ] Connection string Neon.tech đã copy
- [ ] JWT secrets đã generate
- [ ] Webhook secrets đã lấy từ platforms
- [ ] Admin password đã chọn
- [ ] Repository đã connect trên cả Vercel và Render
- [ ] Environment variables đã set đúng máy chủ
- [ ] Frontend URL đã biết (sau khi deploy Vercel)
- [ ] Backend URL đã biết (sau khi deploy Render)

---

## 📞 Support

Nếu gặp vấn đề:
- Kiểm tra connection string Neon.tech
- Verify webhook secrets từ platforms
- Check Render logs cho errors
- Test environment variables cục bộ trước