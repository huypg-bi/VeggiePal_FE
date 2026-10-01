import { test } from "node:test";
import assert from "node:assert/strict";
import { Buffer } from "node:buffer";

import { getTokenExpiryMs, isTokenExpired } from "./jwt.js";

// Tạo JWT giả (không ký) chỉ để test phần đọc payload.
const b64url = (obj) => Buffer.from(JSON.stringify(obj)).toString("base64url");
const makeToken = (payload) => `${b64url({ alg: "HS256" })}.${b64url(payload)}.chu-ky`;

test("getTokenExpiryMs đọc exp (giây) và trả về mili giây", () => {
  assert.equal(getTokenExpiryMs(makeToken({ exp: 1700000000 })), 1700000000 * 1000);
});

test("getTokenExpiryMs đọc được payload có ký tự tiếng Việt", () => {
  const token = makeToken({ fullName: "Nguyễn Văn Á", exp: 1800000000 });
  assert.equal(getTokenExpiryMs(token), 1800000000 * 1000);
});

test("getTokenExpiryMs trả null khi không phải JWT hoặc thiếu exp", () => {
  assert.equal(getTokenExpiryMs("khong-phai-jwt"), null);
  assert.equal(getTokenExpiryMs(""), null);
  assert.equal(getTokenExpiryMs(makeToken({ sub: "1" })), null);
  assert.equal(getTokenExpiryMs(makeToken({ exp: "abc" })), null);
});

test("isTokenExpired: hết hạn khi exp <= hiện tại, chưa hết khi exp còn ở tương lai", () => {
  const now = 1_000_000_000_000; // ms
  assert.equal(isTokenExpired(makeToken({ exp: now / 1000 - 1 }), now), true);
  assert.equal(isTokenExpired(makeToken({ exp: now / 1000 }), now), true);
  assert.equal(isTokenExpired(makeToken({ exp: now / 1000 + 60 }), now), false);
});

test("isTokenExpired: không đọc được hạn thì coi như chưa hết (server quyết định)", () => {
  assert.equal(isTokenExpired("khong-phai-jwt"), false);
});
