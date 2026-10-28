import apiClient from "@/shared/api/apiClient";
import { PROFILE_ERROR_MESSAGES } from "@/shared/api/errorMessages";

// Ưu tiên mã lỗi BE; nếu không có mã (Spring Security / gateway trả thẳng) thì dịch theo HTTP status.
function toMessage(res, fallbackMessage) {
  const byCode = PROFILE_ERROR_MESSAGES[res.data?.code];
  if (byCode) return byCode;
  if (res.status === 401) return "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại";
  if (res.status === 403) return "Bạn không có quyền thực hiện";
  if (res.status === 413) return "Ảnh không được vượt quá 2MB";
  if (res.status === 429) return "Bạn thao tác quá nhanh, vui lòng thử lại sau";
  if (res.status === 503) return "Hệ thống đang bận, vui lòng thử lại sau";
  return fallbackMessage;
}

function unwrap(res, fallbackMessage) {
  if (res.status >= 400) {
    throw new Error(toMessage(res, fallbackMessage));
  }
  return res.data?.result;
}

/** GET /users/me — thông tin profile hiện tại */
export async function getProfile() {
  const res = await apiClient.get("/users/me");
  return unwrap(res, "Không lấy được thông tin hồ sơ");
}

export async function updateProfile(payload) {
  const res = await apiClient.patch("/users/me", payload);
  return unwrap(res, "Cập nhật hồ sơ thất bại");
}

/** PUT /users/me/password — { currentPassword, newPassword } */
export async function changePassword({ currentPassword, newPassword }) {
  const res = await apiClient.put("/users/me/password", {
    currentPassword,
    newPassword,
  });
  unwrap(res, "Đổi mật khẩu thất bại");
}

/** POST /users/me/avatar — multipart field "file" (JPEG/PNG/WEBP, max 2MB) */
export async function uploadAvatar(file) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await apiClient.post("/users/me/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return unwrap(res, "Upload ảnh đại diện thất bại");
}

/** GET /nutrition/allergens — danh mục dị ứng */
export async function getAllergens() {
  const res = await apiClient.get("/nutrition/allergens");
  return unwrap(res, "Không lấy được danh mục dị ứng") ?? [];
}

/** GET /nutrition/me/allergies */
export async function getMyAllergies() {
  const res = await apiClient.get("/nutrition/me/allergies");
  return unwrap(res, "Không lấy được danh sách dị ứng") ?? [];
}

/** PUT /nutrition/me/allergies — { allergenIds: number[] } ([] để xóa hết) */
export async function replaceMyAllergies(allergenIds) {
  const res = await apiClient.put("/nutrition/me/allergies", { allergenIds });
  return unwrap(res, "Cập nhật dị ứng thất bại") ?? [];
}

/** GET /nutrition/me/health-records/latest */
export async function getLatestHealthRecord() {
  const res = await apiClient.get("/nutrition/me/health-records/latest");
  // BE có thể trả 404 / null nếu chưa có bản ghi
  if (res.status === 404 || res.data?.code === 2005) {
    return null;
  }
  if (res.status >= 400) {
    // Một số implement trả 200 + result null
    if (res.data?.result == null) return null;
    throw new Error(toMessage(res, "Không lấy được chỉ số sức khỏe"));
  }
  return res.data?.result ?? null;
}

/** GET /nutrition/me/health-records?page&size */
export async function getHealthRecords({ page = 0, size = 10 } = {}) {
  const res = await apiClient.get("/nutrition/me/health-records", {
    params: { page, size },
  });
  return (
    unwrap(res, "Không lấy được lịch sử sức khỏe") ?? {
      items: [],
      page: 0,
      size,
      totalElements: 0,
      totalPages: 0,
    }
  );
}

/** POST /nutrition/me/health-records — { heightCm, weightKg } */
export async function createHealthRecord({ heightCm, weightKg }) {
  const res = await apiClient.post("/nutrition/me/health-records", {
    heightCm,
    weightKg,
  });
  return unwrap(res, "Ghi nhận chỉ số thất bại");
}

/** PUT /nutrition/me/health-records/:id */
export async function updateHealthRecord(id, { heightCm, weightKg }) {
  const res = await apiClient.put(`/nutrition/me/health-records/${id}`, {
    heightCm,
    weightKg,
  });
  return unwrap(res, "Cập nhật chỉ số thất bại");
}
