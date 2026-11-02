import apiClient from "@/shared/api/apiClient";

const EMPTY_LOG_PAGE = { items: [], page: 0, size: 20, totalElements: 0, totalPages: 0 };

// ai-service dùng dải mã 60xx; 403 và 404 đều mang mã 6002 nên phải xét thêm HTTP status.
function toMessage(res, fallbackMessage) {
  if (res.status === 401) return "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại";
  if (res.status === 403) return "Bạn không có quyền xem dữ liệu giám sát AI";
  if (res.status === 400) return "Bộ lọc không hợp lệ, vui lòng kiểm tra lại";
  return res.data?.message || fallbackMessage;
}

function unwrap(res, fallbackMessage) {
  if (res.status >= 400) throw new Error(toMessage(res, fallbackMessage));
  return res.data?.result;
}

/** GET /ai/admin/monitoring/summary */
export async function getUsageSummary(days = 7, excludeFeature) {
  const d = typeof days === "object" ? (days.days ?? 7) : days;
  const ef = typeof days === "object" ? days.excludeFeature : excludeFeature;
  const res = await apiClient.get("/ai/admin/monitoring/summary", {
    params: {
      days: d,
      excludeFeature: (ef && ef !== "NONE") ? ef : undefined,
    },
  });
  return unwrap(res, "Không lấy được số liệu tổng hợp");
}

export async function searchUsageLogs({
  feature,
  excludeFeature,
  status,
  userId,
  from,
  to,
  page = 0,
  size = 20,
} = {}) {
  const res = await apiClient.get("/ai/admin/monitoring/logs/search", {
    params: {
      feature: feature || undefined,
      excludeFeature: (excludeFeature && excludeFeature !== "NONE") ? excludeFeature : undefined,
      status: status || undefined,
      userId: userId || undefined,
      from: from || undefined,
      to: to || undefined,
      page,
      size,
    },
  });
  return unwrap(res, "Không lấy được nhật ký sử dụng AI") ?? EMPTY_LOG_PAGE;
}

/** GET /ai/admin/monitoring/models */
export async function getAiModels() {
  const res = await apiClient.get("/ai/admin/monitoring/models");
  return unwrap(res, "Không lấy được danh sách model");
}

/** GET /ai/admin/monitoring/limits */
export async function getAiLimits() {
  const res = await apiClient.get("/ai/admin/monitoring/limits");
  return unwrap(res, "Không lấy được giới hạn sử dụng");
}
