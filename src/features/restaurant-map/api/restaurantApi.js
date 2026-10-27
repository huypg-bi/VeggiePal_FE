import apiClient from "@/shared/api/apiClient";

// BE trả message tiếng Anh theo ErrorCode; đổi sang tiếng Việt theo `code`.
const VI_MESSAGES = {
  1018: "Dữ liệu tìm kiếm không hợp lệ",
  5001: "Tọa độ không hợp lệ",
  5002: "Bán kính tìm kiếm phải lớn hơn 0 và tối đa 10 km",
};

function unwrap(res, fallbackMessage) {
  if (res.status >= 400) {
    throw new Error(
      VI_MESSAGES[res.data?.code] ?? res.data?.message ?? fallbackMessage,
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
