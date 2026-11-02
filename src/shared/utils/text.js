/** Chữ thường, bỏ dấu tiếng Việt ("Phở Chay" → "pho chay") để tìm không phân biệt dấu. */
export function normalizeText(text) {
  return String(text ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .trim();
}

/** Tiêu đề có chứa từ khóa không: gõ có dấu thì khớp đúng dấu ("nấm" không khớp "năm"), gõ không dấu thì bỏ qua dấu. */
export function textIncludes(text, keyword) {
  const needle = String(keyword ?? "").normalize("NFC").toLowerCase().trim();
  if (!needle) return true;
  if (needle !== normalizeText(needle)) {
    return String(text ?? "").normalize("NFC").toLowerCase().includes(needle);
  }
  return normalizeText(text).includes(needle);
}
