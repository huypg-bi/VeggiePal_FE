import { test } from "node:test";
import assert from "node:assert/strict";
import { Buffer } from "node:buffer";

import { clearSession, loadSession, saveSession } from "./authStorage.js";

// Storage giả giống localStorage/sessionStorage (chỉ cần 3 hàm dùng tới).
function fakeStorage() {
  const data = new Map();
  return {
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => data.set(k, String(v)),
    removeItem: (k) => data.delete(k),
    has: (k) => data.has(k),
  };
}

const b64url = (obj) => Buffer.from(JSON.stringify(obj)).toString("base64url");
const makeToken = (payload) => `${b64url({ alg: "HS256" })}.${b64url(payload)}.sig`;
const user = { id: 1, email: "a@b.c", fullName: "A" };

test("remember = true -> lưu ở localStorage, không để lại ở sessionStorage", () => {
  const local = fakeStorage();
  const session = fakeStorage();
  saveSession({ token: "t1", user, remember: true }, local, session);

  assert.equal(local.getItem("token"), "t1");
  assert.equal(session.has("token"), false);
  assert.deepEqual(loadSession(local, session), { token: "t1", user, remember: true });
});

test("remember = false -> lưu ở sessionStorage (mất khi đóng trình duyệt)", () => {
  const local = fakeStorage();
  const session = fakeStorage();
  saveSession({ token: "t2", user, remember: false }, local, session);

  assert.equal(session.getItem("token"), "t2");
  assert.equal(local.has("token"), false);
  assert.deepEqual(loadSession(local, session), { token: "t2", user, remember: false });
});

test("đổi từ ghi nhớ sang không ghi nhớ thì xóa bản cũ ở localStorage", () => {
  const local = fakeStorage();
  const session = fakeStorage();
  saveSession({ token: "t3", user, remember: true }, local, session);
  saveSession({ token: "t3", user, remember: false }, local, session);

  assert.equal(local.has("token"), false);
  assert.equal(local.has("user"), false);
  assert.equal(loadSession(local, session).remember, false);
});

test("loadSession trả về chưa đăng nhập khi không có gì được lưu", () => {
  assert.deepEqual(loadSession(fakeStorage(), fakeStorage()), {
    token: null,
    user: null,
    remember: false,
  });
});

test("loadSession bỏ và xóa token đã hết hạn", () => {
  const local = fakeStorage();
  const session = fakeStorage();
  const expired = makeToken({ exp: Math.floor(Date.now() / 1000) - 10 });
  saveSession({ token: expired, user, remember: true }, local, session);

  assert.equal(loadSession(local, session).token, null);
  assert.equal(local.has("token"), false);
});

test("loadSession giữ token còn hạn", () => {
  const local = fakeStorage();
  const session = fakeStorage();
  const valid = makeToken({ exp: Math.floor(Date.now() / 1000) + 3600 });
  saveSession({ token: valid, user, remember: true }, local, session);

  assert.equal(loadSession(local, session).token, valid);
});

test("loadSession chịu được dữ liệu user hỏng", () => {
  const local = fakeStorage();
  local.setItem("token", "t4");
  local.setItem("user", "{khong-phai-json");
  assert.deepEqual(loadSession(local, fakeStorage()), { token: "t4", user: null, remember: true });
});

test("clearSession xóa ở cả hai nơi", () => {
  const local = fakeStorage();
  const session = fakeStorage();
  saveSession({ token: "t5", user, remember: true }, local, session);
  session.setItem("token", "t5b");
  clearSession(local, session);

  assert.equal(local.has("token") || session.has("token") || local.has("user"), false);
});
