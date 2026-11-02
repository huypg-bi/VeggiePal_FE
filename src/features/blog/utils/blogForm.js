// Logic thuần của form bài viết: kiểm tra ảnh bìa + diễn giải kết quả kiểm duyệt của BE.

export const THUMBNAIL_MAX_BYTES = 5 * 1024 * 1024;
export const THUMBNAIL_TYPES = ["image/jpeg", "image/png", "image/webp"];

/** Kiểm tra ảnh bìa theo luật của BE (JPEG/PNG/WEBP, ≤ 5MB). Trả message lỗi hoặc null nếu hợp lệ. */
export function validateThumbnail(file) {
  if (!file) return null;
  if (!THUMBNAIL_TYPES.includes(file.type)) return "Ảnh bìa phải là JPEG, PNG hoặc WEBP";
  if (file.size > THUMBNAIL_MAX_BYTES) return "Ảnh bìa không được vượt quá 5MB";
  return null;
}

export function describeBlogOutcome(blog, { edited = false } = {}) {
  switch (blog?.status) {
    case "PUBLISHED":
      return { tone: "success", message: "Bài viết đã được đăng" };
    case "PENDING":
      if (blog.aiReviewInProgress) {
        return {
          tone: "info",
          message: edited
            ? "Đã lưu thay đổi. Bài tạm ẩn cho tới khi AI kiểm duyệt xong"
            : "Đã gửi bài, AI đang kiểm duyệt. Bài sẽ hiện công khai sau khi được duyệt",
        };
      }
      return { tone: "info", message: "Bài viết cần quản trị viên xem xét thêm, bạn sẽ thấy nó khi được duyệt" };
    case "REJECTED":
      return {
        tone: "error",
        message: blog.moderationReason
          ? `Bài viết không vượt qua kiểm duyệt: ${blog.moderationReason}`
          : "Bài viết không vượt qua kiểm duyệt",
      };
    default:
      return { tone: "success", message: "Đã lưu bản nháp" };
  }
}
