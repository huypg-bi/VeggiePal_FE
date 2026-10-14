import test from "node:test";
import assert from "node:assert/strict";

import {
  calcChartPoints,
  calcTrendAnalysis,
  formatAxisDate,
} from "./bmiChartHelpers.js";

test("formatAxisDate format đúng ngày/tháng tiếng Việt", () => {
  assert.equal(formatAxisDate("2026-10-14T08:00:00Z"), "14/10");
  assert.equal(formatAxisDate(null), "—");
  assert.equal(formatAxisDate("invalid-date"), "—");
});

test("calcChartPoints trả về null khi ít hơn 2 điểm", () => {
  assert.equal(calcChartPoints([]), null);
  assert.equal(calcChartPoints([{ bmi: 22.5, recordedAt: "2026-10-01" }]), null);
  assert.equal(calcChartPoints(null), null);
});

test("calcChartPoints tính toạ độ và sinh path SVG chính xác", () => {
  const records = [
    { bmi: 22.0, recordedAt: "2026-10-01" },
    { bmi: 21.5, recordedAt: "2026-10-15" },
    { bmi: 21.0, recordedAt: "2026-10-30" },
  ];

  const res = calcChartPoints(records, "bmi", 500, 120);
  assert.ok(res);
  assert.equal(res.points.length, 3);
  // Điểm đầu x=10, điểm cuối x=490
  assert.equal(res.points[0].x, 10);
  assert.equal(res.points[2].x, 490);
  // Điểm đầu cao nhất (22.0) nên y nhỏ nhất (20)
  assert.equal(res.points[0].y, 20);
  // Điểm cuối thấp nhất (21.0) nên y cao nhất (85)
  assert.equal(res.points[2].y, 85);
  assert.ok(res.linePath.startsWith("M 10 20 L"));
  assert.ok(res.areaPath.includes("L 490 120 L 10 120 Z"));
});

test("calcTrendAnalysis trả về null khi không đủ bản ghi", () => {
  assert.equal(calcTrendAnalysis([]), null);
  assert.equal(calcTrendAnalysis([{ bmi: 22.0 }]), null);
});

test("calcTrendAnalysis tính đúng độ lệch âm, dương và số ngày", () => {
  const downRecords = [
    { bmi: 22.8, weightKg: 65, recordedAt: "2026-08-30T00:00:00Z" },
    { bmi: 21.4, weightKg: 61, recordedAt: "2026-10-14T00:00:00Z" },
  ];

  const resBmi = calcTrendAnalysis(downRecords, "bmi");
  assert.ok(resBmi);
  assert.equal(resBmi.diff, -1.4);
  assert.equal(resBmi.days, 45);
  assert.equal(resBmi.highlight, "Chỉ số giảm 1.4 điểm");
  assert.equal(resBmi.detail, "sau 45 ngày theo dõi thể trạng");

  const resWeight = calcTrendAnalysis(downRecords, "weightKg");
  assert.ok(resWeight);
  assert.equal(resWeight.diff, -4);
  assert.equal(resWeight.highlight, "Chỉ số giảm 4 kg");

  const steadyRecords = [
    { bmi: 21.0, recordedAt: "2026-10-01T00:00:00Z" },
    { bmi: 21.0, recordedAt: "2026-10-10T00:00:00Z" },
  ];
  const resSteady = calcTrendAnalysis(steadyRecords, "bmi");
  assert.equal(resSteady.diff, 0);
  assert.equal(resSteady.highlight, "Chỉ số duy trì ổn định");
});
