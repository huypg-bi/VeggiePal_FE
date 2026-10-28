import { toast } from "sonner";

import { refreshAccessToken } from "@/features/auth/api/authApi";
import { useAuthStore } from "@/features/auth/store/authStore";
import { loadSession } from "@/features/auth/utils/authStorage";

let inFlight = null;

/** Làm mới phiên bằng refresh token. Trả "ok" | "dead" (đã đăng xuất) | "unavailable" (lỗi tạm, thử lại sau). */
export function refreshSession() {
  inFlight ??= run().finally(() => {
    inFlight = null;
  });
  return inFlight;
}

async function run() {
  const { refreshToken: used, remember } = useAuthStore.getState();
  if (!used) return "dead";

  const { outcome, session } = await refreshAccessToken(used);

  if (outcome === "ok") {
    useAuthStore.getState().setAuth({ ...session, remember });
    return "ok";
  }
  if (outcome === "unavailable") return "unavailable";

  // Refresh token dùng một lần: tab khác có thể đã đổi nó trước, khi đó lấy cặp mới từ localStorage.
  const stored = loadSession();
  if (stored.refreshToken && stored.refreshToken !== used) {
    useAuthStore.getState().syncFromStorage();
    return "ok";
  }

  if (useAuthStore.getState().token) {
    useAuthStore.getState().logout();
    toast.info("Phiên đăng nhập đã hết hạn hoặc tài khoản không còn hoạt động, vui lòng đăng nhập lại.");
  }
  return "dead";
}
