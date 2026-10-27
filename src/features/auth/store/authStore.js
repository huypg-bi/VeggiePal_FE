import { create } from "zustand";

import { clearSession, loadSession, saveSession } from "@/features/auth/utils/authStorage";
import { queryClient } from "@/lib/queryClient";

// Khôi phục phiên khi mở app (token hết hạn sẽ bị bỏ ngay ở bước này).
const initial = loadSession();

export const useAuthStore = create((set, get) => ({
    token: initial.token,
    user: initial.user,
    remember: initial.remember,

    setAuth: ({ token, user, remember = get().remember }) => {
        saveSession({ token, user, remember });
        set({ token, user, remember });
    },

    logout: () => {
        clearSession();
        set({ token: null, user: null, remember: false });
        // Xóa cache React Query để user đăng nhập sau không thấy dữ liệu của user trước.
        queryClient.clear();
    },
}));

// selector tiện dùng: const isAuthenticated = useAuthStore(selectIsAuthenticated)
export const selectIsAuthenticated = (s) => Boolean(s.token);
