import { unwrapVideoResponse as unwrap } from "@/features/video/api/videoErrors";
import apiClient from "@/shared/api/apiClient";
import { chunk, joinIds, normalizeIds } from "@/shared/utils/ids";

// BE giới hạn tối đa 100 id mỗi lần gọi GET /videos/me/votes.
const MAX_VOTE_IDS_PER_REQUEST = 100;

const EMPTY_PAGE = { items: [], page: 0, size: 10, totalElements: 0, totalPages: 0 };

export async function getVideos({ categoryId, page = 0, size = 12 } = {}) {
  const res = await apiClient.get("/videos", {
    params: {
      categoryId: categoryId || undefined,
      page,
      size,
    },
  });
  return unwrap(res, "Không lấy được danh sách video") ?? EMPTY_PAGE;
}

export async function getVideo(id) {
  const res = await apiClient.get(`/videos/${id}`);
  return unwrap(res, "Không tìm thấy video hoặc video chưa được đăng");
}

export async function createVideo(formData, { onUploadProgress } = {}) {
  const res = await apiClient.post("/videos", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress,
  });
  return unwrap(res, "Đăng video thất bại");
}

export async function getMyVideos({ status, page = 0, size = 10 } = {}) {
  const res = await apiClient.get("/videos/me", {
    params: {
      status: status || undefined,
      page,
      size,
    },
  });
  return unwrap(res, "Không lấy được danh sách video của bạn") ?? EMPTY_PAGE;
}

export async function updateVideo(id, { title, description, categoryId }) {
  const res = await apiClient.put(`/videos/${id}`, {
    title,
    description: description || "",
    categoryId,
  });
  return unwrap(res, "Cập nhật video thất bại");
}

export async function submitVideo(id) {
  const res = await apiClient.post(`/videos/${id}/submit`);
  return unwrap(res, "Gửi duyệt video thất bại");
}

export async function deleteVideo(id) {
  const res = await apiClient.delete(`/videos/${id}`);
  unwrap(res, "Xóa video thất bại");
}

// POST /videos/:id/vote — gửi 1 (thích) hoặc -1 (không thích); gửi lại cùng giá trị thì BE toggle hủy vote.
export async function voteVideo(id, value = 1) {
  const res = await apiClient.post(`/videos/${id}/vote`, { value });
  return unwrap(res, "Không bình chọn được, vui lòng thử lại");
}

// DELETE /videos/:id/vote — bỏ vote rõ ràng, gọi nhiều lần không lỗi.
export async function removeVideoVote(id) {
  const res = await apiClient.delete(`/videos/${id}/vote`);
  return unwrap(res, "Không bỏ bình chọn được, vui lòng thử lại");
}

// GET /videos/me/votes?videoIds=1,2,3 — lấy danh sách vote của tôi (tối đa 100 id mỗi lượt).
export async function getMyVideoVotes(videoIds) {
  const ids = normalizeIds(videoIds);
  if (ids.length === 0) return [];

  const responses = await Promise.all(
    chunk(ids, MAX_VOTE_IDS_PER_REQUEST).map((part) =>
      apiClient.get("/videos/me/votes", { params: { videoIds: joinIds(part) } })
    )
  );
  return responses.flatMap((res) => unwrap(res, "Không lấy được bình chọn của bạn") ?? []);
}
