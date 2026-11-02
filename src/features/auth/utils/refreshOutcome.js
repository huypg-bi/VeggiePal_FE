// Phân loại phản hồi của POST /auth/refresh (không import gì để chạy được trong `npm test`).

// 1021 khóa, 1022 không hoạt động, 1023 chưa xác minh, 1027 refresh token sai / đã dùng / hết hạn.
const DEAD_CODES = new Set([1021, 1022, 1023, 1027]);

/** "ok" = có cặp token mới; "dead" = phiên hết cách cứu; "unavailable" = lỗi mạng / máy chủ, thử lại sau được. */
export function classifyRefreshResponse(res) {
  if (res.status < 400) return "ok";
  if (DEAD_CODES.has(res.data?.code) || res.status === 401 || res.status === 403) return "dead";
  return "unavailable";
}
