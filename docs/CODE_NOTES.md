# VeggiePal FE — Ghi chú chi tiết của code

File này gom các comment dài (từ 2 dòng trở lên) đã được chuyển ra khỏi source để code gọn hơn. Mỗi mục ghi **chức năng và cách hoạt động** của đoạn code ngay bên dưới comment cũ.

## Quy ước

- Trong code chỉ giữ comment **ngắn, đúng 1 dòng** (chú thích "vì sao" quan trọng). Phần giải thích dài viết vào file này.
- Mỗi mục được gắn với một dòng code (ghi ở dòng "Gắn với") nên tìm được bằng cách tìm dòng đó trong file tương ứng.
- Khi viết thêm giải thích dài cho code mới hoặc sửa hành vi của đoạn code đã có mục ở đây, thêm hoặc sửa mục trong file này thay vì viết comment nhiều dòng trong code. Nếu đoạn code bị xóa thì xóa mục tương ứng.
- Các mục theo thứ tự thư mục, trong mỗi file theo thứ tự xuất hiện trong code. Nội dung chép nguyên văn từ comment cũ, chưa viết lại, nên có thể nhắc tới code ở thời điểm viết.

Tổng cộng 334 mục từ 200 file.

## Mục lục

- [components](#components)
- [features/admin](#featuresadmin)
- [features/auth](#featuresauth)
- [features/blog](#featuresblog)
- [features/chatbot](#featureschatbot)
- [features/home](#featureshome)
- [features/ingredient](#featuresingredient)
- [features/meal-planner](#featuresmeal-planner)
- [features/my-content](#featuresmy-content)
- [features/payment](#featurespayment)
- [features/profile](#featuresprofile)
- [features/recipe](#featuresrecipe)
- [features/restaurant-map](#featuresrestaurant-map)
- [features/video](#featuresvideo)
- [lib](#lib)
- [shared](#shared)

## components

### components/ui/dialog.jsx

**Gắn với:** `function Dialog({`

> Hộp thoại (modal) dựng trên @base-ui/react, cùng cấu trúc với alert-dialog.jsx.
> Khác AlertDialog: có thể đóng bằng bấm ra ngoài, nội dung cuộn được khi dài (form nhiều trường).

### components/ui/input.jsx

**Gắn với:** `function Input({ className, variant, type = "text", ...props }) {`

> Ô nhập dùng chung. `ref` và các prop của react-hook-form (`{...register("x")}`)
> truyền thẳng xuống \<input> (React 19 cho phép nhận `ref` như một prop thường).

### components/ui/select.jsx

**Gắn với:** `const TRIGGER_VARIANTS = {`

> pill: thanh lọc (bo tròn hẳn); field: ô chọn trong form (cùng dáng với ô input bo rounded-xl);
> compact: ô chọn thấp, chữ nhỏ, bo rounded-2xl (cùng dáng với ô input của form chỉ số sức khỏe, cao h-10).

### components/ui/variants/button-variants.js

**Gắn với:** `export const buttonVariants = cva(`

> Tách khỏi button.jsx để file component chỉ export component (Fast Refresh),
> đồng thời cho phép style \<Link> giống nút: className={buttonVariants({ ... })}.  
> 
> Quy ước của app: nút mặc định bo tròn hẳn (rounded-full). Nút nào cần bo khác
> (rounded-xl, rounded-2xl...) thì truyền qua className. Icon trong nút nên dùng
> `size-*` thay vì `h-* w-*`, vì base ép icon không có `size-*` về size-4.

### components/ui/variants/input-variants.js

**Gắn với:** `export const inputVariants = cva("w-full outline-none transition", {`

> Tách khỏi input.jsx cho cùng kiểu với button.jsx / button-variants.js.  
> 
> - default: ô nhập trên nền sáng/tối của app (trang Profile).  
> - auth: ô chỉ có đường kẻ chân, chữ trắng trên nền kính mờ (các form đăng nhập/đăng ký).  
>   Chỉnh riêng từng ô (chiều cao, màu viền...) qua className.

## features/admin

### features/admin/components/AdminLayout.jsx

**Gắn với:** `export default function AdminLayout() {`

> Khung trang quản trị: thanh trên (logo, về trang web, đổi theme, đăng xuất) + menu trái.
> Dưới lg menu chuyển thành hàng nút cuộn ngang phía trên nội dung.

### features/admin/components/CategoryFormDialog.jsx

**Gắn với:** `export default function CategoryFormDialog({ target, onClose }) {`

> Hộp thoại tạo / sửa danh mục. `target` quyết định chế độ (null = đóng):  
> - { mode: "create-root" }                 tạo danh mục gốc, chọn loại  
> - { mode: "create-child", parent }        tạo danh mục con, tự kế thừa loại của cha  
> - { mode: "edit", category }              chỉ đổi tên / thứ tự / hiển thị (BE không cho đổi cha và loại)

### features/admin/components/IngredientFormDialog.jsx

**Gắn với:** `export default function IngredientFormDialog({ target, onClose }) {`

> Hộp thoại thêm / sửa nguyên liệu. `target`: null = đóng,
> { mode: "create" } hoặc { mode: "edit", ingredient }.

### features/admin/components/ToggleField.jsx

**Gắn với:** `export default function ToggleField({ label, hint, ref, ...inputProps }) {`

> Công tắc bật/tắt gắn với react-hook-form: \<ToggleField label="..." hint="..." {...register("active")} />
> Dùng checkbox thật (ẩn) nên bàn phím và trình đọc màn hình hoạt động bình thường.

### features/admin/moderation/api/moderationApi.js

**Gắn với:** `function toMessage(res, fallbackMessage) {`

> AI Content Moderation APIs (ai-service qua api-gateway). Chỉ dành cho ADMIN.  
> 
> @typedef {"BLOG" | "VIDEO" | "COMMENT"} ContentType
> @typedef {"APPROVED" | "REJECTED" | "REVIEW_REQUIRED" | "DISMISSED"} Decision  
> 
> @typedef {Object} ModerationResponse
> @property {number} caseId - ID case kiểm duyệt (ai_moderation_cases.id)
> @property {ContentType} contentType - Loại nội dung được kiểm duyệt
> @property {number|null} externalContentId - ID bài viết/video/bình luận gốc
> @property {number|null} authorId - ID tài khoản tạo nội dung
> @property {string|null} content - Nội dung văn bản thực tế bị AI gắn cờ
> @property {Decision} decision - Trạng thái/quyết định kiểm duyệt
> @property {string[]} categories - Danh mục vi phạm (hate, spam, violence, harassment, ...)
> @property {string|null} reason - Lý do giải thích từ AI hoặc ghi chú của Admin
> @property {number} confidence - Độ tin cậy nhận diện của AI (0.0000 -> 1.0000)
> @property {number|null} reviewedBy - ID của Admin xử lý case (null nếu chưa duyệt)
> @property {string|null} reviewedAt - Thời điểm Admin xử lý (ISO-8601, null nếu chưa duyệt)
> @property {string} createdAt - Thời điểm tạo case kiểm duyệt (ISO-8601)  
> 
> Error codes từ AI-Service:  
> - 6012 (MODERATION_TARGET_NOT_FOUND): "Nội dung đã bị xóa, không thể áp dụng quyết định"  
> - 6013 (MODERATION_CASE_STALE): "Case đã được xử lý" (không còn ở trạng thái REVIEW_REQUIRED)

**Gắn với:** `export async function getPendingModerationCases() {`

> GET /ai/admin/moderation
> Lấy danh sách case kiểm duyệt đang chờ (REVIEW_REQUIRED, sắp xếp cũ nhất trước).  
> 
> @returns {Promise\<ModerationResponse[]>}

**Gắn với:** `export async function reviewModerationCase(id, { decision, reason }) {`

> PUT /ai/admin/moderation/{id}
> Quản trị viên duyệt hoặc từ chối case kiểm duyệt kèm lý do.
> Khi quyết định được lưu, BE tự động gọi sang blog-service để cập nhật trạng thái nội dung gốc.  
> 
> @param {number} id - Mã case kiểm duyệt (caseId)
> @param {{ decision: "APPROVED" | "REJECTED", reason?: string }} payload
> @returns {Promise\<ModerationResponse>}

**Gắn với:** `export async function dismissModerationCase(id, { reason } = {}) {`

> DELETE /ai/admin/moderation/{id}?reason=
> Bỏ qua case: chỉ đưa case ra khỏi hàng đợi (decision = DISMISSED). Khác với từ chối (REJECTED),
> nội dung gốc KHÔNG bị đổi trạng thái. Case đã được xử lý trước đó sẽ trả lỗi 6013.  
> 
> @param {number} id - Mã case kiểm duyệt (caseId)
> @param {{ reason?: string }} [payload] - Lý do tùy chọn (gửi dạng query param `reason`)
> @returns {Promise\<ModerationResponse>}

### features/admin/moderation/components/ModerationDetailDialog.jsx

**Gắn với:** `export default function ModerationDetailDialog({`

> Modal hiển thị toàn bộ thông tin chi tiết của một case kiểm duyệt.
> Hiển thị trực tiếp nội dung văn bản bị gắn cờ (content) và mã tác giả (authorId) từ AI-Service.

### features/admin/moderation/components/ReviewDecisionDialog.jsx

**Gắn với:** `export default function ReviewDecisionDialog({`

> Dialog xác nhận quyết định duyệt (APPROVED) hoặc từ chối (REJECTED) case kiểm duyệt.
> Yêu cầu/cho phép admin nhập lý do quyết định trước khi gửi request PUT /ai/admin/moderation/{id}.

### features/admin/moderation/data/mockModerationData.js

**Gắn với:** `export const MOCK_MODERATION_CASES = [`

> Mock data dùng để kiểm thử giao diện và chức năng Admin Kiểm duyệt nội dung (AI Moderation).
> Cấu trúc tương thích 100% với ModerationResponse từ AI-Service:
> { caseId, contentType, externalContentId, authorId, content, decision, categories, reason, confidence, createdAt }

### features/admin/moderation/hooks/useModeration.js

**Gắn với:** `export function useDismissModeration() {`

> Mutation bỏ qua case kiểm duyệt: case rời khỏi hàng đợi nhưng nội dung gốc không đổi trạng thái.
> Làm mới hàng đợi (và badge ở sidebar, dùng chung moderationKeys.pending) sau khi thành công.

### features/admin/monitoring/api/monitoringApi.js

**Gắn với:** `const EMPTY_LOG_PAGE = { items: [], page: 0, size: 20, totalElements: 0, totalPages: 0 };`

> AI monitoring APIs (ai-service qua api-gateway). Chỉ ADMIN.
> FE gọi `/ai/admin/monitoring/...` vì baseURL đã là `.../api` (gateway có route /api/ai/** -> /ai/**).
>  GET /ai/admin/monitoring/summary?days=       tổng hợp N ngày gần nhất (BE giới hạn 1-90)
>  GET /ai/admin/monitoring/logs/search?...     usage log có lọc + phân trang (size tối đa 100)
>  GET /ai/admin/monitoring/models              model đang cấu hình cho từng tác vụ
>  GET /ai/admin/monitoring/limits              quota / giới hạn token đang áp dụng
> (GET .../logs chỉ trả 100 log mới nhất, không lọc được nên không dùng; đã có logs/search.)  
> 
> Summary: { periodDays, requests, promptTokens, completionTokens, averageLatencyMs, failedRequests }
> UsageLog: { id, userId (null = khách), principalKey ("user:7" | "guest:\<uuid>"), feature, model,
>  status ("SUCCESS" | "FAILED"), promptTokens, completionTokens, latencyMs, errorMessage, createdAt }
> LogPage: { items, page, size, totalElements, totalPages }
> feature: CHAT | MEAL_PLAN | MODERATION | RECOMMENDATION | TRANSCRIPTION | VIDEO
> Models: { chat, moderation, recommendation, mealPlan, videoExtraction, transcription }
> Limits: { guestChatRequestsPerDay, memberChatRequestsPerDay, dailyTokenLimit, maxHistoryMessages, maxInputCharacters }

**Gắn với:** `export async function searchUsageLogs({ feature, status, userId, from, to, page = 0, size = 20 } …`

> GET /ai/admin/monitoring/logs/search
> from / to: chuỗi ISO không múi giờ ("2026-10-01T00:00:00"). userId: số, bỏ trống = tất cả.

### features/admin/monitoring/components/UsageLogsSection.jsx

**Gắn với:** `export default function UsageLogsSection() {`

> Nhật ký từng lượt gọi AI, có lọc theo tác vụ / trạng thái / người dùng / khoảng ngày và phân trang
> (GET /ai/admin/monitoring/logs/search).

### features/admin/monitoring/hooks/useMonitoring.js

**Gắn với:** `export function useUsageLogs(params, { enabled = true } = {}) {`

> Nhật ký usage có lọc + phân trang. params: { feature, status, userId, from, to, page, size }.
> `enabled = false` để tạm dừng khi bộ lọc chưa hợp lệ (vd. ngày bắt đầu sau ngày kết thúc).

### features/admin/pages/AdminAiMonitoringScreen.jsx

**Gắn với:** `export default function AdminAiMonitoringScreen() {`

> Trang giám sát AI (/admin/ai-monitoring): lượt dùng, token, độ trễ, lỗi của ai-service,
> model đang dùng, giới hạn quota và nhật ký từng lượt gọi.

### features/admin/pages/AdminDashboardScreen.jsx

**Gắn với:** `export default function AdminDashboardScreen() {`

> Trang tổng quan quản trị (/admin): số liệu nhanh + lối tắt tới các trang quản lý.
> Số liệu lấy từ các API công khai có sẵn (đếm qua totalElements, size=1 cho nhẹ).

### features/admin/pages/AdminIngredientsScreen.jsx

**Gắn với:** `export default function AdminIngredientsScreen() {`

> Trang quản lý nguyên liệu (/admin/ingredients): tìm kiếm, lọc, phân trang, thêm / sửa / xóa.
> Lưu ý: BE chỉ trả nguyên liệu đang hoạt động nên danh sách này không có nguyên liệu đã tắt.

### features/admin/pages/AdminModerationScreen.jsx

**Gắn với:** `export default function AdminModerationScreen() {`

> Trang kiểm duyệt nội dung của Admin (/admin/moderation):  
> - Giao diện 3 tab điều hướng qua URL param (?tab=queue | logs | history).  
> - Tab "Hàng đợi kiểm duyệt" (mặc định): Hàng đợi các case cần duyệt (REVIEW_REQUIRED, cũ nhất trước); hiển thị caseId, loại nội dung (BLOG, VIDEO, COMMENT), externalContentId, authorId, content (nội dung bị gắn cờ), categories, reason, confidence; hỗ trợ chế độ Mock Data để test giao diện và luồng duyệt/từ chối ngay cả khi BE chưa có dữ liệu.  
> - Tab "Nhật ký kiểm duyệt" (ModerationLogsSection): Xem lịch sử các lượt gọi AI kiểm duyệt (GET /ai/admin/monitoring/logs/search?feature=MODERATION) gồm thời gian, tác giả, model, prompt/completion tokens, độ trễ ms, trạng thái thành công/thất bại và bộ lọc theo trạng thái, userId, khoảng ngày.  
> - Tab "Đã xử lý": Giao diện giữ chỗ thông báo tính năng xem lịch sử các ca đã duyệt/từ chối bởi AI và Admin kèm quyết định, lý do, độ tin cậy và người duyệt (chờ Backend hoàn thành endpoint GET /ai/admin/moderation/history theo task B05).

### features/admin/moderation/components/ModerationLogsSection.jsx

**Gắn với:** `export default function ModerationLogsSection() {`

> Khối nhật ký kiểm duyệt hiển thị các lượt gọi AI kiểm duyệt nội dung trong trang /admin/moderation.  
> - Gọi GET /ai/admin/monitoring/logs/search với tham số cố định feature=MODERATION thông qua hook useUsageLogs.  
> - Bộ lọc: trạng thái (Tất cả, SUCCESS, FAILED), mã người dùng userId (có debounce 400ms), khoảng ngày từ ngày - đến ngày.  
> - Bảng danh sách phân trang 20 dòng / trang ("Trước", "Sau"): hiển thị thời gian, người gọi (dùng describeCaller), model, token vào/ra, độ trễ và badge trạng thái.  
> - Banner giải thích: phân biệt rõ đây là nhật ký gọi AI của hệ thống, không thay thế tính năng xem quyết định kiểm duyệt chi tiết (B05).

### features/admin/payments/api/adminPaymentApi.js

**Gắn với:** `const EMPTY_ORDER_PAGE = { items: [], page: 0, size: 20, totalElements: 0, totalPages: 0 };`

> Admin payment APIs (payment-service qua api-gateway). Chỉ ADMIN.
>  GET /admin/payments/summary?from&to&planCode        thẻ tổng quan
>  GET /admin/payments/statistics?from&to&planCode     phân bố trạng thái / gói
>  GET /admin/payments/revenue?from&to&planCode&groupBy=DAY|MONTH   doanh thu theo kỳ
>  GET /admin/payments/orders?status&planCode&from&to&page&size     danh sách đơn có phân trang
>  GET /admin/payments/orders/{id}                      chi tiết đơn
> from / to: Instant ISO-8601 (Date.toISOString()).  
> 
> Summary: { totalRevenue, totalTransactions, paidTransactions, pendingTransactions,
>  cancelledTransactions, failedTransactions, averagePaidAmount, statusDistribution }
> Statistics: { statusDistribution: [{ key, count, amount }], planDistribution: [...], transactionTrend: [Point] }
> Revenue: { totalRevenue, paidTransactions, groupBy, points: [{ period, transactionCount, revenue }] }
> OrderPage: { items: [Order], page, size, totalElements, totalPages }

### features/admin/payments/components/OrdersTableSection.jsx

**Gắn với:** `export default function OrdersTableSection({ filters, enabled }) {`

> Bảng đơn hàng có lọc trạng thái, phân trang, xem chi tiết (GET /admin/payments/orders[/{id}]).
> filters: { from, to, planCode } dùng chung với các khối khác của trang.

### features/admin/payments/utils/adminPaymentFormat.js

**Gắn với:** `export function toInstant(dateValue, endOfDay = false) {`

> Chuyển giá trị \<input type="date"> ("2026-10-22") thành Instant ISO (UTC) theo giờ địa phương.
> endOfDay = true -> 23:59:59.999 cuối ngày để bao trọn ngày kết thúc.

### features/admin/users/api/usersApi.js

**Gắn với:** `export async function searchUsers({ keyword, status, role, page = 0, size = 20 } = {}) {`

> API Quản lý người dùng khu vực Admin (identity-service qua gateway).
> searchUsers: GET /admin/users?keyword=&status=&role=&page=&size= (phân trang dạng { items, page, size, totalElements, totalPages }).
> lockUser: PUT /admin/users/{id}/lock với body { reason: string } (bắt buộc, tối đa 500 ký tự).
> unlockUser: PUT /admin/users/{id}/unlock (chỉ áp dụng cho tài khoản BLOCKED).
> changeUserRole: PUT /admin/users/{id}/role với body { role: "USER" | "ADMIN" }.
> Dịch mã lỗi BE (1007, 1008, 1009, 1018, 1024, 1025, 1026) thông qua ADMIN_USER_ERROR_MESSAGES trong src/shared/api/errorMessages.js.

### features/admin/pages/AdminUsersScreen.jsx

**Gắn với:** `export default function AdminUsersScreen() {`

> Màn hình quản lý người dùng của Quản trị viên:
> - Tìm kiếm theo email hoặc họ tên có debounce 400ms.
> - Lọc theo trạng thái tài khoản (ACTIVE, PENDING, INACTIVE, BLOCKED) và vai trò (USER, ADMIN) sử dụng component SelectField.
> - Bảng danh sách phân trang 20 người dùng/trang, hỗ trợ chuyển trang Trước / Sau.
> - Phản ánh quy tắc nghiệp vụ: không cho phép admin thao tác lên chính mình (mã 1024) và tài khoản admin khác (mã 1025).
> - Thao tác khóa tài khoản mở LockUserDialog đếm 500 ký tự và ghi chú về hiệu lực access token 15 phút.
> - Thao tác mở khóa mở UnlockUserDialog cho tài khoản đang BLOCKED.
> - Thao tác nâng quyền mở ChangeRoleDialog xác nhận nâng USER lên ADMIN và lưu ý hạ quyền phải thao tác trực tiếp qua DB.

## features/auth

### features/auth/api/authApi.js

**Gắn với:** `export async function login({ email, password }) {`

> Đăng nhập bằng email + mật khẩu (khớp /auth/login của identity-service).
> Trả về: { token, refreshToken, user: { id, email, fullName, role } }
> Ném lỗi (throw) với thông báo tiếng Việt (dịch theo `code` của BE) nếu thất bại; Error mang thêm `code`
> để form phân nhánh (vd 1023 chưa xác minh email thì chuyển sang nhập mã).

**Gắn với:** `export async function loginWithGoogle(idToken) {`

> Đăng nhập bằng Google (khớp POST /auth/google của identity-service).
> `idToken` là `credential` của Google Identity Services; BE tự kiểm tra token và liên kết
> tài khoản theo email (chưa có thì tạo mới). Kết quả giống `login`.

**Gắn với:** `export async function register({ email, password, fullName, phone }) {`

> Đăng ký tài khoản mới (khớp /auth/register của identity-service).
> Backend không trả token khi đăng ký: tài khoản ở PENDING, mã OTP gửi qua email, phải xác minh (verifyEmail) mới đăng nhập được.
> Trả về: { id, email, fullName, phone, avatarUrl, role, status, emailVerified }

**Gắn với:** `export async function refreshAccessToken(refreshToken) {`

> Không ném lỗi: trả { outcome, session? } với outcome "ok" | "dead" | "unavailable" để refreshSession quyết định
> đăng xuất (dead) hay giữ phiên và thử lại (unavailable: lỗi mạng / 5xx). `skipAuthRefresh` để interceptor của
> apiClient không tự refresh chính request này.

**Gắn với:** `export function revokeRefreshToken(refreshToken) {`

> Gọi khi đăng xuất, không chờ kết quả: phiên phía FE đã xóa, còn BE chậm hoặc lỗi thì refresh token tự hết hạn sau 7 ngày.

### features/auth/api/refreshSession.js

**Gắn với:** `export function refreshSession() {`

> Mọi request cùng gặp 401 dùng chung một lần refresh (refresh token chỉ dùng được một lần, hai lần song song sẽ làm
> lần sau bị từ chối và đăng xuất oan).

**Gắn với:** `const stored = loadSession();`

> Refresh bị từ chối nhưng localStorage đã có refresh token khác thì tab khác vừa đổi trước: lấy cặp mới đó thay vì đăng xuất.

### features/auth/components/AdminRoute.jsx

**Gắn với:** `export default function AdminRoute() {`

> Route layout chỉ dành cho ADMIN. Chưa đăng nhập -> /login (nhớ trang muốn vào để quay lại);
> đã đăng nhập nhưng không phải ADMIN -> về trang chủ.
> Đây chỉ là chặn ở giao diện; BE vẫn tự kiểm tra role ở từng API quản trị.

### features/auth/components/GoogleSignInButton.jsx

**Gắn với:** `export default function GoogleSignInButton({ onError }) {`

> Nút "Tiếp tục với Google" dùng chung cho màn đăng nhập và đăng ký (BE gộp hai luồng:
> chưa có tài khoản thì tạo mới). Hiện thẳng nút thật của Google (cần để lấy ID token).
> Không được làm mờ / trong suốt nút này (opacity < 1): iframe của Google có cơ chế chống
> clickjacking và bỏ qua cú bấm, nên bấm không có phản hồi gì (không popup, không request).
> `onError(message)`: để form cha hiện lỗi trong khung lỗi của nó.

**Gắn với:** `function GoogleButtonBody({ status }) {`

> Nút kính mờ của app, chỉ hiện khi chưa có nút Google thật (thiếu cấu hình / chưa tải xong script /
> đang đăng nhập) để bấm vào sẽ báo lý do thay vì im lặng.

### features/auth/components/ProtectedRoute.jsx

**Gắn với:** `export default function ProtectedRoute({ children }) {`

> Bọc quanh route cần đăng nhập. Chưa đăng nhập -> đá về /login,
> nhớ lại trang đang muốn vào để login xong quay lại.

### features/auth/hooks/useSessionRefresh.js

**Gắn với:** `export function useSessionRefresh() {`

> Làm mới access token trước khi hết hạn 60 giây (đọc "exp" của JWT), gọi một lần ở gốc app. Phiên cũ không có refresh token
> thì đăng xuất khi hết hạn như trước. Token không phải JWT / không có "exp" thì không làm gì, lúc đó việc hết hạn do
> server từ chối request (401 -> interceptor của apiClient) quyết định.

**Gắn với:** `if (Date.now() - lastRefreshAt.current < MIN_GAP_MS) {`

> Giờ máy lệch quá nhiều làm token vừa nhận vẫn "sắp hết hạn" thì không được refresh liên tục (mỗi lần tốn một refresh token).

**Gắn với:** `const onStorage = (event) => {`

> Chỉ localStorage mới chia sẻ giữa các tab; sessionStorage (không ghi nhớ) là của riêng từng tab nên không cần đồng bộ.

### features/auth/hooks/useRequireLogin.js

**Gắn với:** `export function useRequireLogin() {`

> Dùng cho nút/hành động chỉ thành viên mới làm được (vote, bình luận...) trên trang công khai.
> `requireLogin()` trả true nếu đã đăng nhập; nếu chưa thì báo, đá sang /login
> (nhớ trang hiện tại để login xong quay lại, giống ProtectedRoute) và trả false.

### features/auth/pages/AuthScreen.jsx

**Gắn với:** `export default function AuthScreen() {`

> 6 mode (login/register/verify-email/quên mật khẩu/otp đặt lại/đặt mật khẩu mới) dùng chung 1 khung ảnh+card,
> URL quyết định mode nào hiển thị — không còn tách thành page riêng nữa.

### features/auth/schema.js

**Gắn với:** `export const loginSchema = z.object({`

> Luật kiểm tra dữ liệu form đăng nhập.
> react-hook-form + zodResolver sẽ dùng schema này để validate và sinh message lỗi.
> Backend (/auth/login) chỉ chấp nhận email, không hỗ trợ số điện thoại/username.

### features/auth/store/authStore.js

**Gắn với:** `export const useAuthStore = create((set, get) => ({`

> Nguồn sự thật về trạng thái đăng nhập của toàn app.  
> - token / user: lưu để giữ phiên khi F5. Nơi lưu phụ thuộc `remember`:  
>  true -> localStorage (còn sau khi đóng trình duyệt), false -> sessionStorage.  
> - remember: người dùng có tick "Ghi nhớ đăng nhập" ở lần đăng nhập này hay không.
> - refreshToken: dùng một lần, mỗi lần làm mới đổi sang token mới (xem refreshSession).

**Trong:** `useAuthStore` · **Gắn với:** `setAuth: ({ token, refreshToken = null, user, remember = get().remember }) => {`

> gọi sau khi login thành công và sau mỗi lần làm mới phiên. Các lần cập nhật sau đó (vd. đồng bộ hồ sơ)
> không truyền `remember` thì giữ nguyên lựa chọn hiện tại.

**Trong:** `useAuthStore` · **Gắn với:** `syncFromStorage: () => set(loadSession()),`

> Tab khác vừa đăng nhập / làm mới / đăng xuất qua localStorage thì tab này đọc lại cho khớp (gọi từ sự kiện `storage`).

**Trong:** `useAuthStore` · **Gắn với:** `if (refreshToken) revokeRefreshToken(refreshToken);`

> authStore import authApi và authApi import apiClient (vốn import authStore): vòng import này an toàn vì chỉ dùng bên trong hàm, không dùng lúc nạp module.

### features/auth/utils/authErrors.js

**Gắn với:** `export function toAuthMessage(res, fallbackMessage, overrides = {}) {`

> Thông báo tiếng Việt cho một phản hồi lỗi (status >= 400) của /auth/*.
> `overrides` là bảng riêng của từng hàm (vd login dịch 1008 thành "sai email hoặc mật khẩu").
> Mã lạ thì dùng `fallbackMessage`, không dùng message của BE vì nó là tiếng Anh.

### features/auth/utils/authStorage.js

**Gắn với:** `function parseUser(raw) {`

> "Ghi nhớ đăng nhập" = lưu phiên ở localStorage (còn sau khi đóng trình duyệt).
> Không ghi nhớ = sessionStorage (mất khi đóng tab/trình duyệt, F5 vẫn còn).
> Tham số storage truyền vào được để test; mặc định là storage của trình duyệt.
> Access token hết hạn nhưng còn refresh token thì vẫn giữ phiên (sẽ được làm mới); hết hạn mà không có refresh token thì xóa.

### features/auth/utils/roleRedirect.js

**Gắn với:** `export function resolvePostLoginPath(user, from) {`

> Trang đích sau khi đăng nhập thành công.  
> - ADMIN luôn vào trang quản trị, trừ khi đang muốn vào một trang con của /admin (vd bị đá ra  
>  từ /admin/categories lúc hết phiên) thì quay lại đúng trang đó.  
> - Người dùng thường quay lại trang họ muốn vào trước khi bị đá sang /login, mặc định là "/".  
> `from` là pathname đã lưu trong location.state.from (có thể undefined).

## features/blog

### features/blog/api/blogApi.js

**Gắn với:** `const MAX_VOTE_IDS_PER_REQUEST = 100;`

> Blog APIs (blog-service qua api-gateway).
> Công khai (không cần token):
>  GET /blogs?categoryId=&keyword=&sort=&page=&size=
>  GET /blogs/:id           (bài đã đăng; mỗi lần gọi BE tính thêm 1 lượt xem -> chỉ gọi ở trang chi tiết)  
>    Kèm token hợp lệ thì chủ bài và ADMIN còn đọc được bài DRAFT/PENDING/REJECTED/BANNED (không tính  
>    lượt xem); người khác nhận lỗi như bài không tồn tại. Token hỏng/hết hạn bị bỏ qua, không làm 401.
>  GET /blogs/:id/related
> Cần đăng nhập:
>  POST   /blogs                body { title, content, categoryId, publish }
>  PUT    /blogs/:id            body { title, content, categoryId }
>  POST   /blogs/:id/submit     (gửi bản nháp đi kiểm duyệt)
>  DELETE /blogs/:id
>  POST   /blogs/:id/thumbnail  multipart field "file" (JPEG/PNG/WEBP, tối đa 5MB)
>  POST   /blogs/:id/vote      body { value: 1 | -1 } — gửi lại cùng giá trị thì BE thu hồi vote
>  DELETE /blogs/:id/vote
>  GET    /blogs/me/votes?blogIds=1,2,3
>  GET    /blogs/me?status=&page=&size=  
> 
> BlogSummary (item của danh sách / related / "của tôi"): { id, authorId, categoryId, categoryName,
>  title, thumbnailUrl, status, viewCount, voteScore, publishedAt, createdAt }
>  -> KHÔNG có nội dung bài và số bình luận.
> Blog (chi tiết) = BlogSummary + { content, updatedAt, moderationReason }
> status: "DRAFT" | "PENDING" | "PUBLISHED" | "REJECTED" | "BANNED"
> Vote: { blogId, myVote: 1 | -1 | null, voteScore }  (voteScore = null ở GET /blogs/me/votes)
> Page: { items, page, size, totalElements, totalPages }  (chú ý: `items`, không phải `content`)
> authorId -> lấy tên/avatar qua usePublicUsers (GET /users/batch).

**Gắn với:** `export async function getBlogs({ categoryId, keyword, sort, page = 0, size = 10 } = {}) {`

> GET /blogs — bài đã duyệt, có phân trang.  
> - keyword: tìm trong tiêu đề + nội dung, khớp tiêu đề xếp trước ("" coi như không lọc)  
> - sort: "popular" (nhiều vote) | "mostViewed" (nhiều lượt xem) | bỏ trống = mới đăng nhất

**Gắn với:** `export async function voteBlog(id, value = 1) {`

> POST /blogs/:id/vote — nút tim luôn gửi 1: chưa vote thì thành vote, đã vote 1 thì BE thu hồi.
> Không vote được bài của chính mình (BE trả lỗi 3041).

**Gắn với:** `export async function getMyVotes(blogIds) {`

> GET /blogs/me/votes — vote của tôi trên một danh sách bài, để phủ lên feed công khai.
> Trả về mảng { blogId, myVote }, mỗi id được hỏi có đúng 1 phần tử (myVote null = chưa vote).

**Gắn với:** `export async function getMyBlogs({ status, page = 0, size = 10 } = {}) {`

> GET /blogs/me — bài của tôi ở mọi trạng thái, có phân trang.
> status: bỏ trống để lấy tất cả.

**Gắn với:** `export async function createBlog({ title, content, categoryId, publish = false }) {`

> ---- Tạo / sửa / xóa bài (chủ bài hoặc ADMIN) ------------------------------------------------
> Các hàm tạo/sửa/gửi duyệt trả BlogResponse có `status` và `moderationReason` để báo kết quả
> kiểm duyệt: PUBLISHED (đã đăng) | PENDING (chờ duyệt) | REJECTED (bị từ chối, kèm lý do) | DRAFT.

**Gắn với:** `export async function createBlog({ title, content, categoryId, publish = false }) {`

> POST /blogs — tạo bài. publish = false lưu bản nháp; true thì kiểm duyệt ngay (có thể đăng luôn).
> Giới hạn: tiêu đề tối đa 150 ký tự, nội dung tối thiểu 20 ký tự, danh mục phải đang hoạt động.

**Gắn với:** `export async function updateBlog(id, { title, content, categoryId }) {`

> PUT /blogs/:id — sửa bài. Bài đã qua kiểm duyệt (đã đăng, chờ duyệt, bị từ chối) sẽ bị kiểm duyệt
> lại khi sửa; bản nháp thì không. Bài đã bị gỡ (BANNED) không sửa được.

### features/blog/api/categoryApi.js

**Gắn với:** `export async function getCategories({ type, activeOnly = true } = {}) {`

> Category APIs (blog-service qua api-gateway).
> GET công khai, không cần token:
>  GET /categories?type=&activeOnly=
>  GET /categories/:id
> Chỉ ADMIN:
>  POST   /categories       body { name, type?, parentId?, displayOrder?, active? }
>  PUT    /categories/:id   body { name, displayOrder?, active? } (không đổi được cha và loại)
>  DELETE /categories/:id   (lỗi 3005 nếu còn bài viết hoặc danh mục con)  
> 
> Category: { id, parentId, type, name, displayOrder, active, children: Category[] }
> type: "FOOD_TYPE" | "RECIPE_TYPE"

**Gắn với:** `export async function getCategories({ type, activeOnly = true } = {}) {`

> GET /categories — cây danh mục 2 cấp (cha có `children`).  
> - type: lọc theo loại, bỏ trống để lấy tất cả  
> - activeOnly: mặc định true (chỉ danh mục đang hiển thị); trang quản trị truyền false

**Gắn với:** `export async function createCategory(payload) {`

> ---- Quản trị danh mục (chỉ ADMIN) -----------------------------------------------------------
> Cây tối đa 2 cấp. Danh mục gốc bắt buộc có `type`; danh mục con gửi parentId và tự kế thừa loại.

### features/blog/api/commentApi.js

**Gắn với:** `const EMPTY_PAGE = { items: [], page: 0, size: 20, totalElements: 0, totalPages: 0 };`

> Comment APIs (blog-service qua api-gateway).
> Công khai (không cần token):
>  GET /comments?targetType=BLOG|VIDEO&targetId=&page=&size=   (comment cấp 1, cũ nhất trước)
>  GET /comments/:id/replies?page=&size=                  (reply của một comment, cũ nhất trước)
> Cần đăng nhập:
>  POST   /comments        body { targetType, targetId, parentCommentId?, content }
>  PUT    /comments/:id    body { targetType, targetId, content } (chỉ chủ comment)
>  DELETE /comments/:id    (chủ comment hoặc ADMIN)  
> 
> Comment: { id, authorId, targetType, targetId, parentCommentId,
>  content, deleted, replyCount, createdAt, updatedAt }  
> - Comment đã xóa: `deleted = true`, `content = null` (vẫn giữ dòng để reply không mất ngữ cảnh)  
>  -> UI hiện "Bình luận đã bị xóa".  
> - Reply chỉ sâu 1 cấp: replyCount của reply luôn = 0.  
> - Comment mới/sửa đi qua kiểm duyệt: có thể bị ẩn hoặc chờ duyệt mà response vẫn trả bình thường  
>  (không có field status) -> UI không được giả định comment vừa gửi sẽ hiện ngay trong danh sách.  
> - Nội dung tối đa 500 từ và 5000 ký tự.  
> - Bình luận video được kiểm duyệt đồng bộ; khi ai-service không phản hồi thì BE trả 503 / 3050 (MODERATION_UNAVAILABLE). Chỉ bình luận được trên nội dung đã PUBLISHED.  
> Page: { items, page, size, totalElements, totalPages }

### features/blog/components/AuthorAvatar.jsx

**Gắn với:** `export default function AuthorAvatar({ author, className = "size-11 text-sm" }) {`

> Avatar tác giả: ảnh nếu có, không thì chữ cái đầu của tên trên nền brand nhạt.
> `author` là { fullName, avatarUrl } từ usePublicUsers, có thể undefined.

### features/blog/components/BlogFilterBar.jsx

**Gắn với:** `export default function BlogFilterBar({ filters, onChange }) {`

> Thanh tìm kiếm + hai dropdown sắp xếp / lọc danh mục của feed, cùng một hàng.  
> - filters: { keyword, sort, categoryId } (nguồn sự thật nằm ở URL, xem BlogScreen)  
> - onChange(patch): gộp patch vào bộ lọc hiện tại  
> Ô tìm kiếm giữ chữ đang gõ ở state cục bộ và chỉ báo lên sau khi ngừng gõ,
> nên cha muốn xóa ô này phải remount component bằng `key`.

### features/blog/components/BlogForm.jsx

**Gắn với:** `export default function BlogForm({ blog, categories }) {`

> Form viết / sửa bài.  
> - Tạo mới (không có `blog`): "Lưu nháp" hoặc "Đăng bài" (gửi AI kiểm duyệt nền, bài hiện công khai sau khi được duyệt).  
> - Sửa (`blog` là BlogResponse, mọi trạng thái trừ BANNED): "Lưu thay đổi". Bản nháp vẫn là nháp;  
>  bài đã qua kiểm duyệt (đã đăng, chờ duyệt, bị từ chối) sẽ về PENDING và bị ẩn tới khi AI duyệt lại.
> Sau khi lưu: bản nháp về /my-content, bài đã gửi duyệt mở /blog/:id để xem AI xét xong.
> `categories` là danh sách phẳng { id, name } của danh mục đang hoạt động.
> Ảnh bìa tải lên bằng endpoint riêng sau khi bài đã có id.

### features/blog/components/BlogPostCard.jsx

**Gắn với:** `export default function BlogPostCard({ post, author, myVote }) {`

> `post` là BlogSummaryResponse của BE (GET /blogs); `author` là { fullName, avatarUrl }
> từ usePublicUsers, có thể undefined (đang tải hoặc user không còn hiển thị công khai).
> `myVote` là vote của tôi trên bài này (từ useMyVotes), undefined với khách.

### features/blog/components/CommentComposer.jsx

**Gắn với:** `export default function CommentComposer({`

> Ô viết bình luận. Ba chế độ:  
> - bình luận mới:  \<CommentComposer blogId />  
> - phản hồi:       \<CommentComposer blogId parentCommentId />  
> - sửa:            \<CommentComposer blogId commentId initialContent />  
> `onDone` chạy sau khi gửi thành công, `onCancel` (nếu có) hiện nút Hủy.

### features/blog/components/CommentItem.jsx

**Gắn với:** `export default function CommentItem({ comment, author, isReply = false }) {`

> Một comment (cấp 1 hoặc reply). `author` là { fullName, avatarUrl } hoặc undefined.  
> - Comment cấp 1 có replyCount > 0 sẽ có nút mở danh sách reply (chỉ gọi API khi bấm).  
> - Comment đã xóa: BE trả deleted = true, content = null -> hiện dòng mờ, giữ nguyên thread.  
> - Hành động: Phản hồi (chỉ comment gốc), Sửa (chỉ chủ comment), Xóa (chủ comment hoặc ADMIN).  
>  Khách bấm Phản hồi sẽ được đá sang /login.

### features/blog/components/CommentSection.jsx

**Gắn với:** `export default function CommentSection({ blogId }) {`

> Bình luận của một bài. `total` là số comment cấp 1 (không gồm reply).
> Đã đăng nhập thì có ô viết bình luận; khách thấy lời mời đăng nhập.

### features/blog/components/ThumbnailPicker.jsx

**Gắn với:** `export default function ThumbnailPicker({`

> Chọn ảnh (mặc định là ảnh bìa blog: JPEG/PNG/WEBP ≤ 5MB; form công thức truyền `acceptTypes`, `validate`, `label`, `hint` riêng vì BE chỉ nhận JPEG/PNG). Chỉ giữ file trong bộ nhớ; việc tải lên do form cha làm
> sau khi bài đã được tạo (BE tải ảnh qua endpoint riêng cần blogId).  
> - currentUrl: ảnh bìa hiện có của bài (chế độ sửa), hiện khi chưa chọn ảnh mới  
> - onChange(file | null): file đã qua kiểm tra, hoặc null khi bỏ chọn
> - acceptTypes / validate(file) -> message | null / label / hint: đổi luật kiểm tra và chữ hiển thị

### features/blog/components/VoteButton.jsx

**Gắn với:** `export default function VoteButton({ blog, myVote, className }) {`

> Nút tim của một bài. `myVote` là vote hiện tại của tôi (1 | -1 | null | undefined).  
> - Khách bấm -> đá sang /login (useRequireLogin).  
> - Bài của chính mình: BE không cho vote, nên chỉ hiện số tim, không có nút.  
> - Bấm lần nữa khi đã thả tim: BE thu hồi vote.

### features/blog/data/mockBlog.js

**Gắn với:** `export const communityStats = [`

> Dữ liệu demo cho các khối phụ của trang Cộng đồng (/blog) mà BE chưa có API:
> số liệu cộng đồng, lời nhắn Bé Bông Cải, bảng vàng, chủ đề hot, thử thách.
> Bài viết đã lấy từ API thật (useBlogFeed), không còn nằm ở đây.

### features/blog/hooks/useBlogMutations.js

**Gắn với:** `function useInvalidateBlogs() {`

> Mọi thay đổi bài viết đều làm mới cache "blog/posts" (feed, chi tiết, bài của tôi, bài liên quan),
> vì trạng thái bài phụ thuộc kết quả kiểm duyệt của server nên không ghi tay vào cache.

### features/blog/hooks/useBlogs.js

**Gắn với:** `export function useBlogFeed({ categoryId, keyword, sort, size = 10 } = {}) {`

> Feed bài viết (GET /blogs) dạng "Tải thêm". params: { categoryId, keyword, sort, size }.
> Trả về query của React Query + `posts` (mảng phẳng các bài đã tải).

**Gắn với:** `export function useBlog(id) {`

> Chi tiết một bài (GET /blogs/:id). BE tính 1 lượt xem mỗi lần gọi, nên tắt refetch
> khi mount lại để không đếm xem trùng chỉ vì người dùng quay lại trang.
> Bài PENDING (BE cho AI duyệt nền) thì staleTime = 0 và poll mỗi 3 giây khi `aiReviewInProgress` (tối đa 3 phút);
> poll không làm tăng lượt xem vì BE chỉ cộng view cho bài PUBLISHED.

### features/blog/hooks/useBlogVotes.js

**Gắn với:** `export function useMyVotes(blogIds) {`

> Vote của tôi trên một danh sách bài (GET /blogs/me/votes) để phủ lên feed công khai.
> `data` là Map\<blogId, 1 | -1 | null>; chưa đăng nhập thì không gọi API (data undefined).

**Gắn với:** `export function useVoteBlog() {`

> Bấm tim (POST /blogs/:id/vote, value = 1): chưa vote -> vote, đã vote -> BE thu hồi.
> Thành công thì ghi thẳng kết quả vào cache (vote của tôi, điểm trong feed, điểm trong chi tiết).
> Dùng: mutate({ blogId }, { onError }) — lỗi (vd. vote bài của chính mình) là Error tiếng Việt.

### features/blog/hooks/useCategoryMutations.js

**Gắn với:** `function useInvalidateCategories() {`

> Mọi thay đổi danh mục làm mới toàn bộ cache "blog/categories" (cây ở trang quản trị, chip lọc
> của feed, dropdown trong form viết bài).

### features/blog/hooks/useChallenge.js

**Gắn với:** `const listeners = new Set();`

> Tiến độ thử thách lưu ở localStorage (chưa có API). Truy cập storage có thể ném lỗi (chế độ
> riêng tư, bị chặn dữ liệu), nên mọi lần đọc/ghi đều bọc try/catch và rơi về "chưa tham gia".

**Gắn với:** `export function useChallenge() {`

> Tiến độ thử thách 7 ngày của user đang đăng nhập.
> Trả { days, total, checkedToday, completed, broken, checkIn }.
> `checkIn()` trả true khi lần check-in này vừa hoàn thành thử thách (để mở popup phần thưởng).
> Khách chưa đăng nhập luôn ở 0 ngày.

### features/blog/hooks/useCommentMutations.js

**Gắn với:** `function useInvalidateComments() {`

> Thêm / sửa / xóa comment đều làm mới toàn bộ cache comment (danh sách gốc lẫn reply),
> vì replyCount của comment gốc và thứ tự hiển thị phụ thuộc vào dữ liệu server.
> Không ghi tay vào cache: comment mới đi qua kiểm duyệt nên có thể không hiện ra.

### features/blog/hooks/useComments.js

**Gắn với:** `export function useComments(blogId, { size = 20 } = {}) {`

> Comment cấp 1 của một bài (GET /comments) dạng "Xem thêm".
> Trả về query của React Query + `comments` (mảng phẳng) + `total` (tổng số comment cấp 1).

**Gắn với:** `export function useReplies(commentId, { size = 20, enabled = true } = {}) {`

> Reply của một comment (GET /comments/:id/replies). Chỉ truyền `enabled: true`
> khi người dùng bấm "Xem phản hồi" để khỏi gọi API cho mọi comment ngay từ đầu.

### features/blog/hooks/useMyBlogs.js

**Gắn với:** `export function useMyBlogs({ status, size = 10 } = {}) {`

> Bài viết của tôi ở mọi trạng thái (GET /blogs/me) dạng "Xem thêm".
> status: "DRAFT" | "PENDING" | "PUBLISHED" | "REJECTED" | "BANNED", bỏ trống = tất cả.
> Trả về query của React Query + `posts` (mảng phẳng) + `total`.
> Danh sách (BlogSummaryResponse) không có `aiReviewInProgress`, nên cứ còn bài PENDING thì tự làm mới
> mỗi 3 giây (tối đa 3 phút) để bài đang chờ AI tự đổi trạng thái.

### features/blog/hooks/useReviewPolling.js

**Gắn với:** `export function useReviewPollInterval() {`

> Trả hàm (active) -> `refetchInterval` cho React Query. Mốc giờ bắt đầu lưu trong ref, đặt lại khi hết active,
> nên mỗi đợt chờ AI mới có đủ REVIEW_POLL_MAX_MS; quá hạn thì dừng poll (bài vẫn PENDING, BE tự thử lại).

**Gắn với:** `export function useReviewResultToast(blog) {`

> Báo toast đúng một lần khi bài chuyển từ "AI đang xét" sang kết quả (đã đăng / bị từ chối / chờ admin).
> Mở trang khi bài đã có kết quả sẵn thì không báo, vì chưa từng thấy trạng thái đang xét.

### features/blog/pages/BlogDetailScreen.jsx

**Gắn với:** `export default function BlogDetailScreen() {`

> Trang đọc một bài (route /blog/:blogId), công khai. Nội dung BE lưu là text thuần,
> nên hiển thị bằng text (giữ xuống dòng) chứ không render HTML.
> Chủ bài / ADMIN (kèm token) còn mở được bài chưa đăng: lúc đó hiện nhãn trạng thái và ẩn vote,
> bình luận, bài liên quan vì những phần này chỉ dành cho bài đã đăng.
> Bài đang chờ AI: banner có vòng xoay và `getBlogReviewNote`, trang tự cập nhật nhờ polling trong `useBlog`.

**Trong:** `BlogDetailScreen` · **Gắn với:** `<main className="mx-auto w-full max-w-[1280px] px-6 py-6">`

> 3 cột như trang Cộng đồng: trái là nút quay lại, bài chính ở giữa, bài liên quan bên phải.
> Nút quay lại nằm ở cột trái nên khung bài chính và khung bài liên quan bắt đầu cùng một mức.
> Hai cột bên rộng gần bằng nhau nên bài luôn nằm đúng giữa trang, kể cả khi chưa có bài
> liên quan. Dưới lg chỉ còn 1 cột: nút quay lại, bài, rồi bài liên quan.

**Trong:** `BlogDetailScreen` · **Gắn với:** `<div className="ml-auto flex shrink-0 flex-col items-end gap-1.5">`

> Bên phải: danh mục, và ngay dưới là tim + lượt xem cỡ nhỏ (không chen vào hàng tiêu đề,
> vì tiêu đề dài sẽ đẩy chúng xuống dòng).

### features/blog/pages/BlogFormScreen.jsx

**Gắn với:** `export default function BlogFormScreen() {`

> Trang viết bài mới (/blog/new) và sửa bài (/blog/:blogId/edit), cần đăng nhập.
> Chế độ sửa nạp bài qua GET /blogs/:id: kèm token thì chủ bài / ADMIN đọc được cả bản nháp, chờ duyệt,
> bị từ chối. Bài bị gỡ (BANNED) không sửa được vì BE từ chối.

### features/blog/pages/BlogScreen.jsx

**Gắn với:** `export default function BlogScreen() {`

> Trang Cộng đồng (route /blog). Bài viết lấy từ API thật (GET /blogs); bảng vàng,
> chủ đề, thử thách... BE chưa có API nên vẫn dùng mock trong features/blog/data/mockBlog.js.
> Trên mobile bài viết lên trước, hai cột phụ xuống dưới (order-*); từ lg trở lên là 3 cột.

### features/blog/queryKeys.js

**Gắn với:** `export const blogKeys = {`

> Khóa cache React Query của feature blog (danh mục, bài viết, bình luận).
> Khóa phân cấp: invalidateQueries({ queryKey: blogKeys.blogs }) làm mới cả feed lẫn chi tiết.

### features/blog/schema.js

**Gắn với:** `export const blogSchema = z.object({`

> Form viết / sửa bài, khớp BlogRequest: tiêu đề tối đa 150 ký tự, nội dung tối thiểu 20 ký tự,
> bắt buộc chọn danh mục. categoryId giữ dạng chuỗi vì lấy từ dropdown, đổi sang số khi gửi.

**Gắn với:** `export const categorySchema = z.object({`

> Form tạo / sửa danh mục của admin, khớp CategoryRequest: tên tối đa 100 ký tự, thứ tự hiển thị
> là số nguyên không âm (BE dùng kiểu short nên tối đa 32767).

### features/blog/utils/blogForm.js

**Gắn với:** `export function describeBlogOutcome(blog) {`

> Diễn giải BlogResponse sau khi tạo / sửa / gửi duyệt thành thông báo cho người dùng.
> Trả { tone: "success" | "info" | "error", message } để chọn toast.success / info / error.
> BE kiểm duyệt nền: đăng / sửa / gửi duyệt trả PENDING + `aiReviewInProgress=true` (thông báo "AI đang kiểm duyệt");
> PENDING với `aiReviewInProgress=false` là chờ admin. `edited: true` đổi lời nhắn thành "bài tạm ẩn".
> Kết quả cuối (PUBLISHED / REJECTED) chỉ có sau khi poll, xem `useReviewResultToast`.

### features/blog/utils/blogModeration.js

**Gắn với:** `export const isAiReviewing = (blog) => blog?.status === "PENDING" && blog.aiReviewInProgress === true;`

> Chỉ BlogResponse chi tiết mới có cờ `aiReviewInProgress`; danh sách thì không nên không dùng được hàm này.

**Gắn với:** `export function nextReviewPollInterval(active, since, now) {`

> Hàm thuần quyết định poll tiếp hay dừng: trả REVIEW_POLL_INTERVAL_MS khi còn trong REVIEW_POLL_MAX_MS
> kể từ `since`, ngược lại false. Giới hạn 3 phút vì khi AI sập BE thử lại mỗi 2 phút không hẹn ngày xong.

**Gắn với:** `export function getBlogReviewNote(blog) {`

> Dòng ghi chú cho chủ bài ở banner trang chi tiết: AI đang xét, chờ admin, hoặc bị từ chối, kèm `moderationReason` nếu có.

### features/blog/utils/categoryForm.js

**Gắn với:** `export function formValuesToCategoryPayload(values, { parentId, isEdit } = {}) {`

> Giá trị form (đã qua categorySchema) -> CategoryRequest.  
> - tạo danh mục gốc: gửi `type` (BE bắt buộc); không gửi parentId  
> - tạo danh mục con: gửi parentId, không gửi type (con luôn kế thừa loại của cha)  
> - sửa: chỉ gửi name / displayOrder / active (BE không cho đổi cha và loại)  
> displayOrder để trống thì không gửi để BE giữ giá trị hiện tại (mặc định 0 khi tạo).

### features/blog/utils/challenge.js

**Gắn với:** `export const CHALLENGE_DAYS = 7;`

> Thử thách "7 Ngày Sống Thuần Chay Tươi Mới". Chưa có API nên tiến độ lưu ở localStorage theo từng
> user (xem useChallenge). File này chỉ chứa logic thuần để test được; khi BE có API thì thay phần lưu.  
> 
> Luật: người dùng tự bắt đầu ở lần check-in đầu tiên. Mỗi ngày check-in được một lần, cần 7 ngày
> liên tiếp. Bỏ lỡ một ngày thì đứt chuỗi và lần check-in kế tiếp bắt đầu lại từ ngày 1.

**Gắn với:** `export function readProgress(record, today) {`

> Tiến độ hiển thị tại ngày `today`.  
> - completed: đã đủ 7 ngày (huy hiệu giữ mãi)  
> - broken: từng check-in nhưng đã lỡ ít nhất một ngày -> hiện 0, lần check-in sau bắt đầu lại

### features/blog/utils/feedFilters.js

**Gắn với:** `export const SORT_OPTIONS = [`

> Bộ lọc của feed blog được lưu trên URL (?q=&sort=&category=) để bấm vào bài rồi
> quay lại vẫn giữ nguyên bộ lọc, và có thể chia sẻ link đã lọc.

**Gắn với:** `export function flattenCategories(tree) {`

> Cây danh mục 2 cấp -> danh sách phẳng để làm chip lọc: cha rồi tới con của nó.
> BE lọc theo đúng categoryId (không gồm danh mục con) nên mỗi cấp là một chip riêng.

### features/blog/utils/voteCache.js

**Gắn với:** `export function applyVoteToMyVotes(list, vote) {`

> Cập nhật cache React Query sau khi vote, để không phải tải lại cả feed.
> `vote` là VoteResponse của BE: { blogId, myVote: 1 | -1 | null, voteScore }.

### features/video/utils/videoVoteCache.js

**Gắn với:** `export function applyVoteToMyVideoVotes(list, vote) {`

> Cập nhật điểm voteScore và trạng thái myVote vào cache React Query của feed và chi tiết video sau khi vote.

## features/chatbot

### features/chatbot/api/chatbotApi.js

**Gắn với:** `function unwrap(res, fallbackMessage) {`

> API chatbot — ai-service qua gateway (baseURL đã có /api nên đường dẫn bắt
> đầu từ /ai/...). Response envelope: { code, message, result }.

**Gắn với:** `export async function sendChatMessage({ conversationId, message }) {`

> POST /ai/chat — hỏi AI khi đã đăng nhập. `conversationId` rỗng = BE tự tạo
> hội thoại mới, có giá trị = nối tiếp hội thoại cũ (nhiều lượt).

### features/chatbot/components/ChatMarkdown.jsx

**Gắn với:** `export default function ChatMarkdown({ content }) {`

> Hiển thị nội dung AI trả về (markdown) thành tiêu đề / bảng / danh sách gọn gàng.
> Render bằng React element, không dùng dangerouslySetInnerHTML nên an toàn với nội dung AI.

### features/chatbot/components/ChatSidebar.jsx

**Trong:** `ChatSidebar` · **Gắn với:** `const [pendingDelete, setPendingDelete] = useState(null);`

> Một hộp thoại xác nhận dùng chung cho mọi dòng. Tách open và pendingDelete
> để tiêu đề không bị trống trong lúc hộp thoại đang mờ dần khi đóng.

### features/chatbot/hooks/useChatbot.js

**Gắn với:** `async function ensureGuestSession(forceNew = false) {`

> Dùng lại phiên còn hạn để không tốn thêm lượt tạo phiên (BE giới hạn theo IP/ngày).
> forceNew = true: bỏ qua phiên đang lưu trong sessionStorage và tạo phiên hoàn toàn mới.

**Gắn với:** `export function useChatbot() {`

> State + hành động cho trang chatbot.  
> - Đã đăng nhập: hội thoại lưu ở BE (danh sách / chi tiết / gửi / xoá).  
>  `activeSessionId = null` nghĩa là đoạn chat mới — BE tự tạo hội thoại ở tin nhắn đầu.  
> - Chưa đăng nhập: chế độ khách, tin nhắn chỉ giữ trong bộ nhớ, bị giới hạn lượt hỏi.

**Trong:** `useChatbot` · **Gắn với:** `try {`

> Đồng bộ lại trong mutationFn để dấu "đang trả lời" giữ tới khi tin nhắn
> thật đã có trong cache (tránh nháy mất tin nhắn giữa hai lần render).

### features/chatbot/pages/ChatbotScreen.jsx

**Gắn với:** `export default function ChatbotScreen() {`

> Trang chatbot dinh dưỡng (/chatbot).
> Dùng ai-service thật qua @/features/chatbot/api/chatbotApi.js:  
> - Đã đăng nhập: lịch sử hội thoại lưu ở BE (sidebar, nhiều lượt).  
> - Chưa đăng nhập: chế độ dùng thử, không có sidebar, giới hạn số lượt hỏi.

### features/chatbot/queryKeys.js

**Gắn với:** `export const chatbotKeys = {`

> Khóa cache React Query của feature chatbot.
> Tách "conversations" (danh sách) và "conversation" (chi tiết) để invalidate
> danh sách không làm mất cache chi tiết từng cuộc trò chuyện.

### features/chatbot/utils/chatUtils.js

**Gắn với:** `export function pickNextActiveSessionId(sessions, deletedId, currentActiveId) {`

> Xác định session nên active sau khi xoá `deletedId`.  
> - Nếu session bị xoá không phải session đang active, giữ nguyên active hiện tại.  
> - Nếu đang active bị xoá, chuyển sang session gần nhất còn lại (sessions cần  
>  được sắp xếp sẵn theo thời gian — BE đã trả về theo updatedAt giảm dần).  
> - Nếu không còn session nào, trả về null (= đoạn chat mới).

**Gắn với:** `export function isGuestSessionValid(stored, now = new Date()) {`

> Phiên khách còn dùng được không. BE trả `expiresAt` dạng LocalDateTime
> (không có múi giờ) nên chừa 60 giây đệm để tránh gửi sát giờ hết hạn.

**Gắn với:** `export function getChatErrorMessage(error, { guest = false } = {}) {`

> Dịch lỗi của ai-service (ErrorCode 6000-6999) sang thông báo tiếng Việt qua bảng CHATBOT_ERROR_MESSAGES và CHATBOT_GUEST_ERROR_MESSAGES trong src/shared/api/errorMessages.js.
> BE trả message tiếng Anh nên dịch theo code (6000-6007, 6999) và dự phòng theo HTTP status (401, 404, 429, 500-599).

### features/chatbot/utils/parseChatMarkdown.js

**Gắn với:** `const TABLE_ROW = /^\s*\|.*\|\s*$/;`

> Phân tích markdown đơn giản mà AI trả về thành cấu trúc block để UI render
> (không dùng thư viện markdown vì quy ước dự án không thêm dependency).
> Hỗ trợ: tiêu đề (#), bảng (| a | b |), danh sách (-, *, •, 1.), đường kẻ (---),
> đoạn văn; inline: **đậm**, *nghiêng*, `code`.

## features/home

### features/home/api/recommendationApi.js

**Gắn với:** `export async function getRecommendations({ interest, limit = 6 } = {}) {`

> AI Content Recommendation APIs (ai-service qua gateway).
> GET /ai/recommendations?interest=&limit= (cần đăng nhập, limit 1-10, mặc định 6).
> Trả về danh sách Recommendation:
> [{ type: "BLOG" | "RECIPE", id: number, reason: string, content: JsonNode }]

**Gắn với:** `export async function getRecommendations({ interest, limit = 6 } = {}) {`

> Lấy danh sách gợi ý nội dung từ AI.
> @param {Object} params
> @param {string} [params.interest] - Chủ đề / sở thích (mặc định BE dùng "ăn chay")
> @param {number} [params.limit=6] - Số lượng gợi ý (1-10)

### features/home/components/AiRecommendationsSection.jsx

**Gắn với:** `export default function AiRecommendationsSection() {`

> Khối "Gợi ý dành riêng cho bạn" trên trang chủ:
> Sử dụng GET /ai/recommendations của ai-service.  
> - Đã đăng nhập: lấy danh sách các món ăn & bài viết AI đề xuất kèm lý do.  
> - Chưa đăng nhập: hiển thị banner giới thiệu đăng nhập để cá nhân hóa nội dung.  
> - Có xử lý riêng biệt lỗi Server (isError) và trạng thái rỗng.

### features/home/components/RecommendationCard.jsx

**Gắn với:** `export default function RecommendationCard({ item }) {`

> Card hiển thị một mục nội dung gợi ý từ AI (có thể là BLOG hoặc RECIPE).
> Hiển thị hình ảnh, badge loại, lý do AI gợi ý (reason) và tiêu đề.

### features/home/hooks/useRecommendations.js

**Gắn với:** `export function useRecommendations({ interest, limit = 6 } = {}) {`

> Hook lấy gợi ý nội dung trực tiếp từ BE qua API `GET /ai/recommendations`.
> Chỉ gọi khi người dùng đã đăng nhập.

## features/ingredient

### features/ingredient/api/ingredientApi.js

**Gắn với:** `const EMPTY_PAGE = {`

> Ingredient APIs (recipe-service qua api-gateway).
> GET công khai, không cần token (CHỈ trả nguyên liệu đang hoạt động, kể cả trang quản trị):
>  GET /ingredients?keyword=&vegan=&allergen=&page=&size=
>  GET /ingredients/:id
> Chỉ ADMIN:
>  POST   /ingredients       body IngredientRequest
>  PUT    /ingredients/:id
>  DELETE /ingredients/:id   (xóa hẳn)  
> 
> Ingredient: { id, name, description, caloriesPer100g, proteinPer100g, carbsPer100g,
>  fatPer100g, fiberPer100g, vegan, allergen, imageUrl, active, createdAt, updatedAt }
> Page: { content, page, size, totalElements, totalPages, first, last }

**Gắn với:** `export async function getIngredients({`

> GET /ingredients — nguyên liệu đang hoạt động, có phân trang.  
> - keyword: tìm theo tên ("" coi như không lọc)  
> - vegan / allergen: true | false để lọc, undefined để bỏ qua

**Gắn với:** `export async function createIngredient(payload) {`

> ---- Quản trị nguyên liệu (chỉ ADMIN) --------------------------------------------------------
> IngredientRequest: { name, description?, caloriesPer100g, proteinPer100g, carbsPer100g,  
>   fatPer100g, fiberPer100g?, vegan?, allergen?, active? }. Tên không được trùng (không phân biệt  
>   hoa thường và dấu). Cột giới hạn: tên 150, mô tả 1000 ký tự.

**Gắn với:** `export async function deleteIngredient(id) {`

> DELETE /ingredients/:id — xóa hẳn. Nguyên liệu đang nằm trong công thức nào đó sẽ bị ràng buộc
> khóa ngoại và BE trả lỗi 500 chung chung, nên lỗi từ server được diễn giải lại cho admin.

### features/ingredient/hooks/useIngredientMutations.js

**Gắn với:** `function useInvalidateIngredients() {`

> Mọi thay đổi nguyên liệu làm mới toàn bộ cache "ingredients" (danh sách, chi tiết, và dinh dưỡng
> đang dùng để tính kcal công thức).

### features/ingredient/hooks/useIngredients.js

**Gắn với:** `export function useIngredients(params = {}) {`

> Danh sách nguyên liệu (GET /ingredients). params: { keyword, vegan, allergen, page, size }.
> Giữ dữ liệu trang cũ trong lúc tải trang/từ khóa mới để danh sách không bị nháy.

### features/ingredient/schema.js

**Gắn với:** `export const ingredientSchema = z.object({`

> Form tạo / sửa nguyên liệu của admin. Số giữ dạng chuỗi vì lấy từ \<input>
> (đổi sang số ở utils/ingredientForm.js). Chất xơ không bắt buộc, khớp BE.

### features/ingredient/utils/ingredientForm.js

**Gắn với:** `import { parseDecimal } from "../schema.js";`

> Chuyển đổi giữa dữ liệu form nguyên liệu (toàn chuỗi) và IngredientRequest / IngredientResponse của BE.
> Không import alias @/ để file test (node --test) chạy được.

## features/meal-planner

### features/meal-planner/api/diaryApi.js

**Gắn với:** `export async function getDiary(date) {`

> Nhật ký ăn uống (nutrition-service qua api-gateway, cần đăng nhập). Ngày tính theo múi giờ Asia/Ho_Chi_Minh,
> gửi dạng "YYYY-MM-DD" (BE để trống thì lấy hôm nay).
>  GET    /nutrition/me/diary?date=                              tổng kết một ngày
>  PUT    /nutrition/me/diary/meal-plans/:planId/meals/:mealType xác nhận đã ăn { date, servings? }
>  DELETE /nutrition/me/diary/meal-plans/:planId/meals/:mealType?date=  bỏ xác nhận
>  POST   /nutrition/me/diary/water                               { date, milliliters }
>  DELETE /nutrition/me/diary/water/:id
>  POST   /nutrition/me/diary/activities                          { date, activityType, minutes }
>  DELETE /nutrition/me/diary/activities/:id
> DailySummary: { date, timezone, meals, nutrition, water, totalWaterMl, activities, totalActivityMinutes }
> MealEntry: { id, date, source, mealPlanId, mealType, recipeId, title, servings,
>  nutrition: { calories, protein, carbohydrate, fat }, recordedAt }

### features/meal-planner/api/mealPlanApi.js

**Gắn với:** `const CREATE_TIMEOUT_MS = 120_000;`

> Meal plan APIs (ai-service qua api-gateway). Tất cả cần đăng nhập.
> FE gọi `/ai/...` vì baseURL đã là `.../api` (gateway có route /api/ai/** -> /ai/**).
>  POST /ai/meal-plans              tạo thực đơn 7 ngày (gọi LLM nên chậm, có thể vài chục giây)
>  GET  /ai/meal-plans              các thực đơn đã lưu (kèm đủ nội dung), mới nhất trước
>  POST /ai/meal-plans/:id/replace  đổi một món, trả về cả thực đơn sau khi cập nhật
>  POST   /ai/meal-plans/:id/favorite  thêm cả thực đơn vào yêu thích (yêu thích theo thực đơn, không theo món)
>  DELETE /ai/meal-plans/:id/favorite  bỏ yêu thích
>  POST   /ai/meal-plans/:id/update-from-health  tính lại mục tiêu dinh dưỡng theo chỉ số sức khỏe mới nhất  
>    rồi co giãn lại khẩu phần: confirm=false chỉ xem trước (không lưu), confirm=true lưu bản mới  
>    (BE giữ bản cũ trong lịch sử phiên bản). Trả { confirmed, message, recalculatedTarget, currentPlan,  
>    proposedPlan, updatedMealPlan }; currentPlan / proposedPlan là phần `plan` (có days[].nutritionTotals).
>  POST /ai/meal-plans/:id/preview-edit  xem trước chỉnh sửa thủ công (không lưu), trả { preview: true, plan }
>  POST /ai/meal-plans/:id/edit          lưu chỉnh sửa thủ công, trả { preview: false, plan, updatedMealPlan }  
>    body { changeSummary?, edits: [{ day, mealType, action: "REPLACE" | "UPDATE_SERVING", recipeId?, servingMultiplier? }] }  
>    BE tính lại dinh dưỡng từng bữa + tổng ngày + targetMet; chỉ nhận món chay, không chứa dị ứng của người dùng  
>    (6018 / 6019). Bản trước được lưu vào lịch sử phiên bản.
>  GET /ai/meal-plans/:id                    một thực đơn của tôi (cùng dạng MealPlan trong danh sách)
>  GET /ai/meal-plans/favorites?page&size    thực đơn yêu thích, mới yêu thích trước: PageResponse { content, page, size,  
>    totalElements, totalPages, first, last } (size tối đa 100)
>  GET /ai/meal-plans/favorites/:id          một thực đơn yêu thích (6015 khi thực đơn chưa được yêu thích)
>  GET /ai/meal-plans/:id/versions/:version  một phiên bản cũ (6017 khi không có số phiên bản đó)
>  GET /ai/meal-plans/:id/versions  các bản cũ đã được thay thế, mới nhất trước:  
>    [{ id, mealPlanId, version, name, goal, plan, changeSummary, createdAt }]. Mỗi lần cập nhật theo sức khỏe hoặc  
>    sửa thủ công hoặc khôi phục, BE lưu bản trước đó ở đây (đổi món bằng AI `/replace` thì không tạo phiên bản).  
> 
 POST /ai/meal-plans/:id/versions/:version/restore  đưa bản cũ thành phiên bản mới (không body, trả MealPlan; không tốn lượt).  
   BE lưu bản đang dùng vào lịch sử (ghi chú "Trước khi khôi phục phiên bản N") và kiểm tra lại từng món theo dị ứng / món chay  
   hiện tại: 6018 / 6019 (dịch riêng bằng `MEAL_PLAN_RESTORE_ERROR_MESSAGES`), 6017 không có phiên bản đó.  
 GET /ai/meal-plans/usage  lượt tạo thực đơn của tháng: { planCode, limit, used, remaining, periodStart, resetsOn (YYYY-MM-DD) }  
> 
>  GET /ai/meal-plans/nutrition-target?goalType=  mục tiêu calo / macro BE tính từ hồ sơ (xem getNutritionTarget)  
> 
> MealPlan: { id, name, goal, goalType, createdAt, updatedAt, version, isFavorite, plan: {
>  days: [{ day: "MONDAY", meals: [{ mealType: "BREAKFAST"|"LUNCH"|"DINNER", recipeId, note?,  
>    servingMultiplier?, nutrition: { calories, protein, carbohydrate, fat } }], nutritionTotals: { ... },  
>    targetMet?: boolean, targetDeviations?: { calories|protein|carbohydrate|fat: { actual, min?, max? } } }],
>  constraints: { preferences, availableIngredients, allergies, healthRecord, dailyNutritionTarget } } }
> nutrition do BE cộng từ nguyên liệu (không phải AI tự bịa) và ĐÃ nhân `servingMultiplier`.
> servingMultiplier (0.75 - 2.0) chỉ có khi BE co giãn khẩu phần để calo từng bữa chạm ngân sách của bữa đó.
> goalType ("LOSE" | "MAINTAIN" | "GAIN") là null với thực đơn tạo trước khi BE có trường này.
> BE luôn trả đủ 7 ngày × 3 bữa; `day` là "MONDAY".."SUNDAY" (vẫn chuẩn hóa ở utils/mealPlan.js).
> Nếu AI lỗi, BE tự lập thực đơn bằng thuật toán cố định nên FE không phân biệt được hai trường hợp.
> Mọi thực đơn mới đều có mục tiêu (FE gửi dailyNutritionTarget hoặc BE tự tính theo goalType). Một ngày có calo
> ngoài [minCalories, maxCalories] (không còn dung sai) thì BE KHÔNG báo lỗi, vẫn trả thực đơn và đánh dấu ngày
> đó bằng targetMet=false (targetMet chỉ xét calo); targetDeviations liệt kê mọi chất nằm ngoài khoảng, kể cả khi
> targetMet=true (xem utils/mealPlan.js: dayTargetDeviations).
> Lỗi cần xử lý riêng: 6010 (chưa có chỉ số sức khỏe), 6011 (không còn món phù hợp), 6020 (hồ sơ thiếu ngày sinh /
> giới tính / mức vận động) và 6021 (dưới 18 tuổi); hai lỗi sau chỉ có khi BE tự tính mục tiêu và không tốn lượt.
> Meal chỉ có recipeId, tên/ảnh món lấy qua GET /recipes/:id.

**Gắn với:** `export async function createMealPlan(payload) {`

> POST /ai/meal-plans
> Body: { name, healthGoal, goalType, preferences?: string[], availableIngredients?: string[],
>  dailyNutritionTarget?: { minCalories, maxCalories, minProtein, maxProtein,
>  minCarbohydrate, maxCarbohydrate, minFat, maxFat } }
> goalType ("LOSE" | "MAINTAIN" | "GAIN") bắt buộc (thiếu thì BE trả 400 / 6000). healthGoal chỉ là mô tả đưa vào
> prompt nhưng vẫn không được rỗng. Không gửi dailyNutritionTarget thì BE tự tính theo hồ sơ + goalType; có gửi
> thì BE dùng nguyên giá trị đó (mọi mốc đều tùy chọn) và không đọc hồ sơ.

**Gắn với:** `export async function getNutritionTarget(goalType) {`

> GET /ai/meal-plans/nutrition-target?goalType= — mục tiêu calo / macro BE tính từ chiều cao, cân nặng mới nhất
> và ngày sinh, giới tính, mức vận động trong hồ sơ (Mifflin-St Jeor).
> Trả { goalType, bmr, tdee, targetCalories, target: { minCalories, maxCalories, minProtein, ... } };
> `target` có thể gửi nguyên làm dailyNutritionTarget. Lỗi: 6010 (thiếu chỉ số sức khỏe), 6020 (hồ sơ thiếu thông
> tin), 6021 (dưới 18 tuổi), kèm `error.code`.

**Gắn với:** `export async function favoriteMealPlan(id) {`

> POST /ai/meal-plans/:id/favorite — thêm thực đơn vào yêu thích. Đã có sẵn (6014) coi như đã xong,
> vì ý người dùng là "thực đơn này đang được yêu thích".

**Gắn với:** `export async function editMealPlan(id, { edits, changeSummary, preview = false }) {`

> Chỉnh sửa thủ công thực đơn. `preview` = true chỉ xem trước (không lưu), false thì lưu.
> edits: [{ day, mealType, action: "REPLACE" | "UPDATE_SERVING", recipeId?, servingMultiplier? }]

**Gắn với:** `export async function updatePlanFromHealth(id, { confirm = false, customTarget, changeSummary } =…`

> POST /ai/meal-plans/:id/update-from-health — cập nhật thực đơn theo chỉ số sức khỏe mới nhất.
> confirm=false: chỉ xem trước (không lưu gì). confirm=true: lưu, kết quả có `updatedMealPlan`.
> Chưa có hồ sơ sức khỏe thì BE báo 6010 (đã có bản dịch ở VI_MESSAGES).
> customTarget (tùy chọn, cùng dạng dailyNutritionTarget): mục tiêu tự đặt, BE dùng thay hẳn mục tiêu tự tính.
> Không gửi thì BE tính lại theo goalType đã lưu của thực đơn (thực đơn cũ chưa có goalType thì BE đoán từ `goal`)
> và có thể báo 6020 / 6021 giống getNutritionTarget. changeSummary (tùy chọn, tối đa 500 ký tự): ghi chú lưu cùng phiên bản cũ, mặc định BE ghi
> "Cập nhật từ chỉ số sức khỏe". Bản xem trước và bản lưu phải dùng cùng customTarget thì kết quả mới giống nhau.

**Gắn với:** `export async function replaceMeal(id, { day, mealType, currentRecipeId }) {`

> POST /ai/meal-plans/:id/replace — đổi một bữa sang món khác.
> Body: { day, mealType, currentRecipeId } (day lấy đúng chuỗi BE đã trả trong plan.days[].day).

### features/meal-planner/components/AiMealSuggestion.jsx

**Gắn với:** `const AUTO_TARGET_BLOCKING_CODES = new Set([6020, 6021]);`

> BE từ chối chắc chắn (hồ sơ thiếu thông tin / dưới 18 tuổi) khi phải tự tính mục tiêu: khóa nút thay vì để người
> dùng bấm rồi mới thấy lỗi (mã này là lỗi BE trả về khi hồ sơ đã đổi sau lần kiểm tra ở FE). Có mục tiêu tự đặt
> thì BE không đọc hồ sơ nên không bị chặn.

**Gắn với:** `export default function AiMealSuggestion({ onCreated }) {`

> Form nhờ AI lên thực đơn 7 ngày (POST /ai/meal-plans).  
> - Mục tiêu (giảm / duy trì / tăng cân) là `goalType` bắt buộc; ô "Mô tả thêm" là tùy chọn và được ghép vào `healthGoal`.  
> - Mục tiêu dinh dưỡng mỗi ngày: mặc định BE tự tính từ hồ sơ (thẻ NutritionTargetCard cho xem trước); điền các ô  
>  "Tự đặt mục tiêu riêng" thì gửi `dailyNutritionTarget` thay thế.  
> - Nguyên liệu có sẵn: chọn từ danh mục nguyên liệu; BE chỉ ưu tiên các món dùng chúng (không loại món khác).  
> - Cần có chỉ số sức khỏe (chiều cao, cân nặng) mới tạo được thực đơn: thiếu thì khóa nút và dẫn tới hồ sơ.  
> - Khẩu vị: gửi nhãn các lựa chọn đang bật qua `preferences`.  
> - Tên, mục tiêu, mô tả, mục tiêu dinh dưỡng: react-hook-form + zod.  
> `onCreated(plan)` được gọi khi tạo xong để trang chuyển sang xem thực đơn mới.

**Trong:** `AiMealSuggestion` · **Gắn với:** `const healthRecord = useLatestHealthRecord();`

> BE trả lỗi 6010 nếu chưa có bản ghi sức khỏe nên chặn sớm. Chỉ khóa khi chắc chắn là chưa có
> (đã tải xong, không lỗi); nếu không tải được thì vẫn cho thử, BE sẽ là bên quyết định.

**Trong:** `AiMealSuggestion` · **Gắn với:** `const { subscription } = useMySubscription();`

> Gói quy định số thực đơn được tạo mỗi tháng (BE báo lỗi 6003 khi hết). Chưa biết gói (đang tải / lỗi) thì
> không chặn, để BE quyết định.

**Trong:** `AiMealSuggestion` · **Gắn với:** `const { data: usage } = useMealPlanUsage();`

> Số lượt lấy từ `GET /ai/meal-plans/usage` (BE tính bằng đúng bộ kiểm tra hạn mức của lúc tạo nên khớp với 6003). `limit = 0` là gói không có lượt
> (mời nâng cấp), `remaining = 0` là đã dùng hết (khóa nút, báo ngày `resetsOn`). Chưa tải được usage thì dùng `mealPlansPerMonth` của gói
> và không khóa vì hết lượt, để BE quyết định. Tạo thực đơn xong thì làm mới `mealPlanKeys.usage`.

**Trong:** `AiMealSuggestion` · **Gắn với:** `const { profile, loading: profileLoading, error: profileError } = useProfile();`

> Hồ sơ thiếu ngày sinh / giới tính / mức vận động hoặc dưới 18 tuổi thì BE chắc chắn từ chối mục tiêu tự tính
> (6020 / 6021): báo ngay, không gọi API. Hồ sơ chưa tải xong hoặc tải lỗi thì chưa kết luận, để BE quyết định.

### features/meal-planner/components/ConfirmMealDialog.jsx

**Gắn với:** `export default function ConfirmMealDialog({ planId, meal, mealLabel, title, date, onClose }) {`

> Hỏi người dùng đã ăn bao nhiêu khẩu phần rồi ghi bữa vào nhật ký (PUT .../meals/:mealType).
> Mặc định là khẩu phần thực đơn đã xếp cho bữa này. `meal` là bữa của thực đơn, `title` là tên món đang hiện.
> Ghi rồi thì BE giữ bản đầu tiên, muốn đổi khẩu phần phải bỏ đánh dấu rồi ghi lại.

### features/meal-planner/components/EditMealDialog.jsx

**Gắn với:** `export default function EditMealDialog({ plan, day, meal, current, usedRecipeIds, onClose }) {`

> Hộp thoại tự chỉnh một bữa của thực đơn: chọn món khác từ danh sách gợi ý (công thức đã đăng, bỏ các món đang
> có trong ngày) và/hoặc đổi khẩu phần, bấm "Xem trước" để BE tính lại dinh dưỡng (chưa lưu), rồi "Lưu thay đổi".
> Chỉ sửa món / khẩu phần của 3 bữa sẵn có, không thêm hay xóa bữa.  
> 
> Cha chỉ dựng component này khi đang sửa (nên `open` luôn true) và truyền:  
> - plan: MealPlan đang xem; day: ngày đang chọn; meal: bữa trong plan (mealType, recipeId, servingMultiplier?).  
> - current: { title, image } của món hiện tại (cha đã tải chi tiết công thức).  
> - usedRecipeIds: id các món khác đang có trong cùng ngày, để không gợi ý trùng.  
> - onClose: đóng hộp thoại.

### features/meal-planner/components/FavoritePlansButton.jsx

**Gắn với:** `export default function FavoritePlansButton({ plans, onSelectPlan }) {`

> Nút "Yêu thích của tôi" + hộp thoại liệt kê các thực đơn đã yêu thích (GET /ai/meal-plans/favorites, phân trang).
> Mỗi mục bấm "Xem chi tiết" để mở 7 ngày của thực đơn (GET /ai/meal-plans/favorites/:id), hoặc "Mở trên trang" để
> chuyển trang thực đơn sang thực đơn đó. `plans` là danh sách thực đơn đã tải của trang; `onSelectPlan(id)` chọn một cái.

### features/meal-planner/components/GoalCombobox.jsx

**Gắn với:** `export default function GoalCombobox({ value, onChange, onBlur, inputRef, options, className, ...…`

> Ô nhập kèm danh sách chọn nhanh: gõ tự do, hoặc bấm mũi tên (hay phím ↓) để chọn một mục có sẵn.
> Dùng với react-hook-form qua \<Controller>: truyền `value`, `onChange(text)`, `onBlur`, `inputRef` (field.ref).
> `inputProps` được chuyển thẳng cho \<input> (id, maxLength, placeholder, aria-invalid...).

### features/meal-planner/components/HealthUpdateButton.jsx

**Gắn với:** `export default function HealthUpdateButton({ plan }) {`

> Nút "Cập nhật theo chỉ số mới" + hộp thoại xem trước của một thực đơn.
> Bấm nút: BE tính lại mục tiêu dinh dưỡng theo chỉ số sức khỏe mới nhất (và ngày sinh, giới tính, mức vận động trong
> hồ sơ, theo mục tiêu giảm / duy trì / tăng cân đã lưu của thực đơn) rồi co giãn lại khẩu phần, nhưng CHƯA lưu
> (update-from-health với confirm=false). Người dùng xem so sánh rồi bấm "Áp dụng" mới lưu (confirm=true);
> BE giữ bản cũ trong lịch sử phiên bản. `plan` là một MealPlan trong danh sách của useMealPlans.
> Hồ sơ thiếu thông tin thì BE báo 6020 (hiện liên kết sang hồ sơ); dưới 18 tuổi báo 6021 (gợi ý tự đặt mục tiêu riêng).  
> 
> Tùy chọn: tự đặt mục tiêu dinh dưỡng riêng (BE dùng thay hẳn mục tiêu tính từ chỉ số sức khỏe) và ghi chú thay đổi.
> Bản lưu phải dùng đúng mục tiêu của bản xem trước người dùng vừa thấy, nên đổi ô nhập thì phải xem trước lại
> mới được áp dụng (`previewTarget` là mục tiêu của lần xem trước gần nhất).

### features/meal-planner/components/MacroBalanceCard.jsx

**Gắn với:** `export default function MacroBalanceCard({ totals }) {`

> Tỉ lệ năng lượng tinh bột / đạm / béo của ngày đang xem.
> `totals`: nutritionTotals của ngày (calories, protein, carbohydrate, fat) hoặc null khi chưa có thực đơn.

### features/meal-planner/components/MealCard.jsx

**Gắn với:** `export default function MealCard({`

> Thẻ một bữa ăn.
> `meal`: { label, time, title, description, image, prepMinutes, kcal, protein, carb, fat, href?, servingMultiplier? }  
> - servingMultiplier: hệ số khẩu phần riêng của bữa này (BE chọn 0,75 - 2,0 để bữa chạm ngân sách calo; khác 1 thì hiện  
>  nhãn "Khẩu phần ×N"); kcal/macro đã nhân sẵn.  
> - href: có thì tên món dẫn tới trang công thức.  
> - onReplace: có thì hiện nút "Đổi món"; `replacing` đang đổi bữa này, `replaceDisabled` khóa nút  
>  (đang đổi bữa khác hoặc bữa này không đổi được).  
> - onEdit: có thì hiện nút "Tự chọn món / khẩu phần" (mở hộp thoại chỉnh tay), khóa cùng điều kiện với "Đổi món".  
> (Yêu thích là theo cả thực đơn, nút nằm ở TodayMeals chứ không ở từng thẻ món.)

### features/meal-planner/components/NutritionTargetCard.jsx

**Gắn với:** `export default function NutritionTargetCard({`

> Thẻ "Mục tiêu dinh dưỡng gợi ý" theo mục tiêu đã chọn (GET /ai/meal-plans/nutrition-target): nhu cầu cơ bản (BMR),
> tiêu hao mỗi ngày (TDEE), calo mục tiêu và khoảng đạm / tinh bột / béo. BE tự tính từ chỉ số sức khỏe + ngày sinh,
> giới tính, mức vận động nên không cần FE tính lại.  
> - `goalType`: mục tiêu đang chọn (rỗng thì thẻ nhắc chọn mục tiêu).  
> - `enabled`: false khi biết chắc chưa có chỉ số sức khỏe (form đã có cảnh báo riêng cho trường hợp đó).  
> - `profileIssue`: "incomplete" | "underage" | null, kết quả của profileTargetIssue; có thì không gọi API.  
> - `missingFields`: trường hồ sơ còn trống (missingProfileFields), gắn vào liên kết "Cập nhật hồ sơ" để trang hồ sơ  
>  làm nổi đúng các ô đó và cho người dùng quay lại thực đơn sau khi lưu.  
> - `overridden`: người dùng đang tự đặt mục tiêu riêng nên thẻ này chỉ để tham khảo.  
> - `onUseTarget(target)`: điền mục tiêu gợi ý vào các ô "tự đặt riêng" để chỉnh tiếp (nút chỉ hiện khi có hàm này).  
> - `onClearTarget()`: xóa mục tiêu riêng để quay lại mục tiêu tự tính (nút chỉ hiện khi đang `overridden`).  
> Form cha cũng gọi `useNutritionTarget` cùng khóa để biết khi nào BE chắc chắn từ chối; React Query dùng chung một
> lần gọi API cho cả hai nơi.

### features/meal-planner/components/NutritionTargetFields.jsx

**Gắn với:** `export default function NutritionTargetFields({ register, errors, replacesAuto = false, open, onO…`

> Mục tiêu dinh dưỡng MỖI NGÀY tự đặt (tùy chọn), nằm trong form react-hook-form của AiMealSuggestion.
> Điền thì BE dùng đúng khoảng này thay hẳn mục tiêu tự tính; chất bỏ trống thì không bị giới hạn.
> Nhập quá chặt thì BE vẫn lên thực đơn nhưng đánh dấu ngày calo không đạt (targetMet=false), TodayMeals sẽ cảnh báo.
> `replacesAuto`: form này có mục tiêu tự tính ở trên (thẻ NutritionTargetCard) nên nhắc rằng điền ở đây là thay nó.
> `open` / `onOpenChange`: tùy chọn, để form cha mở phần này (vd sau khi điền sẵn từ mục tiêu gợi ý); bỏ trống thì
> tự mở / đóng như thẻ \<details> bình thường.

### features/meal-planner/components/PlanDaysPreview.jsx

**Gắn với:** `export default function PlanDaysPreview({ plan }) {`

> Xem nhanh nội dung một thực đơn (hoặc một phiên bản cũ), chỉ đọc: mỗi ngày một dòng kèm năng lượng,
> bấm vào để xem 3 bữa. `plan` là phần `plan` của BE (có days[].meals và days[].nutritionTotals).

### features/meal-planner/components/PlanVersionsButton.jsx

**Gắn với:** `export default function PlanVersionsButton({ plan }) {`

> Nút "Lịch sử" + hộp thoại liệt kê các phiên bản cũ của một thực đơn; mỗi bản có "Xem nội dung" và "Khôi phục".
> Đầu hộp thoại là phiên bản hiện tại lấy mới từ server (GET /ai/meal-plans/:id); bấm "Xem nội dung" ở một phiên bản
> cũ để xem 7 ngày của bản đó (GET /ai/meal-plans/:id/versions/:version).
> BE chỉ lưu phiên bản khi thực đơn được cập nhật theo sức khỏe, sửa thủ công hoặc khôi phục; đổi món bằng AI thì không.
> "Khôi phục" hỏi xác nhận ngay trong dòng (`confirmVersion`), khôi phục tạo phiên bản mới = `version + 1` chứ không quay số phiên bản lại;
> sau khi xong cache danh sách và chi tiết thực đơn được ghi đè, lịch sử tải lại. Nhật ký ăn uống đã ghi không đổi.
> `plan` là một MealPlan trong danh sách của useMealPlans (có `version` hiện tại).

### features/meal-planner/components/StatsGrid.jsx

**Gắn với:** `export default function StatsGrid({ dayTotals, target, dayLong = "hôm nay" }) {`

> Bốn thẻ chỉ số đầu trang.  
> - BMI: thật, từ nutrition-service (bản ghi sức khỏe mới nhất).  
> - Calo: thật, tổng calo của ngày đang xem trong thực đơn.  
> - Nước & Vận động: vẫn là dữ liệu mẫu, BE chưa có API theo dõi.  
> `dayTotals`: nutritionTotals của ngày đang xem; `target`: dailyNutritionTarget của thực đơn.

### features/meal-planner/components/TodayMeals.jsx

**Gắn với:** `export default function TodayMeals({`

> Thực đơn theo ngày của thực đơn đang xem.  
> - plans / plan: các thực đơn đã lưu (mới nhất trước) và cái đang xem.  
> - days: các ngày của thực đơn đang xem, đã sắp T2 -> CN; activeDay: ngày đang chọn.  
> Thực đơn AI chỉ có 3 bữa sáng / trưa / tối (BE không có bữa phụ).

**Trong:** `TodayMeals` · **Gắn với:** `const activeDate = activeDay ? planDayDate(plan, activeDay.day) : null;`

> Ngày cụ thể của thứ đang chọn (theo tuần chứa ngày tạo thực đơn). "Hôm Nay" chỉ khi đúng là hôm nay,
> tránh gọi nhầm thứ Năm của một thực đơn tuần trước. Thiếu ngày thì so theo tên thứ như trước.

**Trong:** `TodayMeals` · **Gắn với:** `const requestReplace = (meal) => {`

> Đổi món làm BE tính lại khẩu phần của các bữa, nên khẩu phần đã chỉnh tay (UPDATE_SERVING) bị đặt lại. Thực đơn từ
> phiên bản 2 trở đi đã được sửa tay hoặc cập nhật theo chỉ số (đổi món bằng AI không tạo phiên bản), có thể đang
> mang khẩu phần chỉnh tay: hỏi trước. Thực đơn nguyên bản (phiên bản 1) không có gì để mất thì đổi luôn.

### features/meal-planner/data/mockMealPlanner.js

**Gắn với:** `import { Flame, Pencil, Soup, Sparkles } from "lucide-react";`

> Dữ liệu mẫu còn lại của trang Thực đơn — chỉ cho những khối mà BE CHƯA có API:
> thẻ Nước & Khoáng và thẻ Vận Động.
> Thực đơn, dinh dưỡng, BMI và biểu đồ macro đã lấy từ BE; khi BE bổ sung phần còn lại thì thay các hằng số này.

### features/meal-planner/hooks/useDayRecipes.js

**Gắn với:** `export function useDayRecipes(recipeIds) {`

> Chi tiết các công thức của những món trong một ngày (GET /recipes/:id), dùng chung cache với
> trang công thức. Meal của thực đơn chỉ có recipeId nên tên, ảnh, thời gian nấu phải lấy ở đây.
> Trả về Map\<recipeId, { recipe, isPending, isError }>.

### features/meal-planner/hooks/useDiary.js

**Gắn với:** `function useDiaryMutation(mutationFn) {`

> Mọi thao tác ghi đều kèm `date` trong biến, thành công thì tải lại nhật ký của ngày đó.
> Trả về promise của lần tải lại để nút còn trạng thái "đang xử lý" tới khi dữ liệu mới về.

### features/meal-planner/hooks/useMealPlanMutations.js

**Gắn với:** `export function useCreateMealPlan() {`

> Tạo thực đơn mới. mutate(payload) -> MealPlan.
> Thực đơn mới được đặt lên đầu danh sách cache (BE sắp mới nhất trước) nên không cần tải lại.

**Gắn với:** `export function useSetPlanFavorite() {`

> Yêu thích / bỏ yêu thích cả thực đơn. mutate({ planId, favorite }) với favorite = true | false.
> Thành công thì ghi cờ `isFavorite` thẳng vào danh sách đã cache, không cần tải lại.

**Gắn với:** `export function usePreviewHealthUpdate() {`

> Xem trước thực đơn sau khi cập nhật theo chỉ số sức khỏe (không lưu).
> mutate({ planId, customTarget? }) -> kết quả xem trước. customTarget là mục tiêu tự đặt (bỏ trống = BE tự tính).

**Gắn với:** `export function useApplyHealthUpdate() {`

> Lưu bản cập nhật theo chỉ số sức khỏe. mutate({ planId, customTarget?, changeSummary? }); phải dùng cùng customTarget
> với bản xem trước người dùng vừa thấy. Thành công thì thay thực đơn trong cache bằng bản mới.

### features/meal-planner/hooks/useMealPlans.js

**Gắn với:** `export function useNutritionTarget(goalType, enabled = true) {`

> Mục tiêu calo / macro BE tính cho một `goalType` (GET /ai/meal-plans/nutrition-target). Chỉ tải khi `enabled`
> và có goalType. Không thử lại khi lỗi (lỗi 6010 / 6020 / 6021 là do hồ sơ, thử lại cũng không khác) và luôn lấy
> mới khi mở lại vì người dùng có thể vừa cập nhật hồ sơ.

**Gắn với:** `export function useMealPlanVersions(planId, enabled) {`

> Các phiên bản cũ của một thực đơn (GET /ai/meal-plans/:id/versions). Chỉ tải khi `enabled`
> (hộp thoại lịch sử đang mở) và luôn lấy mới khi mở lại, vì có thể vừa có bản cũ mới được lưu.

**Gắn với:** `export function useMealPlan(planId, enabled) {`

> Một thực đơn lấy mới từ server (GET /ai/meal-plans/:id). Chỉ tải khi `enabled` và luôn lấy mới khi mở lại,
> dùng để đối chiếu phiên bản hiện tại với các bản cũ trong hộp thoại lịch sử.

**Gắn với:** `export function useFavoriteMealPlans(page, size, enabled) {`

> Một trang thực đơn yêu thích (GET /ai/meal-plans/favorites). Chỉ tải khi `enabled` (hộp thoại đang mở),
> luôn lấy mới khi mở lại vì người dùng có thể vừa bật / tắt yêu thích.

### features/meal-planner/pages/MealPlannerScreen.jsx

**Gắn với:** `export default function MealPlannerScreen() {`

> Trang thực đơn (/meal-planner): tạo thực đơn 7 ngày bằng AI (ai-service) và xem/đổi món theo ngày.
> Thẻ Nước & Vận Động vẫn là dữ liệu mẫu (BE chưa có), xem data/mockMealPlanner.js.
> Yêu thích là theo cả thực đơn (nút trong TodayMeals).

### features/meal-planner/schema.js

**Gắn với:** `export const MEAL_PLAN_LIMITS = {`

> Giới hạn khớp GenerateRequest của ai-service. `healthGoal` của BE tối đa 500 ký tự gồm cả nhãn mục tiêu
> ("Tăng cân: ") nên mô tả thêm của người dùng (`healthNote`) giữ ngắn hơn.

### features/meal-planner/utils/mealPlan.js

**Gắn với:** `export function macroPercentages(totals) {`

> Tỉ lệ năng lượng (%) của tinh bột / đạm / béo trong một ngày, tổng đúng 100.
> Quy đổi theo năng lượng: đạm 4 kcal/g, tinh bột 4 kcal/g, béo 9 kcal/g.
> Trả null khi chưa có dữ liệu (tổng bằng 0).

**Gắn với:** `export function dayTargetDeviations(day) {`

> Các chất mà ngày này lệch khỏi mục tiêu, lấy từ `day.targetDeviations`.
> BE không từ chối thực đơn mà chỉ đánh dấu: `targetMet: false` + `targetDeviations: { protein: { actual, min?, max? } }`.
> `targetMet` chỉ xét calo trong [minCalories, maxCalories] (không dung sai); `targetDeviations` liệt kê mọi chất nằm
> ngoài khoảng, kể cả khi `targetMet` là true. FE chỉ cảnh báo khi `targetMet` không phải true, nên đạm / tinh bột /
> béo lệch một mình (calo vẫn đạt) thì không bị coi là ngày lỡ mục tiêu.
> Trả mảng { key, label, unit, actual, range } theo thứ tự năng lượng, đạm, tinh bột, béo; rỗng khi ngày đạt
> mục tiêu calo, không đặt mục tiêu hoặc thực đơn cũ chưa có hai trường này.

**Gắn với:** `export function dayMacroNotes(day) {`

> Ngược lại với dayTargetDeviations: các chất (đạm, tinh bột, béo) lệch khỏi khoảng mục tiêu trong khi calo của ngày
> vẫn đạt (`targetMet === true`). Chỉ là lưu ý nhẹ, không tính là ngày lỡ mục tiêu. Cùng dạng mảng với
> dayTargetDeviations; rỗng khi ngày không đạt calo (khi đó mọi chất lệch đã nằm trong cảnh báo chính) hoặc không lệch gì.

**Gắn với:** `export function buildMealEdits({ day, mealType, currentRecipeId, currentMultiplier = 1, recipeId,…`

> Dựng `edits` gửi BE cho một bữa: đổi món thì REPLACE (kèm khẩu phần chọn, vì BE mặc định giữ khẩu phần cũ),
> chỉ đổi khẩu phần thì UPDATE_SERVING. Không đổi gì thì trả mảng rỗng.

**Gắn với:** `export function targetRangeLines(target) {`

> Các mốc mục tiêu (dailyNutritionTarget) thành dòng chữ cho từng chất, bỏ chất không đặt mốc nào.
> Trả mảng { key, label, unit, range }, ví dụ { label: "Đạm", range: "≥ 80 g" }.

**Gắn với:** `export function averageDailyTotals(planBody) {`

> Năng lượng / đạm / tinh bột / béo trung bình mỗi ngày của phần `plan` (có days[].nutritionTotals),
> làm tròn số nguyên. Trả null khi chưa có ngày nào có nutritionTotals.

**Gắn với:** `export function parseTargetNumber(text) {`

> Chuỗi người dùng nhập -> số. Hiểu cả kiểu có dấu phân cách hàng nghìn ("1,500" / "1.500" -> 1500) lẫn dấu phẩy
> thập phân kiểu Việt ("1500,5" / "1500.5" -> 1500,5). Chuỗi rỗng hoặc không phải số -> NaN.

**Gắn với:** `export function buildNutritionTarget(values) {`

> Dựng dailyNutritionTarget từ các ô nhập (chuỗi). Ô trống bị bỏ qua; không có ô nào thì
> trả undefined để KHÔNG gửi mục tiêu riêng (BE tự tính theo hồ sơ khi tạo thực đơn).

**Gắn với:** `export function buildHealthUpdateBody({ confirm, customTarget, changeSummary }) {`

> Body cho POST /ai/meal-plans/:id/update-from-health. `customTarget` (mục tiêu tự đặt, thay hẳn mục tiêu BE
> tính từ chỉ số sức khỏe) và `changeSummary` (ghi chú lưu vào lịch sử phiên bản) chỉ được gửi khi có.

**Gắn với:** `export function planGoalNote(plan) {`

> Mô tả thêm nằm trong `goal` của một thực đơn: "Giảm cân: ăn thanh đạm" -> "ăn thanh đạm". Thực đơn cũ chưa có
> goalType (hoặc `goal` không theo dạng trên) thì trả nguyên `goal`; rỗng khi không có mô tả thêm.

**Gắn với:** `export function missingProfileFields(profile) {`

> Các trường hồ sơ BE cần để tự tính calo mà đang trống, theo tên field của `GET /users/me`
> ("dateOfBirth" | "gender" | "activityLevel"). Chưa có hồ sơ thì trả mảng rỗng (chưa kết luận được).

**Gắn với:** `export function profileFixState(missingFields = []) {`

> `state` của liên kết sang `/profile/edit` khi hồ sơ thiếu thông tin cho thực đơn: trang hồ sơ dùng nó để mở sẵn và
> làm nổi các ô còn thiếu, rồi cho người dùng quay lại thực đơn sau khi lưu (xem profile/utils/profileFixState.js).

**Gắn với:** `export function profileTargetIssue(profile, today = new Date()) {`

> Hồ sơ có đủ điều kiện để BE tự tính mục tiêu calo không (cùng điều kiện với lỗi 6020 / 6021 của BE):
> "incomplete" khi thiếu ngày sinh / giới tính / mức vận động, "underage" khi dưới 18 tuổi, null khi ổn
> (hoặc chưa có hồ sơ để kiểm tra: khi đó để BE quyết định). `profile.dateOfBirth` dạng "YYYY-MM-DD".

**Gắn với:** `export function buildHealthGoalText(goalType, note) {`

> `healthGoal` gửi BE (bắt buộc không rỗng): nhãn của mục tiêu, kèm mô tả thêm của người dùng nếu có,
> ví dụ "Giảm cân: ăn thanh đạm".

**Gắn với:** `export function buildGeneratePayload({ name, goalType, healthNote, preferences, ingredients, targ…`

> Payload cho POST /ai/meal-plans từ giá trị form + nguyên liệu/khẩu vị đã chọn.
> `healthNote` là mô tả thêm (tùy chọn). Không có ô mục tiêu nào được điền thì không gửi dailyNutritionTarget,
> BE sẽ tự tính theo hồ sơ + goalType.

**Gắn với:** `export function defaultPlanName(date = new Date()) {`

> Tên gợi ý cho thực đơn mới: cả tuần T2 -> CN chứa ngày tạo, ví dụ tạo ngày 17/10 -> "Thực đơn 12/10 - 18/10".
> BE chỉ lưu thứ (MONDAY..SUNDAY) chứ không lưu ngày cụ thể, nên lấy tuần lịch là khớp nhất với dữ liệu.

**Gắn với:** `export function planDayDate(plan, dayKey) {`

> Ngày cụ thể của một thứ trong thực đơn, tính theo tuần chứa ngày tạo (`plan.createdAt`).
> Trả null khi thiếu createdAt / thứ lạ.

## features/my-content

### features/my-content/components/MyBlogList.jsx

**Gắn với:** `export default function MyBlogList() {`

> Tab "Bài viết": lọc theo trạng thái (GET /blogs/me?status=) + danh sách "Xem thêm",
> mỗi dòng có Sửa / Gửi duyệt / Xóa tùy trạng thái.

### features/my-content/components/MyVideoJobList.jsx

**Gắn với:** `export default function MyVideoJobList() {`

> Tab "Bóc tách": lịch sử bóc tách công thức từ video (GET /ai/videos), mới nhất trước, "Xem thêm".
> Job đang xử lý tự cập nhật; BE không có sửa / xóa job nên mỗi dòng chỉ có "Xem kết quả".

### features/my-content/components/MyVideoList.jsx

**Gắn với:** `export default function MyVideoList() {`

> Tab "Video": lọc theo trạng thái (GET /videos/me?status=) + danh sách "Xem thêm",
> mỗi dòng có Sửa / Gửi duyệt / Xóa tùy trạng thái.

### features/my-content/pages/MyContentScreen.jsx

**Gắn với:** `export default function MyContentScreen() {`

> Trang "Nội dung của tôi" (route /my-content, cần đăng nhập): bài viết (GET /blogs/me),
> công thức (GET /recipes/me) và video (GET /videos/me) của chính mình ở mọi trạng thái,
> kèm nút tạo mới / sửa / gửi duyệt / xóa. Tab "Bóc tách" là lịch sử AI bóc tách công thức từ video
> (GET /ai/videos), nút góc phải mở hộp thoại tải video lên thay vì chuyển trang.
> Tab nằm trên URL (?tab=videos) để form quay về đúng tab.

### features/my-content/utils/statusInfo.js

**Gắn với:** `const BLOG_STATUS = {`

> Nhãn + màu + gợi ý cho trạng thái của bài viết (blog-service), công thức (recipe-service),
> video (blog-service) và job bóc tách video (ai-service).
> tone ánh xạ sang class ở StatusBadge: success | warning | danger | muted.

**Gắn với:** `export const canEditBlog = (status) => status !== "BANNED";`

> Sửa bài: BE cho sửa bài ở mọi trạng thái trừ BANNED (bài bị gỡ là cuối cùng, sửa sẽ bị từ chối).
> Chủ bài đọc lại được bài chưa đăng qua GET /blogs/:id (kèm token) nên form sửa nạp được cả
> bản nháp, chờ duyệt, bị từ chối.

## features/payment

### features/payment/api/paymentApi.js

**Gắn với:** `export async function getPlans() {`

> GET /payments/plans (Công khai)
> Danh sách các gói thành viên hiện có:
> [{ id, code, price, durationDays, chatPerDay, mealPlansPerMonth, videosPerMonth }]

**Gắn với:** `export async function checkout(planCode) {`

> POST /payments/checkout (Yêu cầu đăng nhập)
> Body: { planCode: "PLUS" | "PRO" }
> Trả về: { id, orderCode, planCode, amount, status, checkoutUrl, createdAt, paidAt }

**Gắn với:** `export async function getOrder(id) {`

> GET /payments/orders/{id} (Yêu cầu đăng nhập)
> Lấy chi tiết đơn hàng theo internal ID (không phải orderCode payOS)

**Gắn với:** `export async function cancelOrder(id) {`

> POST /payments/orders/{id}/cancel (Yêu cầu đăng nhập)
> Huỷ đơn PENDING, trả về đơn với status "CANCELLED".

**Gắn với:** `export async function getHistory() {`

> GET /payments/history (Yêu cầu đăng nhập)
> Lịch sử thanh toán của người dùng, mới nhất trước

**Gắn với:** `export async function getMySubscription() {`

> GET /subscriptions/me (Yêu cầu đăng nhập)
> Gói thành viên hiện tại:
> { planCode, startedAt, expiresAt, chatPerDay, mealPlansPerMonth, videosPerMonth }

### features/payment/hooks/useCancelOrder.js

**Gắn với:** `export function useCancelOrder() {`

> Mutation huỷ đơn PENDING. Sau khi huỷ, làm mới đơn và lịch sử thanh toán.

### features/payment/hooks/useCheckout.js

**Gắn với:** `export function useCheckout() {`

> Mutation tạo đơn thanh toán payOS cho gói PLUS hoặc PRO.

### features/payment/hooks/useMySubscription.js

**Gắn với:** `export function useMySubscription() {`

> Lấy gói thành viên hiện tại của người dùng (chỉ gọi khi đã đăng nhập).

### features/payment/hooks/useOrder.js

**Gắn với:** `export function useOrder(id, { poll = false, intervalMs = 2500 } = {}) {`

> Lấy chi tiết đơn hàng nội bộ theo id, hỗ trợ polling kiểm tra trạng thái webhook payOS.

### features/payment/hooks/usePaymentHistory.js

**Gắn với:** `export function usePaymentHistory() {`

> Lấy lịch sử giao dịch thanh toán của người dùng (chỉ gọi khi đã đăng nhập).

### features/payment/hooks/usePlans.js

**Gắn với:** `export function usePlans() {`

> Lấy danh sách các gói thành viên công khai từ BE.

### features/payment/queryKeys.js

**Gắn với:** `export const paymentKeys = {`

> React Query keys dành riêng cho tính năng payment & subscriptions.

### features/payment/utils/paymentFormat.js

**Gắn với:** `export function formatVnd(amount) {`

> Định dạng số tiền VNĐ (vd: 29.000đ).

**Gắn với:** `export function formatDateTime(isoString) {`

> Định dạng ngày giờ chuẩn Việt Nam (vd: 14:30 21/10/2026).

**Gắn với:** `export function formatDate(isoString) {`

> Định dạng ngày (vd: 21/10/2026).

**Gắn với:** `export function getPaymentStatusInfo(status) {`

> Thông tin trạng thái đơn hàng:
> Nhãn tiếng Việt và màu sắc dịu nhẹ (đặc biệt PENDING là "Chưa thanh toán" không quá gay gắt).

**Gắn với:** `export function isOrderResumable(order) {`

> Đơn PENDING còn hạn (chưa quá expiredAt) -> có thể tiếp tục thanh toán.

**Gắn với:** `const BANK_NAMES = {`

> Tra tên ngân hàng từ mã BIN (các ngân hàng VietQR phổ biến).

**Gắn với:** `export const PLAN_DETAILS = {`

> Tên và badge hiển thị của các gói.

## features/profile

### features/profile/api/profileApi.js

**Gắn với:** `const INVALID_DATA = "Dữ liệu chưa hợp lệ, vui lòng kiểm tra lại";`

> Profile + nutrition APIs (identity-service + nutrition-service qua api-gateway).
> Base: VITE_VEGGIEPAL_API_BASE_URL = http://localhost:8080/api  
> 
> Identity:
>  GET    /users/me
>  PATCH  /users/me
>  PUT    /users/me/password
>  POST   /users/me/avatar  (multipart)  
> 
> Nutrition:
>  GET    /nutrition/allergens
>  GET    /nutrition/me/allergies
>  PUT    /nutrition/me/allergies
>  GET    /nutrition/me/health-records
>  GET    /nutrition/me/health-records/latest
>  POST   /nutrition/me/health-records
>  PUT    /nutrition/me/health-records/:id

**Gắn với:** `export async function updateProfile(payload) {`

> PATCH /users/me
> Body: { fullName?, phone?, dateOfBirth?, gender?, activityLevel? }  
> - null / bỏ field: giữ nguyên  
> - phone: "" để xóa số điện thoại  
> - gender: "MALE" | "FEMALE" | "OTHER"; activityLevel: "SEDENTARY" | "LIGHT" | "MODERATE" | "ACTIVE" | "VERY_ACTIVE".  
>  Giá trị lạ (kể cả "") bị BE từ chối (400 / 1018) và không có cách xóa về trống, nên chỉ gửi khi đã chọn.
>  Hai trường này cùng ngày sinh là dữ liệu BE dùng để tính nhu cầu calo của thực đơn.
> GET /users/me trả thêm gender, activityLevel (null khi chưa nhập).

### features/profile/components/CalorieProfileFields.jsx

**Gắn với:** `export default function CalorieProfileFields({`

> Ba trường hồ sơ BE dùng để tính nhu cầu calo của thực đơn: ngày sinh, giới tính, mức độ vận động.
> Nằm trong form chỉ số sức khỏe (EditHealthForm) cùng chiều cao, cân nặng vì BE dùng chung cả năm giá trị để tính
> nhu cầu calo; form cần có field `birthDate` / `gender` / `activityLevel`.  
> - form: đối tượng của useForm (register, control, formState.errors).  
> - idPrefix: tiền tố id của các ô (id = `${idPrefix}-birthDate`...).  
> - highlightFields: trường (tên field của GET /users/me: "dateOfBirth" | "gender" | "activityLevel") cần làm nổi vì  
>  BE báo thiếu; mỗi trường chỉ nổi khi còn trống và hết nổi ngay khi người dùng điền.  
> - inputClass / labelClass / className: giữ kiểu của form chứa nó.

### features/profile/components/EditHealthCard.jsx

**Gắn với:** `export default function EditHealthCard({ highlightFields, returnTo, returnLabel }) {`

> Box "Chỉ số sức khỏe": tải dữ liệu rồi ghép summary + form + lịch sử.
> `highlightFields` / `returnTo` / `returnLabel` chuyển thẳng cho EditHealthForm (trường hồ sơ cần bổ sung và nơi quay lại
> khi người dùng được chuyển từ trang thực đơn sang). Có `highlightFields` thì cả box cuộn tới giữa màn hình khi vào trang.
> Nút "Ghi nhận" của form hiện ở đầu box, cạnh nhãn "Cá nhân hóa" (qua `submitSlot`).

**Trong:** `EditHealthCard` · **Gắn với:** `const [submitSlot, setSubmitSlot] = useState(null);`

> Chỗ ở đầu thẻ (cạnh nhãn "Cá nhân hóa") để EditHealthForm đặt nút "Ghi nhận" vào; dùng state để form nhận được
> phần tử ngay khi nó được gắn vào DOM.

### features/profile/components/EditHealthForm.jsx

**Gắn với:** `const fieldInputClass = '${healthInputClass} h-10';`

> Mọi ô của form (chiều cao, cân nặng, ngày sinh, giới tính, mức vận động) cùng cao h-10 cho đồng nhất; ô chọn dùng
> variant "compact" của SelectField có cùng chiều cao.

**Gắn với:** `export default function EditHealthForm({`

> Form ghi nhận chiều cao / cân nặng mới (POST /nutrition/me/health-records), kèm ngày sinh, giới tính và mức vận động.
> Ba trường sau không thuộc bản ghi sức khỏe: BE đọc chúng từ hồ sơ (PATCH /users/me) để tính nhu cầu calo, nên
> form lưu chúng vào hồ sơ khi người dùng đổi, cùng nguồn với thẻ "Thông tin cá nhân".  
> - Chỉ đổi ngày sinh / giới tính / mức vận động mà chiều cao, cân nặng giữ nguyên thì chỉ cập nhật hồ sơ, không tạo  
>  thêm bản ghi trùng trong lịch sử. Không đổi gì cả thì vẫn ghi nhận một bản ghi mới như trước.  
> - highlightFields: trường hồ sơ BE báo thiếu (xem profileFixState); returnTo / returnLabel: nơi người dùng đến từ  
>  đó, hiện liên kết quay lại sau khi lưu xong.  
> - submitSlot: phần tử DOM (ở đầu thẻ) để đặt nút "Ghi nhận"; nút vẫn thuộc form này (gắn bằng thuộc tính `form`)  
>  nên trạng thái "Đang ghi…" vẫn đúng. Không truyền thì nút nằm ngay cuối form.

### features/profile/components/ProfileBanner.jsx

**Gắn với:** `export default function ProfileBanner({ profile }) {`

> Thẻ đầu trang cá nhân (ảnh bìa, ảnh đại diện, danh hiệu, gói tài khoản, nút sửa hồ sơ và 5 chỉ số).
> - Số người theo dõi và đang theo dõi lấy từ API thật `GET /users/{id}/follow-stats` qua `useFollowStats`, bấm vào ô mở `FollowListDialog` để xem danh sách và theo dõi / bỏ theo dõi.
> - Ô thứ tư là "Công thức đã lưu": tổng số từ `GET /recipes/favorites` (`useFavoriteRecipes({ size: 1 })`, chỉ cần `totalElements`). BE chưa có số lượt lưu mà công thức của tôi nhận được nên không hiện chỉ số đó.

### features/profile/components/FavoritesCard.jsx

**Gắn với:** `export default function FavoritesCard() {`

> Thẻ "Công Thức Đã Lưu" ở cột trái trang cá nhân: lưới công thức tôi đã lưu (`GET /recipes/favorites`, lưu gần nhất trước), bấm mở công thức.
> Mặc định 6 mục; "Xem tất cả" nâng lên 30 mục mới lưu gần nhất (chưa có trang riêng). BE chỉ trả công thức đang đăng nên công thức đã bị ẩn tự biến mất.
> - Thẻ BMI lấy từ bản ghi sức khỏe mới nhất, bài viết & video lấy từ tổng thực tế blog và recipe của người dùng.

### features/profile/hooks/useAllergyDraft.js

**Gắn với:** `export function useAllergyDraft() {`

> Lựa chọn dị ứng đang chỉnh. draft = null nghĩa là user chưa chỉnh gì
> -> hiển thị đúng dữ liệu server. Là hook riêng vì nút lưu cuối trang cũng cần dùng.

### features/profile/hooks/useEditProfileActions.js

**Gắn với:** `export function useEditProfileActions({ personal, allergy, returnTo = "/profile" }) {`

> Nút "Lưu thông tin" / "Hủy thay đổi" cuối trang.
> Quyết định: chỉ lưu phần đã thay đổi (thông tin cá nhân + dị ứng). Mật khẩu và chỉ số
> sức khỏe có nút riêng vì là thao tác tức thời (đổi mật khẩu / ghi nhận bản ghi mới).
> `returnTo`: nơi quay lại sau khi lưu / hủy (mặc định trang cá nhân); trang thực đơn đặt nó khi chuyển người dùng sang
> bổ sung hồ sơ để họ làm xong là về thẳng thực đơn.

### features/profile/hooks/useHealthRecords.js

**Gắn với:** `export function useCreateHealthRecord() {`

> Ghi nhận chỉ số mới. Xong thì làm mới cả "latest" lẫn "history"
> (cùng tiền tố khóa); trả Promise nên mutation chờ refetch xong mới kết thúc.

**Gắn với:** `export function useUpdateHealthRecord() {`

> Sửa một bản ghi chỉ số cũ (PUT /nutrition/me/health-records/:id). Xong thì làm mới cả "latest" lẫn
> "history" (kèm biểu đồ BMI) bằng cùng tiền tố khóa, giống useCreateHealthRecord.
> mutate({ id, heightCm, weightKg })

### features/profile/hooks/usePersonalInfoForm.js

**Gắn với:** `const personalSchema = updateProfileSchema.pick({ fullName: true, phone: true });`

> Thẻ này chỉ sửa họ tên và số điện thoại. Ngày sinh, giới tính, mức vận động nằm ở form chỉ số sức khỏe
> (EditHealthForm) cùng chỗ với chiều cao, cân nặng vì BE dùng chúng chung để tính nhu cầu calo.

**Gắn với:** `export function usePersonalInfoForm() {`

> Form thông tin cá nhân. Tách thành hook vì cả card lẫn nút "Lưu thông tin"
> cuối trang đều cần dùng chung form + hàm lưu.

**Trong:** `usePersonalInfoForm` · **Gắn với:** `const save = async (values) => {`

> Gửi lên API: phone "" nghĩa là xóa số điện thoại. Không gửi các trường khác nên BE giữ nguyên ngày sinh,
> giới tính, mức vận động.

### features/profile/hooks/useProfile.js

**Gắn với:** `function syncAuthUser(p) {`

> Giữ token, cập nhật user trong store (fullName / avatar hiển thị ở header).
> Đọc store trực tiếp qua getState() nên không phụ thuộc closure/hook.

**Gắn với:** `export function useProfile({ enabled = true, staleTime } = {}) {`

> Hồ sơ hiện tại (GET /users/me), đồng bộ user vào authStore.
> Fallback nhẹ từ authStore nếu API lỗi.

**Gắn với:** `function useApplyProfile() {`

> Hồ sơ mới từ server -> ghi vào cache (mọi nơi đang đọc useProfile tự cập nhật)
> và đồng bộ tên/avatar vào authStore để header đổi theo.

### features/profile/hooks/useProfileStats.js

**Gắn với:** `export function useProfileStats() {`

> Số liệu thật cho trang hồ sơ: tổng bài viết (GET /blogs/me), tổng công thức
> (GET /recipes/me) và chỉ số sức khỏe mới nhất. size=1 vì chỉ cần `totalElements`.

### features/profile/pages/EditProfileScreen.jsx

**Trong:** `EditProfileScreen` · **Gắn với:** `const { state } = useLocation();`

> Được chuyển từ trang thực đơn sang vì hồ sơ thiếu thông tin tính calo: thẻ chỉ số sức khỏe (nơi nhập ngày sinh,
> giới tính, mức vận động) cuộn tới và làm nổi các ô còn thiếu, và lưu / hủy xong thì quay lại nơi đã chuyển đi
> (xem readProfileFixState).

### features/profile/queryKeys.js

**Gắn với:** `export const profileKeys = {`

> Khóa cache React Query của feature profile + nutrition (dữ liệu của user hiện tại).
> Khóa dạng mảng phân cấp: invalidateQueries({ queryKey: profileKeys.healthRecords })
> sẽ làm mới cả "latest" lẫn "history" vì cùng tiền tố.

### features/profile/utils/bmiChartHelpers.js

**Gắn với:** `const DEFAULT_WIDTH = 500;`

> Tiện ích tính toán toạ độ SVG và chỉ số xu hướng cho BmiTrackerCard.
> Tách hàm thuần để dễ dàng kiểm thử bằng node:test.

**Gắn với:** `export function formatAxisDate(iso) {`

> Format nhãn ngày hiển thị dưới trục hoành của biểu đồ (VD: "12/05" hoặc "Tháng 05").

**Gắn với:** `export function calcChartPoints(records, metric = "bmi", width = DEFAULT_WIDTH, height = DEFAULT_…`

> Tính toạ độ SVG (line & area path) từ danh sách bản ghi đã sắp xếp theo thời gian (cũ -> mới).
> Yêu cầu tối thiểu 2 điểm. Nếu ít hơn 2 điểm, trả về null.

**Gắn với:** `export function calcTrendAnalysis(records, metric = "bmi") {`

> Tính độ lệch, số ngày và câu nhận xét xu hướng giữa bản ghi đầu và bản ghi mới nhất.

### features/profile/utils/editProfileConstants.js

**Gắn với:** `export const ALLERGY_CATEGORY_META = {`

> Hằng số dùng chung cho các component của trang chỉnh sửa hồ sơ.
> Gom vào một chỗ để component không phải chứa chuỗi/class lặp lại.

**Gắn với:** `export const GENDER_OPTIONS = [`

> Giới tính và mức độ vận động (enum Gender / ActivityLevel của identity-service). BE dùng hai trường này cùng ngày
> sinh để tính nhu cầu calo khi lên thực đơn.

### features/profile/utils/feedHelpers.js

**Gắn với:** `export function getStatusBadgeText(status) {`

> Tiện ích chuẩn hoá và gộp danh sách bài viết + công thức cho RecipeFeedCard.

**Gắn với:** `export function mergeAndSortContent(blogs = [], recipes = []) {`

> Gộp bài viết và công thức của người dùng thành 1 danh sách đồng nhất,
> sắp xếp theo ngày tạo/ngày đăng mới nhất trước.

### features/profile/utils/profileFixState.js

**Gắn với:** `export const HIGHLIGHTABLE_PROFILE_FIELDS = ["dateOfBirth", "gender", "activityLevel"];`

> Đọc `state` mà nơi khác (vd trang thực đơn) gắn vào liên kết sang `/profile/edit` khi cần người dùng bổ sung hồ sơ.
> Chỉ nhận giá trị hợp lệ vì `location.state` có thể bị sửa tay trong lịch sử trình duyệt.

**Gắn với:** `export function readProfileFixState(state) {`

> { missingFields: string[], returnTo: string | null, returnLabel: string }  
> - missingFields: trường hồ sơ cần bổ sung (đã lọc theo HIGHLIGHTABLE_PROFILE_FIELDS).  
> - returnTo: đường dẫn nội bộ để quay lại sau khi lưu; null nếu không có hoặc không phải đường dẫn nội bộ.

## features/recipe

### features/recipe/api/recipeApi.js

**Gắn với:** `const EMPTY_PAGE = {`

> Recipe APIs (recipe-service qua api-gateway) — GET công khai, không cần token.
>  GET /recipes?keyword=&sort=&page=&size=   (sort=popular: được lưu nhiều nhất trước, còn lại mới nhất trước)
>  GET /recipes/:id   (công thức đã đăng ai cũng đọc được; bản nháp / đang ẩn (DRAFT, HIDDEN) chỉ chủ công thức  
>    và ADMIN đọc được khi kèm token hợp lệ, người khác nhận 404 (4100) -> dùng để nạp form sửa.  
>    Token hỏng / hết hạn bị bỏ qua, không làm 401. Công thức ARCHIVED (đã xóa) vẫn đọc được để thực đơn  
>    cũ còn hiện món.)
> Cần đăng nhập:
>  POST   /recipes             tạo (luôn là DRAFT)
>  PUT    /recipes/:id         sửa (chủ công thức hoặc ADMIN), không đổi trạng thái
>  POST   /recipes/:id/publish đăng (DRAFT -> PUBLISHED, không kiểm duyệt)
>  DELETE /recipes/:id         xóa mềm (chuyển ARCHIVED)
>  GET    /recipes/me          (không gồm công thức đã xóa)
> Công thức ARCHIVED / HIDDEN không sửa, đăng, xóa được (lỗi 4108).
> Recipe: { id, userId, title, description, imageUrl, servings, prepTime, cookTime,
>  status, ingredients: [{ ingredientId, ingredientName, quantity, unit, note }],
>  steps: [{ stepNumber, instruction }], createdAt, updatedAt, publishedAt }
> status: "DRAFT" | "PUBLISHED" | "HIDDEN" | "ARCHIVED"
> Page: { content, page, size, totalElements, totalPages, first, last }
> userId là id tác giả -> lấy tên qua usePublicUsers (GET /users/batch).

**Gắn với:** `export async function getMyRecipes({ page = 0, size = 10 } = {}) {`

> GET /recipes/me — công thức của tôi ở mọi trạng thái (DRAFT/PUBLISHED/HIDDEN). Cần đăng nhập.
> Page cùng dạng với getRecipes: { content, page, size, totalElements, totalPages, ... }

**Gắn với:** `export async function createRecipe(payload) {`

> ---- Tạo / sửa / đăng / xóa công thức --------------------------------------------------------
> RecipeRequest: { title, description?, imageUrl?, servings, prepTime?, cookTime?,  
>   ingredients: [{ ingredientId, quantity, unit, note? }], steps: [{ stepNumber, instruction }] }
> Giới hạn cột ở BE (BE không tự kiểm tra, vượt sẽ lỗi 500): title 200, description 2000,
> imageUrl 500 (chỉ là chuỗi URL, recipe-service chưa có API tải ảnh lên), unit 30, note 300,
> instruction 2000, quantity tối đa 2 chữ số thập phân. BE tự IN HOA unit.

**Gắn với:** `export async function uploadRecipeImage(id, file) {`

> POST /recipes/:id/image (multipart, field `file`): JPEG hoặc PNG ≤ 5MB, chủ công thức hoặc ADMIN. BE kiểm tra cả
> chữ ký tệp, tải lên Cloudinary, ghi `imageUrl` và xóa ảnh Cloudinary cũ (link dán tay thì để nguyên). Lỗi 4116 / 4117 / 4118 / 1017.

**Gắn với:** `export async function getFavoriteRecipeIds() {`

> Yêu thích công thức (cần đăng nhập, mọi API trả lỗi 401 với khách):
>  GET /recipes/favorites/ids  id các công thức tôi đã lưu, để tô trái tim ở danh sách công khai
>  GET /recipes/favorites?page&size  công thức đã lưu, lưu gần nhất trước, chỉ gồm công thức đang PUBLISHED
>  POST|DELETE /recipes/:id/favorite  lưu / bỏ lưu, gọi lặp không lỗi, trả { recipeId, favorited, favoriteCount }
> BE chỉ cho lưu công thức đã đăng (404 / 4100 với bản nháp), nhưng bỏ lưu được cả công thức đã bị ẩn.

### features/recipe/components/IngredientPicker.jsx

**Gắn với:** `export default function IngredientPicker({ selectedIds, onPick }) {`

> Ô tìm và thêm nguyên liệu (GET /ingredients?keyword=). Bấm một kết quả để thêm vào công thức.  
> - selectedIds: id đã thêm, bị ẩn khỏi kết quả vì BE không cho trùng nguyên liệu trong 1 công thức  
> - onPick(ingredient): nhận Ingredient đầy đủ (id, name, caloriesPer100g...)  
> Mỗi kết quả kèm `description` của nguyên liệu (nếu có) vì BE ghi ở đó nguyên liệu đang ở trạng thái nào
> (vd "Gạo thơm" là gạo sống 365 kcal/100g, "Cơm trắng" là cơm đã nấu 130 kcal/100g).

### features/recipe/components/RecipeCard.jsx

**Gắn với:** `export default function RecipeCard({ recipe, nutrition, author }) {`

> Thẻ công thức dùng chung (trang chủ, trang danh sách công thức).
> `nutrition` là { kcal, protein, ... } hoặc null/undefined (chưa tính được); `author` là { fullName, avatarUrl } hoặc undefined.
> Nút lưu ở góc ảnh là `RecipeFavoriteButton`; số lượt lưu (`favoriteCount`) hiện cạnh dòng dinh dưỡng khi lớn hơn 0.

### features/recipe/components/RecipeFavoriteButton.jsx

**Gắn với:** `export default function RecipeFavoriteButton({ recipe, variant = "overlay" }) {`

> Nút lưu / bỏ lưu công thức. `overlay`: nút tròn đè lên ảnh thẻ; `full`: nút có chữ và số lượt lưu ở trang chi tiết.
> Trạng thái đã lưu lấy từ một lần gọi `GET /recipes/favorites/ids` cho cả danh sách (không gọi từng công thức); chưa tải xong
> thì khóa nút để khỏi POST nhầm lên công thức đã lưu; khách bấm thì dẫn tới đăng nhập. Ẩn với công thức chưa PUBLISHED vì BE từ chối.

### features/recipe/components/RecipeForm.jsx

**Gắn với:** `export default function RecipeForm({ recipe }) {`

> Form tạo / sửa công thức.  
> - Tạo mới (không có `recipe`): "Lưu nháp" hoặc "Lưu và đăng".  
> - Sửa (`recipe` là RecipeResponse): "Lưu thay đổi" (không đổi trạng thái);  
>  công thức chưa đăng có thêm "Lưu và đăng".  
> - Ảnh: chọn tệp (`ThumbnailPicker`) hoặc dán link. Tệp chỉ được tải lên sau khi công thức đã lưu (BE cần id), ngay trước bước đăng,  
>  và ghi đè link. Tải ảnh lỗi thì công thức vẫn được lưu; nếu đang bấm "Lưu và đăng" thì dừng ở bản nháp để sửa lại, giống form bài viết.

### features/recipe/components/RecipeStepsEditor.jsx

**Gắn với:** `export default function RecipeStepsEditor({ control, register, errors }) {`

> Danh sách các bước của công thức: thêm, xóa, đổi thứ tự.  
> - Kéo thả bằng số thứ tự bên trái (HTML5 drag & drop; chỉ phần này kéo được để vẫn bôi đen  
>  chữ trong ô nhập bình thường).  
> - Nút lên/xuống là cách đổi thứ tự dự phòng cho bàn phím và điện thoại, vì kéo thả HTML5  
>  không chạy trên màn hình cảm ứng.
> Số thứ tự hiển thị theo vị trí; khi gửi lên BE, stepNumber cũng lấy theo vị trí
> (xem formValuesToPayload). `control`, `register`, `errors` lấy từ useForm của RecipeForm.

### features/recipe/hooks/useMyRecipes.js

**Gắn với:** `export function useMyRecipes({ size = 10 } = {}) {`

> Công thức của tôi ở mọi trạng thái (GET /recipes/me) dạng "Xem thêm".
> Trả về query của React Query + `recipes` (mảng phẳng) + `total`.
> recipe-service trả danh sách ở field `content` (khác blog-service dùng `items`).

### features/recipe/hooks/useRecipeFavorites.js

**Gắn với:** `export function useSetRecipeFavorite() {`

> mutate({ recipeId, favorite }): `favorite = true` gọi POST, `false` gọi DELETE (BE không có toggle).
> BE trả luôn `favoriteCount` mới nên ghi thẳng vào mọi danh sách / chi tiết đang có trong cache gốc `recipes` (`patchFavoriteCount`),
> cập nhật tập id đã lưu và đánh dấu cũ các trang "công thức đã lưu". Khóa cache của phần này nằm ngoài gốc `recipes`
> (`recipeFavoriteKeys`) để lưu / bỏ lưu không làm tải lại mọi danh sách công khai.

### features/recipe/hooks/useRecipeNutrition.js

**Gắn với:** `export function useRecipeNutrition(recipes) {`

> Dinh dưỡng mỗi khẩu phần của danh sách công thức, đọc từ `recipe.nutritionPerServing` do BE tính sẵn (xem `readRecipeNutrition`).
>
> Trả về:
> - nutritionById: Map\<recipeId, { kcal, protein, carbs, fat } | null>, null nghĩa là chưa tính được
> - gapById: Map\<recipeId, string> chỉ có với công thức BE chưa quy đổi hết nguyên liệu, kèm tên nguyên liệu

### features/recipe/hooks/useRecipes.js

**Gắn với:** `export function useRecipes(params = {}) {`

> Danh sách công thức đã publish (GET /recipes). params: { keyword, page, size }.
> Giữ dữ liệu trang cũ trong lúc tải trang/từ khóa mới để danh sách không bị nháy.

**Gắn với:** `export function useRecipeFeed({ keyword, sort, size = 12 } = {}) {`

> Feed công thức đã đăng dạng "Xem thêm" (GET /recipes), lọc theo từ khóa, `sort="popular"` để xếp theo lượt lưu.
> Trả về query của React Query + `recipes` (mảng phẳng) + `total`.

### features/recipe/pages/RecipeDetailScreen.jsx

**Gắn với:** `export default function RecipeDetailScreen() {`

> Trang đọc một công thức (route /recipes/:recipeId), công khai với công thức đã đăng.
> BE chỉ trả bản nháp/đang ẩn cho tác giả hoặc ADMIN (kèm token), người khác nhận 404. FE vẫn kiểm tra
> thêm ở đây để chắc chắn không hiện nhầm (vd. công thức ARCHIVED, BE trả cho mọi người vì thực đơn cũ cần).

### features/recipe/pages/RecipeFormScreen.jsx

**Gắn với:** `export default function RecipeFormScreen() {`

> Trang tạo công thức (/recipes/new) và sửa công thức (/recipes/:recipeId/edit), cần đăng nhập.
> GET /recipes/:id kèm token thì chủ công thức / ADMIN nạp được cả bản nháp để sửa; người khác nhận 404.
> Công thức đã xóa (ARCHIVED) hoặc bị ẩn (HIDDEN) vẫn nạp được nhưng BE từ chối lưu (lỗi 4108).

### features/recipe/pages/RecipeListScreen.jsx

**Gắn với:** `export default function RecipeListScreen() {`

> Trang duyệt công thức (route /recipes), công khai: lưới công thức đã đăng, mới nhất trước,
> tìm theo từ khóa (BE tìm trong tên và mô tả). Từ khóa nằm trên URL (?q=) để chia sẻ/quay lại được.
> Ô "Sắp xếp" chọn Mới nhất hoặc Được lưu nhiều nhất (?sort=popular); đổi từ khóa và đổi kiểu sắp xếp giữ nguyên nhau trên URL.

### features/recipe/schema.js

**Gắn với:** `export const recipeSchema = z.object({`

> Form tạo / sửa công thức. Số giữ dạng chuỗi vì lấy từ \<input>, đổi sang số khi gửi
> (xem formValuesToPayload ở utils/recipeForm.js).

### features/recipe/utils/recipeForm.js

**Gắn với:** `import { parseQuantity } from "../schema.js";`

> Chuyển đổi giữa dữ liệu form công thức (toàn chuỗi, theo \<input>) và payload / RecipeResponse của BE.
> Không import alias @/ để file test (node --test) chạy được.

**Gắn với:** `export const UNIT_OPTIONS = [`

> Đơn vị cho chọn. BE lưu chuỗi tự do và tự IN HOA. GRAM / KG luôn quy đổi được ra gram; ml, muỗng, quả chỉ quy đổi
> được với một số nguyên liệu quen thuộc (BE có bảng khối lượng riêng / cân nặng mỗi quả), không thì công thức chưa có kcal.

**Gắn với:** `export function validateRecipeImage(file) {`

> Luật ảnh công thức của BE: chỉ JPEG / PNG (khác blog, không nhận WEBP), tối đa 5MB.

**Gắn với:** `export function formValuesToPayload(values) {`

> Giá trị form (đã qua recipeSchema) -> RecipeRequest gửi lên BE.  
> - thứ tự bước = vị trí trong danh sách (stepNumber bắt đầu từ 1)  
> - thời gian để trống -> null; quantity đổi dấu phẩy thành dấu chấm rồi ép số

### features/recipe/utils/recipeFavorite.js

**Gắn với:** `export function patchFavoriteCount(data, recipeId, favoriteCount) {`

> Ghi `favoriteCount` mới của một công thức vào dữ liệu cache: nhận chi tiết (một công thức), một trang `{ items }`
> hoặc danh sách vô hạn `{ pages }`; không khớp thì trả nguyên dữ liệu cũ.

### features/recipe/utils/recipeNutrition.js

**Gắn với:** `export function readRecipeNutrition(recipe) {`

> Đọc dinh dưỡng MỖI KHẨU PHẦN do BE tính (`recipe.nutritionPerServing`, cả danh sách lẫn chi tiết): { kcal (làm tròn), protein, carbs, fat }.
> BE tự quy đổi muỗng / quả / ml ra gram, FE không còn tính lại. Khi `complete = false` BE bỏ các nguyên liệu không quy đổi được
> (`missingIngredients`) khỏi tổng nên con số sẽ thấp hơn thật; FE khi đó không hiện số mà nêu tên các nguyên liệu đó.
> Công thức không có nguyên liệu hoặc thiếu trường (BE cũ) thì trả nutrition = null, gap = null.

**Gắn với:** `export function isGramUnit(unit) {`

> Đơn vị khối lượng (gram, kg, mg) mà BE luôn quy đổi được; form dùng để nhắc khi chọn đơn vị khác.

### features/recipe/utils/recipeSafety.js

**Gắn với:** `export function isAllergenIngredient(item) {`

> BE gửi kèm cờ `allergen` (nguyên liệu thuộc nhóm dễ gây dị ứng) và `vegan` cho từng nguyên liệu của công thức.
> `allergen` chỉ là cờ chung, không nói đó là dị ứng gì, nên FE chỉ cảnh báo chung chứ không so với dị ứng
> cụ thể người dùng đã khai.

## features/restaurant-map

### features/restaurant-map/api/restaurantApi.js

**Gắn với:** `export async function getNearbyRestaurants({`

> Restaurant APIs (location-service qua api-gateway). Công khai, không cần token.
>  GET /restaurants/nearby?lat=&lng=[&radiusKm=5][&veganOnly=false]  
> 
> Restaurant: {
>  id, name, address, latitude, longitude, phoneNumber, rating,
>  veganOnly, imageUrl (có thể null), distanceKm
> }
> Kết quả xếp theo khoảng cách tăng dần, không phân trang. radiusKm tối đa 10.
> Lỗi: 1018 thiếu/sai kiểu tham số, 5001 tọa độ ngoài phạm vi, 5002 bán kính ngoài (0, 10].
>  GET /restaurants/search?q=&lat=&lng=[&veganOnly=false]  tìm theo tên, xem `searchRestaurants`  

**Gắn với:** `export async function getNearbyRestaurants({`

> GET /restaurants/nearby — quán chay trong bán kính `radiusKm` (tối đa 10), gần nhất trước.

**Gắn với:** `export async function searchRestaurants({ q, lat, lng, veganOnly = false }) {`

> GET /restaurants/search — tìm quán theo TÊN (không tìm theo địa chỉ), công khai, tối đa 20 quán, không phân trang và không theo bán kính.
> q phải 2 - 100 ký tự (ngoài khoảng: 400 / 5003). Thứ tự: quán có tên bắt đầu bằng q trước, rồi gần nhất (hoặc A-Z khi không có lat / lng); không phân biệt hoa thường và dấu.
> Có lat / lng thì mỗi quán kèm `distanceKm`, không thì null (`formatDistance` trả chuỗi rỗng nên thẻ không hiện khoảng cách).

### features/restaurant-map/components/MapPanel.jsx

**Gắn với:** `export default function MapPanel({`

> Bản đồ Mapbox của trang quán chay.  
> - restaurants: quán đang hiện trong danh sách (đã lọc), vẽ thành chấm; > 50 quán thì gom cụm  
> - location / isDefaultLocation / radiusKm: tâm tìm kiếm (chấm xanh là vị trí thật) và vòng bán kính  
> - selectedId / onSelect(id | null): quán đang chọn (có ghim lớn và popup), đồng bộ với danh sách  
> - onLocate / locating: nút "Vị trí của tôi" xin định vị lại  
> - searchMode: đang hiện kết quả tìm theo tên. Quán có thể nằm ngoài vòng bán kính nên ẩn vòng và `fitBounds` vừa các kết quả mới (chỉ khi tập kết quả đổi);
>   thoát chế độ này thì bay về vòng bán kính như bình thường

### features/restaurant-map/components/MapSearchBar.jsx

**Gắn với:** `export default function MapSearchBar({ keyword, onKeywordChange }) {`

> Thanh tìm kiếm quán. Từ khóa đủ 2 ký tự thì màn hình gọi BE tìm theo tên (xem RestaurantMapScreen), ít hơn thì chỉ lọc trên danh sách quanh đây.  
> - keyword / onKeywordChange: ô tìm kiếm (tối đa 100 ký tự, khớp giới hạn của BE)

### features/restaurant-map/components/RestaurantList.jsx

**Gắn với:** `export default function RestaurantList({`

> Danh sách quán bên trái bản đồ. Toàn bộ dữ liệu và state nằm ở RestaurantMapScreen.  
> - restaurants: quán đã lọc và sắp xếp, hiện 5 quán một lần ("Xem thêm" để mở rộng)  
> - resetKey: đổi giá trị này thì số quán đang hiện quay lại 5  
> - isRefreshing: đang tải lại (đổi bán kính) trong khi vẫn hiện kết quả cũ  
> - searchTerm: từ khóa đang được BE tìm (null khi không tìm theo tên); có giá trị thì tiêu đề đổi thành "N quán khớp ..." và ô bán kính bị khóa vì BE không xét bán kính

**Trong:** `RestaurantList` · **Gắn với:** `useEffect(() => {`

> Chọn quán từ marker: cuộn danh sách tới thẻ. Chỉ làm ở màn rộng (2 cột), vì ở màn hẹp
> bản đồ nằm dưới danh sách và cuộn lên sẽ kéo người dùng rời khỏi bản đồ.

### features/restaurant-map/hooks/useNearbyRestaurants.js

**Gắn với:** `export function useNearbyRestaurants({ lat, lng, radiusKm, veganOnly = false }) {`

> Quán chay quanh một điểm (GET /restaurants/nearby), gần nhất trước.
> params: { lat, lng, radiusKm, veganOnly }. Trả về query của React Query + `restaurants`
> (mảng, luôn có giá trị). Đổi bán kính thì giữ kết quả cũ trong lúc tải để danh sách không nháy trống.

### features/restaurant-map/hooks/useSearchRestaurants.js

**Gắn với:** `export function useSearchRestaurants({ q, lat, lng, veganOnly = false }) {`

> Tìm quán theo tên (GET /restaurants/search). `q` null thì không gọi (enabled = false). Giữ kết quả cũ trong lúc tải từ khóa mới để danh sách không nháy trống.

### features/restaurant-map/hooks/useUserLocation.js

**Gắn với:** `function readPosition(update) {`

> Gọi định vị và báo kết quả qua `update`. Lỗi giữ lại vị trí cũ (nếu có) để lần thử lại
> thất bại không đẩy người dùng về tâm mặc định.

**Gắn với:** `export function useUserLocation() {`

> Vị trí người dùng từ `navigator.geolocation`, tự xin quyền khi trang mở.
> Trả về:  
> - location: { lat, lng } — luôn có giá trị, là tâm TP.HCM khi chưa có vị trí thật  
> - isDefaultLocation: true khi đang dùng tâm mặc định  
> - status: "loading" | "granted" | "denied" | "unavailable" | "unsupported"  
> - request(): xin định vị lại (nút "Vị trí của tôi")  
> - resetToDefault(): quay về tâm mặc định

### features/restaurant-map/pages/RestaurantMapScreen.jsx

**Gắn với:** `export default function RestaurantMapScreen() {`

> Trang Bản đồ quán chay (location-service: GET /restaurants/nearby và GET /restaurants/search).
> Màn hình giữ toàn bộ state; danh sách và bản đồ cùng đọc một mảng quán đã lọc.
> `searchTerm` = từ khóa đã cắt khoảng trắng, dài 2 - 100 ký tự và đứng yên 400 ms (gõ dở thì null, danh sách quanh đây lọc ngay trên máy);
> có `searchTerm` thì danh sách / bản đồ / trạng thái tải lấy từ kết quả tìm theo tên, không thì từ danh sách quanh đây. Hai truy vấn dùng chung khóa cache theo từ khóa và tọa độ làm tròn.

### features/restaurant-map/queryKeys.js

**Gắn với:** `const round = (n) => Math.round(n * 1e4) / 1e4;`

> Khóa cache React Query của feature restaurant-map (`nearby` và `search`).
> Tọa độ làm tròn 4 chữ số thập phân (~11 m) để GPS nhích nhẹ không gọi lại API.

### features/restaurant-map/utils/mapConfig.js

**Gắn với:** `export const MARKER_COLORS = {`

> Màu marker: paint của Mapbox không đọc được token CSS, nên lặp lại giá trị
> `--brand` trong globals.css cho từng theme.

**Gắn với:** `export const MIN_SEARCH_LENGTH = 2;`

> Độ dài từ khóa BE chấp nhận khi tìm quán theo tên (2 - 100 ký tự; ngoài khoảng là lỗi 5003).

**Gắn với:** `export function zoomForRadius(radiusKm) {`

> Mức zoom vừa khít vòng bán kính trong khung bản đồ ~500px:
> 1 km → 14.8, 5 km → 12.5, 10 km → 11.5.

**Gắn với:** `export function circleGeoJSON({ lat, lng }, radiusKm, steps = 64) {`

> Vòng tròn bán kính quanh một điểm dưới dạng GeoJSON Polygon (xấp xỉ phẳng, đủ chính xác ≤ 10 km).
> Tọa độ theo [kinh độ, vĩ độ]; vòng khép kín (điểm cuối trùng điểm đầu).

### features/restaurant-map/utils/restaurantFormat.js

**Gắn với:** `export function getSearchTerm(keyword) {`

> Từ khóa đã cắt khoảng trắng nếu dài 2 - 100 ký tự (đủ để gọi BE tìm theo tên), ngắn hoặc dài hơn thì null.

**Gắn với:** `export function sortRestaurants(restaurants, sort) {`

> Sắp xếp bản sao của danh sách. BE đã xếp theo khoảng cách nên "nearest" chỉ giữ thứ tự;
> "rating" xếp rating giảm dần (không có rating xuống cuối), bằng nhau thì gần hơn trước.

**Gắn với:** `export function toGeoJSON(restaurants) {`

> Danh sách quán → GeoJSON FeatureCollection cho Mapbox source.
> Tọa độ GeoJSON là [kinh độ, vĩ độ] — ngược với latitude/longitude của BE.

## features/video

### features/video/api/videoApi.js

**Gắn với:** `export async function getVideos({ categoryId, page = 0, size = 12 } = {}) {`

> GET /videos — danh sách video đã được duyệt & xuất bản (PUBLISHED), mới nhất trước.
> Công khai, không cần token. Phân trang 0-based.

**Gắn với:** `export async function getVideo(id) {`

> GET /videos/:id — chi tiết video đã xuất bản; mỗi lần gọi server tính thêm 1 lượt xem.
> Công khai, không cần token.

**Gắn với:** `export async function createVideo(formData, { onUploadProgress } = {}) {`

> POST /videos — đăng video mới (multipart/form-data).
> Cần đăng nhập. Form gửi đúng một trong hai: file .mp4 (≤ 30MB) hoặc youtubeUrl.
> Kèm title, description, categoryId, publish (boolean).

**Gắn với:** `export async function getMyVideos({ status, page = 0, size = 10 } = {}) {`

> GET /videos/me — video của người dùng hiện tại ở mọi trạng thái.
> Cần đăng nhập. status: DRAFT | PENDING | PUBLISHED | REJECTED | BANNED (bỏ trống = tất cả).

**Gắn với:** `export async function updateVideo(id, { title, description, categoryId }) {`

> PUT /videos/:id — sửa tiêu đề, mô tả, danh mục. Nguồn video (file hoặc youtube) không đổi.
> Nếu video đã qua kiểm duyệt thì sau khi sửa sẽ được kiểm duyệt lại.

**Gắn với:** `export async function submitVideo(id) {`

> POST /videos/:id/submit — gửi bản nháp đi kiểm duyệt.

**Gắn với:** `export async function deleteVideo(id) {`

> DELETE /videos/:id — chủ xóa thật, admin xóa người khác thì video bị BANNED.

**Gắn với:** `export async function voteVideo(id, value = 1) {`

> POST /videos/:id/vote — thích (value = 1) hoặc không thích (value = -1) một video đã xuất bản.
> Gửi cùng giá trị lần hai thì BE hủy vote (toggle). Trả VoteResponse { videoId, myVote, voteScore }.

**Gắn với:** `export async function removeVideoVote(id) {`

> DELETE /videos/:id/vote — bỏ vote rõ ràng; gọi lặp lại không lỗi. Trả VoteResponse với myVote = null.

**Gắn với:** `export async function getMyVideoVotes(videoIds) {`

> GET /videos/me/votes?videoIds=1,2,3 — lấy trạng thái vote của tôi trên tối đa 100 video mỗi lượt gọi (chunk tự động).

### features/video/api/videoJobApi.js

**Gắn với:** `export async function processVideo(file, { onUploadProgress } = {}) {`

> POST /ai/videos/process (multipart, field `file`, cần đăng nhập và còn lượt trong gói).
> BE trả 202 kèm job { id, status: "PROCESSING", ... }; kết quả lấy bằng cách hỏi lại GET /ai/videos/:id.

**Gắn với:** `export async function processExistingVideo(videoId) {`

> POST /ai/videos/process-existing { videoId } — bóc tách công thức của một video đã đăng (chỉ video UPLOAD,
> đã xuất bản). BE trả 202 kèm job: đã có kết quả thì dùng lại (COMPLETED, không trừ lượt), đang chạy thì trả
> job PROCESSING, còn lại tạo job mới và trừ 1 lượt (hoàn lại nếu thất bại).
> Theo dõi bằng getVideoRecipe, không dùng GET /ai/videos/:id vì job có thể của người khác (BE trả 404).

**Gắn với:** `export async function getVideoRecipe(videoId) {`

> GET /ai/videos/by-video/:videoId — công thức AI dùng chung của một video đã đăng (công khai, không tốn lượt).
> Trả { state, extraction? } với state: "ready" | "processing" | "failed" | "unsupported" | "none"
> (xem recipeStateFromResponse); lỗi khác (mạng, 5xx...) thì ném.

**Gắn với:** `export async function getVideoJobs({ page = 0, size = 10 } = {}) {`

> GET /ai/videos — lịch sử bóc tách của tôi, mới nhất trước.
> PageResponse { content, page, size, totalElements, totalPages, first, last } (size tối đa 100).
> Mỗi job: { id, status: PROCESSING | COMPLETED | FAILED, filename, transcript,
>  extraction: { title, ingredients: [{ name, quantity }], steps: [{ number, instruction }] },
>  error, createdAt, updatedAt }.

### features/video/components/AiSummaryCard.jsx

**Gắn với:** `export default function AiSummaryCard({ video }) {`

> Thẻ "Tóm tắt công thức nấu ăn (AI Summary)" ở trang xem video: công thức AI bóc tách từ chính video này
> (GET /ai/videos/by-video/:id, công khai dùng chung cho mọi người nên xem không tốn lượt). Chưa có thì mời bóc tách
> (POST /ai/videos/process-existing, trừ 1 lượt của gói). Nút ở tiêu đề (VideoMetaHeader) dùng chung trạng thái này.

### features/video/components/NutritionFactsCard.jsx

**Gắn với:** `export default function NutritionFactsCard() {`

> Thẻ giá trị dinh dưỡng của video.
> Do BE hiện chưa có endpoint bóc tách dữ liệu dinh dưỡng thật cho video,
> phần này được đánh dấu rõ ràng là dữ liệu mẫu tham khảo.

### features/video/components/UploadVideoJobDialog.jsx

**Gắn với:** `export default function UploadVideoJobDialog({ open, onOpenChange }) {`

> Hộp thoại chọn tệp video để AI bóc tách công thức (POST /ai/videos/process).
> Gửi xong BE trả 202 ngay, kết quả hiện dần trong danh sách (tab "Bóc tách") nên hộp thoại đóng luôn.
> Gói không có lượt bóc tách (videosPerMonth = 0, vd FREE) thì chặn sớm và mời nâng cấp.

### features/video/components/VideoChannelBar.jsx

**Gắn với:** `export default function VideoChannelBar() {`

> Thanh kênh gợi ý phía trên trang video chính.
> BE chưa có endpoint kênh / người sáng tạo riêng, nên các kênh ở đây được đánh dấu là dữ liệu mẫu.

### features/video/components/VideoForm.jsx

**Gắn với:** `export default function VideoForm({ video, categories = [] }) {`

> Form đăng / sửa video.  
> - Đăng mới: hỗ trợ tệp .mp4 (≤ 30MB) có thanh tiến trình upload, hoặc liên kết YouTube.  
>  Lựa chọn "Lưu nháp" hoặc "Đăng video" (gửi kiểm duyệt ngay).  
> - Sửa: cập nhật tiêu đề, danh mục, mô tả (nguồn video giữ nguyên theo luật BE).

### features/video/components/VideoJobResultDialog.jsx

**Gắn với:** `export default function VideoJobResultDialog({ job, onClose }) {`

> Xem kết quả bóc tách của một job COMPLETED: tên món, nguyên liệu kèm số lượng, các bước và bản chép lời.
> `job` rỗng thì đóng; extraction { title, ingredients: [{ name, quantity }], steps: [{ number, instruction }] }.

### features/video/components/VideoPlayerFrame.jsx

**Gắn với:** `export default function VideoPlayerFrame({ video }) {`

> Trình phát video:  
> - sourceType === "YOUTUBE": dùng \<iframe> với videoUrl là embed URL do BE trả về.  
> - sourceType === "UPLOAD": dùng thẻ \<video> HTML5 với videoUrl là tệp .mp4.

### features/video/data/mockVideo.js

**Gắn với:** `export const nutritionFacts = {`

> Dữ liệu mẫu tham khảo cho các tính năng chưa có endpoint backend riêng
> (nutrition facts, kênh ẩm thực đề xuất).

### features/video/hooks/useMyVideos.js

**Gắn với:** `export function useMyVideos({ status, size = 10 } = {}) {`

> Video của tôi ở mọi trạng thái (GET /videos/me) có phân trang dạng "Xem thêm".
> status: "DRAFT" | "PENDING" | "PUBLISHED" | "REJECTED" | "BANNED", bỏ trống = tất cả.

### features/video/hooks/useVideoJobs.js

**Gắn với:** `export function useVideoJobs({ size = 10 } = {}) {`

> Lịch sử bóc tách công thức từ video (GET /ai/videos) có phân trang "Xem thêm".
> Còn job PROCESSING thì tự hỏi lại BE mỗi vài giây, hết thì dừng (job mới nhất nằm ở trang đầu).

**Gắn với:** `export function useStartVideoJob() {`

> Gửi video đi bóc tách (POST /ai/videos/process).
> mutate({ file, onUploadProgress }) -> job { id, status: "PROCESSING", ... }.

### features/video/hooks/useVideoMutations.js

**Gắn với:** `export function useCreateVideo() {`

> Đăng video mới (multipart).
> mutate({ formData, onUploadProgress }) -> VideoResponse.

**Gắn với:** `export function useUpdateVideo() {`

> Cập nhật tiêu đề, mô tả, danh mục video.
> mutate({ id, title, description, categoryId }) -> VideoResponse.

**Gắn với:** `export function useSubmitVideo() {`

> Gửi bản nháp đi kiểm duyệt.
> mutate(id) -> VideoResponse.

**Gắn với:** `export function useDeleteVideo() {`

> Xóa video.
> mutate(id).

### features/video/hooks/useVideoRecipe.js

**Gắn với:** `export function useVideoRecipe(video) {`

> Công thức AI của một video đã đăng, dùng chung cho nút ở tiêu đề và thẻ "AI Summary" (cùng queryKey nên chỉ
> gọi BE một lần). `video` là kết quả GET /videos/:id (undefined khi đang tải).  
> 
> status:  
> - "loading"     đang tải video hoặc đang hỏi BE  
> - "unsupported" video YouTube (BE chỉ bóc tách video tải lên, mã 6021)  
> - "login"       chưa đăng nhập (chỉ áp dụng khi video chưa có công thức và cần đăng nhập để bóc tách)  
> - "none"        chưa có kết quả, có thể bóc tách (trừ 1 lượt của gói)  
> - "processing"  AI đang bóc tách (kể cả đang gửi yêu cầu), tự hỏi lại mỗi vài giây  
> - "failed"      lần trước thất bại (lượt đã hoàn lại), có thể thử lại  
> - "ready"       đã có `extraction` { title, ingredients, steps }  
> - "error"       không hỏi được BE (`error` là chuỗi tiếng Việt, `refetch` để thử lại)  
> `noQuota` = gói hiện tại không có lượt bóc tách (vd FREE): vẫn xem được kết quả có sẵn nhưng không tạo mới.
> `run()` gửi yêu cầu bóc tách, tự báo toast khi gửi xong hoặc lỗi.

### features/video/hooks/useVideos.js

**Gắn với:** `export function useVideoFeed({ categoryId, size = 12, enabled = true } = {}, options = {}) {`

> Feed video đã xuất bản (GET /videos) có phân trang dạng "Xem thêm".
> params: { categoryId, size, enabled }.

**Gắn với:** `export function useVideo(id) {`

> Chi tiết video đã xuất bản (GET /videos/:id).
> BE tăng 1 lượt xem mỗi lần gọi, nên tắt refetch khi focus để không tăng lượt xem ảo.

### features/video/hooks/useVideoVotes.js

**Gắn với:** `export function useMyVideoVotes(videoIds) {`

> Lấy danh sách vote của tôi trên các video hiển thị (tối đa 100 id mỗi đợt, chunk tự động).
> Trả Map<videoId, myVote> (1: Thích, -1: Không thích, null: chưa vote).

**Gắn với:** `export function useVoteVideo() {`

> Mutation bình chọn video dạng toggle (POST /videos/:id/vote). Cập nhật cache React Query cho feed, chi tiết và myVotes.

### features/video/pages/VideoFormScreen.jsx

**Trong:** `VideoFormScreen` · **Gắn với:** `const stateVideo = location.state?.video;`

> Nạp video để sửa: ưu tiên lấy từ router state (để sửa được cả bản nháp/bị từ chối từ My Content),
> nếu không có thì gọi GET /videos/:id (chỉ video đã đăng).

### features/video/pages/VideoHomeScreen.jsx

**Gắn với:** `export default function VideoHomeScreen() {`

> Trang video chính (route /videos, công khai): danh sách video đã duyệt (GET /videos),
> hỗ trợ lọc theo danh mục trên URL (?category=) và phân trang "Xem thêm".

### features/video/pages/VideoWatchScreen.jsx

**Gắn với:** `export default function VideoWatchScreen() {`

> Trang xem video chi tiết (route /videos/:videoId, công khai).
> Nạp dữ liệu qua GET /videos/:id (BE tính 1 lượt xem mỗi lần xem).

### features/video/utils/videoForm.js

**Gắn với:** `export function extractYouTubeId(url) {`

> Trích xuất ID 11 ký tự của video YouTube từ link người dùng nhập.
> Khớp hoàn toàn với bộ lọc của backend (YouTubeUrls.java).
> Hỗ trợ: youtu.be/\<id>, youtube.com/watch?v=\<id>, /embed/\<id>, /shorts/\<id>.

**Gắn với:** `export function validateVideoFile(file) {`

> Kiểm tra tệp video: bắt buộc .mp4 và dung lượng ≤ 30MB.
> Trả về chuỗi lỗi tiếng Việt nếu không hợp lệ, hoặc null nếu hợp lệ.

**Gắn với:** `export function describeVideoOutcome(video) {`

> Diễn giải VideoResponse sau khi tạo / sửa / gửi duyệt thành thông báo toast cho người dùng.
> Trả { tone: "success" | "info" | "error", message }.

### features/video/utils/videoJob.js

**Gắn với:** `export function validateJobFile(file) {`

> Kiểm tra tệp trước khi gửi: phải là video và ≤ 100MB (BE kiểm lại bằng ffprobe, kể cả thời lượng ≤ 30 phút).
> Trả chuỗi lỗi tiếng Việt nếu không hợp lệ, hoặc null nếu hợp lệ.

**Gắn với:** `export function jobSourceLabel(job) {`

> Tên hiển thị của nguồn một job: job tạo từ video đã đăng có filename do BE tự đặt ("blog-video-8.mp4")
> nên không đưa cho người dùng, thay bằng số video.

**Gắn với:** `export function recipeStateFromResponse(res) {`

> Trạng thái công thức AI của một video đã đăng, suy ra từ phản hồi của GET /ai/videos/by-video/:id:
> "ready" (có kết quả) | "processing" (409, mã 6022) | "failed" (mã 6023) | "unsupported" (mã 6021)
> | "none" (404, chưa từng bóc tách hoặc kết quả đã hết hạn).
> Trả null với lỗi khác để nơi gọi ném lỗi.

## lib

### lib/jwt.js

**Gắn với:** `export function getTokenExpiryMs(token) {`

> Đọc thời điểm hết hạn (claim "exp") từ JWT ở phía client. Chỉ để UI biết khi nào
> nên tự đăng xuất — KHÔNG thay cho việc server kiểm tra token.

### lib/queryClient.js

**Gắn với:** `export const queryClient = new QueryClient({`

> Tách riêng để authStore có thể xóa cache khi đăng xuất (tránh user sau thấy
> dữ liệu cache của user trước).  
> 
> - retry: false — lỗi 4xx/5xx được ném từ các hàm *Api.js (apiClient tắt  
>   validateStatus) là lỗi nghiệp vụ, thử lại không giúp ích mà chỉ làm chậm  
>   việc hiện thông báo lỗi.  
> - refetchOnWindowFocus: false — không tự gọi lại API khi quay lại tab, giữ  
>   hành vi giống code cũ (tự gọi tay khi cần).

## shared

### shared/api/apiClient.js

**Trong:** `apiClient` · **Gắn với:** `validateStatus: () => true,`

> axios mặc định throw khi gặp 4xx/5xx. Tắt đi để tự xử lý status trong code,
> giống hành vi của fetch (chỉ throw khi lỗi mạng).

**Gắn với:** `function authHeader() {`

> Lấy token từ store (không đọc thẳng localStorage, vì token có thể nằm ở
> sessionStorage khi người dùng không tick "Ghi nhớ đăng nhập").

**Gắn với:** `apiClient.interceptors.response.use(async (res) => {`

> Access token chỉ sống 15 phút nên 401 là chuyện thường: làm mới bằng refresh token rồi gửi lại request đúng một lần (`authRetried`).
> Bỏ qua `/auth/*` (đăng nhập sai cũng là 401) và request có `skipAuthRefresh`. Request đi bằng token cũ mà request khác đã làm mới xong
> thì chỉ gửi lại, không đổi refresh token thêm lần nữa.

### shared/api/errorMessages.js

**Gắn với:** `export const AUTH_ERROR_MESSAGES = {`

> Mã lỗi (`code`) của BE -> thông báo tiếng Việt. Message gốc của BE là tiếng Anh nên mỗi file *Api.js dịch theo `code`.
> Mỗi service BE dùng dải mã riêng và cùng một số có thể mang nghĩa khác nhau giữa các service (vd 6020, 6021),
> nên mỗi API có một bảng riêng, đừng gộp chung.

**Gắn với:** `export const BLOG_ERROR_MESSAGES = {`

> BE trả message tiếng Anh theo ErrorCode. Với các lỗi người dùng có thể gặp khi thao tác
> (vote, bình luận...) ta đổi sang tiếng Việt theo `code`; code lạ thì dùng message của BE.

**Gắn với:** `export const INGREDIENT_ERROR_MESSAGES = {`

> BE trả message tiếng Anh theo ErrorCode; các lỗi admin hay gặp khi lưu nguyên liệu được đổi
> sang tiếng Việt theo `code`. Lỗi lạ dùng message của BE.

**Gắn với:** `export const PAYMENT_ERROR_MESSAGES = {`

> Bảng dịch lỗi dành riêng cho payment-service (mã 6000–6007 của payment-service,
> không dùng chung với ai-service hay các service khác).

**Gắn với:** `export const RECIPE_ERROR_MESSAGES = {`

> BE trả message tiếng Anh theo ErrorCode; các lỗi người dùng hay gặp khi lưu công thức được đổi
> sang tiếng Việt theo `code`. Lỗi lạ dùng message của BE.

### shared/api/publicUserApi.js

**Gắn với:** `export async function getPublicUsers(ids) {`

> GET /users/batch?ids=1,2,3 (identity-service, công khai)
> Đổi id tác giả thành tên + avatar để hiện cạnh blog / comment / công thức,
> vì các service khác chỉ lưu author id.
> Trả về: [{ id, fullName, avatarUrl }] — user bị khóa/chưa kích hoạt sẽ không có trong kết quả.

### shared/components/AppHeader.jsx

**Gắn với:** `const PROFILE_STALE_MS = 5 * 60 * 1000;`

> Đăng nhập (POST /auth/login) không trả avatarUrl nên header tự nạp hồ sơ một lần
> rồi giữ trong cache; đổi avatar ở trang hồ sơ ghi thẳng vào cache này nên header đổi theo.

### shared/components/ConfirmDialog.jsx

**Gắn với:** `export default function ConfirmDialog({`

> Hộp thoại xác nhận hành động nguy hiểm (xóa). Cha giữ state `open`.
> `loading` khóa nút trong lúc đang gọi API; cha tự đóng hộp thoại khi thành công.

### shared/components/FallbackImage.jsx

**Gắn với:** `export default function FallbackImage({ src, fallback = null, alt = "", ...props }) {`

> \<img> tự chuyển sang `fallback` khi `src` rỗng hoặc tải lỗi (ví dụ URL ảnh cũ trên MinIO đã bị gỡ).
> Nhớ riêng URL đã lỗi, nên khi `src` đổi sang URL mới thì ảnh được thử lại.
> Các prop còn lại được chuyển thẳng cho \<img>.

### shared/components/ScrollToTop.jsx

**Gắn với:** `export default function ScrollToTop() {`

> Đổi trang (bấm link/navigate) thì đưa thanh cuộn về đầu trang, nếu không trang mới sẽ giữ
> vị trí cuộn của trang cũ. Chỉ theo dõi pathname để đổi bộ lọc/tìm kiếm trên URL không bị nhảy.
> Bỏ qua Back/Forward (POP) để trình duyệt tự khôi phục vị trí cũ, và bỏ qua link có #anchor.

### shared/components/SelectField.jsx

**Gắn với:** `export default function SelectField({`

> Dropdown chọn một giá trị, thay cho \<select> gốc.
> options: [{ value, label }]; onValueChange(value) nhận lại đúng `value` gốc (số, chuỗi hay undefined)
> của option được chọn. Giá trị không khớp option nào thì hiện `placeholder`.
> variant: "pill" (thanh lọc) | "field" (ô trong form) | "compact" (ô trong form, thấp hơn và chữ nhỏ hơn "field").
> `id` để \<label htmlFor> trỏ tới.
> `active` tô nhẹ nút khi đang lọc khác mặc định (chỉ dùng với variant pill).

**Trong:** `SelectField` · **Gắn với:** `<span className="grid min-w-0 flex-1 text-left">`

> Các nhãn ẩn xếp chồng cùng một ô lưới để nút luôn rộng bằng mục dài nhất,
> nhờ đó menu (rộng đúng bằng nút) và nút không bao giờ lệch nhau.

### shared/components/ThemeToggle.jsx

**Gắn với:** `export default function ThemeToggle({ className }) {`

> Nút bật/tắt dark mode với hiệu ứng "Circular Reveal" mở rộng từ vị trí
> con trỏ chuột, dựa trên View Transitions API. Trình duyệt không hỗ trợ
> `startViewTransition` sẽ chuyển theme ngay lập tức, không hiệu ứng.

### shared/hooks/usePublicUsers.js

**Gắn với:** `export function usePublicUsers(ids) {`

> Tên + avatar của danh sách tác giả (GET /users/batch).
> `data` là Map\<id, { id, fullName, avatarUrl }> -> dùng `data?.get(authorId)`.
> Id không có trong Map nghĩa là user không còn hiển thị công khai (nên hiện tên dự phòng).

### shared/hooks/useRevealOnScroll.js

**Gắn với:** `export function useRevealOnScroll({ threshold = 0.15 } = {}) {`

> Trả về [ref, visible]: gắn `ref` vào phần tử cần hiện dần; `visible` chuyển
> sang true (và giữ nguyên) khi phần tử lần đầu cuộn vào màn hình.
> Dùng chung cho Reveal và AppFooter.

### shared/store/themeStore.js

**Gắn với:** `export const useThemeStore = create((set, get) => ({`

> Nguồn sự thật cho theme (light/dark) của toàn app.  
> - Đồng bộ với class `dark` trên \<html> để Tailwind dark: hoạt động.  
> - Lưu lựa chọn vào localStorage để giữ theme khi F5 / mở tab mới.

### shared/utils/ids.js

**Gắn với:** `export function normalizeIds(ids) {`

> BE (Spring) nhận list id dạng "1,2,3". axios mặc định serialize mảng thành
> "ids[]=1&ids[]=2" nên BE không đọc được -> luôn nối chuỗi thủ công.

### shared/utils/paging.js

**Gắn với:** `export function getNextPageNumber(lastPage) {`

> Trang kế tiếp cho useInfiniteQuery, dựa trên PageResponse của BE ({ page, totalPages }).
> Trả undefined khi đã hết trang (React Query hiểu là không còn trang sau).

**Gắn với:** `export function flattenPages(data, key = "items") {`

> Gộp danh sách của mọi trang useInfiniteQuery thành một mảng phẳng.
> `key` là tên field chứa danh sách: blog-service dùng "items", recipe-service dùng "content".
