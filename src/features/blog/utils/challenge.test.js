import { test } from "node:test";
import assert from "node:assert/strict";

import {
  CHALLENGE_DAYS,
  applyCheckIn,
  daysBetween,
  emptyRecord,
  parseRecord,
  readProgress,
  toDateKey,
} from "./challenge.js";

test("toDateKey lấy ngày theo giờ địa phương, có số 0 đứng đầu", () => {
  assert.equal(toDateKey(new Date(2026, 0, 5, 23, 59)), "2026-01-05");
  assert.equal(toDateKey(new Date(2026, 9, 14, 0, 0)), "2026-10-14");
});

test("daysBetween đếm đúng khi qua tháng và qua năm", () => {
  assert.equal(daysBetween("2026-10-14", "2026-10-14"), 0);
  assert.equal(daysBetween("2026-10-31", "2026-11-01"), 1);
  assert.equal(daysBetween("2026-12-31", "2027-01-01"), 1);
  assert.equal(daysBetween("2026-10-14", "2026-10-10"), -4);
});

test("readProgress: chưa check-in lần nào thì 0 ngày và chưa đứt chuỗi", () => {
  assert.deepEqual(readProgress(emptyRecord(), "2026-10-14"), {
    days: 0,
    checkedToday: false,
    completed: false,
    broken: false,
  });
});

test("readProgress: đã check-in hôm nay", () => {
  const record = { checkIns: ["2026-10-13", "2026-10-14"], completedAt: null };
  const progress = readProgress(record, "2026-10-14");
  assert.equal(progress.days, 2);
  assert.equal(progress.checkedToday, true);
});

test("readProgress: lần cuối là hôm qua thì chuỗi còn sống và hôm nay chưa check-in", () => {
  const record = { checkIns: ["2026-10-12", "2026-10-13"], completedAt: null };
  const progress = readProgress(record, "2026-10-14");
  assert.equal(progress.days, 2);
  assert.equal(progress.checkedToday, false);
  assert.equal(progress.broken, false);
});

test("readProgress: lỡ một ngày thì đứt chuỗi, hiện 0", () => {
  const record = { checkIns: ["2026-10-11", "2026-10-12"], completedAt: null };
  const progress = readProgress(record, "2026-10-14");
  assert.equal(progress.days, 0);
  assert.equal(progress.broken, true);
});

test("readProgress: đã hoàn thành thì luôn đủ 7 ngày và không bao giờ đứt", () => {
  const record = { checkIns: [], completedAt: "2026-10-01" };
  const progress = readProgress(record, "2026-12-31");
  assert.equal(progress.days, CHALLENGE_DAYS);
  assert.equal(progress.completed, true);
  assert.equal(progress.broken, false);
});

test("applyCheckIn: lần đầu bắt đầu từ ngày 1", () => {
  assert.deepEqual(applyCheckIn(emptyRecord(), "2026-10-14"), {
    checkIns: ["2026-10-14"],
    completedAt: null,
  });
});

test("applyCheckIn: check-in lần hai trong cùng ngày không đổi gì", () => {
  const record = { checkIns: ["2026-10-14"], completedAt: null };
  assert.equal(applyCheckIn(record, "2026-10-14"), record);
});

test("applyCheckIn: ngày liên tiếp thì nối thêm vào chuỗi", () => {
  const record = { checkIns: ["2026-10-13"], completedAt: null };
  assert.deepEqual(applyCheckIn(record, "2026-10-14").checkIns, ["2026-10-13", "2026-10-14"]);
});

test("applyCheckIn: lỡ ngày thì bắt đầu lại từ hôm nay", () => {
  const record = { checkIns: ["2026-10-10", "2026-10-11", "2026-10-12"], completedAt: null };
  assert.deepEqual(applyCheckIn(record, "2026-10-14"), {
    checkIns: ["2026-10-14"],
    completedAt: null,
  });
});

test("applyCheckIn: ngày thứ 7 liên tiếp thì hoàn thành, sau đó không đổi nữa", () => {
  const record = {
    checkIns: ["2026-10-08", "2026-10-09", "2026-10-10", "2026-10-11", "2026-10-12", "2026-10-13"],
    completedAt: null,
  };
  const done = applyCheckIn(record, "2026-10-14");
  assert.equal(done.checkIns.length, CHALLENGE_DAYS);
  assert.equal(done.completedAt, "2026-10-14");
  assert.equal(applyCheckIn(done, "2026-10-20"), done);
});

test("parseRecord chịu được dữ liệu rỗng, hỏng hoặc bị sửa tay", () => {
  assert.deepEqual(parseRecord(null), emptyRecord());
  assert.deepEqual(parseRecord("{không phải json"), emptyRecord());
  assert.deepEqual(parseRecord(JSON.stringify({ checkIns: "x", completedAt: 5 })), emptyRecord());
  assert.deepEqual(
    parseRecord(JSON.stringify({ checkIns: ["2026-10-14", "bậy", 7], completedAt: "2026-10-14" })),
    { checkIns: ["2026-10-14"], completedAt: "2026-10-14" }
  );
});
