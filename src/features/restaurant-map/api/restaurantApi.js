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
