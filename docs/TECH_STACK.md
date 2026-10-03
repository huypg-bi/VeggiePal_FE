# VeggiePal FE — Tech Stack & Quy ước (dành cho AI agent)

> **Đọc file này trước khi viết bất kỳ dòng code FE nào.**
> Mục tiêu: không đổi công nghệ, không đổi cách tổ chức code, không đổi giao diện (UI).
> Phạm vi: chỉ phần **Frontend** (`VeggiePal_FE`). Backend không thuộc phạm vi file này.
>
> Quy tắc vàng: **không thêm thư viện mới, không đổi công cụ, không tự chế style mới** nếu chưa được người dùng đồng ý rõ ràng. Cái gì đã có thì dùng lại.

---

## 1. Công nghệ đang dùng (đúng theo `package.json`)

| Mảng | Công nghệ | Phiên bản | Ghi chú |
|---|---|---|---|
| Ngôn ngữ | **JavaScript + JSX** | ES Modules (`"type": "module"`) | **KHÔNG dùng TypeScript** (`jsconfig.json`, `components.json` có `"tsx": false`). File là `.js` / `.jsx`, không tạo `.ts` / `.tsx` |
| UI framework | **React** | ^19.2 | Function component + hooks. Không dùng class component |
| Build tool | **Vite** | ^8 | Plugin `@vitejs/plugin-react` ^6 |
| CSS | **Tailwind CSS v4** | ^4.3 | Qua `@tailwindcss/vite`. **Không có `tailwind.config.js`** — cấu hình bằng `@theme` trong CSS |
| Animation CSS | `tw-animate-css` | ^1.4 | Import trong `globals.css` |
| UI primitives | **shadcn/ui** (style `base-nova`) trên **`@base-ui/react`** | ^1.8 | **Không phải Radix.** Thêm component bằng CLI shadcn (xem mục 6) |
| Icon | **`lucide-react`** | ^1.45 | Chỉ dùng lucide. Không thêm bộ icon khác |
| Variant class | `class-variance-authority` (cva) | ^0.7 | Dùng cho variant của component |
| Gộp class | `cn` | ^0.4 | `import { cn } from "@/lib/utils"` |
| Routing | **`react-router-dom`** | ^7 | Dùng `BrowserRouter` + `<Routes>`/`<Route>` (khai báo trong `src/app/routes.jsx`) |
| Server state | **`@tanstack/react-query`** | ^5 | Cho mọi dữ liệu lấy từ API thật |
| Client state | **`zustand`** | ^5 | Cho state toàn cục phía client (auth, theme) |
| HTTP | **`axios`** | ^1.20 | Qua instance dùng chung `apiClient` |
| Form | **`react-hook-form`** + `@hookform/resolvers` | ^7 / ^5 | Luôn đi cùng `zodResolver` |
| Validation | **`zod`** | ^3.25 | **Zod 3** (không phải Zod 4). Schema đặt trong `schema.js` |
| Font | `@fontsource-variable/geist` + Google Fonts (Playfair Display, Inter) | — | Xem mục 4 |
| Lint | **ESLint 10** (flat config) + `react-hooks` + `react-refresh` | — | `npm run lint` |
| Test | **`node:test`** (built-in Node) + `node:assert/strict` | — | `npm test`. **Không dùng Jest/Vitest** |

### Lệnh

```bash
npm run dev       # chạy dev server (vite)
npm run build     # build production -> dist/
npm run preview   # xem bản build
npm run lint      # eslint .
npm test          # node --test "src/**/*.test.js"
```

### Biến môi trường (`.env`)

- `VITE_VEGGIEPAL_API_BASE_URL` — base URL của API gateway (vd: `http://localhost:8080/api`). Đọc bằng `import.meta.env.VITE_VEGGIEPAL_API_BASE_URL`.
- Biến phải có tiền tố `VITE_`. Không hardcode URL API trong code.

---

## 2. Những thứ KHÔNG được làm

- ❌ Không chuyển sang TypeScript, không thêm `.ts/.tsx`, không thêm PropTypes.
- ❌ Không thêm UI library khác (MUI, Ant Design, Chakra, Mantine, Bootstrap, v.v.).
- ❌ Không dùng styled-components / emotion / CSS Modules / SCSS. Chỉ Tailwind + `globals.css`.
- ❌ Không tạo `tailwind.config.js`, không tạo `postcss.config.js` (Tailwind v4 chạy qua plugin Vite).
- ❌ Không dùng Redux / Context để thay Zustand; không dùng SWR / `useEffect + fetch` thay React Query cho dữ liệu API mới.
- ❌ Không dùng `fetch` trực tiếp hay `axios.create` mới — luôn dùng `apiClient` (`@/shared/api/apiClient`).
- ❌ Không dùng Formik / Yup — chỉ react-hook-form + zod.
- ❌ Không dùng icon từ nguồn khác (FontAwesome, react-icons, heroicons...) — chỉ `lucide-react`.
- ❌ Không dùng Radix UI trực tiếp (project dùng `@base-ui/react`).
- ❌ Không đổi bảng màu, font, bo góc, cấu trúc layout đã có (xem mục 4).
- ❌ Không đổi test runner; không thêm `jest`/`vitest`/`@testing-library`.
- ❌ Không import đường dẫn tương đối kiểu `../../..` — dùng alias `@/`.
- ❌ Không sửa file trong `node_modules/`, `dist/`.

---

## 3. Cấu trúc thư mục & kiến trúc

Alias: **`@` → `src/`** (khai báo ở `vite.config.js` và `jsconfig.json`). Luôn `import ... from "@/..."`.

```
src/
├── main.jsx                 # entry: import globals.css + themeStore, render <App/>
├── app/
│   ├── App.jsx              # bọc AppProvider + AppRoutes
│   ├── provider.jsx         # QueryClientProvider + BrowserRouter (provider dùng chung)
│   └── routes.jsx           # TẤT CẢ route khai báo ở đây
├── assets/                  # img/ svg/ video/ — import trực tiếp vào component
├── components/ui/           # component shadcn (button.jsx ...); cva variants ở ui/variants/ (button-variants.js ...)
├── features/                # MỖI TÍNH NĂNG 1 THƯ MỤC (xem bên dưới)
│   ├── auth/  chatbot/  home/  meal-planner/  profile/  restaurant-map/  video/
├── lib/                     # tiện ích dùng chung: queryClient.js, schema.js, utils.js (cn)
├── shared/                  # dùng chung nhiều feature
│   ├── api/apiClient.js     # axios instance duy nhất
│   ├── components/          # Reveal, ThemeToggle ...
│   └── store/themeStore.js  # zustand theme
└── styles/globals.css       # Tailwind + design tokens (nguồn sự thật của màu/font)
```

### Cấu trúc một feature (theo feature-based architecture)

```
features/<ten-feature>/
├── api/         # <ten>Api.js  — hàm gọi API (dùng apiClient)
├── components/  # component riêng của feature (PascalCase.jsx)
├── hooks/       # useXxx.js — React Query hooks / logic state
├── pages/       # <Ten>Screen.jsx — màn hình cấp route
├── store/       # zustand store (nếu cần)
├── data/        # mock data (mock*.js) khi chưa có API thật
├── utils/       # hàm thuần + file *.test.js cạnh nó
├── queryKeys.js # khóa cache React Query của feature
└── schema.js    # zod schema riêng (hoặc dùng src/lib/schema.js)
```

**Quy tắc đặt tên**
- Component / Screen: `PascalCase.jsx` (`LoginForm.jsx`, `ProfileScreen.jsx`).
- Hook: `useXxx.js` (`useProfile.js`). Store: `xxxStore.js` với hook `useXxxStore`.
- API: `xxxApi.js`, hàm export dạng `getXxx`, `updateXxx`, `createXxx`...
- Test: `xxx.test.js` đặt **cạnh** file được test.
- Thư mục: `kebab-case` (`meal-planner`, `restaurant-map`).
- Feature mới → tạo thư mục mới trong `features/`, đừng nhét vào feature khác.
- Route mới → thêm vào `src/app/routes.jsx`; trang cần đăng nhập thì bọc `<ProtectedRoute>`.

### Trạng thái từng feature (tham khảo để biết mock hay thật)

| Feature | Route | Dữ liệu |
|---|---|---|
| auth | `/login` `/register` `/forgot-password` `/verify-otp` | API thật (`authApi.js`) |
| profile | `/profile` | API thật + React Query (`profileApi.js`, `useProfile`...) |
| home | `/` | Dữ liệu tĩnh (`homeData.js`) |
| meal-planner | `/meal-planner` | Mock (`mockMealPlanner.js`) |
| restaurant-map | `/map` | Mock (`mockRestaurantMap.js`) |
| video | `/videos`, `/videos/:videoId` | Mock (`mockVideo.js`) |
| chatbot | `/chatbot` | API mock (`chatbotApi.js` + `mockChatData.js`), state bằng `useState` |

Khi nối API thật cho feature đang mock: giữ nguyên UI, thay nguồn dữ liệu bằng `*Api.js` + React Query hook theo mẫu của `profile`.

---

## 4. Hệ thống UI / Design (BẮT BUỘC giữ nguyên)

Nguồn sự thật: **`src/styles/globals.css`**. Màu thương hiệu lấy từ Figma "VeggiePalApp".

### 4.1. Dùng token, không dùng hex cứng

Luôn dùng class Tailwind map tới token (đã khai báo trong `@theme inline`):

| Mục đích | Class Tailwind | Light | Dark |
|---|---|---|---|
| Màu thương hiệu (xanh lá) | `bg-brand` `text-brand` `border-brand` | `#1d9d5a` | `#34c37c` |
| Chữ trên nền brand | `text-brand-foreground` | `#fff` | `#06170e` |
| Nền xanh nhạt | `bg-brand-soft` | `#e7f7ec` | `#16301f` |
| Brand phụ (gradient) | `to-brand-2` | `#0ea47a` | `#22e0a5` |
| Cảnh báo | `text-warning` `bg-warning` | `#f0883e` | `#ffa361` |
| Nguy hiểm / lỗi | `text-destructive` `bg-destructive/10`, `text-danger` | — | — |
| Chữ chính (đậm) | `text-ink` | `#111c2d` | `#eaf3ec` |
| Chữ nội dung | `text-body` | `#404940` | `#c3d6c9` |
| Chữ phụ / mờ | `text-subtle` | `#707a70` | `#93ac9e` |
| Nền trang | `bg-canvas` | `#f9f9ff` | `#0a140f` |
| Nền ô nhập / khối phụ | `bg-surface` | `#f5f8f3` | `#12261a` |
| Nền card | `bg-card` | trắng | `#10231a` |
| Viền | `border-border` | — | — |
| Màu biểu đồ | `chart-1..5` | xanh lá / xanh dương / tím / cam / xanh nhạt (carb / nước / vận động / béo / đạm) | — |

- Dark mode: class `dark` trên `<html>` (variant `dark:` của Tailwind). **Mọi UI mới phải hiển thị đúng ở cả light lẫn dark** — ưu tiên dùng token (tự đổi màu theo theme) thay vì màu cố định.
- Code cũ có vài hex cứng (`#E8F5E9`, `#EF6461`, `#E8ECFB`...) kèm biến thể `dark:` — chỉ giữ ở code cũ, **code mới nên dùng token**.
- Theme do `useThemeStore` (zustand) quản lý, lưu `localStorage` key `theme`; nút đổi theme là `ThemeToggle` (hiệu ứng circular reveal bằng View Transitions).

### 4.2. Font

- **Tiêu đề (`h1,h2,h3`, class `font-heading` / `font-display-serif`)**: **Playfair Display** (serif) — nạp qua Google Fonts trong `index.html`.
- **Chữ thường (`font-sans`, mặc định `html`)**: **Geist Variable** (`@fontsource-variable/geist`).
- **Trang chủ (`font-home-sans`)**: **Inter**.
- Menu nav dùng `font-display-serif`. Không thêm font mới.

### 4.3. Bo góc, khoảng cách, bóng

- Radius gốc `--radius: 0.625rem`; scale `rounded-sm … rounded-4xl` theo token.
- **Nút: bo tròn hẳn (`rounded-full`) là mặc định.** Nút cần bo khác thì truyền `className="rounded-xl"`.
- **Card/section**: `rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6`.
- **Ô input (trang thường)**: `h-11 w-full rounded-xl border border-border bg-surface px-3.5 text-sm text-ink outline-none transition placeholder:text-subtle focus:border-brand/40 focus:ring-2 focus:ring-brand/15 aria-[invalid=true]:border-destructive/50 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-destructive/20`
- **Ô input (màn auth, nền tối/ảnh)**: gạch chân, trong suốt, chữ trắng, class `auth-input` (có xử lý autofill trong `globals.css`).
- **Header**: `sticky top-4 z-30`, pill `rounded-full border border-border bg-card/90 shadow-sm backdrop-blur`.
- **Khung nội dung trang**: `mx-auto w-full max-w-6xl` (hoặc `max-w-[1280px]`) `px-4 sm:px-6 lg:px-8`, nền trang `bg-canvas`, `min-h-dvh`.
- Icon: `lucide-react`, kích thước `size-4` / `size-5`; trong `<Button>` dùng `size-*` thay vì `h-* w-*`.
- Responsive: mobile-first, breakpoint `sm/md/lg` của Tailwind (nav ẩn dưới `lg`).
- Tôn trọng `prefers-reduced-motion` (đã xử lý trong `globals.css`).

### 4.4. Button — luôn dùng `@/components/ui/button`

```jsx
import { Button } from "@/components/ui/button";
<Button variant="default" size="md">…</Button>
```

- **variant**: `default` (xanh brand) · `outline` · `secondary` · `soft` · `ghost` · `destructive` · `link` · `gradient` (CTA/submit ở auth) · `glass` (trên nền tối/ảnh).
- **size**: `xs` `sm` `default` `md` `lg` `xl` `icon` `icon-xs` `icon-sm` `icon-lg`.
- Style `<Link>` giống nút: `className={buttonVariants({ variant, size })}` (import từ `@/components/ui/variants/button-variants`).
- **Không tạo `<button>` tự style** để thay `<Button>` cho nút mới (trừ các icon-toggle nhỏ như nút hiện/ẩn mật khẩu).

### 4.5. Layout & mẫu trang

- Trang sau đăng nhập luôn có khung: `<AppHeader />` + `<main>` + `<AppFooter />` (import từ `@/shared/components/`), bọc trong `<div className="min-h-dvh bg-canvas">`.
- Section xuất hiện dần khi cuộn: bọc `<Reveal>` (`@/shared/components/Reveal`).
- Trạng thái loading: `<Loader2 className="size-4 animate-spin" />` + chữ mô tả tiếng Việt.
- Thông báo lỗi trong form: `rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive`; thành công: nền emerald nhạt, chữ emerald.
- Ngôn ngữ giao diện: **tiếng Việt** (label, placeholder, thông báo lỗi). Giữ giọng văn hiện có.

---

## 5. Quy ước code

### 5.1. Gọi API

- **Chỉ dùng `apiClient`** (`@/shared/api/apiClient`):
  - `baseURL = VITE_VEGGIEPAL_API_BASE_URL` (đi qua API gateway).
  - Request interceptor tự gắn `Authorization: Bearer <token>` (token ở `localStorage` key `token`) — **không tự thêm header token**.
  - **`validateStatus: () => true`** → axios **không throw** khi 4xx/5xx. **Bắt buộc tự kiểm tra `res.status >= 400`** rồi `throw new Error(res.data?.message || "<thông báo mặc định tiếng Việt>")`.
- Response envelope của server: `{ code, message, result }`. Dữ liệu thật nằm ở `res.data.result`. Thành công `code = 1000`.
- Mẫu chuẩn (xem `features/profile/api/profileApi.js`):
  ```js
  function unwrap(res, fallbackMessage) {
    if (res.status >= 400) throw new Error(res.data?.message || fallbackMessage);
    return res.data?.result;
  }
  export async function getProfile() {
    const res = await apiClient.get("/users/me");
    return unwrap(res, "Không lấy được thông tin hồ sơ");
  }
  ```
- Hàm API chỉ gọi + chuẩn hóa dữ liệu, **không** chứa state/UI. Đường dẫn bỏ tiền tố `/api` (đã nằm trong baseURL).
- Upload file: `FormData`, field `file`, header `multipart/form-data`.

### 5.2. Server state (React Query)

- Dữ liệu từ API thật → `useQuery` / `useMutation` trong `features/<x>/hooks/`.
- Khóa cache khai báo tập trung ở `features/<x>/queryKeys.js`, dạng mảng phân cấp (`["nutrition", "health-records", "latest"]`).
- `queryClient` (`@/lib/queryClient`) mặc định: `retry: false`, `refetchOnWindowFocus: false`. Không đổi cấu hình này.
- Sau mutation: `queryClient.setQueryData` hoặc `invalidateQueries` theo mẫu `useProfile.js`.
- Hook trả về dạng gọn: `{ data/profile, loading, error }` với `error` là string tiếng Việt.

### 5.3. Client state (Zustand)

- Store dùng `create` từ `zustand`. Hiện có: `useAuthStore` (`features/auth/store/authStore.js`) và `useThemeStore` (`shared/store/themeStore.js`).
- Dùng selector: `useAuthStore((s) => s.user)`, `useAuthStore(selectIsAuthenticated)`.
- Auth: `token` và `user` lưu song song `localStorage` (key `token`, `user`). `logout()` phải `queryClient.clear()`.
- **Không** nhét dữ liệu server vào Zustand (để React Query lo).

### 5.4. Form

- `useForm({ resolver: zodResolver(schema), defaultValues })` + `register`.
- Schema zod đặt trong `schema.js` (`features/<x>/schema.js` hoặc `src/lib/schema.js`); thông báo lỗi **tiếng Việt**.
- Lỗi từ server: `setError("root", { message })` rồi hiển thị `errors.root.message`.
- Trạng thái nút submit dùng `formState.isSubmitting`; invalid hiển thị qua `aria-invalid={Boolean(errors.x)}`.
- Label gắn input bằng `htmlFor` + `useId()` (hoặc bọc `<label>`); thêm `autoComplete` phù hợp.

### 5.5. Routing & bảo vệ route

- Khai báo route ở `src/app/routes.jsx`. Route cần đăng nhập → `<ProtectedRoute>` (đá về `/login`, nhớ `state.from`).
- Điều hướng: `Link`, `useNavigate` từ `react-router-dom`. Route lạ → `Navigate to="/"`.

### 5.6. Style & component

- Chỉ viết class Tailwind trực tiếp trong JSX; gộp/điều kiện bằng `cn(...)` từ `@/lib/utils`.
- Class dùng lặp lại trong 1 file → gom thành hằng (`const fieldClass = "..."`) như code hiện tại.
- CSS tùy chỉnh (keyframes, autofill...) chỉ thêm vào `src/styles/globals.css`, đúng `@layer`.
- Component ở `components/ui/` là shadcn — file component chỉ export component; `cva` variants tách sang `*-variants.js` (để Fast Refresh hoạt động, ESLint `react-refresh` bắt lỗi này).
- Ảnh/SVG/video: đặt trong `src/assets/`, `import` vào component. Favicon ở `public/favicon.png`.
- Comment trong code viết bằng **tiếng Việt**, ngắn, giải thích "vì sao" (theo phong cách hiện có).

### 5.7. Test

- `node:test` + `node:assert/strict`, đặt `xxx.test.js` cạnh file thuần JS cần test (utils, logic không phụ thuộc React/DOM).
- Chạy: `npm test`. Không viết test cần DOM/JSX nếu không cài thêm công cụ — hãy tách logic ra hàm thuần để test.

### 5.8. Lint

- `npm run lint` phải sạch trước khi báo xong. Cấu hình: ESLint flat (`eslint.config.js`) với `js.recommended`, `react-hooks`, `react-refresh/vite`.

---

## 6. Thêm shadcn component (nếu thực sự cần)

Cấu hình trong `components.json`: style `base-nova`, `tsx: false`, `baseColor: neutral`, `cssVariables: true`, icon `lucide`, CSS tại `src/styles/globals.css`.
Aliases: `components → @/components`, `ui → @/components/ui`, `lib → @/lib`, `utils → @/lib/utils`, `hooks → @/hooks`.

```bash
npx shadcn@latest add <component>
```

Sau khi thêm: kiểm tra component dùng đúng token màu của VeggiePal (mục 4), bo `rounded-full` cho nút theo quy ước, và hiển thị ổn ở dark mode.

---

## 7. Checklist trước khi báo hoàn thành

- [ ] Không thêm dependency mới (hoặc đã được người dùng cho phép).
- [ ] File mới là `.js/.jsx`, đặt đúng thư mục feature, import bằng `@/`.
- [ ] Màu/font/bo góc dùng token, khớp UI hiện có; kiểm tra cả **light và dark**.
- [ ] Nút dùng `<Button>`; icon dùng `lucide-react`.
- [ ] API đi qua `apiClient`, tự check `status >= 400`, thông báo lỗi tiếng Việt.
- [ ] Dữ liệu server dùng React Query; state toàn cục dùng Zustand; form dùng RHF + zod.
- [ ] Responsive (mobile → desktop) và có trạng thái loading/lỗi.
- [ ] `npm run lint` và `npm test` chạy sạch.
