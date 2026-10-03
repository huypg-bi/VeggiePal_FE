import { test } from "node:test";
import assert from "node:assert/strict";

import { resolvePostLoginPath } from "./roleRedirect.js";

const admin = { role: "ADMIN" };
const user = { role: "USER" };

test("ADMIN đăng nhập xong vào /admin dù trước đó muốn vào trang khác", () => {
  assert.equal(resolvePostLoginPath(admin, undefined), "/admin");
  assert.equal(resolvePostLoginPath(admin, "/"), "/admin");
  assert.equal(resolvePostLoginPath(admin, "/profile"), "/admin");
  assert.equal(resolvePostLoginPath(admin, "/administrator"), "/admin");
});

test("ADMIN bị đá ra từ trang con của /admin thì quay lại đúng trang đó", () => {
  assert.equal(resolvePostLoginPath(admin, "/admin"), "/admin");
  assert.equal(resolvePostLoginPath(admin, "/admin/categories"), "/admin/categories");
});

test("người dùng thường quay lại trang trước đó, mặc định về trang chủ", () => {
  assert.equal(resolvePostLoginPath(user, "/profile"), "/profile");
  assert.equal(resolvePostLoginPath(user, undefined), "/");
  assert.equal(resolvePostLoginPath(user, ""), "/");
});
