/**
 * Mock data dùng để kiểm thử giao diện và chức năng Admin Kiểm duyệt nội dung (AI Moderation).
 * Bao gồm đầy đủ các loại nội dung: BLOG, VIDEO, COMMENT với các vi phạm khác nhau.
 */
export const MOCK_MODERATION_CASES = [
  {
    caseId: 101,
    contentType: "BLOG",
    externalContentId: 42,
    authorId: 15,
    decision: "REVIEW_REQUIRED",
    categories: ["spam", "misinformation_dangerous"],
    reason: "Bài viết chứa liên kết lạ và quảng cáo thực phẩm chức năng giảm cân cấp tốc không rõ nguồn gốc kiểm định y tế.",
    confidence: 0.78,
    createdAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(), // 2 giờ trước
    authorName: "Trần Văn Nam",
    contentTitle: "Phương pháp nhịn ăn 21 ngày thải độc kết hợp thuốc thanh lọc",
    contentSnippet: "Chia sẻ phương pháp nhịn ăn 21 ngày chỉ uống nước kèm thuốc thảo dược gia truyền... Đặt mua thuốc liên hệ Zalo 0987xxx để nhận ưu đãi hôm nay!",
  },
  {
    caseId: 102,
    contentType: "COMMENT",
    externalContentId: 580,
    authorId: 28,
    decision: "REVIEW_REQUIRED",
    categories: ["harassment", "hate"],
    reason: "Bình luận chứa ngôn từ thù địch, xúc phạm danh dự người chia sẻ công thức và kích động tranh cãi độc hại.",
    confidence: 0.82,
    createdAt: new Date(Date.now() - 3600 * 1000 * 5).toISOString(), // 5 giờ trước
    authorName: "Thành Đạt",
    contentTitle: "Bình luận trong bài viết 'Canh rong biển đậu hũ non'",
    contentSnippet: "Nấu ăn dở tệ thế này mà cũng bày đặt đăng bài, lừa đảo cộng đồng ăn chay... lũ ăn chay giả tạo cút khỏi nền tảng đi!",
  },
  {
    caseId: 103,
    contentType: "VIDEO",
    externalContentId: 19,
    authorId: 8,
    decision: "REVIEW_REQUIRED",
    categories: ["violence"],
    reason: "AI nhận diện khung hình video có yếu tố phản cảm, hành vi ngược đãi vật nuôi trước khi chế biến món ăn.",
    confidence: 0.74,
    createdAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString(), // 12 giờ trước
    authorName: "Bếp Chay Hoang Dã",
    contentTitle: "Cách bắt và sơ chế nguyên liệu sống ngoài tự nhiên",
    contentSnippet: "Video dài 08:30 hướng dẫn các cảnh quay bắt nhốt và sơ chế động vật hoang dã gây phản cảm cho cộng đồng.",
  },
  {
    caseId: 104,
    contentType: "BLOG",
    externalContentId: 87,
    authorId: 44,
    decision: "REVIEW_REQUIRED",
    categories: ["illegal", "spam"],
    reason: "Nội dung dẫn link mua bán các chất kích thích bị cấm dưới danh nghĩa thảo mộc tự nhiên.",
    confidence: 0.81,
    createdAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(), // 1 ngày trước
    authorName: "Cỏ May Mắn",
    contentTitle: "Thảo mộc thư giãn tự nhiên nhập khẩu trực tiếp",
    contentSnippet: "Cung cấp các loại nấm thần kinh và thảo mộc thư giãn kích thích não bộ... Cam kết giao kín đáo, quét mã QR tham gia nhóm Telegram kín...",
  },
  {
    caseId: 105,
    contentType: "COMMENT",
    externalContentId: 1024,
    authorId: 63,
    decision: "REVIEW_REQUIRED",
    categories: ["spam"],
    reason: "Tần suất đăng lặp lại cùng một đoạn tin quảng cáo cờ bạc trực tuyến qua nhiều bài viết khác nhau.",
    confidence: 0.84,
    createdAt: new Date(Date.now() - 3600 * 1000 * 36).toISOString(), // 1.5 ngày trước
    authorName: "Bot TaiXiu",
    contentTitle: "Bình luận trên Video 'Smoothie cải xoăn chuối hạt chia'",
    contentSnippet: "Cổng game đổi thưởng uy tín số 1 Việt Nam, nạp 1 tặng 1 nhận ngay 500k trải nghiệm tại nhacaiuytin888.com!!",
  },
];
