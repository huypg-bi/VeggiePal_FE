<p align="center">
  <img src="src/assets/img/logo.png" alt="VeggiePal" width="140" />
</p>

<h1 align="center">VeggiePal</h1>

<p align="center">
  Ứng dụng web giúp người ăn chay theo dõi sức khỏe, lên thực đơn bằng AI, khám phá công thức – video nấu ăn, tìm quán chay và trò chuyện cùng trợ lý <b>Bông Cải</b>.
</p>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img alt="React Router" src="https://img.shields.io/badge/React_Router-7-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white" />
  <img alt="TanStack Query" src="https://img.shields.io/badge/TanStack_Query-5-FF4154?style=for-the-badge&logo=reactquery&logoColor=white" />
  <img alt="Zustand" src="https://img.shields.io/badge/Zustand-5-433E38?style=for-the-badge" />
  <img alt="Axios" src="https://img.shields.io/badge/Axios-1.x-5A29E4?style=for-the-badge&logo=axios&logoColor=white" />
  <img alt="Zod" src="https://img.shields.io/badge/Zod-3-3E67B1?style=for-the-badge&logo=zod&logoColor=white" />
  <img alt="Mapbox" src="https://img.shields.io/badge/Mapbox_GL-3-000000?style=for-the-badge&logo=mapbox&logoColor=white" />
  <img alt="ESLint" src="https://img.shields.io/badge/ESLint-10-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" />
  <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" />
</p>

---

## 🔗 Liên kết dự án

- **Frontend (repo này):** [huypg-bi/VeggiePal_FE](https://github.com/huypg-bi/VeggiePal_FE)
- **Backend (Spring Boot Microservices):** [Phu0312/VeggiePal_BE](https://github.com/Phu0312/VeggiePal_BE)
- **Live Demo:** [https://www.veggiepal.id.vn](https://www.veggiepal.id.vn)

---

## ✨ Tính năng chính (Key Features)

Các tính năng dưới đây được suy ra từ các route trong [`src/app/routes.jsx`](src/app/routes.jsx) và thư mục `src/features/`.

- **🔐 Xác thực & phiên đăng nhập** (`/login`, `/register`, `/verify-email`, `/forgot-password`, `/verify-otp`, `/reset-password`): đăng ký kèm xác minh email bằng mã OTP, đăng nhập bằng email hoặc Google, tự làm mới phiên bằng refresh token, quên mật khẩu qua OTP, bảo vệ route riêng tư và route quản trị.
- **👤 Hồ sơ cá nhân** (`/profile`, `/profile/edit`): thông tin cá nhân, ảnh đại diện, đổi mật khẩu, số người theo dõi / đang theo dõi, công thức đã lưu, huy hiệu, dinh dưỡng trong ngày.
- **📊 Sức khỏe & dị ứng:** ghi nhận chiều cao, cân nặng, theo dõi lịch sử và biểu đồ BMI, chọn danh mục thực phẩm dị ứng.
- **🥗 Thực đơn AI** (`/meal-planner`): tạo thực đơn 7 ngày × 3 bữa theo mục tiêu giảm / duy trì / tăng cân, xem theo ngày, đổi món, tự chọn món / khẩu phần, xem lịch sử phiên bản và khôi phục, thực đơn yêu thích; nhật ký ăn uống (đánh dấu bữa đã ăn, nước uống, vận động).
- **🍲 Công thức** (`/recipes`): duyệt, tìm kiếm, sắp xếp theo mới nhất / được lưu nhiều nhất, xem dinh dưỡng mỗi khẩu phần, tạo / sửa công thức kèm ảnh, lưu công thức yêu thích.
- **📝 Cộng đồng** (`/blog`): đăng và đọc bài viết (có AI kiểm duyệt nền), bình luận, thả tim, theo dõi tác giả, thử thách 7 ngày sống thuần chay kèm huy hiệu.
- **🎥 Video** (`/videos`): xem và đăng video (tệp `.mp4` hoặc liên kết YouTube), lọc theo danh mục, AI bóc tách công thức từ video.
- **📍 Bản đồ xanh** (`/map`): tìm quán chay quanh vị trí hiện tại trên bản đồ Mapbox, tìm quán theo tên.
- **🤖 Trợ lý Bông Cải** (`/chatbot`): hỏi đáp dinh dưỡng chay, quản lý nhiều cuộc trò chuyện, khách chưa đăng nhập được dùng thử có giới hạn lượt.
- **💳 Gói thành viên & thanh toán** (`/pricing`, `/checkout/:orderId`, `/payment/*`): các gói FREE / PLUS / PRO, thanh toán payOS bằng mã VietQR, theo dõi trạng thái đơn, lịch sử thanh toán.
- **🗂️ Nội dung của tôi** (`/my-content`): quản lý bài viết, công thức, video và lịch sử bóc tách của chính mình.
- **🛡️ Quản trị** (`/admin/*`, chỉ vai trò ADMIN): tổng quan, người dùng, danh mục, nguyên liệu, kiểm duyệt, nội dung, giám sát AI, prompt AI, thanh toán.
- **🎨 Giao diện:** chế độ Sáng / Tối, responsive từ mobile đến desktop, trang trợ giúp (`/support`).

> Một số khối nhỏ vẫn dùng dữ liệu mẫu (ví dụ lời khuyên hằng ngày trong trang thực đơn). Chi tiết từng tính năng nằm ở [`docs/TECH_STACK.md`](docs/TECH_STACK.md).

---

## 🧰 Công nghệ sử dụng (Tech Stack)

### Frontend
| Nhóm | Công nghệ |
| :--- | :--- |
| Ngôn ngữ / Framework | JavaScript + JSX (không dùng TypeScript), React 19 |
| Build tool | Vite 8, `@vitejs/plugin-react` |
| Giao diện | Tailwind CSS v4 (`@tailwindcss/vite`), `tw-animate-css`, shadcn/ui (style `base-nova`) trên `@base-ui/react`, `class-variance-authority`, `cn`, `lucide-react`, `sonner` (toast), `@fontsource-variable/geist` |
| Routing | React Router v7 |
| Server state | TanStack Query v5 |
| Client state | Zustand v5 |
| Form & Validation | React Hook Form, `@hookform/resolvers`, Zod 3 |
| HTTP | Axios |
| Bản đồ | Mapbox GL JS, `react-map-gl` |
| Khác | `qrcode.react` (vẽ mã VietQR), `@react-oauth/google` (đăng nhập Google) |

### Mobile
- Không có. Đây là ứng dụng web (SPA).

### Backend & Cơ sở dữ liệu
- Repo này **không chứa** backend hay cơ sở dữ liệu. Ứng dụng gọi qua một API Gateway tới hệ thống **Spring Boot Microservices (Java 21)** ở repo riêng ([VeggiePal_BE](https://github.com/Phu0312/VeggiePal_BE)), gồm các service: identity, nutrition, blog, recipe, location, ai, payment.
- Cơ sở dữ liệu do phía Backend quản lý (xem repo Backend).

### Công cụ & Dịch vụ
- **Chất lượng mã:** ESLint 10 (flat config) cùng `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`.
- **Kiểm thử:** `node:test` (test tạm, không giữ lâu dài trong repo).
- **Triển khai:** cấu hình Vercel trong [`vercel.json`](vercel.json) (rewrite SPA, cache dài hạn cho `/assets/`).
- **Dịch vụ bên thứ ba dùng ở phía FE:** Mapbox (bản đồ), Google OAuth (đăng nhập), payOS (thanh toán, FE hiển thị mã VietQR do Backend trả về).

---

## 📁 Cấu trúc thư mục (Project Structure)

```text
VeggiePal_FE/
├── public/                  # Tài nguyên tĩnh (favicon)
├── docs/                    # Tài liệu kỹ thuật
│   ├── TECH_STACK.md        #   Công nghệ, quy ước code, hệ thống UI
│   ├── CODE_NOTES.md        #   Giải thích chi tiết cách hoạt động của code
│   └── BACKEND_COMPLETION_TASKS.md  # Danh sách việc cần phía Backend hoàn thiện
├── src/
│   ├── main.jsx             # Điểm vào của ứng dụng
│   ├── app/                 # App, provider (Query + Router), khai báo routes
│   ├── components/ui/       # Component shadcn/ui (button, dialog, select, ...)
│   ├── features/            # Mỗi tính năng một thư mục (api, components, hooks, pages, ...)
│   │   ├── admin/           #   Khu quản trị (users, content, moderation, monitoring, payments, prompts)
│   │   ├── auth/            #   Đăng ký, đăng nhập, OTP, phiên đăng nhập
│   │   ├── blog/            #   Cộng đồng, bình luận, theo dõi, thử thách 7 ngày
│   │   ├── chatbot/         #   Trợ lý AI Bông Cải
│   │   ├── home/            #   Trang chủ
│   │   ├── ingredient/      #   Nguyên liệu
│   │   ├── meal-planner/    #   Thực đơn AI, nhật ký ăn uống
│   │   ├── my-content/      #   Nội dung của tôi
│   │   ├── payment/         #   Gói thành viên, thanh toán
│   │   ├── profile/         #   Hồ sơ, chỉ số sức khỏe, dị ứng
│   │   ├── recipe/          #   Công thức
│   │   ├── restaurant-map/  #   Bản đồ quán chay
│   │   ├── support/         #   Trợ giúp & hỗ trợ
│   │   └── video/           #   Video, bóc tách công thức bằng AI
│   ├── lib/                 # queryClient, schema Zod dùng chung, tiện ích (cn, jwt)
│   ├── shared/              # apiClient (axios), bảng dịch mã lỗi, component / hook / store dùng chung
│   ├── assets/              # Ảnh, SVG, video
│   └── styles/              # globals.css (Tailwind + design token)
├── .env.example             # Mẫu biến môi trường
├── components.json          # Cấu hình shadcn/ui
├── eslint.config.js         # Cấu hình ESLint
├── jsconfig.json            # Alias import "@/" → src/
├── vercel.json              # Cấu hình triển khai Vercel
└── vite.config.js           # Cấu hình Vite (React, Tailwind, alias)
```

Alias import: `@/` trỏ tới `src/` (ví dụ `import { cn } from "@/lib/utils"`).

---

## 🚀 Hướng dẫn cài đặt (Getting Started)

### Yêu cầu hệ thống (Prerequisites)

- **Node.js:** `^20.19.0`, `^22.13.0` hoặc `>=24` (thỏa mãn yêu cầu `engines` của Vite 8 và ESLint 10).
- **npm** (đi kèm Node.js).
- **Backend (tùy chọn nhưng cần để dùng đầy đủ tính năng):** API Gateway chạy tại `http://localhost:8080` (xem [VeggiePal_BE](https://github.com/Phu0312/VeggiePal_BE)).

### Cài đặt (Installation)

```bash
# 1. Clone dự án
git clone https://github.com/huypg-bi/VeggiePal_FE.git
cd VeggiePal_FE

# 2. Cài đặt thư viện
npm install

# 3. Tạo file biến môi trường từ file mẫu
cp .env.example .env        # Windows (cmd): copy .env.example .env
```

### Biến môi trường (Environment Variables)

Điền giá trị vào file `.env` (file này đã nằm trong `.gitignore`, **không commit**). Biến phải có tiền tố `VITE_` và Vite nhúng giá trị vào bản build.

| Biến | Mô tả | Ví dụ |
| :--- | :--- | :--- |
| `VITE_VEGGIEPAL_API_BASE_URL` | Base URL của API Gateway (đã gồm `/api`) | `http://localhost:8080/api` |
| `VITE_MAPBOX_TOKEN` | Mapbox public access token cho trang bản đồ `/map` (thiếu thì trang hiện thông báo thay vì bản đồ) | `pk.<your-mapbox-public-token>` |
| `VITE_MAPBOX_STYLE` | Style Mapbox dùng cho bản đồ | `mapbox://styles/<username>/<style-id>` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID (Web) cho nút "Tiếp tục với Google"; phải trùng `GOOGLE_CLIENT_ID` của identity-service | `<your-client-id>.apps.googleusercontent.com` |

> Origin của frontend (ví dụ `http://localhost:5173`) cần nằm trong cấu hình CORS của Backend và trong "Authorized JavaScript origins" của Google OAuth Client ID.

### Khởi chạy ứng dụng (Running the App)

```bash
npm run dev
```

Ứng dụng chạy tại `http://localhost:5173` (cổng mặc định của Vite).

| Lệnh | Mô tả |
| :--- | :--- |
| `npm run dev` | Chạy server phát triển (Vite) |
| `npm run build` | Build production vào thư mục `dist/` |
| `npm run preview` | Chạy thử bản build |
| `npm run lint` | Kiểm tra mã nguồn bằng ESLint |
| `npm test` | Chạy `node --test "src/**/*.test.js"`; chỉ dùng khi đang có file test tạm (repo không giữ test lâu dài) |

**Triển khai lên Vercel:** import repo (preset Vite), thêm các biến `VITE_*` ở *Settings → Environment Variables*; đổi biến xong phải *Redeploy* vì Vite nhúng biến lúc build. File [`vercel.json`](vercel.json) đã rewrite mọi đường dẫn (trừ `/assets/`) về `index.html` để mở thẳng route con như `/recipes/1` không bị 404.

---
