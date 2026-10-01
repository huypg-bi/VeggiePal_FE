# 🥬 VeggiePal — Client App

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

- **🔐 Quản lý tài khoản (Authentication):** Đăng ký, đăng nhập xác thực JWT, bảo vệ đường dẫn riêng tư (Protected Routes).
- **👤 Hồ sơ cá nhân (Profile):** Quản lý thông tin cá nhân, cập nhật ảnh đại diện và đổi mật khẩu.
- **📊 Sức khỏe & Dị ứng (Nutrition):** Ghi nhận chiều cao/cân nặng, theo dõi lịch sử BMI, chọn danh mục thực phẩm dị ứng.
- **🥗 Thực đơn dinh dưỡng (Meal Planner):** Thống kê calo, lượng nước, vận động và gợi ý món ăn theo nguyên liệu sẵn có *(Mock Data)*.
- **🎥 Khám phá video (Videos):** Xem video hướng dẫn nấu món chay kèm phân tích thông tin dinh dưỡng *(Mock Data)*.
- **📍 Bản đồ xanh (Map):** Tìm kiếm và xem danh sách các nhà hàng, quán ăn chay *(Mock Data)*.
- **🤖 Trợ lý Bông Cải (AI Chatbot):** Giao diện hỏi đáp kiến thức dinh dưỡng chay, quản lý nhiều đoạn chat *(Mock API)*.
- **🎨 Giao diện & Trải nghiệm:** Landing page hiện đại, hỗ trợ chuyển đổi chế độ Sáng/Tối (Light/Dark Mode).

---

## 💻 Công nghệ sử dụng (Tech Stack)

### Frontend Client
- **Core Framework:** React 19, Vite 8 (JavaScript / JSX)
- **Styling:** Tailwind CSS v4, shadcn/ui (`@base-ui/react`)
- **Routing:** React Router v7
- **State Management:** 
  - TanStack Query v5 *(Server State / Async Data)*
  - Zustand v5 *(Global Auth State, Theme State)*
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
```

| Biến | Mô tả |
| :--- | :--- |
| `VITE_VEGGIEPAL_API_BASE_URL` | Base URL của API Gateway (đã gồm `/api`) |

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
| `npm test` | Chạy unit test |

---

## 📁 Cấu trúc thư mục

```text
src/
├── app/            # App, provider (Query + Router), routes
├── components/ui/  # Component shadcn/ui
├── features/       # auth, home, meal-planner, profile, video, restaurant-map, chatbot
├── lib/            # queryClient, schema zod, cn
├── shared/         # apiClient (axios), Reveal, ThemeToggle, themeStore
└── styles/         # globals.css (Tailwind + design token)
docs/TECH_STACK.md  # Quy ước công nghệ & UI
```

Alias import: `@/` trỏ tới `src/`.

---

## 🔌 API chính

Gọi qua API Gateway, response dạng `{ code, message, result }`, cần JWT (trừ `/auth/*`).

| Method | Endpoint | Mô tả |
| :--- | :--- | :--- |
| `POST` | `/auth/login` | Đăng nhập |
| `POST` | `/auth/register` | Đăng ký |
| `GET` / `PATCH` | `/users/me` | Xem / sửa hồ sơ |
| `PUT` | `/users/me/password` | Đổi mật khẩu |
| `POST` | `/users/me/avatar` | Tải ảnh đại diện |
| `GET` | `/nutrition/allergens` | Danh mục dị ứng |
| `GET` / `PUT` | `/nutrition/me/allergies` | Xem / cập nhật dị ứng |
| `GET` / `POST` | `/nutrition/me/health-records` | Lịch sử / ghi chỉ số sức khỏe |
| `GET` | `/nutrition/me/health-records/latest` | Chỉ số sức khỏe mới nhất |