import test from "node:test";
import assert from "node:assert/strict";

import {
  getStatusBadgeText,
  mergeAndSortContent,
} from "./feedHelpers.js";

test("getStatusBadgeText trả đúng nhãn tiếng Việt cho các trạng thái", () => {
  assert.equal(getStatusBadgeText("PUBLISHED"), "#đã_xuất_bản");
  assert.equal(getStatusBadgeText("PENDING"), "#chờ_duyệt");
  assert.equal(getStatusBadgeText("DRAFT"), "#bản_nháp");
  assert.equal(getStatusBadgeText("REJECTED"), "#từ_chối");
  assert.equal(getStatusBadgeText("HIDDEN"), "#đã_ẩn");
  assert.equal(getStatusBadgeText(null), "#công_khai");
});

test("mergeAndSortContent gộp và sắp xếp đúng thứ tự thời gian giảm dần", () => {
  const blogs = [
    {
      id: 1,
      title: "Bài viết cũ",
      createdAt: "2026-10-01T10:00:00Z",
      status: "PUBLISHED",
    },
    {
      id: 2,
      title: "Bài viết mới nhất",
      publishedAt: "2026-10-15T12:00:00Z",
      status: "PUBLISHED",
    },
  ];

  const recipes = [
    {
      id: 10,
      title: "Công thức ở giữa",
      createdAt: "2026-10-10T08:00:00Z",
      status: "DRAFT",
      servings: 4,
    },
  ];

  const result = mergeAndSortContent(blogs, recipes);
  assert.equal(result.length, 3);
  assert.equal(result[0].id, "blog-2");
  assert.equal(result[1].id, "recipe-10");
  assert.equal(result[2].id, "blog-1");
  assert.equal(result[1].servings, 4);
});

test("mergeAndSortContent xử lý an toàn khi mảng rỗng hoặc null", () => {
  const emptyRes = mergeAndSortContent(null, undefined);
  assert.deepEqual(emptyRes, []);
});
