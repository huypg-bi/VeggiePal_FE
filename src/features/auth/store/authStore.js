import { create } from "zustand";

/**
 * Nguồn sự thật về trạng thái đăng nhập của toàn app.
 * - token: lưu song song ở localStorage để giữ phiên khi F5 / mở tab mới.
 * - user: thông tin người dùng để UI hiển thị.
 */
export const useAuthStore = create((set) => ({
    token: localStorage.getItem("token") || null,
    user: JSON.parse(localStorage.getItem("user") || "null"),

    // gọi sau khi login thành công
    setAuth: ({ token, user }) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        set({ token, user });
    },

    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        set({ token: null, user: null });
    },
}));

// selector tiện dùng: const isAuthenticated = useAuthStore(selectIsAuthenticated)
export const selectIsAuthenticated = (s) => Boolean(s.token);
