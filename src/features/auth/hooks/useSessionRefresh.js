import { useEffect, useRef } from "react";
import { toast } from "sonner";

import { refreshSession } from "@/features/auth/api/refreshSession";
import { useAuthStore } from "@/features/auth/store/authStore";
import { AUTH_STORAGE_KEYS } from "@/features/auth/utils/authStorage";
import { getTokenExpiryMs } from "@/lib/jwt";

// setTimeout chỉ nhận tối đa ~24,8 ngày; quá hạn đó thì hẹn lại theo từng đoạn.
const MAX_TIMEOUT_MS = 2 ** 31 - 1;
const REFRESH_LEAD_MS = 60 * 1000;
const RETRY_MS = 30 * 1000;
const MIN_GAP_MS = 10 * 1000;

/** Làm mới access token trước khi hết hạn; phiên cũ không có refresh token thì đăng xuất khi hết hạn. */
export function useSessionRefresh() {
  const token = useAuthStore((s) => s.token);
  const hasRefreshToken = useAuthStore((s) => Boolean(s.refreshToken));
  const logout = useAuthStore((s) => s.logout);
  const lastRefreshAt = useRef(0);

  useEffect(() => {
    const expiry = token ? getTokenExpiryMs(token) : null;
    if (!expiry) return;

    let timer;
    let cancelled = false;

    const check = async () => {
      const remaining = expiry - Date.now();

      if (!hasRefreshToken) {
        if (remaining <= 0) {
          logout();
          toast.info("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
          return;
        }
        timer = setTimeout(check, Math.min(remaining, MAX_TIMEOUT_MS));
        return;
      }

      if (remaining > REFRESH_LEAD_MS) {
        timer = setTimeout(check, Math.min(remaining - REFRESH_LEAD_MS, MAX_TIMEOUT_MS));
        return;
      }

      // Giờ máy lệch làm token mới vẫn "sắp hết hạn" thì không được làm mới liên tục.
      if (Date.now() - lastRefreshAt.current < MIN_GAP_MS) {
        timer = setTimeout(check, MIN_GAP_MS);
        return;
      }
      lastRefreshAt.current = Date.now();

      // "ok": token đổi nên effect chạy lại; "dead": đã đăng xuất; "unavailable": thử lại sau.
      const outcome = await refreshSession();
      if (!cancelled && outcome === "unavailable") timer = setTimeout(check, RETRY_MS);
    };

    check();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [token, hasRefreshToken, logout]);

  // Tab khác đăng nhập / làm mới / đăng xuất (localStorage) thì tab này lấy lại phiên cho khớp.
  useEffect(() => {
    const onStorage = (event) => {
      if (event.storageArea !== localStorage) return;
      if (event.key !== null && !AUTH_STORAGE_KEYS.includes(event.key)) return;
      useAuthStore.getState().syncFromStorage();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
}
