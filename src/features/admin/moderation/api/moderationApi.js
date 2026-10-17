import apiClient from "@/shared/api/apiClient";

/**
 * AI Content Moderation APIs (ai-service qua api-gateway). Chỉ ADMIN.
 * - GET /ai/admin/moderation: danh sách case REVIEW_REQUIRED (cũ nhất trước).
 * - PUT /ai/admin/moderation/{id}: duyệt hoặc từ chối case kèm lý do ({ decision: "APPROVED" | "REJECTED", reason }).
 *   Khi admin quyết định, BE tự động gọi ngược về blog-service áp dụng trạng thái.
 */

function toMessage(res, fallbackMessage) {
  if (res.status === 401) return "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại";
  if (res.status === 403) return "Bạn không có quyền thực hiện kiểm duyệt nội dung";
  if (res.status === 404) return "Không tìm thấy yêu cầu kiểm duyệt này";
  if (res.status === 400) return "Dữ liệu quyết định kiểm duyệt không hợp lệ";
  return res.data?.message || fallbackMessage;
}

function unwrap(res, fallbackMessage) {
  if (res.status >= 400) throw new Error(toMessage(res, fallbackMessage));
  return res.data?.result;
}

/**
 * GET /ai/admin/moderation
 * Trả về danh sách ModerationResponse:
 * [{ caseId, decision, categories, reason, confidence, createdAt }]
 */
export async function getPendingModerationCases() {
  const res = await apiClient.get("/ai/admin/moderation");
  return unwrap(res, "Không lấy được danh sách hàng đợi kiểm duyệt") ?? [];
}

/**
 * PUT /ai/admin/moderation/{id}
 * Body: { decision: "APPROVED" | "REJECTED", reason?: string }
 */
export async function reviewModerationCase(id, { decision, reason }) {
  const res = await apiClient.put(`/ai/admin/moderation/${id}`, {
    decision,
    reason: reason?.trim() || undefined,
  });
  return unwrap(res, "Không thể cập nhật quyết định kiểm duyệt");
}
