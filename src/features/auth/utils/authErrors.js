// identity-service trả message tiếng Anh theo ErrorCode; đổi sang tiếng Việt theo `code`.
const VI_MESSAGES = {
  1001: "Dữ liệu chưa hợp lệ, vui lòng kiểm tra lại",
  1002: "Email này đã được đăng ký, vui lòng dùng email khác hoặc đăng nhập",
  1003: "Mật khẩu phải có ít nhất 6 ký tự",
  1004: "Email không hợp lệ",
  1005: "Vui lòng nhập email",
  1006: "Vui lòng nhập họ và tên",
  1010: "Vui lòng nhập mật khẩu",
  1018: "Dữ liệu chưa hợp lệ, vui lòng kiểm tra lại",
  1019: "Không xác thực được tài khoản Google. Vui lòng thử lại.",
};

// BE dùng chung mã 1008 (UNAUTHENTICATED) cho cả "không có email" lẫn "sai mật khẩu" nên chỉ có một câu chung.
export const LOGIN_FAILED_MESSAGE = "Email hoặc mật khẩu không đúng";
export const NETWORK_ERROR_MESSAGE = "Không kết nối được máy chủ, vui lòng thử lại";
const SERVER_ERROR_MESSAGE = "Máy chủ đang gặp sự cố, vui lòng thử lại sau";

export function toAuthMessage(res, fallbackMessage, overrides = {}) {
  const code = res?.data?.code;
  const byCode = overrides[code] ?? VI_MESSAGES[code];
  if (byCode) return byCode;
  if (res?.status >= 500) return SERVER_ERROR_MESSAGE;
  return fallbackMessage;
}
