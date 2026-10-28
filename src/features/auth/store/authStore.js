import { create } from "zustand";

import { revokeRefreshToken } from "@/features/auth/api/authApi";
import { clearSession, loadSession, saveSession } from "@/features/auth/utils/authStorage";
import { queryClient } from "@/lib/queryClient";

// Khôi phục phiên khi mở app (token hết hạn mà không có refresh token sẽ bị bỏ ngay ở bước này).
const initial = loadSession();

export const useAuthStore = create((set, get) => ({
    token: initial.token,
    refreshToken: initial.refreshToken,
    user: initial.user,
    remember: initial.remember,

    setAuth: ({ token, refreshToken = null, user, remember = get().remember }) => {
        saveSession({ token, refreshToken, user, remember });
        set({ token, refreshToken, user, remember });
    },

    // Tab khác vừa đổi / xóa phiên trong localStorage thì lấy lại cho khớp.
    syncFromStorage: () => set(loadSession()),

    logout: () => {
        const { refreshToken } = get();
        clearSession();
        set({ token: null, refreshToken: null, user: null, remember: false });
        // Xóa cache React Query để user đăng nhập sau không thấy dữ liệu của user trước.
        queryClient.clear();
        // Báo BE hủy refresh token của thiết bị này (không chờ, lỗi bỏ qua).
        if (refreshToken) revokeRefreshToken(refreshToken);
    },
}));

// selector tiện dùng: const isAuthenticated = useAuthStore(selectIsAuthenticated)
export const selectIsAuthenticated = (s) => Boolean(s.token);
