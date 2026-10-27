import { BLOG_ERROR_MESSAGES } from "@/shared/api/errorMessages";

/** Trả `res.data.result`, hoặc ném Error với thông báo tiếng Việt nếu status >= 400. */
export function unwrapBlogResponse(res, fallbackMessage) {
  if (res.status >= 400) {
    throw new Error(BLOG_ERROR_MESSAGES[res.data?.code] ?? res.data?.message ?? fallbackMessage);
  }
  return res.data?.result;
}
