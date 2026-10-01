import { test } from "node:test";
import assert from "node:assert/strict";

import {
  createLocalId,
  deriveSessionTitle,
  formatRelativeTime,
  getMockAssistantReply,
  pickNextActiveSessionId,
  sortSessionsByRecent,
} from "./chatUtils.js";

test("createLocalId dùng prefix truyền vào và không trùng nhau giữa các lần gọi", () => {
  const a = createLocalId("msg");
  const b = createLocalId("msg");
  assert.ok(a.startsWith("msg-"));
  assert.ok(b.startsWith("msg-"));
  assert.notEqual(a, b);
});

test("deriveSessionTitle giữ nguyên câu ngắn", () => {
  assert.equal(deriveSessionTitle("Chào bạn"), "Chào bạn");
});

test("deriveSessionTitle rút gọn câu dài và thêm dấu …", () => {
  const longText = "a".repeat(60);
  const title = deriveSessionTitle(longText, 40);
  assert.equal(title.length, 41); // 40 ký tự + dấu …
  assert.ok(title.endsWith("…"));
});

test("deriveSessionTitle trả về mặc định khi chuỗi rỗng/khoảng trắng", () => {
  assert.equal(deriveSessionTitle(""), "Cuộc trò chuyện mới");
  assert.equal(deriveSessionTitle("   "), "Cuộc trò chuyện mới");
});

test("sortSessionsByRecent sắp xếp updatedAt giảm dần và không sửa mảng gốc", () => {
  const sessions = [
    { id: "1", updatedAt: "2024-01-01T00:00:00.000Z" },
    { id: "2", updatedAt: "2024-03-01T00:00:00.000Z" },
    { id: "3", updatedAt: "2024-02-01T00:00:00.000Z" },
  ];
  const sorted = sortSessionsByRecent(sessions);
  assert.deepEqual(
    sorted.map((s) => s.id),
    ["2", "3", "1"]
  );
  assert.equal(sessions[0].id, "1"); // mảng gốc giữ nguyên thứ tự
});

test("formatRelativeTime trả về mốc phút/giờ/ngày phù hợp", () => {
  const ref = new Date("2024-06-01T12:00:00.000Z");
  assert.equal(
    formatRelativeTime(new Date("2024-06-01T11:59:45.000Z"), ref),
    "Vừa xong"
  );
  assert.equal(
    formatRelativeTime(new Date("2024-06-01T11:55:00.000Z"), ref),
    "5 phút trước"
  );
  assert.equal(
    formatRelativeTime(new Date("2024-06-01T09:00:00.000Z"), ref),
    "3 giờ trước"
  );
  assert.equal(
    formatRelativeTime(new Date("2024-05-30T12:00:00.000Z"), ref),
    "2 ngày trước"
  );
});

test("getMockAssistantReply trả lời theo từ khoá phở/nước dùng", () => {
  const { content, isFallback } = getMockAssistantReply(
    "Cách nấu nước dùng phở chay ngon?"
  );
  assert.ok(content.includes("nấm hương"));
  assert.equal(isFallback, false);
});

test("getMockAssistantReply trả về fallback khi gõ từ khoá kích hoạt", () => {
  const { isFallback } = getMockAssistantReply("hệ thống đang quá tải à?");
  assert.equal(isFallback, true);
});

test("getMockAssistantReply trả về câu trả lời mặc định khi không khớp từ khoá nào", () => {
  const { content, isFallback } = getMockAssistantReply("xin chào");
  assert.equal(isFallback, false);
  assert.ok(content.length > 0);
});

test("pickNextActiveSessionId giữ nguyên active nếu session bị xoá không phải session đang mở", () => {
  const sessions = [
    { id: "1", updatedAt: "2024-03-01T00:00:00.000Z" },
    { id: "2", updatedAt: "2024-02-01T00:00:00.000Z" },
  ];
  assert.equal(pickNextActiveSessionId(sessions, "2", "1"), "1");
});

test("pickNextActiveSessionId chuyển sang session gần nhất còn lại khi xoá session đang mở", () => {
  const sessions = [
    { id: "1", updatedAt: "2024-03-01T00:00:00.000Z" },
    { id: "2", updatedAt: "2024-02-01T00:00:00.000Z" },
    { id: "3", updatedAt: "2024-01-01T00:00:00.000Z" },
  ];
  assert.equal(pickNextActiveSessionId(sessions, "1", "1"), "2");
});

test("pickNextActiveSessionId trả về null khi xoá session cuối cùng", () => {
  const sessions = [{ id: "1", updatedAt: "2024-03-01T00:00:00.000Z" }];
  assert.equal(pickNextActiveSessionId(sessions, "1", "1"), null);
});
