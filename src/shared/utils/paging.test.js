import { test } from "node:test";
import assert from "node:assert/strict";

import { flattenPages, getNextPageNumber } from "./paging.js";

test("getNextPageNumber trả trang kế tiếp khi còn, undefined khi hết", () => {
  assert.equal(getNextPageNumber({ page: 0, totalPages: 3 }), 1);
  assert.equal(getNextPageNumber({ page: 1, totalPages: 3 }), 2);
  assert.equal(getNextPageNumber({ page: 2, totalPages: 3 }), undefined);
  assert.equal(getNextPageNumber({ page: 0, totalPages: 0 }), undefined);
  assert.equal(getNextPageNumber(undefined), undefined);
});

test("flattenPages gộp items của các trang theo thứ tự", () => {
  const data = { pages: [{ items: [1, 2] }, { items: [3] }, {}] };
  assert.deepEqual(flattenPages(data), [1, 2, 3]);
  assert.deepEqual(flattenPages(undefined), []);
});

test("flattenPages đọc field khác khi truyền key (recipe-service dùng content)", () => {
  const data = { pages: [{ content: ["a"] }, { content: ["b", "c"] }] };
  assert.deepEqual(flattenPages(data, "content"), ["a", "b", "c"]);
});
