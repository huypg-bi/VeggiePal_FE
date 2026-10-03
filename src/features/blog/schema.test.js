import { test } from "node:test";
import assert from "node:assert/strict";

import { commentSchema } from "./schema.js";
import { countWords } from "./utils/commentText.js";

const firstError = (content) => {
  const result = commentSchema.safeParse({ content });
  return result.success ? null : result.error.issues[0].message;
};

test("countWords đếm theo khoảng trắng, bỏ khoảng trắng thừa", () => {
  assert.equal(countWords(""), 0);
  assert.equal(countWords("   "), 0);
  assert.equal(countWords("  một  hai\nba\tbốn "), 4);
  assert.equal(countWords(undefined), 0);
});

test("commentSchema chấp nhận bình luận hợp lệ và cắt khoảng trắng hai đầu", () => {
  const result = commentSchema.safeParse({ content: "  Món này ngon quá!  " });
  assert.equal(result.success, true);
  assert.equal(result.data.content, "Món này ngon quá!");
});

test("commentSchema từ chối nội dung trống", () => {
  assert.equal(firstError("   "), "Vui lòng nhập nội dung bình luận");
});

test("commentSchema từ chối quá 500 từ nhưng nhận đúng 500 từ", () => {
  assert.equal(firstError(Array(500).fill("a").join(" ")), null);
  assert.equal(firstError(Array(501).fill("a").join(" ")), "Bình luận tối đa 500 từ");
});

test("commentSchema từ chối quá 5000 ký tự", () => {
  assert.equal(firstError("a".repeat(5001)), "Bình luận tối đa 5000 ký tự");
});
