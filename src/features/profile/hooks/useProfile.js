import { useCallback, useEffect, useState } from "react";

import { useAuthStore } from "@/features/auth/store/authStore";
import { getProfile } from "@/features/profile/api/profileApi";

/**
 * Load hồ sơ hiện tại (GET /users/me) và đồng bộ user vào authStore.
 * Fallback nhẹ từ authStore nếu API lỗi.
 */
export function useProfile() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const token = useAuthStore((s) => s.token);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const syncAuthUser = useCallback(
    (p) => {
      if (!p || !token) return;
      // Giữ token, cập nhật user trong store (fullName / avatar hiển thị header)
      setAuth({
        token,
        user: {
          id: p.id,
          email: p.email,
          fullName: p.fullName,
          role: p.role,
          avatarUrl: p.avatarUrl,
        },
      });
    },
    [setAuth, token]
  );

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getProfile();
      setProfile(data);
      syncAuthUser(data);
    } catch (err) {
      setError(err.message || "Không tải được hồ sơ");
      // fallback nhẹ từ auth store nếu API lỗi (đọc trực tiếp, không subscribe
      // để tránh loadProfile bị tái tạo mỗi khi store user đổi -> gọi lặp vô hạn)
      const fallbackUser = useAuthStore.getState().user;
      if (fallbackUser) {
        setProfile({
          id: fallbackUser.id,
          email: fallbackUser.email,
          fullName: fallbackUser.fullName,
          role: fallbackUser.role,
          phone: null,
          avatarUrl: fallbackUser.avatarUrl || null,
          dateOfBirth: null,
          emailVerified: false,
        });
      }
    } finally {
      setLoading(false);
    }
  }, [syncAuthUser]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const updateProfile = useCallback(
    (updated) => {
      setProfile(updated);
      syncAuthUser(updated);
    },
    [syncAuthUser]
  );

  return { profile, loading, error, updateProfile };
}
