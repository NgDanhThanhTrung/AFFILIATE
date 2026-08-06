# 🚀 Step-by-Step Setup Guide for Cloud Deployment

Hướng dẫn chi tiết từng bước để setup Affiliate Marketing Platform trên Vercel (Frontend), Render (Backend), và Neon.tech (Database).

---

## 📋 Tổng Quan Trình (Dự kiến Order)

1. ✅ **Neon.tech** - Database (30 phút)
2. ✅ **Render** - Backend API (45 phút)  
3. ✅ **Vercel** - Frontend (30 phút)
4. ✅ **Cập nhật biến môi trường** (15 phút)

**Tổng thời gian**: ~2 giờ

---

## 🗄️ BƯỚC 1: NEON.TECH (DATABASE) - 30 phút

### 1.1 Tài khoản Neon.tech
1. Truy cập [https://neon.tech](https://neon.tech)
2. Click "Sign up" 
3. Đăng ký bằng GitHub hoặc email
4. Verify email nếu cần thiết

### 1.2 Tạo Database
1. Sau khi đăng nhập, click "Create a project"
2. Điền tên project: `affiliate-platform`
3. Chọn region:
   - **Singapore** (khuyên dùng cho Việt Nam)
   - Hoặc region gần nhất với users
4. Chọn PostgreSQL version: `15`
5. Click "Create project"

### 1.3 Lấy Connection String
1. Project sẽ được tạo trong vài giây
2. Trong dashboard, click vào tab "Connection details"
3. Copy connection string dạng:
   ```
   postgresql://neondb_owner:xxxxxx@ep-xxxxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```
4. **LƯU LẠI**: Copy và lưu vào file tạm (Notepad)

### 1.4 Kiểm Tra Connection (Optional)
1. Trong Neon dashboard, click "SQL Editor"
2. Chạy lệnh: `SELECT version();`
3. Xem có kết quả trả về không

**✅ Hoàn thành Bước 1**

---

## ⚙️ BƯỚC 2: RENDER (BACKEND) - 45 phút

### 2.1 Tài khoản Render
1. Truy cập [https://render.com](https://render.com)
2. Click "Sign up"
3. Đăng ký bằng GitHub (khuyên dùng)
4. Verify email nếu cần thiết

### 2.2 Kết nối GitHub Repository
1. Trong Render dashboard, click "New +"
2. Chọn "Web Service"
3. Click "Connect GitHub"
4. Authorize Render truy cập repository của bạn
5. Chọn repository: `NgDanhThanhTrung/AFFILIATE`
6. Click "Connect"

### 2.3 Cấu Hình Service
1. **Name**: `affiliate-backend`
2. **Region**: Singapore (khuyên dùng)
3. **Branch**: `main`
4. **Root Directory**: `backend`
5. **Runtime**: Node
6. **Build Command**: `npm install && npm run build`
7. **Start Command**: `npm start`

### 2.4 Cấu Hình Environment Variables (QUAN TRỌNG)

Trong tab "Environment", add các biến sau:

#### 🔴 Biến BẮT BUỐ (Must have):

| Variable Name | Value | Hướng dẫn |
|---------------|-------|-----------|
| `DATABASE_URL` | Connection string từ Neon.tech | Paste từ Bước 1.3 |
| `JWT_SECRET` | Generate strong secret | Run: `openssl rand -base64 32` |
| `JWT_REFRESH_SECRET` | Generate strong secret | Run: `openssl rand -base64 32` |
| `SHOPEE_WEBHOOK_SECRET` | Lấy từ Shopee Partner Center | Tạo app Shopee Partner → Webhook → Secret |
| `TIKTOK_WEBHOOK_SECRET` | Lấy từ TikTok Shop Seller Center | Tạo app TikTok Shop → Webhook → Secret |
| `SUPER_ADMIN_DEFAULT_PASSWORD` | Mật khẩu mạnh | Tạo mật khẩu mạnh (min 8 ký tự) |

#### 🟡 Biến TÙy ChỌN (Có thể bỏ qua):

| Variable Name | Value |
|---------------|-------|
| `NODE_ENV` | `production` |
| `API_BASE_URL` | Để trống (sẽ tự động lấy URL của Render) |
| `FRONTEND_URL` | Để trống (sẽ update sau khi có Vercel URL) |
| `SHOPEE_COMMISSION_RATE` | `5.0` |
| `TIKTOK_COMMISSION_RATE` | `4.5` |
| `MIN_WITHQUẢL_AMOUNT` | `50000` |
| `MAX_WITHDRAWAL_AMOUNT` | `10000000` |
| `WITHDRAWAL_FEE_PERCENT` | `0` |
| `WITHDRAWAL_PROCESSING_HOURS` | `24` |

### 2.5 Deploy
1. Click "Create Web Service"
2. Đợi quá trình build và deploy (~5-10 phút)
3. Sau khi deploy thành công, bạn sẽ thấy status "Live"
4. Copy backend URL: `https://affiliate-backend.onrender.com` (hoặc tương tự)

**✅ Hoàn thành Bước 2**

---

## 🎨 BƯỚC 3: VERCEL (FRONTEND) - 30 phút

### 3.1 Tài khoản Vercel
1. Truy cập [https://vercel.com](https://vercel.com)
2. Click "Sign up"
3. Đăng ký bằng GitHub (khuyên dùng)
4. Verify email nếu cần thiết

### 3.2 Kết nối GitHub Repository
1. Trong Vercel dashboard, click "Add New Project"
2. Click "Import Git Repository"
3. Paste repository URL: `https://github.com/NgDanhThanhTrung/AFFILIATE.git`
4. Click "Import"

### 3.3 Cấu Hình Project
1. **Project Name**: `affiliate-frontend` (hoặc để default)
2. **Framework Preset**: Next.js (tự động nhận diện)
3. **Root Directory**: `frontend`
4. **Build Command**: `npm run build`
5. **Output Directory**: `.next`

### 3.4 Cấu Hình Environment Variables
1. Trong tab "Environment Variables"
2. Add biến:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://affiliate-backend.onrender.com/api` (hoặc URL backend từ Bước 2.5)
3. Click "Add"

### 3.5 Deploy
1. Click "Deploy"
2. Đợi quá trình build và deploy (~3-5 phút)
3. Sau khi deploy thành công, bạn sẽ thấy status "Ready"
4. Copy frontend URL: `https://affiliate-frontend.vercel.app` (hoặc tương tự)

**✅ Hoàn thành Bước 3**

---

## 🔗 BƯỚC 4: CẬP NHẬT VÀ TEST - 15 phút

### 4.1 Cập nhật Frontend URL trong Render
1. Quay lại Render dashboard (backend service)
2. Tab "Environment"
3. Add hoặc update biến:
   - **Name**: `FRONTEND_URL`
   - **Value**: `https://affiliate-frontend.vercel.app` (URL từ Bước 3.5)
4. Click "Save Changes"
5. Render sẽ tự động redeploy (~1-2 phút)

### 4.2 Test Backend Health Check
1. Mở browser, truy cập: `https://affiliate-backend.onrender.com/health`
2. Bạn nên thấy:
   ```json
   {
     "status": "ok",
     "timestamp": "2024-08-06T12:00:00.000Z"
   }
   ```

### 4.3 Test Frontend
1. Mở browser, truy cập: `https://affiliate-frontend.vercel.app`
2. Bạn nên thấy giao diện ứng dụng load

### 4.4 Test API Connection
1. Mở browser dev tools (F12)
2. Check Console và Network tabs
3. Kiểm tra có lỗi kết nối API không

**✅ Hoàn thành Bước 4**

---

## 🔐 BƯỚC 5: CẤU HÌNH NGƯỜI DÙNG

### 5.1 Setup Super Admin
1. Truy cập backend API health check endpoint:
   ```
   https://affiliate-backend.onrender.com/api/admin/dev-setup
   ```
2. Hoặc đăng ký với số điện thoại trong config
3. Đăng nhập với mật khẩu admin đã set

### 5.2 Đổi Mật Khẩu Admin
1. Đăng nhập vào admin dashboard
2. Vào Profile/Settings
3. Đổi mật khẩu admin mặc định ngay lập tức

### 5.3 Setup Webhooks
**Shopee:**
1. Vào Shopee Partner Center
2. Tạo webhook với URL: `https://affiliate-backend.onrender.com/webhook/shopee`
3. Set secret từ environment variable

**TikTok:**
1. Vào TikTok Shop Seller Center
2. Tạo webhook với URL: `https://affiliate-backend.onrender.com/webhook/tiktok`
3. Set secret từ environment variable

**✅ Hoàn thành Bước 5**

---

## 🧪 BƯỚC 6: VERIFICATION & TESTING

### 6.1 Test Registration
1. Truy cập frontend URL
2. Đăng ký tài khoản mới
3. Verify email/SMS (nếu có bật)

### 6.2 Test Affiliate Links
1. Đăng nhập vào dashboard
2. Tạo affiliate link thử
3. Test click tracking

### 6.3 Test Wallet System
1. Thêm tiền vào wallet (cho test)
2. Test rút tiền
3. Verify transaction history

### 6.4 Test Admin Dashboard
1. Đăng nhập với admin account
2. Kiểm tra user management
3. View system statistics

**✅ Hoàn thành Bước 6**

---

## 🚨 TROUBLESHOOTING

### Backend không start
- Kiểm tra Render logs trong dashboard
- Verify environment variables đã set đúng
- Check database connection string có `sslmode=require`

### Frontend không kết nối được backend
- Verify `NEXT_PUBLIC_API_URL` đúng backend URL
- Check CORS configuration
- Test backend health endpoint trước

### Database connection error
- Verify Neon.tech database is active
- Check connection string format
- Ensure `sslmode=require` trong connection string

### Webhook không hoạt động
- Verify webhook URLs là public URLs
- Check webhook secrets match platform config
- Test webhook endpoint có phản hồi

---

## 📝 QUICK REFERENCE CARD

### URLs sau khi deploy:
- **Frontend**: `https://affiliate-frontend.vercel.app`
- **Backend**: `https://affiliate-backend.onrender.com`
- **API Health**: `https://affiliate-backend.onrender.com/health`
- **Shopee Webhook**: `https://affiliate-backend.onrender.com/webhook/shopee`
- **TikTok Webhook**: `https://affiliate-backend.onrender.com/webhook/tiktok`

### Environment Variables Summary:
- **Render (6 bắt buộc)**: DATABASE_URL, JWT_SECRET, JWT_REFRESH_SECRET, SHOPEE_WEBHOOK_SECRET, TIKTOK_WEBHOOK_SECRET, SUPER_ADMIN_DEFAULT_PASSWORD
- **Vercel (1 bắt buộc)**: NEXT_PUBLIC_API_URL

---

## 🎉 CONGRATULATIONS!

🎊 Platform của bạn đã sẵn sàng để sử dụng production!

### Next Steps:
- Monitor logs trong 24h đầu
- Set up alerts cho errors
- Backup database định kỳ
- Update documentation khi cần

**Support**: Xem [SECURITY.md](./SECURITY.md) và [ENVIRONMENT-VARIABLES-LIST.md](./ENVIRONMENT-VARIABLES-LIST.md)