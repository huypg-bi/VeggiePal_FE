import apiClient from "@/shared/api/apiClient";
import { ADMIN_USER_ERROR_MESSAGES } from "@/shared/api/errorMessages";

// Dữ liệu trang rỗng mặc định khi chưa có kết quả.
const EMPTY_PAGE = { items: [], page: 0, size: 20, totalElements: 0, totalPages: 0 };

// Chuyển mã lỗi hoặc phản hồi HTTP sang thông báo tiếng Việt tương ứng.
function toMessage(res, fallbackMessage) {
  const code = res.data?.code;
  if (code && ADMIN_USER_ERROR_MESSAGES[code]) {
    return ADMIN_USER_ERROR_MESSAGES[code];
  }
  if (res.status === 401) return "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại";
  if (res.status === 403) return "Bạn không có quyền quản trị người dùng";
  if (res.status === 404) return "Không tìm thấy người dùng";
  if (res.status === 400) return "Dữ liệu yêu cầu không hợp lệ";
  return res.data?.message || fallbackMessage;
}

// Bóc tách kết quả API hoặc ném lỗi nếu mã trạng thái HTTP lớn hơn hoặc bằng 400.
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

// Lấy danh sách người dùng phân trang theo từ khóa, trạng thái và vai trò.
export async function searchUsers({ keyword, status, role, page = 0, size = 20 } = {}) {
  const params = {
    keyword: keyword?.trim() || undefined,
    status: status || undefined,
    role: role || undefined,
    page,
    size,
  };
  const res = await apiClient.get("/admin/users", { params });
  return unwrap(res, "Không thể tải danh sách người dùng") ?? EMPTY_PAGE;
}

// Khóa tài khoản người dùng kèm lý do bắt buộc (tối đa 500 ký tự).
export async function lockUser(id, reason) {
  const res = await apiClient.put(`/admin/users/${id}/lock`, { reason: reason?.trim() });
  return unwrap(res, "Không thể khóa tài khoản");
}

// Mở khóa tài khoản người dùng đang ở trạng thái BLOCKED.
export async function unlockUser(id) {
  const res = await apiClient.put(`/admin/users/${id}/unlock`);
  return unwrap(res, "Không thể mở khóa tài khoản");
}

// Thay đổi vai trò người dùng (USER hoặc ADMIN).
export async function changeUserRole(id, role) {
  const res = await apiClient.put(`/admin/users/${id}/role`, { role });
  return unwrap(res, "Không thể thay đổi vai trò người dùng");
}
