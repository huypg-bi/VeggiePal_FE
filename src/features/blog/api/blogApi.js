import { unwrapBlogResponse as unwrap } from "@/features/blog/api/blogErrors";
import apiClient from "@/shared/api/apiClient";
import { chunk, joinIds, normalizeIds } from "@/shared/utils/ids";

// BE giới hạn 100 id mỗi lần gọi GET /blogs/me/votes.
const MAX_VOTE_IDS_PER_REQUEST = 100;

const EMPTY_PAGE = { items: [], page: 0, size: 10, totalElements: 0, totalPages: 0 };

export async function getBlogs({ categoryId, keyword, sort, page = 0, size = 10 } = {}) {
  const res = await apiClient.get("/blogs", {
    params: {
      categoryId: categoryId || undefined,
      keyword: keyword?.trim() || undefined,
      sort: sort || undefined,
      page,
      size,
    },
  });
  return unwrap(res, "Không lấy được danh sách bài viết") ?? EMPTY_PAGE;
}

/** GET /blogs/:id — chi tiết một bài đã duyệt (+1 lượt xem); chủ bài / ADMIN đọc được cả bài chưa đăng. */
export async function getBlog(id) {
  const res = await apiClient.get(`/blogs/${id}`);
  return unwrap(res, "Không lấy được bài viết");
}

/** GET /blogs/:id/related — tối đa 5 bài cùng danh mục. */
export async function getRelatedBlogs(id) {
  const res = await apiClient.get(`/blogs/${id}/related`);
  return unwrap(res, "Không lấy được bài viết liên quan") ?? [];
}

export async function voteBlog(id, value = 1) {
  const res = await apiClient.post(`/blogs/${id}/vote`, { value });
  return unwrap(res, "Không bình chọn được, vui lòng thử lại");
}

/** DELETE /blogs/:id/vote — bỏ vote (gọi 2 lần cũng không lỗi). */
export async function removeBlogVote(id) {
  const res = await apiClient.delete(`/blogs/${id}/vote`);
  return unwrap(res, "Không bỏ bình chọn được, vui lòng thử lại");
}

export async function getMyVotes(blogIds) {
  const ids = normalizeIds(blogIds);
  if (ids.length === 0) return [];

  const responses = await Promise.all(
    chunk(ids, MAX_VOTE_IDS_PER_REQUEST).map((part) =>
      apiClient.get("/blogs/me/votes", { params: { blogIds: joinIds(part) } })
    )
  );
  return responses.flatMap((res) => unwrap(res, "Không lấy được bình chọn của bạn") ?? []);
}

export async function getMyBlogs({ status, page = 0, size = 10 } = {}) {
  const res = await apiClient.get("/blogs/me", {
    params: { status: status || undefined, page, size },
  });
  return unwrap(res, "Không lấy được bài viết của bạn") ?? EMPTY_PAGE;
}

export async function createBlog({ title, content, categoryId, publish = false }) {
  const res = await apiClient.post("/blogs", { title, content, categoryId, publish });
  return unwrap(res, "Tạo bài viết thất bại");
}

export async function updateBlog(id, { title, content, categoryId }) {
  const res = await apiClient.put(`/blogs/${id}`, { title, content, categoryId });
  return unwrap(res, "Cập nhật bài viết thất bại");
}

/** POST /blogs/:id/submit — gửi bản nháp đi kiểm duyệt (chỉ bản nháp của chính mình). */
export async function submitBlog(id) {
  const res = await apiClient.post(`/blogs/${id}/submit`);
  return unwrap(res, "Gửi duyệt thất bại");
}

/** DELETE /blogs/:id — chủ bài xóa hẳn; ADMIN xóa bài người khác thì chỉ gỡ (BANNED). */
export async function deleteBlog(id) {
  const res = await apiClient.delete(`/blogs/${id}`);
  unwrap(res, "Xóa bài viết thất bại");
}

/** POST /blogs/:id/thumbnail — tải/thay ảnh bìa. Trả BlogResponse có thumbnailUrl mới. */
export async function uploadBlogThumbnail(id, file) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await apiClient.post(`/blogs/${id}/thumbnail`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return unwrap(res, "Tải ảnh bìa thất bại");
}
