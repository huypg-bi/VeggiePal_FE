import apiClient from "@/shared/api/apiClient";

/**
 * Đăng nhập bằng email + mật khẩu (khớp /auth/login của identity-service).
 * Trả về: { token, user: { id, email, fullName, role } }
 * Ném lỗi (throw) kèm message lấy từ ApiResponse của backend nếu thất bại.
 */
export async function login({ email, password }) {
  const res = await apiClient.post("/auth/login", { email, password });

  if (res.status >= 400) {
    throw new Error(res.data?.message || "Đăng nhập thất bại");
  }

  const result = res.data.result;
  return {
    token: result.accessToken,
    user: {
      id: result.userId,
      email: result.email,
      fullName: result.fullName,
      role: result.role,
    },
  };
}

/**
 * Đăng ký tài khoản mới (khớp /auth/register của identity-service).
 * Backend không trả token khi đăng ký -> đăng ký xong phải đăng nhập lại.
 * Trả về: { id, email, fullName, phone, avatarUrl, role, status, emailVerified }
 */
export async function register({ email, password, fullName, phone }) {
  const res = await apiClient.post("/auth/register", {
    email,
    password,
    fullName,
    phone,
  });

  if (res.status >= 400) {
    throw new Error(res.data?.message || "Đăng ký thất bại");
  }

  return res.data.result;
}
