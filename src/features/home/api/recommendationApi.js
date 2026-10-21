import apiClient from "@/shared/api/apiClient";

/**
 * AI Content Recommendation APIs (ai-service qua gateway).
 * GET /ai/recommendations?interest=&limit= (cần đăng nhập, limit 1-10, mặc định 6).
 * Trả về danh sách Recommendation:
 * [{ type: "BLOG" | "RECIPE", id: number, reason: string, content: JsonNode }]
 */

function unwrap(res, fallbackMessage) {
  if (res.status >= 400) {
    throw new Error(res.data?.message || fallbackMessage);
  }
  return res.data?.result;
}

/**
 * Lấy danh sách gợi ý nội dung từ AI.
 * @param {Object} params
 * @param {string} [params.interest] - Chủ đề / sở thích (mặc định BE dùng "ăn chay")
 * @param {number} [params.limit=6] - Số lượng gợi ý (1-10)
 */
export async function getRecommendations({ interest, limit = 6 } = {}) {
  const res = await apiClient.get("/ai/recommendations", {
    params: {
      interest: interest?.trim() || undefined,
      limit,
    },
  });
  return unwrap(res, "Không lấy được danh sách gợi ý nội dung") ?? [];
}
