import { test } from "node:test";
import assert from "node:assert/strict";

import { formatIngredientAmount, formatQuantity, formatUnit, sortSteps } from "./recipeFormat.js";

test("formatQuantity bỏ số 0 thừa và dùng dấu phẩy thập phân", () => {
  assert.equal(formatQuantity("200.00"), "200");
  assert.equal(formatQuantity("1.50"), "1,5");
  assert.equal(formatQuantity(0.25), "0,25");
});

test("formatQuantity trả chuỗi rỗng khi không phải số", () => {
  assert.equal(formatQuantity(null), "0");
  assert.equal(formatQuantity("abc"), "");
  assert.equal(formatQuantity(undefined), "");
});

test("formatUnit đổi chữ in hoa của BE sang chữ thường", () => {
  assert.equal(formatUnit("GRAM"), "gram");
  assert.equal(formatUnit(" Muỗng "), "muỗng");
  assert.equal(formatUnit(null), "");
});

test("formatIngredientAmount ghép số lượng và đơn vị", () => {
  assert.equal(formatIngredientAmount({ quantity: "200.00", unit: "GRAM" }), "200 gram");
  assert.equal(formatIngredientAmount({ quantity: "2.00", unit: "" }), "2");
});

test("sortSteps sắp theo stepNumber và không đổi mảng gốc", () => {
  const steps = [
    { stepNumber: 3, instruction: "c" },
    { stepNumber: 1, instruction: "a" },
    { stepNumber: 2, instruction: "b" },
  ];
  assert.deepEqual(
    sortSteps(steps).map((s) => s.instruction),
    ["a", "b", "c"]
  );
  assert.equal(steps[0].instruction, "c");
  assert.deepEqual(sortSteps(undefined), []);
});
