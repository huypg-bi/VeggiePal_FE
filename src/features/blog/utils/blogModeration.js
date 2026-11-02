// Logic thuần của việc theo dõi kiểm duyệt bài viết (BE cho AI duyệt chạy nền).

export const REVIEW_POLL_INTERVAL_MS = 3000;
export const REVIEW_POLL_MAX_MS = 3 * 60 * 1000;

/** AI đang xét bài (có ở BlogResponse chi tiết và ở GET /blogs/me, danh sách công khai không có). */
export const isAiReviewing = (blog) => blog?.status === "PENDING" && blog.aiReviewInProgress === true;

/** Bài của tôi còn cần hỏi lại BE: PENDING và chưa biết hoặc AI vẫn đang xét (đã chờ admin thì dừng). */
export const needsReviewPolling = (blog) => blog?.status === "PENDING" && blog.aiReviewInProgress !== false;

/** Khoảng poll tiếp theo (ms) hoặc false khi không cần / đã quá thời gian tối đa kể từ `since`. */
export function nextReviewPollInterval(active, since, now) {
  if (!active || since == null) return false;
  return now - since < REVIEW_POLL_MAX_MS ? REVIEW_POLL_INTERVAL_MS : false;
}

/** Ghi chú trạng thái kiểm duyệt cho chủ bài (null nếu không có gì để nói). */
export function getBlogReviewNote(blog) {
  if (isAiReviewing(blog)) {
    return "AI đang kiểm duyệt bài viết, trang sẽ tự cập nhật. Nếu chờ lâu bạn có thể quay lại sau.";
  }
  const reason = blog?.moderationReason ? ` Lý do: ${blog.moderationReason}` : "";
  if (blog?.status === "PENDING") return `Bài đang chờ quản trị viên xem xét.${reason}`;
  if (blog?.status === "REJECTED") return `Bài không vượt qua kiểm duyệt.${reason}`;
  return null;
}
