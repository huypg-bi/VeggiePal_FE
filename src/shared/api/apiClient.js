import axios from "axios";

import { refreshSession } from "@/features/auth/api/refreshSession";
import { useAuthStore } from "@/features/auth/store/authStore";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_VEGGIEPAL_API_BASE_URL,
    validateStatus: () => true,
});

function authHeader() {
    const { token } = useAuthStore.getState();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

// Tự động đính token vào mọi request (thay cho việc truyền authHeader() từng chỗ)
apiClient.interceptors.request.use((config) => {
    Object.assign(config.headers, authHeader());
    return config;
});

// Access token chỉ sống 15 phút: gặp 401 thì làm mới bằng refresh token rồi gửi lại request đúng một lần.
apiClient.interceptors.response.use(async (res) => {
    const { config } = res;
    const skip = config.skipAuthRefresh || config.authRetried || config.url?.startsWith("/auth/");
    const { token, refreshToken } = useAuthStore.getState();
    if (res.status !== 401 || skip || !refreshToken) return res;

    // Request đi bằng token cũ mà request khác đã làm mới xong thì chỉ cần gửi lại, không đổi refresh token thêm lần nữa.
    const alreadyRefreshed = config.headers?.Authorization !== `Bearer ${token}`;
    if (!alreadyRefreshed && (await refreshSession()) !== "ok") return res;

    config.authRetried = true;
    return apiClient.request(config);
});

export default apiClient;
