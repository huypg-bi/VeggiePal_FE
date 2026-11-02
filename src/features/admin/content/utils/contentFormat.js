/** Số đếm có dấu chấm ngăn cách hàng nghìn; thiếu thì coi là 0. */
export function formatCount(value) {
  return Number(value ?? 0).toLocaleString("vi-VN");
}
