/** Sinh id ngắn, đủ duy nhất cho tin nhắn tạm phía client (chưa có id từ server). */
export function createLocalId(prefix = "id") {
  const random = Math.random().toString(36).slice(2, 9);
  return `${prefix}-${Date.now().toString(36)}-${random}`;
}

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

/** ConversationSummary của BE -> item sidebar. */
export function toSessionItem(conversation) {
  return {
    id: conversation.id,
    title: conversation.title || "Cuộc trò chuyện mới",
    updatedAt: conversation.updatedAt ?? conversation.createdAt,
  };
}

/** MessageView của BE -> tin nhắn hiển thị (role: "user" | "assistant"). */
export function toMessageItem(message) {
  return {
    id: message.id,
    role: message.role === "user" ? "user" : "assistant",
    content: message.content,
    createdAt: message.createdAt,
  };
}

export function isGuestSessionValid(stored, now = new Date()) {
  if (!stored?.guestSession || !stored?.expiresAt) return false;
  const expires = new Date(stored.expiresAt).getTime();
  if (Number.isNaN(expires)) return false;
  return expires - 60_000 > now.getTime();
}

export function getChatErrorMessage(error, { guest = false } = {}) {
  const code = error?.code;
  const status = error?.status;

  if (code === 6003 || status === 429) {
    return guest
      ? "Bạn đã dùng hết lượt hỏi thử hôm nay. Hãy đăng nhập để tiếp tục trò chuyện."
      : "Bạn đã dùng hết lượt hỏi AI hôm nay. Nâng cấp gói thành viên tại /pricing để nhận thêm lượt hoặc quay lại vào ngày mai.";
  }
  if (code === 6001 || status === 401) {
    return guest
      ? "Phiên dùng thử đã hết hạn. Hãy gửi lại câu hỏi để tạo phiên mới."
      : "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
  }
  if (code === 6002 || status === 404) {
    return "Không tìm thấy cuộc trò chuyện này.";
  }
  if (code === 6000 || status === 400) {
    return "Câu hỏi không hợp lệ hoặc quá dài (tối đa 4000 ký tự).";
  }
  if ([6004, 6005, 6006, 6007].includes(code) || (status >= 500 && status < 600)) {
    return "Trợ lý AI tạm thời không khả dụng. Vui lòng thử lại sau ít phút.";
  }
  if (!status) {
    return "Không kết nối được máy chủ. Vui lòng kiểm tra mạng và thử lại.";
  }
  return "Đã có lỗi xảy ra. Vui lòng thử lại.";
}
