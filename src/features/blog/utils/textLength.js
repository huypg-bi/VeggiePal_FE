/**
 * Số ký tự Unicode (code point) của chuỗi, giống cách BE đếm nội dung bài viết: ký tự bổ sung như emoji
 * tính là 1 (khác `text.length` đếm theo đơn vị UTF-16, emoji ra 2), dấu kết hợp vẫn tính riêng, không chuẩn hóa.
 */
export function countCodePoints(text) {
  return [...String(text ?? "")].length;
}
