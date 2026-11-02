import { unwrapBlogResponse } from "@/features/blog/api/blogErrors";
import { unwrapVideoResponse } from "@/features/video/api/videoErrors";
import apiClient from "@/shared/api/apiClient";
import { RECIPE_ERROR_MESSAGES } from "@/shared/api/errorMessages";

const EMPTY_PAGE = { items: [], page: 0, size: 10, totalElements: 0, totalPages: 0 };

function unwrapRecipe(res, fallbackMessage) {
  if (res.status >= 400) {
    throw new Error(RECIPE_ERROR_MESSAGES[res.data?.code] ?? res.data?.message ?? fallbackMessage);
  }
  return res.data?.result;
}

// status "" / keyword "" coi như không lọc.
const listParams = ({ status, keyword, page = 0, size = 10 }) => ({
  status: status || undefined,
  keyword: keyword?.trim() || undefined,
  page,
  size,
});

/** GET /admin/blogs — bài viết ở mọi trạng thái, mới tạo trước. */
export async function getAdminBlogs(params) {
  const res = await apiClient.get("/admin/blogs", { params: listParams(params) });
  return unwrapBlogResponse(res, "Không lấy được danh sách bài viết") ?? EMPTY_PAGE;
}

/** GET /admin/videos — video ở mọi trạng thái, mới tạo trước. */
export async function getAdminVideos(params) {
  const res = await apiClient.get("/admin/videos", { params: listParams(params) });
  return unwrapVideoResponse(res, "Không lấy được danh sách video") ?? EMPTY_PAGE;
}

/** GET /admin/recipes — công thức ở mọi trạng thái, mới tạo trước. */
export async function getAdminRecipes(params) {
  const res = await apiClient.get("/admin/recipes", { params: listParams(params) });
  return unwrapRecipe(res, "Không lấy được danh sách công thức") ?? EMPTY_PAGE;
}

/** PUT /admin/blogs/:id/status — chỉ PENDING / REJECTED -> PUBLISHED / REJECTED, bắt buộc có lý do. */
export async function changeBlogStatus(id, { status, reason }) {
  const res = await apiClient.put(`/admin/blogs/${id}/status`, { status, reason });
  return unwrapBlogResponse(res, "Đổi trạng thái bài viết thất bại");
}

/** PUT /admin/videos/:id/status — cùng luật với bài viết. */
export async function changeVideoStatus(id, { status, reason }) {
  const res = await apiClient.put(`/admin/videos/${id}/status`, { status, reason });
  return unwrapVideoResponse(res, "Đổi trạng thái video thất bại");
}
