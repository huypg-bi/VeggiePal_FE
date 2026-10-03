import { test } from "node:test";
import assert from "node:assert/strict";

import {
  flattenCategories,
  hasActiveFilters,
  parseFeedFilters,
  toFeedSearchParams,
} from "./feedFilters.js";

test("parseFeedFilters đọc q/sort/category hợp lệ", () => {
  const filters = parseFeedFilters(new URLSearchParams("q=%20bí%20đỏ%20&sort=popular&category=7"));
  assert.deepEqual(filters, { keyword: "bí đỏ", sort: "popular", categoryId: 7 });
});

test("parseFeedFilters bỏ qua sort/category lạ trên URL", () => {
  const filters = parseFeedFilters(new URLSearchParams("sort=hack&category=abc"));
  assert.deepEqual(filters, { keyword: "", sort: "", categoryId: undefined });
  assert.equal(parseFeedFilters(new URLSearchParams("category=0")).categoryId, undefined);
  assert.equal(parseFeedFilters(new URLSearchParams("category=-3")).categoryId, undefined);
});

test("toFeedSearchParams bỏ giá trị mặc định và rỗng", () => {
  assert.equal(toFeedSearchParams({ keyword: "  ", sort: "", categoryId: undefined }).toString(), "");
  const params = toFeedSearchParams({ keyword: "súp", sort: "mostViewed", categoryId: 3 });
  assert.equal(params.get("q"), "súp");
  assert.equal(params.get("sort"), "mostViewed");
  assert.equal(params.get("category"), "3");
});

test("parse và toSearchParams là nghịch đảo của nhau", () => {
  const filters = { keyword: "đậu hũ", sort: "popular", categoryId: 12 };
  assert.deepEqual(parseFeedFilters(toFeedSearchParams(filters)), filters);
});

test("hasActiveFilters", () => {
  assert.equal(hasActiveFilters({ keyword: "", sort: "", categoryId: undefined }), false);
  assert.equal(hasActiveFilters({ keyword: "", sort: "popular", categoryId: undefined }), true);
  assert.equal(hasActiveFilters({ keyword: "a", sort: "", categoryId: undefined }), true);
});

test("flattenCategories xếp cha rồi tới con", () => {
  const tree = [
    { id: 1, name: "Món chính", children: [{ id: 3, name: "Món canh" }] },
    { id: 2, name: "Tráng miệng", children: [] },
    { id: 4, name: "Đồ uống" },
  ];
  assert.deepEqual(
    flattenCategories(tree).map((c) => c.id),
    [1, 3, 2, 4]
  );
  assert.deepEqual(flattenCategories(undefined), []);
});
