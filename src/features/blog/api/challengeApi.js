import apiClient from "@/shared/api/apiClient";
import { CHALLENGE_ERROR_MESSAGES } from "@/shared/api/errorMessages";

// Ưu tiên mã lỗi BE; không có mã (Spring Security / gateway) thì dịch theo HTTP status.
function toMessage(res, fallbackMessage) {
  const byCode = CHALLENGE_ERROR_MESSAGES[res.data?.code];
  if (byCode) return byCode;
  if (res.status === 401) return CHALLENGE_ERROR_MESSAGES[1008];
  if (res.status === 429) return "Bạn thao tác quá nhanh, vui lòng thử lại sau";
  if (res.status === 503) return "Hệ thống đang bận, vui lòng thử lại sau";
  return fallbackMessage;
}

function unwrap(res, fallbackMessage) {
  if (res.status >= 400) throw new Error(toMessage(res, fallbackMessage));
  return res.data?.result;
}

/** GET /users/me/challenges/7-day — lượt gần nhất; chưa từng tham gia (404 / 1033) thì trả null. */
export async function getChallengeProgress() {
  const res = await apiClient.get("/users/me/challenges/7-day");
  if (res.status === 404 || res.data?.code === 1033) return null;
  return unwrap(res, "Không lấy được tiến độ thử thách");
}

/** POST /users/me/challenges/7-day — bắt đầu một lượt mới. */
export async function joinChallenge() {
  const res = await apiClient.post("/users/me/challenges/7-day");
  return unwrap(res, "Không tham gia được thử thách");
}

/** POST /users/me/challenges/7-day/check-ins — điểm danh hôm nay (lỡ ngày thì BE trả tiến độ FAILED, không báo lỗi). */
export async function checkInChallenge() {
  const res = await apiClient.post("/users/me/challenges/7-day/check-ins");
  return unwrap(res, "Check-in thất bại");
}
