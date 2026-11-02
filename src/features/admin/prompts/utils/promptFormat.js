// Tiện ích thuần cho trang quản lý prompt AI (khớp quy tắc của BE: PromptTemplate trong ai-service).

export const PROMPT_MAX_LENGTH = 30_000;

const VARIABLE = /\{\{([a-zA-Z][a-zA-Z0-9]*)}}/g;

export const STATUS_LABELS = {
  DRAFT: "Bản nháp",
  PUBLISHED: "Đã publish",
  DEFAULT: "Mặc định",
};

export const STATUS_CLASS = {
  DRAFT: "bg-warning/15 text-warning",
  PUBLISHED: "bg-brand-soft text-brand",
  DEFAULT: "bg-surface text-subtle",
};

/** "v3" hoặc "Mặc định" cho version 0 (prompt có sẵn trong code). */
export const versionLabel = (version) => (version === 0 ? "Mặc định" : `v${version}`);

/** Tên các biến {{...}} đang có trong nội dung. */
export function findVariables(content) {
  return new Set(Array.from(String(content ?? "").matchAll(VARIABLE), (m) => m[1]));
}

/** Lỗi (tiếng Việt) nếu nội dung không hợp lệ theo BE: độ dài, biến thiếu / thừa, cú pháp biến sai; hợp lệ thì trả null. */
export function validatePromptContent(content, requiredVariables) {
  const text = String(content ?? "");
  if (!text.trim()) return "Nội dung prompt không được để trống";
  if (text.length > PROMPT_MAX_LENGTH) return `Prompt tối đa ${PROMPT_MAX_LENGTH.toLocaleString("vi-VN")} ký tự`;

  const required = new Set(requiredVariables ?? []);
  const found = findVariables(text);
  const missing = [...required].filter((name) => !found.has(name));
  const unknown = [...found].filter((name) => !required.has(name));
  if (missing.length > 0) return `Thiếu biến bắt buộc: ${missing.map((n) => `{{${n}}}`).join(", ")}`;
  if (unknown.length > 0) return `Biến không được phép: ${unknown.map((n) => `{{${n}}}`).join(", ")}`;
  if (text.replace(VARIABLE, "").includes("{{")) return "Có biến {{...}} viết sai cú pháp";
  return null;
}

// Prompt nào cần "dữ liệu mẫu" khi chạy thử (sampleInput); các prompt còn lại chỉ cần giá trị biến.
export const SAMPLE_INPUT_FIELDS = {
  CHAT_SYSTEM: {
    label: "Câu hỏi mẫu của người dùng",
    placeholder: "Ví dụ: Ăn chay có đủ đạm không?",
    initial: "Ăn chay có đủ đạm không? Tôi nên ăn gì mỗi ngày?",
  },
  VIDEO_EXTRACTION: {
    label: "Bản phiên âm mẫu của video",
    placeholder: "Dán lời thoại của một video nấu ăn...",
    initial:
      "Hôm nay mình làm đậu hũ sốt cà. Chuẩn bị 2 bìa đậu hũ, 3 quả cà chua, 1 muỗng canh dầu ăn, nửa muỗng cà phê muối. Chiên đậu hũ vàng hai mặt, xào cà chua với muối rồi cho đậu hũ vào đun 5 phút.",
  },
  MEAL_PLAN_SYSTEM: {
    label: "Prompt người dùng mẫu (đầy đủ)",
    placeholder: "Dán một prompt tạo thực đơn hoàn chỉnh để thử chỉ dẫn hệ thống...",
    initial: "",
  },
  MODERATION_SYSTEM: {
    label: "Nội dung mẫu cần kiểm duyệt",
    placeholder: "Dán một bài viết hoặc bình luận để AI phân loại...",
    initial: "KIẾM TIỀN NHANH! Mua ngay 10000 lượt theo dõi ảo, nhắn tin ngay!",
  },
};

// Giá trị mẫu điền sẵn cho từng biến khi chạy thử, admin có thể sửa.
export const SAMPLE_VARIABLES = {
  goal: "Giảm cân nhẹ, ăn thanh đạm",
  preferences: "ít dầu mỡ, nhiều rau",
  availableIngredients: "đậu hũ, nấm, cà chua",
  health: "BMI 22, không bệnh nền",
  allergies: "không có",
  target: "1800 kcal/ngày",
  recipes: '[{"id":1,"title":"Đậu hũ sốt cà","calories":320},{"id":2,"title":"Canh nấm rau củ","calories":180}]',
  budgetHint: "",
  currentRecipeId: "1",
  budget: "",
  limit: "3",
  interest: "món chay giàu protein",
  candidates: '[{"type":"RECIPE","id":1,"title":"Đậu hũ sốt cà"},{"type":"BLOG","id":5,"title":"Ăn chay đủ đạm"}]',
  content: "KIẾM TIỀN NHANH! Mua ngay 10000 lượt theo dõi ảo, nhắn tin ngay!",
};

/** Giá trị biến ban đầu cho form chạy thử của một prompt. */
export function initialVariableValues(variables) {
  return Object.fromEntries([...(variables ?? [])].sort().map((name) => [name, SAMPLE_VARIABLES[name] ?? ""]));
}
