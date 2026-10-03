import { test } from "node:test";
import assert from "node:assert/strict";

import { categorySchema } from "../schema.js";
import {
  categoryToFormValues,
  categoryTypeLabel,
  emptyCategoryForm,
  formValuesToCategoryPayload,
} from "./categoryForm.js";

const firstError = (values) => {
  const result = categorySchema.safeParse(values);
  return result.success ? null : result.error.issues[0].message;
};

test("categorySchema chấp nhận form hợp lệ và để trống thứ tự", () => {
  assert.equal(firstError({ ...emptyCategoryForm(), name: "Món canh" }), null);
  assert.equal(firstError({ ...emptyCategoryForm(), name: "Món canh", displayOrder: "5" }), null);
});

test("categorySchema kiểm tra tên và thứ tự hiển thị", () => {
  assert.equal(firstError({ ...emptyCategoryForm(), name: "  " }), "Vui lòng nhập tên danh mục");
  assert.equal(
    firstError({ ...emptyCategoryForm(), name: "a".repeat(101) }),
    "Tên danh mục tối đa 100 ký tự"
  );
  const msg = "Thứ tự là số nguyên từ 0 đến 32767";
  assert.equal(firstError({ ...emptyCategoryForm(), name: "a", displayOrder: "-1" }), msg);
  assert.equal(firstError({ ...emptyCategoryForm(), name: "a", displayOrder: "32768" }), msg);
  assert.equal(firstError({ ...emptyCategoryForm(), name: "a", displayOrder: "1.5" }), msg);
});

test("danh mục gốc gửi type, không gửi parentId", () => {
  const payload = formValuesToCategoryPayload(
    { name: " Món chay ", type: "RECIPE_TYPE", displayOrder: "2", active: true },
    {}
  );
  assert.deepEqual(payload, { name: "Món chay", active: true, displayOrder: 2, type: "RECIPE_TYPE" });
});

test("danh mục con gửi parentId, không gửi type", () => {
  const payload = formValuesToCategoryPayload(
    { name: "Canh", type: "FOOD_TYPE", displayOrder: "", active: false },
    { parentId: 7 }
  );
  assert.deepEqual(payload, { name: "Canh", active: false, parentId: 7 });
});

test("sửa danh mục không gửi type và parentId", () => {
  const payload = formValuesToCategoryPayload(
    { name: "Canh", type: "FOOD_TYPE", displayOrder: "3", active: true },
    { isEdit: true, parentId: 7 }
  );
  assert.deepEqual(payload, { name: "Canh", active: true, displayOrder: 3 });
});

test("categoryToFormValues và nhãn loại", () => {
  assert.deepEqual(
    categoryToFormValues({ name: "Canh", type: "FOOD_TYPE", displayOrder: 4, active: false }),
    { name: "Canh", type: "FOOD_TYPE", displayOrder: "4", active: false }
  );
  assert.equal(categoryTypeLabel("FOOD_TYPE"), "Loại món ăn");
  assert.equal(categoryTypeLabel("OTHER"), "OTHER");
});
