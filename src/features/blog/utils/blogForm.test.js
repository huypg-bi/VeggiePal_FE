import { test } from "node:test";
import assert from "node:assert/strict";

import { blogSchema } from "../schema.js";
import { describeBlogOutcome, validateThumbnail } from "./blogForm.js";

test("validateThumbnail chấp nhận JPEG/PNG/WEBP ≤ 5MB và bỏ qua khi không có file", () => {
  assert.equal(validateThumbnail(undefined), null);
  assert.equal(validateThumbnail({ type: "image/jpeg", size: 1000 }), null);
  assert.equal(validateThumbnail({ type: "image/png", size: 5 * 1024 * 1024 }), null);
  assert.equal(validateThumbnail({ type: "image/webp", size: 10 }), null);
});

test("validateThumbnail từ chối sai định dạng hoặc quá 5MB", () => {
  assert.equal(
    validateThumbnail({ type: "image/gif", size: 10 }),
    "Ảnh bìa phải là JPEG, PNG hoặc WEBP"
  );
  assert.equal(
    validateThumbnail({ type: "image/png", size: 5 * 1024 * 1024 + 1 }),
    "Ảnh bìa không được vượt quá 5MB"
  );
});

test("describeBlogOutcome báo đúng kết quả kiểm duyệt", () => {
  assert.equal(describeBlogOutcome({ status: "PUBLISHED" }).tone, "success");
  assert.equal(describeBlogOutcome({ status: "PENDING" }).tone, "info");
  assert.equal(describeBlogOutcome({ status: "DRAFT" }).message, "Đã lưu bản nháp");
  const rejected = describeBlogOutcome({ status: "REJECTED", moderationReason: "Chứa từ ngữ cấm" });
  assert.equal(rejected.tone, "error");
  assert.match(rejected.message, /Chứa từ ngữ cấm/);
  assert.equal(
    describeBlogOutcome({ status: "REJECTED" }).message,
    "Bài viết không vượt qua kiểm duyệt"
  );
});

const valid = { title: "Súp bí đỏ", categoryId: "3", content: "Nội dung bài viết đủ dài rồi nhé." };
const firstError = (values) => {
  const result = blogSchema.safeParse(values);
  return result.success ? null : result.error.issues[0].message;
};

test("blogSchema chấp nhận bài hợp lệ và cắt khoảng trắng hai đầu", () => {
  const result = blogSchema.safeParse({ ...valid, title: "  Súp bí đỏ  " });
  assert.equal(result.success, true);
  assert.equal(result.data.title, "Súp bí đỏ");
});

test("blogSchema kiểm tra tiêu đề, danh mục và độ dài nội dung", () => {
  assert.equal(firstError({ ...valid, title: "  " }), "Vui lòng nhập tiêu đề");
  assert.equal(firstError({ ...valid, title: "a".repeat(151) }), "Tiêu đề tối đa 150 ký tự");
  assert.equal(firstError({ ...valid, title: "a".repeat(150) }), null);
  assert.equal(firstError({ ...valid, categoryId: "" }), "Vui lòng chọn danh mục");
  assert.equal(firstError({ ...valid, content: "ngắn quá" }), "Nội dung tối thiểu 20 ký tự");
  assert.equal(firstError({ ...valid, content: "a".repeat(20) }), null);
  assert.equal(firstError({ ...valid, content: "   " }), "Vui lòng nhập nội dung bài viết");
});
