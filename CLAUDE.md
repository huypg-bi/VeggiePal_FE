# CLAUDE.md — VeggiePal FE

Đây là phần **Frontend** của VeggiePal (React + Vite + Tailwind v4). Chỉ làm việc trong thư mục FE này; không đụng tới Backend (chỉ đọc BE để hiểu BE làm gì và thực hiện logic ở FE cho đúng).

## Bắt buộc đọc trước khi viết code

@docs/TECH_STACK.md

File trên là nguồn sự thật về công nghệ, cấu trúc thư mục, quy ước code và hệ thống UI. Làm đúng theo đó.

## Tóm tắt nhanh

- JavaScript + JSX, **không TypeScript**.
- Không thêm thư viện mới, không đổi công cụ khi chưa được người dùng đồng ý, nếu muốn đổi công cụ thì phải hỏi người dùng.
- Giữ nguyên UI: dùng token màu trong `src/styles/globals.css`, component `<Button>` trong `@/components/ui/button`, icon `lucide-react`. Phải đúng ở cả light và dark mode.
- Gọi API qua `apiClient`, tự kiểm tra `status >= 400`. Dữ liệu server dùng React Query, state toàn cục dùng Zustand, form dùng react-hook-form + zod.
- Giao diện và thông báo lỗi bằng **tiếng Việt**.
- Trước khi báo xong: chạy `npm run lint` và `npm test`.
- Nếu có lỗi logic thì hãy test, còn nếu là UI thì để mình tự test nhé, nếu có lỗi UI thì báo mình rồi cùng fix. 
