/**
 * Dữ liệu mock cho trang chatbot — dùng tạm khi chưa có API thật.
 * Cấu trúc session/message được đặt tên giống REST resource tương lai
 * (id, sessionId, role, content, createdAt) để sau này thay bằng API
 * thật (@/features/chatbot/api/chatbotApi.js) không phải đổi UI.
 */

export const FALLBACK_NOTICE =
  "Ghi chú: Đây là câu trả lời dự phòng do hệ thống AI trực tiếp đang quá tải hoặc gián đoạn kết nối.";

// Mặc định chỉ 1 đoạn chat trống — khi có API thật, danh sách này sẽ được
// thay bằng GET /chatbot/sessions.
export const MOCK_SESSIONS = [
  {
    id: "session-1",
    title: "Cuộc trò chuyện dinh dưỡng",
    updatedAt: new Date().toISOString(),
  },
];

export const MOCK_MESSAGES_BY_SESSION = {
  "session-1": [],
};

/** Gợi ý câu hỏi mở đầu hiển thị khi một đoạn chat chưa có tin nhắn nào. */
export const SUGGESTED_PROMPTS = [
  {
    id: "protein-plan",
    icon: "sprout",
    category: "Đạm thực vật",
    title: "Thực đơn thể thao giàu đạm",
    description:
      "Gợi ý thực đơn chay giàu protein cho người tập gym trong 1 ngày, cần đạt khoảng 70g đạm từ đậu, đậu phụ và các loại hạt.",
  },
  {
    id: "pho-broth",
    icon: "soup",
    category: "Món ngon thuần Việt",
    title: "Nước dùng phở nấm thanh ngọt",
    description:
      "Hướng dẫn cách nấu nước dùng phở nấm chay thanh ngọt tự nhiên chuẩn vị Bắc không dùng bột ngọt hay hạt nêm công nghiệp.",
  },
  {
    id: "micronutrients",
    icon: "pill",
    category: "Vi chất & sức khỏe",
    title: "Bổ sung B12, Sắt & Kẽm",
    description:
      "Người mới chuyển sang ăn chay cần lưu ý bổ sung Vitamin B12, Sắt và Kẽm từ những nguồn thực phẩm nào?",
  },
  {
    id: "calo-balance",
    icon: "scale",
    category: "Cân bằng calo",
    title: "Bữa trưa thuần chay 500 kcal",
    description:
      "Tính toán định lượng và calo cho một bữa trưa văn phòng thuần chay đủ no, cân đối khoảng 500 kcal.",
  },
];
