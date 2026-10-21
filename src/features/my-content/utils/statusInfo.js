// Nhãn + màu + gợi ý cho trạng thái của bài viết (blog-service) và công thức (recipe-service).
// tone ánh xạ sang class ở StatusBadge: success | warning | danger | muted.

const BLOG_STATUS = {
  DRAFT: { label: "Bản nháp", tone: "muted", hint: "Chưa gửi duyệt, chỉ mình bạn thấy" },
  PENDING: { label: "Chờ duyệt", tone: "warning", hint: "Đang chờ kiểm duyệt" },
  PUBLISHED: { label: "Đã đăng", tone: "success", hint: "" },
  REJECTED: { label: "Bị từ chối", tone: "danger", hint: "Không vượt qua kiểm duyệt" },
  BANNED: { label: "Đã bị gỡ", tone: "danger", hint: "Quản trị viên đã gỡ bài này" },
};

const RECIPE_STATUS = {
  DRAFT: { label: "Bản nháp", tone: "muted", hint: "Chưa đăng, chỉ mình bạn thấy" },
  PUBLISHED: { label: "Đã đăng", tone: "success", hint: "" },
  HIDDEN: { label: "Đang ẩn", tone: "danger", hint: "Công thức đang bị ẩn khỏi mọi người" },
};

// Bộ lọc ở tab bài viết: "" = tất cả (không gửi status lên BE).
export const BLOG_STATUS_FILTERS = [
  { value: "", label: "Tất cả" },
  ...Object.entries(BLOG_STATUS).map(([value, { label }]) => ({ value, label })),
];

const UNKNOWN = { label: "Không rõ", tone: "muted", hint: "" };

/** Thông tin hiển thị của một trạng thái bài viết; trạng thái lạ rơi về "Không rõ". */
export function getBlogStatusInfo(status) {
  return BLOG_STATUS[status] ?? UNKNOWN;
}

/** Thông tin hiển thị của một trạng thái công thức. */
export function getRecipeStatusInfo(status) {
  return RECIPE_STATUS[status] ?? UNKNOWN;
}

// Hành động nào hợp lệ ở trạng thái nào (khớp luật chuyển trạng thái của BE).

/**
 * Sửa bài: BE cho sửa bài ở mọi trạng thái trừ BANNED, nhưng chưa có endpoint để chủ bài đọc lại
 * bài chưa đăng (GET /blogs/:id chỉ trả bài PUBLISHED), nên FE chỉ mở sửa được bài đã đăng.
 * Khi BE bổ sung endpoint đọc bài của chính mình thì nới điều kiện này.
 */
export const canEditBlog = (status) => status === "PUBLISHED";

/** Gửi duyệt: chỉ bản nháp (BE trả lỗi 3015 với trạng thái khác). */
export const canSubmitBlog = (status) => status === "DRAFT";

/** Đăng công thức: chỉ bản nháp. (BE còn cho đăng lại công thức HIDDEN, nhưng đó là quản trị ẩn nên không mở.) */
export const canPublishRecipe = (status) => status === "DRAFT";
