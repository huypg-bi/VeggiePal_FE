import apiClient from "@/shared/api/apiClient";
import { FOLLOW_ERROR_MESSAGES } from "@/shared/api/errorMessages";

/**
 * Theo dõi người dùng (identity-service qua api-gateway), mọi endpoint cần đăng nhập.
 *   PUT    /users/:id/follow         theo dõi (gọi lại cũng không lỗi)
 *   DELETE /users/:id/follow         bỏ theo dõi (gọi lại cũng không lỗi)
 *   GET    /users/:id/follow-stats   { followers, following, followedByMe }
 *   GET    /users/me/following/ids   id những tài khoản ACTIVE tôi đang theo dõi
 *   GET    /users/:id|me/following | followers   danh sách phân trang { items: [{ id, fullName, avatarUrl }], page, size, totalElements, totalPages }
 * PUT / DELETE trả luôn FollowStats mới của người được theo dõi. Tự theo dõi mình -> 400 / 1020.
 * Không có endpoint toggle: nút phải dựa vào trạng thái hiện tại để chọn PUT hay DELETE.
 */

function unwrap(res, fallbackMessage) {
  if (res.status >= 400) {
    throw new Error(FOLLOW_ERROR_MESSAGES[res.data?.code] ?? res.data?.message ?? fallbackMessage);
  }
  return res.data?.result;
}

export async function followUser(userId) {
  const res = await apiClient.put(`/users/${userId}/follow`);
  return unwrap(res, "Không theo dõi được, vui lòng thử lại");
}

export async function unfollowUser(userId) {
  const res = await apiClient.delete(`/users/${userId}/follow`);
  return unwrap(res, "Không bỏ theo dõi được, vui lòng thử lại");
}

export async function getFollowStats(userId) {
  const res = await apiClient.get(`/users/${userId}/follow-stats`);
  return unwrap(res, "Không lấy được số người theo dõi");
}

export async function getFollowingIds() {
  const res = await apiClient.get("/users/me/following/ids");
  return unwrap(res, "Không lấy được danh sách người bạn theo dõi") ?? [];
}

const EMPTY_PAGE = { items: [], page: 0, size: 20, totalElements: 0, totalPages: 0 };

/** kind: "following" (người đó theo dõi ai) hoặc "followers" (ai theo dõi người đó). userId = "me" cho chính tôi. */
export async function getFollowList({ userId = "me", kind, page = 0, size = 20 }) {
  const res = await apiClient.get(`/users/${userId}/${kind}`, { params: { page, size } });
  return unwrap(res, "Không lấy được danh sách") ?? EMPTY_PAGE;
}
