import apiClient from "@/shared/api/apiClient";
import { RESTAURANT_ERROR_MESSAGES } from "@/shared/api/errorMessages";

function unwrap(res, fallbackMessage) {
  if (res.status >= 400) {
    throw new Error(
      RESTAURANT_ERROR_MESSAGES[res.data?.code] ?? res.data?.message ?? fallbackMessage,
    );
  }
  return res.data?.result;
}

export async function getNearbyRestaurants({
  lat,
  lng,
  radiusKm,
  veganOnly = false,
}) {
  let res;
  try {
    res = await apiClient.get("/restaurants/nearby", {
      params: { lat, lng, radiusKm, veganOnly },
    });
  } catch {
    // validateStatus tắt throw theo status, nên chỉ còn lỗi mạng rơi vào đây.
    throw new Error("Không kết nối được máy chủ, vui lòng thử lại");
  }
  return unwrap(res, "Không lấy được danh sách quán chay") ?? [];
}

/**
 * GET /restaurants/search — tìm quán theo tên (công khai, tối đa 20 quán, không giới hạn bán kính).
 * q phải 2 - 100 ký tự (BE trả 400 / 5003 nếu không); quán khớp đầu tên đứng trước, rồi gần nhất.
 * Có lat / lng thì mỗi quán kèm distanceKm, không thì distanceKm là null.
 */
export async function searchRestaurants({ q, lat, lng, veganOnly = false }) {
  let res;
  try {
    res = await apiClient.get("/restaurants/search", {
      params: { q, lat, lng, veganOnly },
    });
  } catch {
    throw new Error("Không kết nối được máy chủ, vui lòng thử lại");
  }
  return unwrap(res, "Không tìm được quán chay") ?? [];
}
