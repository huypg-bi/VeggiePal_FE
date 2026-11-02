/** Admin chỉ duyệt lại được bài / video đang chờ duyệt hoặc bị từ chối (khớp luật của BE). */
export const canReviewContent = (status) => status === "PENDING" || status === "REJECTED";

/** BANNED và ARCHIVED là trạng thái cuối, xóa tiếp không còn ý nghĩa. */
export const canDeleteContent = (status) => status !== "BANNED" && status !== "ARCHIVED";
