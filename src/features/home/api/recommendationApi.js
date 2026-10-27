import apiClient from "@/shared/api/apiClient";
import { RECOMMENDATION_ERROR_MESSAGES } from "@/shared/api/errorMessages";

// Lỗi 401/429/503 do Spring Security hoặc gateway trả về có thể không kèm mã 60xx nên dựa thêm vào HTTP status.
function toMessage(res, fallbackMessage) {
  const byCode = RECOMMENDATION_ERROR_MESSAGES[res.data?.code];
  if (byCode) return byCode;
  if (res.status === 401) return RECOMMENDATION_ERROR_MESSAGES[6001];
  if (res.status === 429) return RECOMMENDATION_ERROR_MESSAGES[6003];
  if (res.status === 503) return RECOMMENDATION_ERROR_MESSAGES[6004];
  if (res.status >= 500) return RECOMMENDATION_ERROR_MESSAGES[6999];
  return fallbackMessage;
}

function unwrap(res, fallbackMessage) {
  if (res.status >= 400) {
    throw new Error(toMessage(res, fallbackMessage));
  }
  return res.data?.result;
}

export async function getRecommendations({ interest, limit = 6 } = {}) {
  let res;
  try {
    res = await apiClient.get("/ai/recommendations", {
      params: {
        interest: interest?.trim() || undefined,
        limit,
      },
    });
  } catch (error) {
    // validateStatus tắt throw theo status, nên chỉ còn lỗi mạng / máy chủ không phản hồi rơi vào catch.
    throw new Error("Không kết nối được máy chủ, vui lòng thử lại", { cause: error });
  }
  return unwrap(res, "Không lấy được danh sách gợi ý nội dung") ?? [];
}
