# VeggiePal — Task backend

## 1. Giải thích chi tiết các việc còn lại

### A02 — Xác minh nutrition-target gọi được identity

**Hiện trạng:** Compose đã có URL identity và dependency cần thiết (`IDENTITY_SERVICE_URL` ở ai-service). Chưa có bằng chứng đã chạy thật.

**Việc làm:** khởi động Docker local, kiểm tra network nội bộ, JWT đồng nhất và luồng đọc `/users/me`; gọi nutrition-target với user có và thiếu thông tin. Phân biệt thiếu thông tin người dùng với identity không truy cập được.

**Hoàn thành khi:** profile đủ thông tin trả kết quả; thiếu profile trả lỗi nghiệp vụ (6020/6021); downstream mất kết nối trả lỗi dịch vụ phù hợp. Không coi cấu hình đã có là bằng chứng runtime đã hoạt động.

### A07 — Gỡ mảng `content` tạm

Recipe và AI hiện trả cả `items` lẫn `content` (cùng nội dung) để các client cũ không vỡ. Khi mọi client đã chuyển sang `items`, bỏ `content` và getter alias, cập nhật test serialization tương ứng. Việc này cần phối hợp phát hành, không có ngày tự động.

**Tình trạng phía FE (28/10/2026):** FE đã đọc `items` ở blog, meal-planner, recipe, nguyên liệu và trang chủ. Danh sách bóc tách video (`useVideoJobs`) cũng đã chuyển sang `items`. Hiện không còn nơi nào ở FE đọc `content` hay `first` / `last`, nên BE có thể gỡ alias của cả recipe-service và ai-service khi phối hợp phát hành (cần chốt với các client khác nếu có).

### I01 — Mô tả endpoint cho API sẵn có

`BACKEND_CHANGES.md` đã có bảng endpoint, body và mã lỗi cho API nhật ký và theo dõi mới. Còn thiếu bảng tương tự (đường dẫn, auth, request/response, mã lỗi) cho các API sẵn có:

- `/ai/videos/process-existing` và `/ai/videos/by-video/{videoId}`.

Đã có trong `docs/AI_SERVICE_DOCUMENTATION.md` (kiểm tra 29/10/2026): `/ai/meal-plans/nutrition-target`, các API yêu thích thực đơn và `/ai/videos/process`.

Các đường dẫn trên là mapping trực tiếp tại service; khi gọi qua gateway phải đối chiếu prefix routing hiện tại.

**Hoàn thành khi:** có tài liệu cho nhóm API trên và khớp với source.

### B01 — Nhật ký: phân biệt ngày chưa có dữ liệu với tổng bằng 0

**Service:** nutrition-service · ghi 27/10/2026.

**Hiện trạng:** `GET /nutrition/me/diary` (`DiaryService.summary`) luôn trả `nutrition` là đối tượng 4 giá trị 0 khi ngày đó chưa có bữa nào được xác nhận. Kết quả giống hệt ngày đã xác nhận bữa có tổng 0 kcal, nên không phân biệt được "chưa ghi gì" với "đã ghi, tổng bằng 0".

**Việc làm:** khi ngày chưa có bữa nào xác nhận, trả tín hiệu rõ ràng (ví dụ `nutrition: null` hoặc thêm cờ `hasMeals`); khi đã có bữa thì trả tổng như hiện tại. Chốt cách biểu diễn rồi ghi vào `BACKEND_CHANGES.md`.

**Hoàn thành khi:** có test: ngày chưa có bữa trả tín hiệu "chưa có dữ liệu"; ngày có bữa trả tổng đúng; tổng nước và vận động của ngày vẫn đúng trong cả hai trường hợp.

### B02 — Nhật ký: kiểm tra ngày hợp lệ khi xác nhận bữa ăn, nước và vận động

**Service:** nutrition-service · ghi 27/10/2026 · cần chốt trước Q14 (phần ngày).

**Hiện trạng:** `DiaryService.date()` nhận bất kỳ ngày nào. Với bữa ăn, `MealPlanSnapshotClient.fetch` chỉ so **thứ trong tuần** của ngày đó với trường `day` của thực đơn. Hệ quả: (1) xác nhận "đã ăn" được cho ngày tương lai; (2) mọi ngày cùng thứ đều lấy được bữa của thực đơn, ví dụ một thứ Ba của năm sau hay của tuần trước khi thực đơn được tạo; (3) nước và vận động (`saveWater`, `saveActivity`) cũng nhận ngày tương lai.

**Việc làm:**

- Không cho ngày tương lai (tính theo múi giờ Asia/Ho_Chi_Minh); chốt có cho ghi bù ngày cũ trong giới hạn nào không.
- Với bữa ăn, chỉ chấp nhận ngày nằm trong tuần của thực đơn (đề xuất: tuần thứ Hai đến Chủ nhật chứa `createdAt` của thực đơn). Ngoài tuần đó trả 404 / 2014 hoặc mã lỗi riêng.
- Áp quy tắc ngày tương lai cho nước và vận động.

**Hoàn thành khi:** ngày tương lai bị từ chối với 400 và mã lỗi rõ; ngày cùng thứ nhưng ngoài tuần của thực đơn không lấy được bữa; ngày hợp lệ vẫn xác nhận được; request lặp vẫn idempotent; test có mốc qua nửa đêm giờ Việt Nam.

### B03 — Tài khoản `PENDING` đăng nhập và đăng bài được nhưng tên bị ẩn khỏi mọi nơi công khai

**Service:** identity-service · ghi 28/10/2026.

**Hiện trạng:** `GET /users/batch` (`PublicUserService.getPublicUsers`) chỉ trả tài khoản `ACTIVE`; `FollowService` coi tài khoản không `ACTIVE` là không tồn tại (`1007`). Trong DB local (28/10/2026) có ba tài khoản `PENDING` (id 1, 2, 3) và hai `ACTIVE` (id 4, 5). Các tài khoản `PENDING` vẫn đăng nhập được (lúc ghi, đăng nhập chưa kiểm `status`; BE đã sửa ngày 28/10, xem cập nhật bên dưới) và đã đăng bài `PUBLISHED`. Kết quả: bài của họ hiện tên dự phòng "Người dùng VeggiePal" kèm ảnh "NV" ở feed và trang chi tiết; người khác bấm "Theo dõi" nhận `1007`; số người theo dõi và feed theo dõi bỏ qua họ. Chưa kiểm chứng trên DB triển khai.

**Nguồn gốc:** `UserService.register` hiện đặt `ACTIVE` ngay (`emailVerified=false`), nên các dòng `PENDING` là dữ liệu cũ. Chỉ `linkGoogleAccount` mới chuyển `PENDING` sang `ACTIVE`.

**Cập nhật 28/10/2026:** từ `caddafe`, đăng ký tạo tài khoản `PENDING` rồi chỉ `ACTIVE` sau khi nhập mã OTP (`POST /auth/verify-email`), và `PENDING` không đăng nhập được (`1023`), nên tài khoản mới không còn rơi vào tình trạng đăng bài được mà tên bị ẩn. Dữ liệu `PENDING` cũ trong DB vẫn còn: chủ tài khoản kích hoạt bằng `resend-verification` hoặc quên mật khẩu; seed id 1–3 là `ACTIVE`. Còn lại là dọn dữ liệu cũ nếu cần; bài đã đăng của các tài khoản đó vẫn hiện tên dự phòng cho tới khi họ kích hoạt.

**Việc làm:** chốt một quy tắc rồi áp dụng nhất quán cho đăng nhập, `/users/batch`, theo dõi và đăng bài: (1) chặn đăng nhập (đã làm 28/10) và đăng nội dung của `PENDING`, hoặc (2) coi `PENDING` như `ACTIVE` khi hiển thị công khai. Đồng thời migrate dữ liệu cũ (ví dụ `UPDATE users SET status = 'ACTIVE' WHERE status = 'PENDING'` nếu bỏ trạng thái này) và ghi vào `BACKEND_CHANGES.md`.

**Hoàn thành khi:** tài khoản đăng bài được thì tên và avatar hiện ở feed, chi tiết bài và bình luận, và theo dõi được; không còn tài khoản đăng nhập được mà bị ẩn khỏi API công khai; có test cho từng trạng thái.

### B04 — Danh sách bài viết thiếu `aiReviewInProgress` và `moderationReason`

**Service:** blog-service · ghi 28/10/2026.

**Hiện trạng:** kiểm duyệt blog giờ chạy nền. Chỉ `BlogResponse` (chi tiết, đăng, sửa, gửi duyệt) có `aiReviewInProgress` và `moderationReason`. `GET /blogs/me` và các danh sách trả `BlogSummaryResponse`, chỉ có `status`. Hai bài `PENDING` trong "Bài viết của tôi" có thể đang chờ AI hoặc đang chờ admin, và bài `REJECTED` không có lý do; client không phân biệt được nếu không gọi chi tiết từng bài.

**Việc làm:** thêm `aiReviewInProgress` và `moderationReason` vào `BlogSummaryResponse`, chỉ điền cho `GET /blogs/me` (chủ bài). Các danh sách công khai không cần và không nên trả `moderationReason`. Ghi vào `BACKEND_CHANGES.md`.

**Hoàn thành khi:** `GET /blogs/me` trả đúng hai field cho bài `PENDING` (đang chờ AI: `true`, chờ admin: `false`) và bài `REJECTED` có lý do; feed công khai không lộ `moderationReason`; có test.

### B05 — Thiếu API lịch sử kiểm duyệt (ca đã xử lý)

**Service:** ai-service · ghi 28/10/2026.

**Hiện trạng:** `GET /ai/admin/moderation` (`ModerationService.pending()`) chỉ trả các ca có `decision = REVIEW_REQUIRED` chưa xử lý. Ca AI đã `APPROVED` hoặc `REJECTED` thẳng, và ca admin đã duyệt, từ chối hoặc bỏ qua (`DISMISSED`) đều không có endpoint nào để đọc lại, dù bảng `ai_moderation_cases` vẫn lưu đủ nội dung, quyết định, lý do, độ tin cậy, `reviewed_by`, `reviewed_at`. Hệ quả: admin không xem được AI đã duyệt hay từ chối bài nào và vì sao. `GET /ai/admin/monitoring/logs/search` chỉ ghi lần gọi AI (token, độ trễ, trạng thái), không có quyết định và nội dung.

**Việc làm:** thêm endpoint chỉ dành cho ADMIN, ví dụ `GET /ai/admin/moderation/history`, trả `PageResponse<ModerationResponse>` (`items`, `page`, `size`, `totalElements`, `totalPages`, theo quy ước phân trang chung), sắp xếp mới nhất trước (`createdAt` giảm dần, tie-break theo `id`). Tham số lọc tùy chọn: `decision` (APPROVED / REJECTED / REVIEW_REQUIRED / DISMISSED), `contentType` (BLOG / VIDEO / COMMENT), `authorId`, `from`, `to`. Không trả ca đang chờ (đã có ở hàng đợi) trừ khi lọc `decision=REVIEW_REQUIRED` rõ ràng. Cân nhắc có trả `content` đầy đủ hay cắt ngắn trong danh sách. Ghi vào `BACKEND_CHANGES.md`.

**Hoàn thành khi:** gọi không phải ADMIN trả 403; lọc theo `decision` và `contentType` đúng; ca admin đã xử lý có `reviewedBy` / `reviewedAt`; phân trang đúng shape chung và chặn `size` tối đa 100; có test, gồm trường hợp bảng rỗng.

### B06 — Giám sát AI: không loại trừ được một tác vụ khỏi danh sách và tổng quan

**Service:** ai-service · ghi 28/10/2026.

**Hiện trạng:** `GET /ai/admin/monitoring/logs/search` nhận `feature` và so bằng đúng một giá trị (`MonitoringService.search`: `feature = ?`), nên không thể lấy "mọi tác vụ trừ kiểm duyệt". `GET /ai/admin/monitoring/summary` cộng toàn bộ usage log (`UsageLogRepository.aggregateSince`) và không tách theo tác vụ. Kiểm duyệt nền của blog giờ ghi usage log cho mọi bài đăng, sửa và lần thử lại (principal `service:moderation`, `userId` là tác giả), nên số liệu tổng quan và danh sách bị lẫn dữ liệu kiểm duyệt, trong khi kiểm duyệt thuộc về luồng duyệt nội dung chứ không phải theo dõi tính năng AI của người dùng.

**Việc làm:** (1) thêm tham số loại trừ cho `/logs/search`, ví dụ `excludeFeature` (một hoặc nhiều giá trị), áp dụng trong cùng truy vấn phân trang để `totalElements` và `totalPages` vẫn đúng. (2) Cho `/summary` nhận tham số `feature` hoặc `excludeFeature`, hoặc trả thêm bảng tách theo từng `feature` (số yêu cầu, token, lỗi, độ trễ trung bình). Chốt cách biểu diễn rồi ghi vào `BACKEND_CHANGES.md`. Giá trị `feature` phải trùng với giá trị đang ghi trong `usage_logs` (ví dụ `MODERATION`).

**Hoàn thành khi:** `logs/search?excludeFeature=MODERATION` không trả dòng kiểm duyệt nào và phân trang vẫn đúng; `/summary` tách hoặc loại được kiểm duyệt; không đổi hành vi khi không truyền tham số mới; có test.

## 2. Giải thích chi tiết các tính năng mới còn lại

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

## 3. Các điểm cần làm rõ trước khi triển khai phần liên quan

Tất cả câu trả lời trong cột Đề xuất là gợi ý để thảo luận, chưa được xem là đã chốt. Các câu Q01, Q02, Q06, Q07, Q18, Q19 đã được chốt nên đã xóa khỏi bảng.

| Mã | Task | Câu hỏi cần quyết định | Đề xuất bắt đầu / lưu ý |
|---|---|---|---|
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

## 10. Task BE phát sinh thêm

Các task dưới đây ghi ngày 29/10/2026, sau khi đọc source BE ở các commit `f450216` (recipe), `3d1c450` (thực đơn AI), `baa2322` (tìm quán). Mọi mục đều đã đối chiếu với source, trừ B14 được ghi rõ là chưa đo.

**Cập nhật 30/10/2026:** đọc lại commit `fd2d1e1` thấy BE đã sửa B07 (mã mới 6027 / 6028), B08, B09 (khôi phục cả `name`, `goal`, `goalType`), B10, B11, B12, B13 (mã mới 4119) và có test đo truy vấn cho B14; `23d0651` sửa B02 (mã 2016 / 2017, thực đơn có `createdOn`). FE đã theo các thay đổi ở mã lỗi, form sửa công thức và `planDayDate`.

### B07 — Thực đơn AI: lỗi khi đọc lại công thức bị trả sai mã `6002` ("không tìm thấy thực đơn")

**Service:** ai-service · ghi 29/10/2026 · mức: trung bình.

**Hiện trạng:** `MealPlanService.fetchAndValidateRecipe` (dùng cho `manualEdit` và `restoreVersion`) gọi `GET /recipes/{id}` của recipe-service rồi bọc `catch (Exception)` và luôn ném `RESOURCE_NOT_FOUND` (mã `6002`, HTTP 404). Hàm `get(...)` bên dưới đã đổi mọi lỗi (kể cả 404 và mất kết nối) thành `DOWNSTREAM_UNAVAILABLE`, rồi `catch` này nuốt tiếp. Kết quả: (1) recipe-service đang sập hoặc timeout cũng trả `6002` thay vì `6006` / 503; (2) công thức bị ẩn (`HIDDEN`) làm khôi phục phiên bản cũ thất bại với `6002`, trùng mã với "thực đơn không tồn tại" nên client không phân biệt được hai tình huống; (3) message có ID công thức nhưng client dịch lỗi theo `code`, nên người dùng chỉ thấy "không tìm thấy thực đơn" trong khi thực đơn vẫn còn. Cùng hàm còn ném `INVALID_REQUEST` (`6000`, message "Công thức không thể tính toán giá trị dinh dưỡng") khi một món cũ không tính được dinh dưỡng nữa, cũng là mã chung chung.

**BE cần làm:**
- Chỉ coi là "công thức không còn dùng được" khi recipe-service trả 404 thật; lỗi mạng, timeout, 5xx thì trả `DOWNSTREAM_UNAVAILABLE` (`6006`, 503) và không đổi thành 404.
- Thêm mã riêng (ví dụ `6027 RECIPE_UNAVAILABLE`, HTTP 409 hoặc 422) cho "món trong thực đơn không còn khả dụng", và mã riêng (ví dụ `6028`) cho "món không tính được dinh dưỡng". Message nêu ID và tên món để người dùng biết bản nào cần sửa.
- Áp dụng nhất quán cho cả `restoreVersion` và `manualEdit` (REPLACE / ADD / UPDATE_SERVING). Ghi mã mới vào `BACKEND_CHANGES.md` và `docs/AI_SERVICE_DOCUMENTATION.md`; kiểm tra các mã mới không trùng mã nào đang có (đã có test kiểm tra trùng mã).

**Hoàn thành khi:** có test: recipe-service trả 404 → mã mới (không phải `6002`); recipe-service lỗi 500 hoặc timeout → `6006` / 503; thực đơn không tồn tại vẫn là `6002`; khôi phục một phiên bản chứa món bị ẩn trả mã mới và không thay đổi thực đơn.

### B08 — Hạn mức AI tính theo múi giờ của máy chủ, không phải `Asia/Ho_Chi_Minh`

**Service:** ai-service · ghi 29/10/2026 · mức: trung bình.

**Hiện trạng:** `QuotaService` và `PremiumQuotaService` lấy kỳ hạn mức bằng `LocalDate.now()` (không truyền múi giờ). `GET /ai/meal-plans/usage` trả `periodStart` / `resetsOn` cũng từ `LocalDate.now()`. Không thấy cấu hình `TZ` hay `user.timezone` trong `docker-compose.yml`, `application.properties` và Dockerfile của ai-service, nên trong container mặc định (thường là UTC) hạn mức ngày (chat) và tháng (thực đơn, video) đổi kỳ lúc 07:00 giờ Việt Nam thay vì 00:00. Hệ quả: người dùng ở Việt Nam thấy ngày "làm mới" lệch so với lịch của họ; từ 00:00 đến 07:00 ngày 1 hàng tháng họ vẫn bị tính vào tháng cũ. Nhật ký ăn uống của nutrition-service đã chốt dùng `Asia/Ho_Chi_Minh` (`BACKEND_CHANGES.md`), nên hai nơi đang không thống nhất. Chưa kiểm chứng múi giờ thực của container khi chạy; đây là suy ra từ source và cấu hình.

**BE cần làm:** chốt một quy tắc cho hạn mức (đề xuất `Asia/Ho_Chi_Minh`, giống nhật ký) và áp dụng mọi chỗ tính kỳ hạn mức của ai-service qua một nơi duy nhất (ví dụ một `Clock` hoặc hằng `ZoneId`), gồm `QuotaService` (chat, token, thực đơn, video, hoàn lượt) và `PremiumQuotaService.mealPlanUsage`. Ghi quy tắc vào `BACKEND_CHANGES.md`. Các dòng `daily_quota` đã lưu theo `usage_date` cũ có thể lệch nhẹ ở ranh giới kỳ, chấp nhận được.

**Hoàn thành khi:** có test với đồng hồ giả: 23:30 UTC ngày cuối tháng (đã là 06:30 ngày 1 ở Việt Nam) thuộc kỳ tháng mới, `resetsOn` đúng; không còn `LocalDate.now()` không múi giờ trong `ai/quota`.

### B09 — Khôi phục phiên bản thực đơn không khôi phục `goal`, `goalType` và `name`

**Service:** ai-service · ghi 29/10/2026 · mức: thấp, cần chốt hành vi.

**Hiện trạng:** `MealPlanService.restoreVersion` chỉ gọi `bumpVersion(restored.getPlanJson())`: nội dung 7 ngày và `constraints.dailyNutritionTarget` nằm trong JSON nên được trả về đúng bản cũ, nhưng các cột của thực đơn (`name`, `goal`, `goal_type`) giữ giá trị hiện tại. `MealPlanVersion` có lưu `name` và `goal` của bản cũ, nhưng không có `goalType`. Hệ quả: sau khi khôi phục, mục tiêu hiển thị (`goal` / `goalType`) và mục tiêu thật trong JSON có thể khác nhau; lần `update-from-health` tiếp theo tính lại theo `goalType` hiện tại chứ không phải của bản vừa khôi phục.

**BE cần làm:** chốt một trong hai và ghi vào `BACKEND_CHANGES.md`: (1) khôi phục cả `name`, `goal` và `goalType` cùng JSON (cần thêm `goalType` vào `MealPlanVersion`, bản cũ chưa có thì để nguyên giá trị hiện tại), hoặc (2) giữ như hiện tại nhưng ghi rõ trong tài liệu API rằng khôi phục chỉ khôi phục nội dung và mục tiêu dinh dưỡng trong JSON, đồng thời đảm bảo `goalType` luôn khớp `constraints.dailyNutritionTarget`.

**Hoàn thành khi:** có test: sau khi khôi phục, `goal` / `goalType` và mục tiêu trong JSON nhất quán theo phương án đã chốt.

### B10 — Tìm quán theo tên: ký tự `%` và `_` bị hiểu là ký tự đại diện

**Service:** location-service · ghi 29/10/2026 · mức: thấp.

**Hiện trạng:** `RestaurantRepository.searchByName` dùng `r.name like concat('%', :q, '%')` và `like concat(:q, '%')` mà không escape. `q` là `%%` hoặc `__` (đủ 2 ký tự nên qua kiểm tra độ dài) khớp mọi quán; `q=p_o` khớp "pho", "pao"... Chỉ ảnh hưởng độ chính xác của kết quả (không phải lỗ hổng vì tham số được bind), nhưng "tìm theo tên" không còn đúng nghĩa.

**BE cần làm:** escape `%`, `_` và ký tự escape trong `q` trước khi ghép vào `LIKE` (kèm `ESCAPE`), cho cả điều kiện lọc và điều kiện `starts-with` dùng để xếp hạng. Ngoài ra cần chốt có mở rộng tìm cả `address` hay không (hiện chỉ tìm tên theo task sheet US7; trước đây giao diện lọc cả tên lẫn địa chỉ nên người dùng gõ tên đường không còn ra kết quả).

**Hoàn thành khi:** có test (cả `LocationServiceIntegrationTests`): `q=%%` và `q=__` không trả tất cả quán; `q` chứa dấu `%` hoặc `_` thật chỉ khớp quán có đúng ký tự đó; kết quả tìm bình thường (ví dụ "pho" ra "Phở") không đổi.

### B11 — Công thức yêu thích: `favorites/ids` và `favorites` không nhất quán

**Service:** recipe-service · ghi 29/10/2026 · mức: thấp.

**Hiện trạng:** `GET /recipes/favorites` (`findFavoriteRecipes`) chỉ trả công thức `PUBLISHED`, nhưng `GET /recipes/favorites/ids` (`findRecipeIdsByUserId`) trả id của mọi công thức đã lưu, kể cả công thức sau đó bị ẩn hoặc xóa (`ARCHIVED`). Số lượng id không bằng `totalElements` của danh sách; công thức đã ẩn vẫn tính là "đã lưu" ở nơi dùng `ids`.

**BE cần làm:** chốt rằng `ids` cũng chỉ gồm công thức `PUBLISHED` (khuyến nghị, cùng quy tắc với danh sách) hoặc ghi rõ khác biệt trong tài liệu. Bỏ lưu một công thức đã ẩn vẫn phải làm được như hiện tại.

**Hoàn thành khi:** có test: ẩn một công thức đã được lưu thì `ids` và `favorites` cùng không còn nó; `totalElements` bằng số phần tử của `ids`.

### B12 — Lưu công thức: hai request đầu tiên đồng thời có thể trả 500

**Service:** recipe-service · ghi 29/10/2026 · mức: thấp.

**Hiện trạng:** chính `RecipeFavoriteService` đã ghi chú: hai yêu cầu "lưu" đầu tiên của cùng một người cho cùng một công thức chạy đồng thời đều thấy chưa có dòng, thắng một, thua một và người thua nhận 500 do vi phạm `uk_recipe_favorites_user_recipe` (dữ liệu vẫn đúng). Tài liệu API nói lưu là idempotent (gọi lặp không lỗi), nên 500 này trái cam kết. Có thể gặp khi bấm từ hai tab hoặc hai thiết bị.

**BE cần làm:** bắt `DataIntegrityViolationException` ở nhánh thêm và trả lại bản ghi đã có (`favorited=true`, `favoriteCount` đúng, không cộng đôi). Lưu ý bộ đếm `favorite_count` chỉ được cộng một lần.

**Hoàn thành khi:** có test đồng thời (nhiều luồng cùng thêm một cặp người dùng + công thức): mọi request trả 200, `favoriteCount` tăng đúng 1.

### B13 — Sửa công thức làm mất hoặc bỏ rơi ảnh đã tải lên

**Service:** recipe-service · ghi 29/10/2026 · mức: thấp.

**Hiện trạng:** `RecipeService.update` luôn gán `recipe.setImageUrl(trimToNull(request.getImageUrl()))`. (1) Client gọi `PUT /recipes/{id}` mà không gửi `imageUrl` thì ảnh đã tải lên bị xóa khỏi công thức (đặt null), trong khi tệp trên Cloudinary vẫn còn. (2) Đổi `imageUrl` sang một link dán tay không xóa ảnh Cloudinary cũ (chỉ `RecipeImageService.uploadImage` dọn ảnh cũ). Cả hai để lại tệp mồ côi trên Cloudinary.

**BE cần làm:** chốt quy tắc `imageUrl` khi cập nhật: hoặc coi `imageUrl` vắng mặt là "giữ nguyên" (và dùng giá trị rõ ràng để xóa ảnh), hoặc giữ như hiện tại nhưng khi `imageUrl` đổi thì gọi `FileStorageService.delete` cho ảnh Cloudinary cũ (hàm này đã bỏ qua link ngoài Cloudinary). Ghi quy tắc vào `BACKEND_CHANGES.md`.

**Hoàn thành khi:** có test: `PUT` đổi từ ảnh Cloudinary sang link khác xóa tệp cũ đúng một lần; `PUT` không gửi `imageUrl` hành xử đúng theo quy tắc đã chốt; link ngoài Cloudinary không bị xóa.

### B14 — Danh sách công thức có thể phát sinh nhiều truy vấn (chưa đo)

**Service:** recipe-service · ghi 29/10/2026 · mức: thấp, **chưa kiểm chứng bằng đo thực tế**.

**Hiện trạng:** `spring.jpa.open-in-view=false` và các quan hệ `ingredients`, `steps`, `RecipeIngredient.ingredient` đều lazy, không thấy `@EntityGraph`, `fetch join` hay `default_batch_fetch_size`. Mọi danh sách (`GET /recipes`, `/recipes/me`, `/recipes/favorites`) map từng công thức qua `RecipeMapper.toRecipeResponse`, nay còn gọi `RecipeNutrition.perServing` chạm vào từng nguyên liệu. Với trang 100 công thức có thể sinh hàng trăm truy vấn nhỏ (N+1). Chưa bật log SQL để đếm nên chưa biết ảnh hưởng thật.

**BE cần làm:** bật log thống kê Hibernate cho `GET /recipes?size=100` và `GET /recipes/favorites?size=100`, đếm số truy vấn; nếu tăng theo số công thức thì thêm `@EntityGraph` hoặc `hibernate.default_batch_fetch_size`.

**Hoàn thành khi:** có số truy vấn đo được cho hai endpoint trên; nếu đã tối ưu thì số truy vấn không tăng tuyến tính theo kích thước trang và có test đếm truy vấn.

### B15 — Công thức: không còn cách gỡ ảnh đã có

**Service:** recipe-service · ghi 30/10/2026 · mức: thấp, cần chốt hành vi.

**Hiện trạng:** từ `fd2d1e1`, `PUT /recipes/{id}` coi `imageUrl` bỏ trống, null hoặc blank là "giữ ảnh hiện tại" (`RecipeService.update`), còn link khác ảnh hiện tại trả `4119`. Ảnh chỉ đổi được bằng `POST /recipes/{id}/image`, và không có endpoint nào để xóa ảnh. Chủ công thức đã có ảnh thì không thể bỏ ảnh đi.

**BE cần làm:** chốt có cần gỡ ảnh không; nếu cần thì thêm `DELETE /recipes/{id}/image` (chủ hoặc ADMIN, xóa tệp Cloudinary của chính công thức đó sau commit, gọi lặp không lỗi), hoặc một giá trị rõ ràng trong `PUT` để xóa ảnh.

**Hoàn thành khi:** có test: gỡ ảnh đặt `imageUrl` về null và xóa tệp Cloudinary đúng một lần; gọi lặp vẫn thành công; người khác gọi bị từ chối.
