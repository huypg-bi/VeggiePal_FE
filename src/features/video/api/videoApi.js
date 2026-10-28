import { unwrapVideoResponse as unwrap } from "@/features/video/api/videoErrors";
import apiClient from "@/shared/api/apiClient";

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
