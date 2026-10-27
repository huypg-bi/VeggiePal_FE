// Import tương đối (không dùng "@/") để file này chạy được cả trong `npm test` của Node.
import { isTokenExpired } from "../../../lib/jwt.js";

const TOKEN_KEY = "token";
const USER_KEY = "user";

function parseUser(raw) {
  try {
    return JSON.parse(raw ?? "null");
  } catch {
    return null;
  }
}

export function clearSession(local = localStorage, session = sessionStorage) {
  for (const storage of [local, session]) {
    storage.removeItem(TOKEN_KEY);
    storage.removeItem(USER_KEY);
  }
}

/** Đọc phiên đã lưu. Token đã hết hạn thì xóa luôn và coi như chưa đăng nhập. */
export function loadSession(local = localStorage, session = sessionStorage) {
  for (const [storage, remember] of [[local, true], [session, false]]) {
    const token = storage.getItem(TOKEN_KEY);
    if (!token) continue;

    if (isTokenExpired(token)) {
      clearSession(local, session);
      break;
    }
    return { token, user: parseUser(storage.getItem(USER_KEY)), remember };
  }
  return { token: null, user: null, remember: false };
}

/** Lưu phiên vào đúng nơi theo `remember`, đồng thời xóa bản ở nơi còn lại. */
export function saveSession(
  { token, user, remember },
  local = localStorage,
  session = sessionStorage
) {
  const [target, other] = remember ? [local, session] : [session, local];
  other.removeItem(TOKEN_KEY);
  other.removeItem(USER_KEY);
  target.setItem(TOKEN_KEY, token);
  target.setItem(USER_KEY, JSON.stringify(user));
}
