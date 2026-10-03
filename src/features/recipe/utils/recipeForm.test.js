import { test } from "node:test";
import assert from "node:assert/strict";

import { recipeSchema } from "../schema.js";
import { emptyRecipeForm, formValuesToPayload, recipeToFormValues } from "./recipeForm.js";

const validForm = () => ({
  title: "Cơm gạo lứt đậu hũ",
  description: "",
  imageUrl: "",
  servings: "2",
  prepTime: "15",
  cookTime: "",
  ingredients: [
    { ingredientId: 1, ingredientName: "Đậu hũ", quantity: "200", unit: "GRAM", note: "" },
  ],
  steps: [{ instruction: "Áp chảo đậu hũ" }],
});

const firstError = (values) => {
  const result = recipeSchema.safeParse(values);
  return result.success ? null : result.error.issues[0].message;
};

test("recipeSchema chấp nhận form hợp lệ", () => {
  assert.equal(firstError(validForm()), null);
});

test("recipeSchema kiểm tra tên, khẩu phần và thời gian", () => {
  assert.equal(firstError({ ...validForm(), title: " " }), "Vui lòng nhập tên công thức");
  assert.equal(
    firstError({ ...validForm(), servings: "0" }),
    "Số khẩu phần phải là số nguyên từ 1 trở lên"
  );
  assert.equal(
    firstError({ ...validForm(), prepTime: "-5" }),
    "Thời gian chuẩn bị phải là số nguyên không âm"
  );
  assert.equal(firstError({ ...validForm(), cookTime: "" }), null);
});

test("recipeSchema kiểm tra link ảnh", () => {
  assert.equal(firstError({ ...validForm(), imageUrl: "https://a.com/x.jpg" }), null);
  assert.equal(
    firstError({ ...validForm(), imageUrl: "anh.jpg" }),
    "Link ảnh phải bắt đầu bằng http:// hoặc https://"
  );
});

test("recipeSchema bắt buộc có nguyên liệu và bước", () => {
  assert.equal(firstError({ ...validForm(), ingredients: [] }), "Thêm ít nhất 1 nguyên liệu");
  assert.equal(firstError({ ...validForm(), steps: [] }), "Thêm ít nhất 1 bước thực hiện");
  assert.equal(
    firstError({ ...validForm(), steps: [{ instruction: "  " }] }),
    "Vui lòng nhập nội dung bước"
  );
});

test("recipeSchema chấp nhận số lượng dùng dấu phẩy, từ chối < 0,01 hoặc quá 2 số lẻ", () => {
  const withQty = (quantity) => ({
    ...validForm(),
    ingredients: [{ ingredientId: 1, ingredientName: "x", quantity, unit: "GRAM", note: "" }],
  });
  assert.equal(firstError(withQty("0,5")), null);
  assert.equal(firstError(withQty("0.01")), null);
  const msg = "Số lượng tối thiểu 0,01 và tối đa 2 số thập phân";
  assert.equal(firstError(withQty("0")), msg);
  assert.equal(firstError(withQty("0.001")), msg);
  assert.equal(firstError(withQty("abc")), msg);
  assert.equal(firstError(withQty("")), msg);
});

test("formValuesToPayload đổi kiểu, đánh số bước theo vị trí và null hóa trường trống", () => {
  const payload = formValuesToPayload({
    ...validForm(),
    title: "  Cơm  ",
    ingredients: [
      { ingredientId: 1, ingredientName: "Đậu hũ", quantity: "0,5", unit: "KG", note: " cắt vuông " },
      { ingredientId: 2, ingredientName: "Gạo", quantity: "150", unit: "GRAM", note: "" },
    ],
    steps: [{ instruction: " Bước một " }, { instruction: "Bước hai" }],
  });
  assert.deepEqual(payload, {
    title: "Cơm",
    description: null,
    imageUrl: null,
    servings: 2,
    prepTime: 15,
    cookTime: null,
    ingredients: [
      { ingredientId: 1, quantity: 0.5, unit: "KG", note: "cắt vuông" },
      { ingredientId: 2, quantity: 150, unit: "GRAM", note: null },
    ],
    steps: [
      { stepNumber: 1, instruction: "Bước một" },
      { stepNumber: 2, instruction: "Bước hai" },
    ],
  });
});

test("recipeToFormValues nạp RecipeResponse vào form, sắp bước theo stepNumber", () => {
  const values = recipeToFormValues({
    title: "Cơm",
    description: null,
    imageUrl: null,
    servings: 3,
    prepTime: null,
    cookTime: 20,
    ingredients: [{ ingredientId: 1, ingredientName: "Đậu hũ", quantity: 200, unit: "GRAM", note: null }],
    steps: [
      { stepNumber: 2, instruction: "Hai" },
      { stepNumber: 1, instruction: "Một" },
    ],
  });
  assert.equal(values.servings, "3");
  assert.equal(values.prepTime, "");
  assert.equal(values.cookTime, "20");
  assert.equal(values.ingredients[0].quantity, "200");
  assert.equal(values.ingredients[0].note, "");
  assert.deepEqual(values.steps, [{ instruction: "Một" }, { instruction: "Hai" }]);
  // Nạp rồi gửi lại phải qua được schema
  assert.equal(firstError(values), null);
});

test("emptyRecipeForm có sẵn 1 bước trống và chưa có nguyên liệu", () => {
  const form = emptyRecipeForm();
  assert.equal(form.steps.length, 1);
  assert.equal(form.ingredients.length, 0);
});
