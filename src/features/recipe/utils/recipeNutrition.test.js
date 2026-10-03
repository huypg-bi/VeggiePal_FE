import { test } from "node:test";
import assert from "node:assert/strict";

import { calcRecipeNutrition, isGramUnit, toGrams, totalMinutes } from "./recipeNutrition.js";

const ingredients = new Map([
  [1, { id: 1, caloriesPer100g: 76, proteinPer100g: 8 }], // đậu hũ
  [2, { id: 2, caloriesPer100g: 111, proteinPer100g: 2.5 }], // gạo lứt
]);

test("toGrams quy đổi GRAM/G/KG không phân biệt hoa thường, đơn vị lạ trả null", () => {
  assert.equal(toGrams(200, "GRAM"), 200);
  assert.equal(toGrams("150", "g"), 150);
  assert.equal(toGrams(1.5, "kg"), 1500);
  assert.equal(toGrams(2, "MUONG"), null);
  assert.equal(toGrams(0, "GRAM"), null);
  assert.equal(toGrams(null, "GRAM"), null);
});

test("calcRecipeNutrition cộng theo gram rồi chia cho số khẩu phần", () => {
  const recipe = {
    servings: 2,
    ingredients: [
      { ingredientId: 1, quantity: 200, unit: "GRAM" }, // 152 kcal, 16g đạm
      { ingredientId: 2, quantity: 150, unit: "GRAM" }, // 166.5 kcal, 3.75g đạm
    ],
  };
  // (152 + 166.5) / 2 = 159.25 -> 159 ; (16 + 3.75) / 2 = 9.875 -> 9.9 (làm tròn 1 số lẻ)
  assert.deepEqual(calcRecipeNutrition(recipe, ingredients), {
    kcal: 159,
    protein: 9.9,
  });
});

test("calcRecipeNutrition trả null khi thiếu dữ liệu nguyên liệu hoặc đơn vị lạ", () => {
  const missing = {
    servings: 1,
    ingredients: [{ ingredientId: 99, quantity: 100, unit: "GRAM" }],
  };
  const oddUnit = {
    servings: 1,
    ingredients: [{ ingredientId: 1, quantity: 2, unit: "MUONG" }],
  };
  assert.equal(calcRecipeNutrition(missing, ingredients), null);
  assert.equal(calcRecipeNutrition(oddUnit, ingredients), null);
  assert.equal(calcRecipeNutrition({ servings: 1, ingredients: [] }, ingredients), null);
});

test("calcRecipeNutrition coi servings không hợp lệ là 1", () => {
  const recipe = {
    servings: 0,
    ingredients: [{ ingredientId: 1, quantity: 100, unit: "GRAM" }],
  };
  assert.deepEqual(calcRecipeNutrition(recipe, ingredients), { kcal: 76, protein: 8 });
});

test("totalMinutes cộng chuẩn bị + nấu, thiếu thì coi là 0", () => {
  assert.equal(totalMinutes({ prepTime: 15, cookTime: 30 }), 45);
  assert.equal(totalMinutes({ prepTime: null, cookTime: 20 }), 20);
  assert.equal(totalMinutes({}), 0);
});

test("isGramUnit chỉ đúng với đơn vị khối lượng quy đổi được ra gram", () => {
  assert.equal(isGramUnit("GRAM"), true);
  assert.equal(isGramUnit("kg"), true);
  assert.equal(isGramUnit("ML"), false);
  assert.equal(isGramUnit("PIECE"), false);
  assert.equal(isGramUnit(undefined), false);
});
