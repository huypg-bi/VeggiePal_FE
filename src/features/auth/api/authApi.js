import {
  LOGIN_FAILED_MESSAGE,
  NETWORK_ERROR_MESSAGE,
  toAuthError,
} from "@/features/auth/utils/authErrors";
import { classifyRefreshResponse } from "@/features/auth/utils/refreshOutcome";
import apiClient from "@/shared/api/apiClient";

// LoginResponse của identity-service (dùng chung cho login, Google, verify-email, refresh) -> { token, refreshToken, user }.
function toSession(result) {
  return {
    token: result.accessToken,
    refreshToken: result.refreshToken ?? null,
    user: {
      id: result.userId,
      email: result.email,
      fullName: result.fullName,
      role: result.role,
    },
  };
}

// validateStatus tắt throw theo status, nên chỉ còn lỗi mạng / máy chủ không phản hồi rơi vào catch.
async function post(path, body, config) {
  try {
    return await apiClient.post(path, body, config);
  } catch (error) {
    throw new Error(NETWORK_ERROR_MESSAGE, { cause: error });
  }
}

export async function login({ email, password }) {
  const res = await post("/auth/login", { email, password });

  if (res.status >= 400) {
    // 1008 = UNAUTHENTICATED: BE không phân biệt "không có email" và "sai mật khẩu".
    throw toAuthError(res, "Đăng nhập thất bại", { 1008: LOGIN_FAILED_MESSAGE });
  }

  return toSession(res.data.result);
}

export async function loginWithGoogle(idToken) {
  const res = await post("/auth/google", { idToken });

  if (res.status >= 400) {
    // 1019 = GOOGLE_TOKEN_INVALID (token sai/hết hạn, email chưa xác minh, hoặc BE chưa cấu hình GOOGLE_CLIENT_ID).
    throw toAuthError(res, "Đăng nhập bằng Google thất bại");
  }

  return toSession(res.data.result);
}

export async function register({ email, password, fullName, phone }) {
  const res = await post("/auth/register", {
    email,
    password,
    fullName,
    phone,
  });

  if (res.status >= 400) {
    throw toAuthError(res, "Đăng ký thất bại");
  }

  return res.data.result;
}

/** POST /auth/verify-email — mã đúng thì tài khoản ACTIVE và BE đăng nhập luôn. */
export async function verifyEmail({ email, otp }) {
  const res = await post("/auth/verify-email", { email, otp });

  if (res.status >= 400) {
    throw toAuthError(res, "Xác minh email thất bại");
  }

  return toSession(res.data.result);
}

/** POST /auth/resend-verification — BE luôn báo thành công, kể cả khi email không hợp lệ hoặc chưa đủ 60 giây. */
export async function resendVerification(email) {
  const res = await post("/auth/resend-verification", { email });

  if (res.status >= 400) {
    throw toAuthError(res, "Không gửi lại được mã, vui lòng thử lại");
  }
}

/** POST /auth/forgot-password — BE luôn báo thành công để không lộ email nào đã đăng ký. */
export async function forgotPassword(email) {
  const res = await post("/auth/forgot-password", { email });

  if (res.status >= 400) {
    throw toAuthError(res, "Không gửi được mã xác nhận, vui lòng thử lại");
  }
}

/** POST /auth/verify-otp — đổi mã đúng lấy resetToken dùng một lần (10 phút). */
export async function verifyResetOtp({ email, otp }) {
  const res = await post("/auth/verify-otp", { email, otp });

  if (res.status >= 400) {
    throw toAuthError(res, "Xác nhận mã thất bại");
  }

  return res.data.result;
}

/** POST /auth/reset-password — đổi mật khẩu và đăng xuất mọi thiết bị. */
export async function resetPassword({ resetToken, newPassword }) {
  const res = await post("/auth/reset-password", { resetToken, newPassword });

  if (res.status >= 400) {
    throw toAuthError(res, "Đặt lại mật khẩu thất bại");
  }
}

/** POST /auth/refresh — đổi refresh token (dùng một lần) lấy cặp token mới. Trả { outcome, session? }, không throw. */
export async function refreshAccessToken(refreshToken) {
  try {
    const res = await apiClient.post("/auth/refresh", { refreshToken }, { skipAuthRefresh: true });
    const outcome = classifyRefreshResponse(res);
    return outcome === "ok" ? { outcome, session: toSession(res.data.result) } : { outcome };
  } catch {
    return { outcome: "unavailable" };
  }
}

/** POST /auth/logout — hủy refresh token của thiết bị này; lỗi thì bỏ qua vì phiên phía FE đã xóa. */
export function revokeRefreshToken(refreshToken) {
  apiClient.post("/auth/logout", { refreshToken }, { skipAuthRefresh: true }).catch(() => {});
}
