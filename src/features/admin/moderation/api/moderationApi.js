import apiClient from "@/shared/api/apiClient";

function toMessage(res, fallbackMessage) {
  const code = res.data?.code;
  if (code === 6012) return "Nội dung đã bị xóa, không thể áp dụng quyết định";
  if (code === 6013) return "Case đã được xử lý";
  if (res.status === 401) return "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại";
  if (res.status === 403) return "Bạn không có quyền thực hiện kiểm duyệt nội dung";
  if (res.status === 404) return "Không tìm thấy yêu cầu kiểm duyệt này";
  if (res.status === 400) return "Dữ liệu quyết định kiểm duyệt không hợp lệ";
  return res.data?.message || fallbackMessage;
}

function unwrap(res, fallbackMessage) {
  if (res.status >= 400) {
    const error = new Error(toMessage(res, fallbackMessage));
    error.code = res.data?.code;
    error.status = res.status;
    error.response = res;
    throw error;
  }
  return res.data?.result;
}

export async function getPendingModerationCases() {
  const res = await apiClient.get("/ai/admin/moderation");
  return unwrap(res, "Không lấy được danh sách hàng đợi kiểm duyệt") ?? [];
}

export async function reviewModerationCase(id, { decision, reason }) {
  const res = await apiClient.put(`/ai/admin/moderation/${id}`, {
    decision,
    reason: reason?.trim() || undefined,
  });
  return unwrap(res, "Không thể cập nhật quyết định kiểm duyệt");
}

export async function dismissModerationCase(id, { reason } = {}) {
  const res = await apiClient.delete(`/ai/admin/moderation/${id}`, {
    params: { reason: reason?.trim() || undefined },
  });
  return unwrap(res, "Không thể bỏ qua case kiểm duyệt");
}
