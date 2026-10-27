# VeggiePal — Danh sách task hoàn thiện backend

Ngày đối chiếu: 27/10/2026. Đối chiếu với source BE nhánh `dev` (đã merge PR #49 `feat/backend-completion`, commit `c499148`), working tree sạch. Chi tiết các thay đổi BE đã làm nằm ở `VeggiePal_BE/BACKEND_CHANGES.md`.

**Đã xong và đã xóa khỏi danh sách** (đối chiếu bằng đọc source, chưa chạy lại test): A01 (mã lỗi AI trùng), A03 (password đăng ký), A04 (giới hạn blog), A05 (giới hạn recipe), A07 phần phân trang, D20.1 (theo dõi người dùng và feed người đang theo dõi), D21.3 (nhật ký ăn từ thực đơn), D21.4 (tổng dinh dưỡng ngày), D23.1 (nước uống), D23.2 (vận động), L00 (kiểm tra nền).

## 1. Phạm vi và nguyên tắc

- Hoàn thiện và kiểm thử trên **MySQL local**. Giữ cấu hình database local.
- Chia các phần thành commit nhỏ. Chưa tự commit hoặc push khi chưa có yêu cầu.
- Sau khi BE local hoàn tất mới tạo `chore/aiven-deployment` từ bản đã kiểm thử để chỉnh Aiven và triển khai.
- Tài liệu này liệt kê **công việc còn lại**. Task nào xong thì xóa khỏi đây, không để lại như lịch sử.
- Hiện trạng được xác định bằng đọc source BE. Chưa chạy lại test, chưa kiểm tra database đang triển khai, chưa kiểm tra trạng thái push lên remote.
- Các quy tắc trong cột "Đề xuất" chỉ là gợi ý, chưa phải quyết định nghiệp vụ đã duyệt. Mỗi câu hỏi chỉ chặn phần phụ thuộc vào nó.
- Không làm lại API đã có và không tạo thêm microservice nếu các domain hiện tại đã đáp ứng được.

### Các quyết định đã chốt (theo `BACKEND_CHANGES.md`)

- Mã lỗi AI: giữ 6020/6021 cho nhóm hồ sơ, hàng đợi video đầy là 6025, nguồn video không hỗ trợ là 6026.
- Nội dung blog tối đa 50.000 ký tự Unicode (code point), tính cả markup và khoảng trắng, quá thì trả 400 / 3016.
- Phân trang: `items`, `page` bắt đầu từ 0, `size` mặc định 20, tối đa 100, dạng `{items, page, size, totalElements, totalPages}`. Recipe và AI tạm giữ thêm mảng `content` giống hệt `items` để tương thích; `first`/`last` đã bỏ.
- Nhật ký tính theo ngày múi giờ Asia/Ho_Chi_Minh. Chỉ ghi từ thực đơn đã lưu (nguồn `MEAL_PLAN`), chưa có nhập tay. Nước tính theo ml, vận động theo loại + số phút.
- Theo dõi người dùng là công khai, có feed riêng `/blogs/feed/following`; tài khoản không `ACTIVE` bị ẩn khỏi danh sách và feed.

## 2. Các điểm sai lệch còn lại so với danh sách ban đầu

| Mục ban đầu | Code hiện tại | Hệ quả khi lên kế hoạch |
|---|---|---|
| A2 — AI thiếu identity trong Compose | Đã có `IDENTITY_SERVICE_URL=http://identity-service:8081` và `depends_on identity-service`. | Chỉ còn bước xác minh runtime; không thêm cấu hình trùng. |
| A6 — trạng thái tài khoản | Đăng nhập mật khẩu (`UserService`, sau bước kiểm password) và đăng nhập Google (`loginWithGoogle`) **không kiểm tra `status`**, user `BLOCKED`/`INACTIVE` vẫn nhận JWT. Enum là `PENDING`, `ACTIVE`, `INACTIVE`, `BLOCKED`, không có `SUSPENDED`. | Còn nguyên, chưa làm. Chỉ có `FollowService` và `PublicUserService` biết lọc theo `ACTIVE`. |
| D21 — yêu thích | Đã có API yêu thích thực đơn trong AI. | Bộ sưu tập và lưu blog/recipe/video là phạm vi bổ sung, chưa có. |
| D22 — video | Đã có `authorId`, API video và extraction AI. Extraction nhận `title`, `ingredients`, `steps`. | Chưa có truy vấn video theo tác giả và dinh dưỡng video; không viết lại pipeline extraction hiện có. |

## 3. Danh sách còn lại

| ID | Công việc | Trạng thái | Điều kiện trước khi làm |
|---|---|---|---|
| A02 | Xác minh AI gọi identity và nutrition-target trong Docker local | Có cấu hình, **chưa xác minh runtime** | Có môi trường local |
| A06 | Chặn đăng nhập theo trạng thái tài khoản | **Chưa làm** | Q03–Q05 |
| A07 | Gỡ mảng `content` tạm của recipe và AI | Phân trang đã xong; còn gỡ alias | Chốt đợt gỡ, không có ngày tự động |
| B01 | Nhật ký: ngày chưa có bữa nào vẫn trả tổng bằng 0 | **Làm thiếu** (mục 10) | Có thể làm ngay |
| B02 | Nhật ký: chưa kiểm tra ngày hợp lệ khi xác nhận | **Làm thiếu** (mục 10) | Q14/Q15 phần còn mở |
| I01 | Bảng mô tả endpoint cho API sẵn có | Mới có bảng cho API mới ở `BACKEND_CHANGES.md` | — |
| D20.2 | Bảng xếp hạng cộng đồng | Chưa làm | Q08 |
| D20.3 | Chủ đề xu hướng | Chưa làm | Q09 |
| D20.4 | Thống kê cộng đồng | Chưa làm | Q10 |
| D20.5 | Thử thách 7 ngày | Chưa làm | Q11 |
| D21.1 | Huy hiệu trên profile | Chưa làm | Q12 |
| D21.2 | Bộ sưu tập yêu thích | Chưa làm | Q13 |
| D22.1 | Trang/kênh người sáng tạo | Chưa làm | Q16 |
| D22.2 | Dữ liệu dinh dưỡng video | Chưa làm | Q17 |
| Q00 | Kiểm thử tổng thể, tài liệu và Docker local | Còn thiếu một phần (mục 8) | Các phần trong đợt phát hành đã hoàn tất |
| DEP01 | Cấu hình và kiểm tra Aiven/deploy BE | Ngoài phạm vi nhánh local | — |

## 4. Giải thích chi tiết các việc còn lại

### A02 — Xác minh nutrition-target gọi được identity

**Hiện trạng:** Compose đã có URL identity và dependency cần thiết (`IDENTITY_SERVICE_URL` ở ai-service). Chưa có bằng chứng đã chạy thật.

**Việc làm:** khởi động Docker local, kiểm tra network nội bộ, JWT đồng nhất và luồng đọc `/users/me`; gọi nutrition-target với user có và thiếu thông tin. Phân biệt thiếu thông tin người dùng với identity không truy cập được.

**Hoàn thành khi:** profile đủ thông tin trả kết quả; thiếu profile trả lỗi nghiệp vụ (6020/6021); downstream mất kết nối trả lỗi dịch vụ phù hợp. Không coi cấu hình đã có là bằng chứng runtime đã hoạt động.

### A06 — Trạng thái tài khoản và đăng nhập

**Vấn đề đã kiểm chứng trong source:** `UserService` đăng nhập mật khẩu chỉ kiểm tra email và password rồi phát token. `loginWithGoogle` cũng phát token cho bất kỳ user nào tìm thấy theo email, kể cả `BLOCKED`/`INACTIVE`. `linkGoogleAccount` chỉ chuyển `PENDING` thành `ACTIVE` khi tài khoản chưa xác minh email.

**Việc làm bắt buộc:** kiểm tra trạng thái trước khi phát JWT trong cả password login và Google login; thống nhất chính sách cho các trạng thái hiện có (đề xuất chỉ `ACTIVE` được phát token).

**Việc cần chốt riêng:** có thêm API admin khóa/mở khóa hay không; có thêm trạng thái mới hay không; xử lý JWT đã phát khi tài khoản bị khóa.

**Hoàn thành khi:** tài khoản được phép vẫn đăng nhập được, tài khoản bị khóa không nhận token mới, sai password vẫn trả lỗi xác thực chung (không lộ trạng thái tài khoản cho người chưa xác thực đúng); test Google không chỉ kiểm tra status giữ nguyên mà còn kiểm tra không phát token.

Nếu yêu cầu khóa có hiệu lực ngay với mọi phiên, cần thiết kế kiểm tra trạng thái/thu hồi token ở các service liên quan. Chỉ sửa login không giải quyết được yêu cầu đó. Cần Q03–Q05.

### A07 — Gỡ mảng `content` tạm

Recipe và AI hiện trả cả `items` lẫn `content` (cùng nội dung) để các client cũ không vỡ. Khi mọi client đã chuyển sang `items`, bỏ `content` và getter alias, cập nhật test serialization tương ứng. Việc này cần phối hợp phát hành, không có ngày tự động.

### I01 — Mô tả endpoint cho API sẵn có

`BACKEND_CHANGES.md` đã có bảng endpoint, body và mã lỗi cho API nhật ký và theo dõi mới. Còn thiếu bảng tương tự (đường dẫn, auth, request/response, mã lỗi) cho các API sẵn có:

- `/ai/meal-plans/nutrition-target`.
- `/ai/meal-plans/favorites`, `/ai/meal-plans/{id}/favorite`.
- `/ai/videos/process`, `/ai/videos/process-existing`, `/ai/videos/by-video/{videoId}`.

Các đường dẫn trên là mapping trực tiếp tại service; khi gọi qua gateway phải đối chiếu prefix routing hiện tại.

**Hoàn thành khi:** có tài liệu cho nhóm API trên và khớp với source.

## 5. Giải thích chi tiết các tính năng mới còn lại

### D22.1 — Trang người sáng tạo và video theo tác giả

**Ý nghĩa:** mở trang một tác giả để xem thông tin công khai, số liệu và video đã xuất bản.

**Hiện trạng:** `PublicUserResponse` chỉ có thông tin cơ bản; `GET /videos` không có tham số lọc theo `authorId`; chưa có số liệu tác giả.

**Việc làm:** mở rộng public profile nếu cần; thêm truy vấn video theo `authorId`, phân trang, thống kê theo phạm vi đã chốt; dùng lại quan hệ theo dõi và API video hiện có.

**Hoàn thành khi:** công khai chỉ thấy nội dung được phép xuất bản; chủ nội dung vẫn xem nội dung riêng qua API của mình; không trả PII. Không mặc định tạo hệ thống channel độc lập nếu account hiện tại đủ dùng. Cần Q16.

### D21.2 — Bộ sưu tập yêu thích

**Ý nghĩa:** user tạo danh sách như Món ăn sáng, Món muốn thử rồi lưu nội dung vào từng danh sách.

**Việc làm:** chốt các loại nội dung, nơi sở hữu dữ liệu; API tạo/đổi tên/xóa bộ sưu tập, thêm/bỏ nội dung và liệt kê; chống trùng, kiểm tra quyền truy cập, xử lý nội dung bị xóa/ẩn. Tận dụng API yêu thích thực đơn hiện có nếu nằm trong phạm vi.

**Hoàn thành khi:** chỉ người có quyền được sửa; không trùng mục trong cùng bộ sưu tập; xóa bộ sưu tập không xóa bài/công thức/video gốc. Vote/like và lưu yêu thích phải có ý nghĩa riêng. Cần Q13.

### D20.4 — Thống kê cộng đồng

**Ý nghĩa:** cung cấp các số liệu cộng đồng, ví dụ số thành viên, bài viết và công thức.

**Việc làm:** xác định từng chỉ số, nguồn service, điều kiện lọc và độ mới; tổng hợp qua API/service sở hữu, tránh đọc chéo database trực tiếp. Có chính sách trả kết quả khi một nguồn lỗi.

**Hoàn thành khi:** số liệu có định nghĩa, đối chiếu được và không đếm nội dung bị loại theo quy tắc. Không tự đưa dữ liệu riêng như nhật ký ăn vào thống kê công khai. Cần Q10.

### D20.3 — Chủ đề xu hướng

**Ý nghĩa:** danh mục/chủ đề được quan tâm trong một khoảng thời gian, không đơn thuần là danh mục có nhiều bài nhất từ trước tới nay.

**Việc làm:** chốt chủ đề là category hay hashtag, tín hiệu tương tác và cửa sổ thời gian; truy vấn/xếp thứ tự, tie-break ổn định; loại nội dung bị ẩn/xóa/cấm.

**Hoàn thành khi:** kết quả có thể giải thích và kiểm thử theo thời gian; không trùng chủ đề; dữ liệu ít vẫn trả kết quả hợp lệ. Cần Q09.

### D20.2 — Bảng xếp hạng

**Ý nghĩa:** xếp hạng tác giả hoặc nội dung theo tiêu chí rõ ràng.

**Việc làm:** chốt đối tượng xếp hạng, công thức điểm, tuần/tháng/toàn thời gian và cách xử lý bằng điểm; dùng dữ liệu hợp lệ, xem xét cách giảm thao túng nếu lấy lượt xem làm tín hiệu. Sort popular/mostViewed hiện có chỉ là nền, chưa phải bảng xếp hạng tác giả hoàn chỉnh.

**Hoàn thành khi:** cùng dữ liệu cho cùng kết quả và thứ tự ổn định; có test về mốc thời gian và nội dung/tài khoản không hợp lệ. Cần Q08.

### D22.2 — Dinh dưỡng video

**Ý nghĩa:** có số liệu dinh dưỡng truy xuất được nguồn cho món xuất hiện trong video.

**Việc làm:** tận dụng extraction hiện tại, bổ sung bước xác định nguyên liệu tương ứng trong catalog, khối lượng/đơn vị, trạng thái nguyên liệu và khẩu phần; chọn liên kết với recipe hoặc lưu snapshot. Xác định ai xác nhận/sửa kết quả và khi nào phải tính lại.

Luồng dự kiến: `video → extraction → chuẩn hóa nguyên liệu/khẩu phần → tính từ catalog/recipe → lưu và trả kết quả`.

**Hoàn thành khi:** có cơ sở tính và đơn vị rõ; thiếu thông tin trả trạng thái chưa đủ dữ liệu, không trả 0 gây hiểu nhầm hoặc yêu cầu AI tự bịa số. API trả được trạng thái đang xử lý/thất bại/chưa có kết quả. Cần Q17.

### D21.1 — Huy hiệu trên profile

**Ý nghĩa:** huy hiệu phải đại diện cho một trạng thái có tiêu chí cụ thể, ví dụ người sáng tạo được xác minh hoặc thành tích.

**Việc làm:** định nghĩa loại huy hiệu, điều kiện cấp/thu hồi, thời hạn và người có quyền; API đọc và API quản lý nếu cần; lưu lịch sử quyết định khi có phê duyệt thủ công.

**Hoàn thành khi:** user không tự nâng quyền/cấp huy hiệu; huy hiệu thay đổi đúng khi mất điều kiện. `emailVerified` hiện có không tự đồng nghĩa với xác minh chuyên gia hoặc creator. Cần Q12.

### D20.5 — Thử thách 7 ngày

**Ý nghĩa:** user tham gia thử thách, hoàn thành từng ngày và xem tiến độ.

**Việc làm:** lưu định nghĩa thử thách, lượt tham gia, check-in/tiến độ theo ngày; API tham gia, xem tiến độ, ghi nhận ngày và rời thử thách nếu cần. Chốt xử lý bỏ lỡ ngày, ghi bù và phần thưởng.

**Hoàn thành khi:** một ngày không được tính hai lần; kiểm tra mốc ngày và quyền sở hữu; không tạo phần thưởng lặp khi gửi lại request. Nếu tự check-in thì có thể làm độc lập; nếu tự xác nhận từ nhật ký thì dùng dữ liệu nhật ký đã có (ăn, nước, vận động) theo loại thử thách. Cần Q11.

## 6. Các điểm cần làm rõ trước khi triển khai phần liên quan

Tất cả câu trả lời trong cột Đề xuất là gợi ý để thảo luận, chưa được xem là đã chốt. Các câu Q01, Q02, Q06, Q07, Q18, Q19 đã được chốt (xem mục 1) nên đã xóa.

| Mã | Task | Câu hỏi cần quyết định | Đề xuất bắt đầu / lưu ý |
|---|---|---|---|
| Q03 | A06 | Trạng thái nào được login, dùng HTTP/mã lỗi nào? Có thực sự cần SUSPENDED ngoài BLOCKED? | Chỉ ACTIVE được phát token; không thêm enum mới khi chưa có ý nghĩa riêng. |
| Q04 | A06 | Khóa tài khoản có phải vô hiệu hóa JWT đang hoạt động ngay không? | Tách rõ chặn login mới và chặn mọi request; yêu cầu thứ hai cần cơ chế đa service. |
| Q05 | A06 | Đợt này có cần API admin khóa/mở khóa tài khoản không? Ai được đổi trạng thái và có cần lý do/lịch sử? | Chốt phạm vi riêng; không tự gộp thành một dòng sửa login. |
| Q08 | D20.2 | Xếp tác giả hay bài viết? Công thức điểm, thời gian, timezone, bằng điểm và chống tăng điểm giả thế nào? | Bắt đầu một bảng xếp hạng với công thức kiểm thử được; không tự chọn trọng số. |
| Q09 | D20.3 | Topic là category hay hashtag? Xu hướng theo vote, view, comment hay bài mới? Tính trong bao lâu? | Tận dụng category trước; chưa tạo hệ hashtag nếu không cần. |
| Q10 | D20.4 | Cần chính xác những chỉ số nào, tính theo điều kiện nào? Cần realtime hay chấp nhận trễ? Khi một service lỗi thì sao? | Chốt danh sách chỉ số và ví dụ response trước khi viết API. |
| Q11 | D20.5 | Thử thách gì, ai tạo, bắt đầu chung hay theo ngày tham gia? Check-in tay hay tự động? Bỏ lỡ ngày/ghi bù/phần thưởng thế nào? | MVP dùng check-in thủ công; chưa xác nhận thay người dùng đã ăn/uống/tập thật. |
| Q12 | D21.1 | Huy hiệu xác minh, thành tích hay gói trả phí? Ai cấp/thu hồi, có hết hạn không? | Tách ý nghĩa khỏi emailVerified và role ADMIN. |
| Q13 | D21.2 | Bộ sưu tập chứa recipe/blog/video/meal plan nào? Riêng tư hay công khai? Một mục được nằm nhiều bộ không? | MVP chỉ một loại nội dung, private, cho nằm nhiều bộ. |
| Q14 | D21.3 | Có cần ghi món nhập tay (ngoài thực đơn đã lưu), theo gram hoặc nhiều đơn vị không? Có cho ghi bù ngày cũ hoặc ngày tương lai không? | Hiện chỉ ghi từ thực đơn; bảng đã chừa nguồn `MANUAL`. Phần ngày xem B02. |
| Q15 | D21.4 | Mục tiêu dinh dưỡng dùng làm mốc so sánh lấy từ nguồn nào? Món thiếu dữ liệu thể hiện ra sao? | Múi giờ đã chốt. Phần còn mở: nguồn mục tiêu và trạng thái ngày chưa có dữ liệu (B01). |
| Q16 | D22.1 | Creator chính là user hay có channel riêng? Cần bio/banner/link ngoài/handle riêng không? Có điều kiện thành creator không? | Dùng user hiện có và danh sách video công khai theo authorId. |
| Q17 | D22.2 | Ai xác nhận lượng/nguyên liệu/khẩu phần? Dùng recipeId hay snapshot độc lập? Cần dinh dưỡng cả món hay mỗi phần? | Liên kết recipe đã chuẩn hóa nếu phù hợp; thiếu dữ liệu không tự đoán. |
| Q20 | Toàn nhóm D | Tính năng nào thuộc MVP đợt này, tính năng nào để sau? Có cần mẫu JSON/OpenAPI cho API mới không? | Chốt phạm vi đợt phát hành; không coi toàn bộ danh sách D là điều kiện bắt buộc trước mọi lần deploy. |

## 7. Thứ tự triển khai đề xuất cho phần còn lại

1. **Sửa lỗi rõ ràng:** B01, B02; xác minh A02.
2. **Auth:** A06 và phần quản lý trạng thái/thu hồi phiên theo quyết định Q03–Q05.
3. **Tài liệu:** I01.
4. **Profile và nội dung:** D22.1, D21.2.
5. **Cộng đồng:** D20.4, D20.3, D20.2 sau khi định nghĩa số liệu.
6. **Tính năng cần thêm quy tắc:** D22.2, D21.1, D20.5 khi câu hỏi liên quan đã được chốt.
7. **Kết thúc đợt local:** Q00, rà lại acceptance criteria và xác định task còn hoãn; gỡ alias `content` (A07) khi đã phối hợp xong.
8. **Sau đó mới Aiven:** DEP01 trên nhánh triển khai riêng.

Các mục 4–6 là các cụm phát triển, không phải yêu cầu làm toàn bộ trước khi được phát hành. Có thể chọn một MVP nhỏ theo Q20.

## 8. Kiểm thử, bàn giao và tiêu chí hoàn tất

### Q00 — Hoàn thiện bản local (phần còn thiếu)

`BACKEND_CHANGES.md` báo 651 test pass (AI 211, Identity 87, Nutrition 50, Recipe 33, Blog 270). Chưa chạy lại trong lượt đối chiếu này. Còn thiếu:

- **Integration test trên MySQL local cho identity và nutrition.** Test của nhật ký và theo dõi hiện chạy trên H2; chỉ blog có integration test trên MySQL local. Hai file SQL thủ công (`20261027_user_follows.sql`, `20261027_diaries.sql`) đã chạy thử trên MySQL local nhưng unique constraint chưa được test bằng ứng dụng trên MySQL.
- **Ba test khởi động context cũ đang bị loại khỏi lần chạy:** `VeggiepalApplicationTests`, `NutritionServiceApplicationTests`, `BlogServiceApplicationTests`. Cần chạy lại được hoặc ghi rõ lý do loại.
- **Khởi động bằng Docker Compose** với MySQL local, URL nội bộ, JWT/internal token đồng nhất, healthcheck và các luồng qua gateway (kể cả route mới `/api/nutrition/me/diary`, `/api/users/{id}/follow`, `/api/blogs/feed/following`). Compose đã bổ sung `AI_SERVICE_URL`, `RECIPE_SERVICE_URL` cho nutrition và `IDENTITY_SERVICE_URL` cho blog nhưng chưa có bằng chứng đã chạy.
- **Test chưa có cho A06** (xem mục 4) và cho các task mới khi làm xong.
- Test quyền: chủ dữ liệu, user khác, admin và người chưa đăng nhập cho các API mới của phần còn lại.
- Nếu thêm migration, kiểm tra trên database local mới và đường nâng cấp từ schema có sẵn. Không chỉnh migration đã được áp dụng hoặc bỏ qua checksum để làm test xanh. Với service dùng Hibernate/data.sql, rà cơ chế khởi tạo trước khi thêm Flyway; chưa tự đổi toàn bộ chiến lược migration.
- Cập nhật tài liệu API/OpenAPI cho phần còn lại, ghi rõ test đã chạy, test chưa chạy và giới hạn còn lại.
- Không đưa credential, log chứa dữ liệu nhạy cảm hoặc artifact build vào commit.

Một task chỉ được đánh dấu hoàn tất khi đã đạt tiêu chí của nó và có bằng chứng kiểm thử phù hợp. Có field trong DTO hoặc API trả 200 chưa đủ để coi là hoàn tất nghiệp vụ.

### DEP01 — Công việc để sau trên nhánh Aiven

- Tạo `chore/aiven-deployment` từ commit local đã được chọn phát hành.
- Đổi Compose đọc endpoint Aiven/SSL và bỏ phụ thuộc bắt buộc vào MySQL local cho chế độ deploy.
- Kiểm tra schema/migration trên database triển khai; chạy hai file SQL thủ công của nhật ký và theo dõi trước khi khởi động code mới. Không chạy test create-drop lên Aiven đang dùng.
- Cấu hình biến môi trường, domain/HTTPS, CORS, callback provider và kiểm tra end-to-end.
- Chỉ quyết định hosting và tiến hành deploy khi có yêu cầu, môi trường và thông tin đích cụ thể.

## 9. Nguồn code đối chiếu

- [Docker Compose](../../VeggiePal_BE/docker-compose.yml).
- [UserService](../../VeggiePal_BE/identity-service/src/main/java/com/veggiepal/service/UserService.java) và [UserStatus](../../VeggiePal_BE/identity-service/src/main/java/com/veggiepal/enums/UserStatus.java).
- [AI PageResponse](../../VeggiePal_BE/ai-service/src/main/java/com/veggiepal/ai/common/PageResponse.java) và [Recipe PageResponse](../../VeggiePal_BE/recipe-service/src/main/java/com/veggiepal/recipe/dto/response/PageResponse.java).
- [MealPlanController](../../VeggiePal_BE/ai-service/src/main/java/com/veggiepal/ai/mealplan/MealPlanController.java).
- [VideoController](../../VeggiePal_BE/blog-service/src/main/java/com/veggiepal/blog/controller/VideoController.java), [VideoProcessingController](../../VeggiePal_BE/ai-service/src/main/java/com/veggiepal/ai/video/VideoProcessingController.java) và [VideoProcessingWorker](../../VeggiePal_BE/ai-service/src/main/java/com/veggiepal/ai/video/VideoProcessingWorker.java).
- [DiaryService](../../VeggiePal_BE/nutrition-service/src/main/java/com/veggiepal/nutrition/diary/DiaryService.java) và [MealPlanSnapshotClient](../../VeggiePal_BE/nutrition-service/src/main/java/com/veggiepal/nutrition/diary/MealPlanSnapshotClient.java).
- [FollowService](../../VeggiePal_BE/identity-service/src/main/java/com/veggiepal/service/FollowService.java) và [PublicUserController](../../VeggiePal_BE/identity-service/src/main/java/com/veggiepal/controller/PublicUserController.java).
- [BACKEND_CHANGES.md](../../VeggiePal_BE/BACKEND_CHANGES.md): mô tả các thay đổi BE đã làm.

Các báo cáo cũ trong docs phản ánh thời điểm viết của chúng. Khi có khác biệt, đối chiếu source trên branch đang làm và cập nhật tài liệu này theo các quyết định mới.

## 10. Task BE phát sinh thêm

Mục này ghi các việc BE cần làm được phát hiện thêm trong lúc phát triển, ngoài các task đã có ở mục 3. Mỗi task viết theo mẫu dưới đây, ID tiếp theo số cuối cùng.

```
### B01 — <tên ngắn của việc>
- **Service:** <identity-service / blog-service / ...>
- **Ngày ghi:** dd/mm/yyyy · **Trạng thái:** Chưa làm
- **Vấn đề hiện tại:** <endpoint, request, response thực tế so với mong đợi; đã kiểm chứng bằng cách nào>
- **BE cần làm:** <việc cụ thể>
- **Hoàn thành khi:** <tiêu chí kiểm tra được>
```

### B01 — Nhật ký: phân biệt ngày chưa có dữ liệu với tổng bằng 0
- **Service:** nutrition-service
- **Ngày ghi:** 27/10/2026 · **Trạng thái:** Chưa làm
- **Vấn đề hiện tại:** `GET /nutrition/me/diary` (`DiaryService.summary`) luôn trả `nutrition` là đối tượng 4 giá trị 0 khi ngày đó chưa có bữa nào xác nhận. Kết quả giống hệt ngày đã xác nhận bữa có tổng 0 kcal, nên người dùng của API không phân biệt được "chưa ghi gì" với "đã ghi, tổng bằng 0". Đã kiểm chứng bằng đọc `DiaryService.summary` (dùng `Nutrition.zero()` làm giá trị khởi đầu) và `DiaryDtos.DailySummary`.
- **BE cần làm:** khi ngày chưa có bữa nào xác nhận, trả tín hiệu rõ ràng (ví dụ `nutrition: null` hoặc thêm cờ `hasMeals`), còn khi đã có bữa thì trả tổng như hiện tại. Chốt cách biểu diễn rồi ghi vào `BACKEND_CHANGES.md`.
- **Hoàn thành khi:** có test: ngày chưa có bữa trả tín hiệu "chưa có dữ liệu"; ngày có bữa trả tổng đúng; tổng nước và vận động của ngày vẫn trả đúng trong cả hai trường hợp.

### B02 — Nhật ký: kiểm tra ngày hợp lệ khi xác nhận bữa ăn, nước và vận động
- **Service:** nutrition-service
- **Ngày ghi:** 27/10/2026 · **Trạng thái:** Chưa làm · **Cần chốt trước:** Q14 (phần ngày)
- **Vấn đề hiện tại:** `DiaryService.date()` nhận bất kỳ ngày nào, không kiểm tra gì. Với bữa ăn, `MealPlanSnapshotClient.fetch` chỉ so **thứ trong tuần** của ngày đó với trường `day` của thực đơn. Hệ quả: (1) có thể xác nhận "đã ăn" cho ngày tương lai; (2) bất kỳ ngày nào cùng thứ đều lấy được bữa của thực đơn, ví dụ một thứ Ba của năm sau hay của tuần trước khi thực đơn được tạo đều trả bữa thứ Ba của thực đơn. Nước và vận động (`saveWater`, `saveActivity`) cũng nhận ngày tương lai. Đã kiểm chứng bằng đọc `DiaryService.date`, `MealPlanSnapshotClient.fetch`; chưa chạy thử.
- **BE cần làm:**
  - Chốt quy tắc: không cho ngày tương lai (đề xuất, tính theo múi giờ Asia/Ho_Chi_Minh); cho ghi bù ngày cũ trong một giới hạn nào đó hay không.
  - Với bữa ăn, chỉ chấp nhận ngày nằm trong tuần của thực đơn (đề xuất: tuần thứ Hai đến Chủ nhật chứa ngày tạo thực đơn, `createdAt`). Ngoài tuần đó trả lỗi 404 / 2014 hoặc một mã lỗi riêng.
  - Áp quy tắc ngày tương lai cho nước và vận động.
- **Hoàn thành khi:** ngày tương lai bị từ chối với 400 và mã lỗi rõ; ngày cùng thứ nhưng ngoài tuần của thực đơn không lấy được bữa; ngày hợp lệ vẫn xác nhận được; request lặp vẫn idempotent; test có mốc qua nửa đêm giờ Việt Nam.
