// Import tương đối (không dùng "@/") để file này chạy được cả trong `npm test` của Node.
import { isTokenExpired } from "../../../lib/jwt.js";

const TOKEN_KEY = "token";
const REFRESH_KEY = "refreshToken";
const USER_KEY = "user";

export const AUTH_STORAGE_KEYS = [TOKEN_KEY, REFRESH_KEY, USER_KEY];

function parseUser(raw) {
  try {
    return JSON.parse(raw ?? "null");
  } catch {
    return null;
  }
}

export function clearSession(local = localStorage, session = sessionStorage) {
  for (const storage of [local, session]) {
    for (const key of AUTH_STORAGE_KEYS) storage.removeItem(key);
  }
}

/** Đọc phiên đã lưu. Token hết hạn mà không có refresh token thì không khôi phục được: xóa luôn. */
export function loadSession(local = localStorage, session = sessionStorage) {
  for (const [storage, remember] of [[local, true], [session, false]]) {
    const token = storage.getItem(TOKEN_KEY);
    if (!token) continue;

    const refreshToken = storage.getItem(REFRESH_KEY);
    if (isTokenExpired(token) && !refreshToken) {
      clearSession(local, session);
      break;
    }
    return { token, refreshToken, user: parseUser(storage.getItem(USER_KEY)), remember };
  }
  return { token: null, refreshToken: null, user: null, remember: false };
}

/** Lưu phiên vào đúng nơi theo `remember`, đồng thời xóa bản ở nơi còn lại. */
export function saveSession(
  { token, refreshToken, user, remember },
  local = localStorage,
  session = sessionStorage
) {
  const [target, other] = remember ? [local, session] : [session, local];
  for (const key of AUTH_STORAGE_KEYS) other.removeItem(key);
  target.setItem(TOKEN_KEY, token);
  if (refreshToken) target.setItem(REFRESH_KEY, refreshToken);
  else target.removeItem(REFRESH_KEY);
  target.setItem(USER_KEY, JSON.stringify(user));
}
