import axios from "axios";

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

export default apiClient;
