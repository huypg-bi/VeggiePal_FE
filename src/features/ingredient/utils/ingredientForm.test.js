import { test } from "node:test";
import assert from "node:assert/strict";

import { ingredientSchema } from "../schema.js";
import {
  emptyIngredientForm,
  formValuesToPayload,
  ingredientToFormValues,
} from "./ingredientForm.js";

const validForm = () => ({
  ...emptyIngredientForm(),
  name: "Đậu hũ",
  caloriesPer100g: "76",
  proteinPer100g: "8",
  carbsPer100g: "1,9",
  fatPer100g: "4.8",
});

const firstError = (values) => {
  const result = ingredientSchema.safeParse(values);
  return result.success ? null : result.error.issues[0].message;
};

test("ingredientSchema chấp nhận form hợp lệ, số dùng dấu phẩy hoặc chấm", () => {
  assert.equal(firstError(validForm()), null);
});

test("ingredientSchema bắt buộc tên và 4 chỉ số dinh dưỡng chính", () => {
  assert.equal(firstError({ ...validForm(), name: "  " }), "Vui lòng nhập tên nguyên liệu");
  assert.equal(firstError({ ...validForm(), caloriesPer100g: "" }), "Vui lòng nhập năng lượng");
  assert.equal(firstError({ ...validForm(), proteinPer100g: "" }), "Vui lòng nhập lượng đạm");
  assert.equal(firstError({ ...validForm(), carbsPer100g: "" }), "Vui lòng nhập lượng tinh bột");
  assert.equal(firstError({ ...validForm(), fatPer100g: "" }), "Vui lòng nhập lượng béo");
});

test("ingredientSchema từ chối số âm, chữ, hoặc quá 2 số thập phân; chất xơ được để trống", () => {
  const msg = "Nhập số từ 0 trở lên, tối đa 2 số thập phân";
  assert.equal(firstError({ ...validForm(), caloriesPer100g: "-5" }), msg);
  assert.equal(firstError({ ...validForm(), caloriesPer100g: "abc" }), msg);
  assert.equal(firstError({ ...validForm(), caloriesPer100g: "1.234" }), msg);
  assert.equal(firstError({ ...validForm(), fiberPer100g: "x" }), msg);
  assert.equal(firstError({ ...validForm(), fiberPer100g: "" }), null);
  assert.equal(firstError({ ...validForm(), caloriesPer100g: "0" }), null);
});

test("ingredientSchema giới hạn độ dài tên và mô tả", () => {
  assert.equal(firstError({ ...validForm(), name: "a".repeat(151) }), "Tên tối đa 150 ký tự");
  assert.equal(
    firstError({ ...validForm(), description: "a".repeat(1001) }),
    "Mô tả tối đa 1000 ký tự"
  );
});

test("formValuesToPayload đổi số, null hóa mô tả/chất xơ trống", () => {
  assert.deepEqual(formValuesToPayload({ ...validForm(), name: " Đậu hũ " }), {
    name: "Đậu hũ",
    description: null,
    caloriesPer100g: 76,
    proteinPer100g: 8,
    carbsPer100g: 1.9,
    fatPer100g: 4.8,
    fiberPer100g: null,
    vegan: true,
    allergen: false,
    active: true,
  });
});

test("ingredientToFormValues nạp IngredientResponse và qua lại schema được", () => {
  const values = ingredientToFormValues({
    name: "Cà chua",
    description: null,
    caloriesPer100g: 18.0,
    proteinPer100g: 0.9,
    carbsPer100g: 3.9,
    fatPer100g: 0.2,
    fiberPer100g: null,
    vegan: true,
    allergen: false,
    active: true,
  });
  assert.equal(values.caloriesPer100g, "18");
  assert.equal(values.fiberPer100g, "");
  assert.equal(values.description, "");
  assert.equal(firstError(values), null);
});
