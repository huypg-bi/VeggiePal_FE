import { AUTH_ERROR_MESSAGES } from "@/shared/api/errorMessages";

// BE dùng chung mã 1008 (UNAUTHENTICATED) cho cả "không có email" lẫn "sai mật khẩu" nên chỉ có một câu chung.
export const LOGIN_FAILED_MESSAGE = "Email hoặc mật khẩu không đúng";
export const NETWORK_ERROR_MESSAGE = "Không kết nối được máy chủ, vui lòng thử lại";
const SERVER_ERROR_MESSAGE = "Máy chủ đang gặp sự cố, vui lòng thử lại sau";

export function toAuthMessage(res, fallbackMessage, overrides = {}) {
  const code = res?.data?.code;
  const byCode = overrides[code] ?? AUTH_ERROR_MESSAGES[code];
  if (byCode) return byCode;
  if (res?.status >= 500) return SERVER_ERROR_MESSAGE;
  return fallbackMessage;
}

/** Error tiếng Việt kèm `code` của BE, để form phân nhánh theo mã (vd 1023 chưa xác minh, 1029 mã hết hạn). */
export function toAuthError(res, fallbackMessage, overrides) {
  return Object.assign(new Error(toAuthMessage(res, fallbackMessage, overrides)), {
    code: res?.data?.code,
  });
}
