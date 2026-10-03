import { test } from "node:test";
import assert from "node:assert/strict";

import { chunk, normalizeIds } from "./ids.js";

test("normalizeIds bỏ trùng, bỏ giá trị lỗi và sắp xếp tăng dần", () => {
  assert.deepEqual(
    normalizeIds([3, "1", 3, 2, null, undefined, "abc", 0, -4, 1.5]),
    [1, 2, 3]
  );
});

test("normalizeIds trả mảng rỗng khi không có dữ liệu", () => {
  assert.deepEqual(normalizeIds(undefined), []);
  assert.deepEqual(normalizeIds([]), []);
});

test("chunk chia nhóm tối đa 50 phần tử", () => {
  const ids = Array.from({ length: 120 }, (_, i) => i + 1);
  const parts = chunk(ids, 50);
  assert.deepEqual(
    parts.map((p) => p.length),
    [50, 50, 20]
  );
  assert.equal(parts[2][19], 120);
});
