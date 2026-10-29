<p align="center">
  <img src="src/assets/img/logo.png" alt="VeggiePal" width="150" />
</p>

> Nền tảng hỗ trợ người ăn chay theo dõi sức khỏe, lên thực đơn, khám phá video nấu ăn, tìm quán chay và trò chuyện cùng trợ lý AI **Bông Cải**.

![React Version](https://img.shields.io/badge/React-19.x-61DAFB?style=flat-square&logo=react)
![Vite Version](https://img.shields.io/badge/Vite-8.x-646CFF?style=flat-square&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss)

---

## 🔗 Liên kết dự án

- **Frontend Repository:** [huypg-bi/VeggiePal_FE](https://github.com/huypg-bi/VeggiePal_FE)
- **Backend Repository:** [Phu0312/VeggiePal_BE](https://github.com/Phu0312/VeggiePal_BE.git) *(Spring Boot Microservices)*
- **Live Demo:** *(Đang cập nhật)*

---

## 📸 Giao diện ứng dụng (Screenshots)

*(Đang cập nhật — thêm ảnh vào `docs/images/` rồi bỏ comment bảng bên dưới)*

<!--
| Trang chủ (Landing Page) | Trợ lý AI Bông Cải |
| :---: | :---: |
| ![Landing Page](./docs/images/landing.png) | ![Chatbot](./docs/images/chatbot.png) |

| Lên thực đơn (Meal Planner) | Bản đồ quán chay (Map) |
| :---: | :---: |
| ![Meal Planner](./docs/images/meal-planner.png) | ![Restaurant Map](./docs/images/map.png) |
-->



---

## ✨ Tính năng nổi bật

- **🔐 Quản lý tài khoản (Authentication):** Đăng ký kèm xác minh email bằng mã OTP, đăng nhập (email hoặc Google), tự làm mới phiên bằng refresh token, quên mật khẩu bằng mã OTP qua email, bảo vệ đường dẫn riêng tư (Protected Routes).
- **👤 Hồ sơ cá nhân (Profile):** Quản lý thông tin cá nhân, cập nhật ảnh đại diện, đổi mật khẩu, xem số người theo dõi & đang theo dõi thật và danh sách theo dõi.
- **📊 Sức khỏe & Dị ứng (Nutrition):** Ghi nhận chiều cao/cân nặng, theo dõi lịch sử BMI, chọn danh mục thực phẩm dị ứng.
- **🥗 Thực đơn dinh dưỡng (Meal Planner):** AI lên thực đơn 7 ngày × 3 bữa theo mục tiêu giảm / duy trì / tăng cân (BE tự tính calo từ chỉ số sức khỏe, ngày sinh, giới tính, mức vận động, hoặc tự đặt mục tiêu riêng), nguyên liệu sẵn có và khẩu vị; xem theo ngày, đổi món, chuyển giữa các thực đơn đã lưu; đánh dấu bữa đã ăn, ghi nước uống và vận động vào nhật ký ăn uống, thẻ calo trong ngày tính theo bữa đã ăn *(API thật; bữa phụ chưa có, lời khuyên hằng ngày vẫn là Mock Data)*.
- **🍲 Công thức (Recipe):** Duyệt công thức món chay đã đăng (tìm theo tên / mô tả, sắp xếp mới nhất hoặc được lưu nhiều nhất), xem chi tiết kèm dinh dưỡng mỗi khẩu phần do BE tính sẵn và cảnh báo nguyên liệu dễ dị ứng / không thuần chay, lưu công thức yêu thích (thẻ "Công Thức Đã Lưu" ở trang cá nhân), tạo / sửa công thức với ảnh tải lên (JPEG / PNG ≤ 5MB) hoặc link ảnh *(API thật)*.
- **📝 Cộng đồng (Blog):** Đăng và đọc bài viết (tối đa 50.000 ký tự; bài được AI kiểm duyệt nền nên đăng xong ở trạng thái chờ, trang chi tiết tự cập nhật khi AI xét xong), bình luận, thả tim, tìm kiếm / sắp xếp / lọc danh mục, theo dõi tác giả, xem tab "Đang theo dõi" và danh sách người theo dõi *(API thật; bảng vàng, chủ đề và thử thách tuần vẫn là Mock Data)*.
- **🎥 Khám phá video (Videos):** Xem và đăng tải video nấu món chay (tệp .mp4 hoặc liên kết YouTube), phân trang và lọc theo danh mục, quản lý video cá nhân kèm kiểm duyệt tự động *(API thật; kênh gợi ý và thông tin dinh dưỡng gắn nhãn "Dữ liệu mẫu", bình luận và vote chờ BE)*. Tab "Bóc tách" ở trang Nội dung của tôi cho AI bóc tách nguyên liệu và các bước làm từ video (tệp ≤ 100MB, ≤ 30 phút, lịch sử `GET /ai/videos` phân trang dạng `items` theo lượt của gói thành viên). Ở trang xem video, nút "Bóc tách công thức AI" ở `VideoMetaHeader` và thẻ `AiSummaryCard` hiển thị công thức AI dùng chung cho video tải lên (`POST /ai/videos/process-existing`, xem công khai qua `GET /ai/videos/by-video/:videoId`, khách chưa đăng nhập vẫn xem được kết quả có sẵn; video YouTube hiện "chưa hỗ trợ" mã 6026 và khóa nút; hàng đợi đầy trả 6025 "hệ thống đang bận") *(API thật)*.
- **📍 Bản đồ xanh (Map):** Xem quán ăn chay quanh vị trí của bạn trên bản đồ Mapbox (chọn bán kính 1 - 10 km, sắp theo gần nhất hoặc đánh giá cao), tìm quán theo tên (từ 2 ký tự) trên toàn bản đồ *(API thật)*.
- **🤖 Trợ lý Bông Cải (AI Chatbot):** Giao diện hỏi đáp kiến thức dinh dưỡng chay, quản lý nhiều đoạn chat *(API thật: ai-service, có chế độ dùng thử cho khách; giới hạn lượt/ngày: khách 3 lượt, FREE 5, PLUS 20, PRO 50; mở cuộc trò chuyện của người khác trả 404)*.
- **🎨 Giao diện & Trải nghiệm:** Landing page hiện đại, hỗ trợ chuyển đổi chế độ Sáng/Tối (Light/Dark Mode).
- **🛡️ Quản trị hệ thống (Admin):** Màn hình quản lý người dùng (`/admin/users`: tìm kiếm email/họ tên, lọc theo trạng thái và vai trò, khóa tài khoản kèm lý do, mở khóa tài khoản, nâng quyền Quản trị viên), quản lý danh mục và nguyên liệu, duyệt nội dung bài viết/video/bình luận, giám sát AI và thống kê doanh thu gói thành viên.
- **💳 Gói thành viên & Thanh toán (Payment & Subscriptions):** Xem bảng giá các gói thành viên (FREE, PLUS, PRO), thanh toán qua cổng payOS VietQR, polling kiểm tra webhook kích hoạt gói tức thì, quản lý lịch sử thanh toán và thời hạn sử dụng *(API thật: payment-service)*. Trang thanh toán tự dựng `/checkout/:orderId`: FE tự vẽ mã VietQR bằng `qrcode.react`, đếm ngược hết hạn, polling trạng thái đơn, huỷ/tạo lại đơn.

---

## 💻 Công nghệ sử dụng (Tech Stack)

### Frontend Client
- **Core Framework:** React 19, Vite 8 (JavaScript / JSX)
- **Styling:** Tailwind CSS v4, shadcn/ui (`@base-ui/react`)
- **Routing:** React Router v7
- **State Management:** 
  - TanStack Query v5 *(Server State / Async Data)*
  - Zustand v5 *(Global Auth State, Theme State)*
  - qrcode.react *(vẽ mã VietQR ở trang `/checkout/:orderId`)*
- **Form & Validation:** React Hook Form + Zod Schema
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Code Quality & Testing:** ESLint 10, `node:test`

### Backend Integration
- Kết nối hệ thống **Spring Boot Microservices (Java 21)** thông qua API Gateway tại `http://localhost:8080/api`.

---

## 🛠️ Yêu cầu hệ thống (Prerequisites)

- **Node.js:** `^20.19.0` hoặc `>=22.12.0`
- **Package Manager:** `npm` (đi kèm Node.js)
- **Backend Service:** Chạy tại `http://localhost:8080` *(Cần thiết nếu muốn trải nghiệm đầy đủ API thật)*

---

## ⚙️ Hướng dẫn cài đặt & Khởi chạy (Getting Started)

### 1. Clone dự án
```bash
git clone https://github.com/huypg-bi/VeggiePal_FE.git
cd VeggiePal_FE
```

### 2. Cài đặt thư viện
```bash
npm install
```

### 3. Cấu hình biến môi trường
Tạo file `.env` ở thư mục gốc (file đã được `.gitignore`, không commit):

```env
VITE_VEGGIEPAL_API_BASE_URL=http://localhost:8080/api
VITE_GOOGLE_CLIENT_ID=<oauth-client-id>.apps.googleusercontent.com
```

| Biến | Mô tả |
| :--- | :--- |
| `VITE_VEGGIEPAL_API_BASE_URL` | Base URL của API Gateway (đã gồm `/api`) |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID cho đăng nhập Google; phải trùng `GOOGLE_CLIENT_ID` của identity-service |

### 4. Khởi chạy
```bash
npm run dev
```
Giao diện chạy tại: http://localhost:5173

| Lệnh | Mô tả |
| :--- | :--- |
| `npm run dev` | Chạy môi trường phát triển |
| `npm run build` | Build production vào thư mục `dist/` |
| `npm run preview` | Chạy thử bản build |
| `npm run lint` | Kiểm tra code với ESLint |
| `npm test` | Chạy test tạm (`*.test.js`). Repo không giữ file test lâu dài: viết để kiểm tra, test xong thì xóa |

---

## 📁 Cấu trúc thư mục

```text
src/
├── app/            # App, provider (Query + Router), routes
├── components/ui/  # Component shadcn/ui (button, dialog, dropdown-menu, select ...)
├── features/       # admin, auth, home, meal-planner, payment, profile, video, restaurant-map, chatbot
├── lib/            # queryClient, schema zod, cn
├── shared/         # apiClient (axios), errorMessages (bảng dịch mã lỗi BE), Reveal, ThemeToggle, ScrollToTop (về đầu trang khi đổi route), SelectField (dropdown chọn giá trị), themeStore
└── styles/         # globals.css (Tailwind + design token)
docs/TECH_STACK.md  # Quy ước công nghệ & UI
docs/CODE_NOTES.md  # Giải thích chi tiết chức năng / cách hoạt động của code (comment dài đã chuyển ra đây)
```

Alias import: `@/` trỏ tới `src/`.

---

## 🔌 API chính

Gọi qua API Gateway, response dạng `{ code, message, result }`, cần JWT (trừ `/auth/*`).

| Method | Endpoint | Mô tả |
| :--- | :--- | :--- |
| `POST` | `/auth/login` | Đăng nhập |
| `POST` | `/auth/register` | Đăng ký (tài khoản `PENDING`, BE gửi mã OTP qua email) |
| `POST` | `/auth/verify-email`, `/auth/resend-verification` | Xác minh email bằng mã 6 số (đăng nhập luôn) / gửi lại mã (cách nhau tối thiểu 60 giây) |
| `POST` | `/auth/refresh`, `/auth/logout` | Đổi refresh token (dùng một lần) lấy cặp token mới / hủy refresh token của thiết bị |
| `POST` | `/auth/forgot-password`, `/auth/verify-otp`, `/auth/reset-password` | Quên mật khẩu: gửi mã qua email, đổi mã lấy `resetToken`, đặt mật khẩu mới |
| `POST` | `/auth/google` | Đăng nhập / đăng ký bằng Google (gửi `idToken`) |
| `GET` / `PATCH` | `/users/me` | Xem / sửa hồ sơ (họ tên, số điện thoại, ngày sinh, giới tính, mức vận động) |
| `PUT` | `/users/me/password` | Đổi mật khẩu |
| `PUT` / `DELETE` | `/users/:id/follow` | Theo dõi / bỏ theo dõi một người (gọi lặp không lỗi, trả số liệu mới) |
| `GET` | `/users/:id/follow-stats`, `/users/me/following/ids` | Số người theo dõi / đang theo dõi / đã theo dõi chưa; id những người tôi theo dõi |
| `GET` | `/blogs/feed/following` | Feed bài của những người tôi theo dõi (phân trang, cần đăng nhập) |
| `GET` | `/videos`, `/videos/:id`, `/videos/me` | Danh sách video đã duyệt (phân trang dạng `items`, lọc danh mục) / Chi tiết video / Video của tôi |
| `POST` / `PUT` / `DELETE` | `/videos`, `/videos/:id` | Đăng video (tệp .mp4 ≤ 30MB hoặc YouTube link) / Sửa / Xóa video |
| `GET` | `/recipes`, `/recipes/:id` | Danh sách công thức đã đăng (`keyword`, `sort=popular`, phân trang dạng `items`) / Chi tiết (kèm `nutritionPerServing`, `favoriteCount`) |
| `POST` | `/recipes/:id/image` | Tải ảnh công thức (multipart `file`, JPEG / PNG ≤ 5MB, chủ hoặc ADMIN) |
| `GET` | `/recipes/favorites`, `/recipes/favorites/ids` | Công thức tôi đã lưu (phân trang) / id các công thức đã lưu |
| `POST` / `DELETE` | `/recipes/:id/favorite` | Lưu / bỏ lưu công thức (gọi lặp không lỗi, trả `favoriteCount` mới) |
| `GET` | `/restaurants/nearby`, `/restaurants/search` | Quán chay quanh một điểm (`lat`, `lng`, `radiusKm` ≤ 10) / Tìm quán theo tên (`q` 2 - 100 ký tự, tối đa 20 quán, không theo bán kính; công khai) |
| `POST` | `/users/me/avatar` | Tải ảnh đại diện |
| `GET` | `/nutrition/allergens` | Danh mục dị ứng |
| `GET` / `PUT` | `/nutrition/me/allergies` | Xem / cập nhật dị ứng |
| `GET` / `POST` | `/nutrition/me/health-records` | Lịch sử / ghi chỉ số sức khỏe |
| `GET` | `/nutrition/me/health-records/latest` | Chỉ số sức khỏe mới nhất |
| `PUT` | `/nutrition/me/health-records/:id` | Sửa một bản ghi chỉ số sức khỏe trong lịch sử |
| `GET` | `/ai/admin/monitoring/summary`, `/logs/search`, `/models`, `/limits` | Giám sát AI (chỉ ADMIN): tổng hợp, nhật ký, model, giới hạn |
| `GET` / `PUT` / `DELETE` | `/ai/admin/moderation`, `/ai/admin/moderation/:id`, `/ai/admin/monitoring/logs/search?feature=MODERATION` | Kiểm duyệt nội dung (chỉ ADMIN): hàng đợi chờ duyệt, nhật ký gọi AI kiểm duyệt; tab đã xử lý chờ BE B05 |
| `POST` | `/ai/videos/process` | Gửi tệp video bóc tách công thức AI (multipart ≤ 100MB, ≤ 30 phút, cần đăng nhập) |
| `POST` | `/ai/videos/process-existing` | Bóc tách công thức từ video đã đăng (`{ videoId }`, trừ lượt theo gói) |
| `GET` | `/ai/videos/by-video/:videoId` | Xem công thức AI của video (công khai permitAll, mã 6026 cho YouTube, 6022 đang xử lý) |
| `GET` | `/ai/videos` | Lịch sử các lượt bóc tách video của tôi (phân trang dạng `items`) |
| `GET` | `/admin/payments/summary`, `/statistics`, `/revenue`, `/orders`, `/orders/:id` | Thống kê thanh toán (chỉ ADMIN): tổng quan, phân bố, doanh thu theo ngày / tháng, danh sách và chi tiết đơn hàng |
| `GET` | `/admin/users` | Danh sách người dùng (chỉ ADMIN): tìm kiếm email/họ tên, lọc status / role, phân trang |
| `PUT` | `/admin/users/:id/lock` | Khóa tài khoản người dùng (chỉ ADMIN, bắt buộc nhập lý do tối đa 500 ký tự) |
| `PUT` | `/admin/users/:id/unlock` | Mở khóa tài khoản đang bị BLOCKED (chỉ ADMIN) |
| `PUT` | `/admin/users/:id/role` | Nâng quyền tài khoản người dùng lên ADMIN (chỉ ADMIN) |
| `GET` | `/ai/meal-plans/nutrition-target` | Mục tiêu calo / macro BE tính theo hồ sơ cho `goalType` (`LOSE` / `MAINTAIN` / `GAIN`), hiện ở form tạo thực đơn |
| `GET` | `/ai/meal-plans/:id` | Một thực đơn (lấy mới khi mở hộp thoại "Lịch sử") |
| `GET` | `/nutrition/me/diary?date=` | Nhật ký một ngày: bữa đã ăn, tổng dinh dưỡng, nước, vận động |
| `PUT` / `DELETE` | `/nutrition/me/diary/meal-plans/:planId/meals/:mealType` | Đánh dấu / bỏ đánh dấu một bữa của thực đơn là đã ăn (`{date, servings?}`) |
| `POST` / `DELETE` | `/nutrition/me/diary/water`, `/nutrition/me/diary/water/:id` | Ghi / xóa một lần uống nước (`{date, milliliters}`) |
| `POST` / `DELETE` | `/nutrition/me/diary/activities`, `/nutrition/me/diary/activities/:id` | Ghi / xóa một hoạt động (`{date, activityType, minutes}`) |
| `GET` | `/ai/meal-plans/favorites`, `/ai/meal-plans/favorites/:id` | Danh sách thực đơn yêu thích (phân trang) / một thực đơn yêu thích |
| `GET` | `/ai/meal-plans/:id/versions`, `/ai/meal-plans/:id/versions/:version` | Lịch sử phiên bản / nội dung một phiên bản cũ |
| `POST` | `/ai/chat/guest-sessions` | Tạo phiên dùng thử cho khách (mỗi khách 1 phiên, lưu `sessionStorage`) |
| `POST` | `/ai/chat/guest` | Khách hỏi AI Bông Cải (giới hạn 3 lượt/ngày) |
| `POST` | `/ai/chat` | Thành viên hỏi AI (tạo mới hoặc tiếp tục cuộc trò chuyện) |
| `GET` | `/ai/chat/conversations` | Danh sách các cuộc trò chuyện của thành viên |
| `GET` | `/ai/chat/conversations/:id` | Chi tiết các tin nhắn trong một cuộc trò chuyện (truy cập của người khác trả 404) |
| `DELETE` | `/ai/chat/conversations/:id` | Xóa một cuộc trò chuyện |
| `GET` | `/payments/plans` | Danh sách gói thành viên (công khai) |
| `POST` | `/payments/checkout` | Tạo đơn thanh toán payOS (gói PLUS / PRO) |
| `GET` | `/payments/orders/:id` | Chi tiết đơn thanh toán theo ID |
| `POST` | `/payments/orders/:id/cancel` | Huỷ đơn thanh toán PENDING (`cancelOrder`), trả đơn với status CANCELLED |
| `GET` | `/payments/history` | Lịch sử giao dịch của người dùng |
| `GET` | `/subscriptions/me` | Thông tin gói thành viên hiện tại và hạn dùng |
