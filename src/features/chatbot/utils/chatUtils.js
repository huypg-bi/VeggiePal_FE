import { FALLBACK_NOTICE } from "../data/mockChatData.js";

/** Regex nhận diện các từ khoá người dùng gõ để chủ động xem trạng thái
 * dự phòng (fallback) trên UI khi chưa có API thật. */
const FALLBACK_TRIGGER = /(fallback|qua ?tai|quá tải|loi he thong|lỗi hệ thống)/i;

const REPLY_RULES = [
  {
    keywords: ["phở", "pho", "nước dùng", "nuoc dung"],
    content:
      "Với nước dùng chay thanh ngọt tự nhiên, bạn có thể ninh xương rau củ từ củ cải trắng, bắp cải, hành tây nướng và nấm hương khô trong 2-3 tiếng, nêm bằng nước tương và muối thay vì bột ngọt hay hạt nêm công nghiệp (dữ liệu minh hoạ).",
  },
  {
    keywords: ["thực đơn", "thuc don", "meal plan", "menu"],
    content:
      "Mình gợi ý bạn ghé mục Meal Planner để lên thực đơn chay cân bằng đạm - tinh bột - chất xơ theo tuần (dữ liệu minh hoạ).",
  },
  {
    keywords: ["dị ứng", "di ung", "allergy"],
    content:
      "Bạn có thể cập nhật danh sách dị ứng trong trang Hồ sơ để trợ lý tránh gợi ý các nguyên liệu đó trong thực đơn (dữ liệu minh hoạ).",
  },
];

const DEFAULT_REPLY =
  "Cảm ơn bạn đã hỏi! Đây là câu trả lời minh hoạ vì hệ thống AI thật chưa được kết nối — hãy hỏi cụ thể hơn về món chay, dinh dưỡng hoặc thực đơn để xem gợi ý phù hợp.";

/** Sinh id ngắn, đủ duy nhất cho message/session phía client (mock, chưa có id từ server). */
export function createLocalId(prefix = "id") {
  const random = Math.random().toString(36).slice(2, 9);
  return `${prefix}-${Date.now().toString(36)}-${random}`;
}

/** Rút gọn tin nhắn đầu tiên của user thành tiêu đề đoạn chat mới. */
export function deriveSessionTitle(text, maxLength = 40) {
  const trimmed = (text ?? "").trim().replace(/\s+/g, " ");
  if (!trimmed) return "Cuộc trò chuyện mới";
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength).trimEnd()}…`;
}

/** Sắp xếp session theo thời gian cập nhật gần nhất lên đầu. */
export function sortSessionsByRecent(sessions) {
  return [...sessions].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

/**
 * Xác định session nên active sau khi xoá `deletedId`.
 * - Nếu session bị xoá không phải session đang active, giữ nguyên active hiện tại.
 * - Nếu đang active bị xoá, chuyển sang session gần nhất còn lại (sessions cần
 *   được sắp xếp sẵn theo thời gian, xem sortSessionsByRecent).
 * - Nếu không còn session nào, trả về null.
 */
export function pickNextActiveSessionId(sessions, deletedId, currentActiveId) {
  if (currentActiveId !== deletedId) return currentActiveId;
  const remaining = sessions.filter((s) => s.id !== deletedId);
  return remaining[0]?.id ?? null;
}

/** Format thời gian tương đối kiểu "5 phút trước" cho danh sách lịch sử chat. */
export function formatRelativeTime(dateInput, referenceDate = new Date()) {
  const date = new Date(dateInput);
  const diffMs = referenceDate.getTime() - date.getTime();
  const diffMinutes = Math.round(diffMs / 60000);

  if (diffMinutes < 1) return "Vừa xong";
  if (diffMinutes < 60) return `${diffMinutes} phút trước`;

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} giờ trước`;

  const diffDays = Math.round(diffHours / 24);
  return `${diffDays} ngày trước`;
}

/**
 * Sinh câu trả lời mock cho trợ lý dựa trên từ khoá trong câu hỏi.
 * Gõ kèm từ như "fallback" / "quá tải" để xem trạng thái dự phòng trên UI.
 */
export function getMockAssistantReply(userText) {
  const normalized = (userText ?? "").toLowerCase();

  if (FALLBACK_TRIGGER.test(normalized)) {
    return { content: FALLBACK_NOTICE, isFallback: true };
  }

  const rule = REPLY_RULES.find((r) =>
    r.keywords.some((kw) => normalized.includes(kw))
  );

  return { content: rule ? rule.content : DEFAULT_REPLY, isFallback: false };
}
