import { aiSummary } from "@/features/video/data/mockVideo";

/**
 * Lớp "API" cho video — hiện chưa có backend nên trả Promise từ mock data kèm
 * độ trễ giả lập. Chữ ký hàm giống REST call thật để sau này chỉ cần thay thân
 * hàm bằng apiClient (@/shared/api/apiClient), không phải sửa hook/UI.
 *
 * Khi có endpoint, đổi thành (giống @/features/profile/api/profileApi.js):
 *   const res = await apiClient.get(`/videos/${videoId}/ai-summary`);
 *   if (res.status >= 400) throw new Error(res.data?.message || "Không lấy được tóm tắt");
 *   return res.data.result;
 */

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * GET /videos/:videoId/ai-summary — tóm tắt công thức do AI bóc tách từ video.
 * Trả về: { videoId, steps: string[], tip: string }
 */
export async function getAiSummary(videoId) {
  await delay(400);
  return { videoId, steps: [...aiSummary.steps], tip: aiSummary.tip };
}
