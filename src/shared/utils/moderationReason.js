// Lý do kiểm duyệt do AI trả về bằng tiếng Anh; chuyển thành câu tiếng Việt ngắn (xem docs/CODE_NOTES.md).

const REASON_RULES = [
  [/misinformation|medical|\bcures?\b|\bdiseases?\b|unsubstantiated|false claim|misleading|\bfake\b/i,
    "Nội dung chứa thông tin y tế hoặc sức khỏe sai sự thật, có thể gây hại."],
  [/self[-_ ]?harm|suicid/i, "Nội dung liên quan đến tự làm hại bản thân."],
  [/\bhate\b|hateful|discriminat|racis/i, "Nội dung có ngôn từ thù ghét hoặc phân biệt đối xử."],
  [/violen|\bthreat|\bgore\b/i, "Nội dung có yếu tố bạo lực hoặc đe dọa."],
  [/sexual|explicit|porn|nudity/i, "Nội dung nhạy cảm, không phù hợp."],
  [/illegal|\bdrugs?\b|weapon/i, "Nội dung liên quan đến hoạt động trái pháp luật."],
  [/harass|bully|insult|abus|offensive|profan/i, "Nội dung có lời lẽ xúc phạm hoặc quấy rối người khác."],
  [/spam|scam|advertis|promot|\bpayment\b|\bfraud/i, "Nội dung mang tính quảng cáo, spam hoặc lừa đảo."],
];

const DEFAULT_REASON = "Nội dung vi phạm quy định cộng đồng.";

// Bỏ phần "Confidence: 0.95" AI ghi kèm cuối lý do.
const stripConfidence = (text) => text.replace(/\s*confidence\s*[:=]?\s*[\d.]+\s*\.?\s*$/i, "").trim();

// Có dấu tiếng Việt thì đã là tiếng Việt (vd lý do admin tự nhập), giữ nguyên.
const hasVietnamese = (text) => /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(text);

/** Lý do kiểm duyệt ngắn gọn bằng tiếng Việt; trả chuỗi rỗng khi không có lý do. */
export function toVietnameseModerationReason(reason, fallback = DEFAULT_REASON) {
  const text = stripConfidence(String(reason ?? "").trim());
  if (!text) return "";
  if (hasVietnamese(text)) return text;
  const rule = REASON_RULES.find(([pattern]) => pattern.test(text));
  return rule ? rule[1] : fallback;
}
