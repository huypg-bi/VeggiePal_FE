import { unwrapBlogResponse as unwrap } from "@/features/blog/api/blogErrors";
import apiClient from "@/shared/api/apiClient";

const EMPTY_PAGE = { items: [], page: 0, size: 20, totalElements: 0, totalPages: 0 };

/** GET /comments — comment cấp 1 của một nội dung (hiện chỉ hỗ trợ BLOG). */
export async function getComments({ targetType = "BLOG", targetId, page = 0, size = 20 }) {
  const res = await apiClient.get("/comments", {
    params: { targetType, targetId, page, size },
  });
  return unwrap(res, "Không lấy được bình luận") ?? EMPTY_PAGE;
}

/** GET /comments/:id/replies */
export async function getReplies(commentId, { page = 0, size = 20 } = {}) {
  const res = await apiClient.get(`/comments/${commentId}/replies`, {
    params: { page, size },
  });
  return unwrap(res, "Không lấy được phản hồi") ?? EMPTY_PAGE;
}

/** POST /comments — bình luận mới; truyền parentCommentId để phản hồi một comment gốc. */
export async function createComment({ blogId, parentCommentId, content }) {
  const res = await apiClient.post("/comments", {
    targetType: "BLOG",
    targetId: blogId,
    parentCommentId: parentCommentId ?? null,
    content,
  });
  return unwrap(res, "Gửi bình luận thất bại");
}

/** PUT /comments/:id — BE bắt buộc gửi lại targetType + targetId dù không cho đổi. */
export async function updateComment(commentId, { blogId, content }) {
  const res = await apiClient.put(`/comments/${commentId}`, {
    targetType: "BLOG",
    targetId: blogId,
    content,
  });
  return unwrap(res, "Sửa bình luận thất bại");
}

/** DELETE /comments/:id — xóa mềm, comment vẫn còn dạng "đã bị xóa" nếu có phản hồi. */
export async function deleteComment(commentId) {
  const res = await apiClient.delete(`/comments/${commentId}`);
  unwrap(res, "Xóa bình luận thất bại");
}
