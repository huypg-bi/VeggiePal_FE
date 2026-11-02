import apiClient from "@/shared/api/apiClient";
import { PROMPT_ERROR_MESSAGES, PROMPT_MESSAGE_PATTERNS } from "@/shared/api/errorMessages";

// Ưu tiên dịch theo nội dung câu BE (cùng mã 6000 nhưng nhiều lý do), sau đó theo mã lỗi và HTTP status.
function toMessage(res, fallbackMessage) {
  const raw = res.data?.message;
  const matched = typeof raw === "string" && PROMPT_MESSAGE_PATTERNS.find(([pattern]) => pattern.test(raw));
  if (matched) return matched[1];
  const byCode = PROMPT_ERROR_MESSAGES[res.data?.code];
  if (byCode) return byCode;
  if (res.status === 401) return PROMPT_ERROR_MESSAGES[6001];
  if (res.status === 403) return "Bạn không có quyền quản lý prompt AI";
  if (res.status === 404) return PROMPT_ERROR_MESSAGES[6002];
  return fallbackMessage;
}

function unwrap(res, fallbackMessage) {
  if (res.status >= 400) throw new Error(toMessage(res, fallbackMessage));
  return res.data?.result;
}

const base = (key) => `/ai/admin/prompts/${key}`;

/** GET /ai/admin/prompts — 8 prompt, mỗi mục có bản đang dùng (activeVersion 0 là mặc định trong code). */
export async function getPrompts() {
  const res = await apiClient.get("/ai/admin/prompts");
  return unwrap(res, "Không tải được danh sách prompt") ?? [];
}

/** GET /ai/admin/prompts/:key/versions — nháp, bản đã publish và bản mặc định (version 0, status DEFAULT). */
export async function getPromptVersions(key) {
  const res = await apiClient.get(`${base(key)}/versions`);
  return unwrap(res, "Không tải được các phiên bản prompt") ?? [];
}

/** GET /ai/admin/prompts/:key/activations — ai kích hoạt phiên bản nào, lúc nào. */
export async function getPromptActivations(key) {
  const res = await apiClient.get(`${base(key)}/activations`);
  return unwrap(res, "Không tải được lịch sử kích hoạt") ?? [];
}

/** POST .../drafts — không gửi content thì BE sao chép bản đang dùng. */
export async function createPromptDraft(key, content) {
  const res = await apiClient.post(`${base(key)}/drafts`, content == null ? {} : { content });
  return unwrap(res, "Không tạo được bản nháp");
}

/** PUT .../drafts/:version */
export async function updatePromptDraft(key, version, content) {
  const res = await apiClient.put(`${base(key)}/drafts/${version}`, { content });
  return unwrap(res, "Không lưu được bản nháp");
}

/** POST .../drafts/:version/preview — gọi Groq thật nên có thể mất vài giây và tốn token nhà cung cấp. */
export async function previewPromptDraft(key, version, { sampleInput, variables }) {
  const res = await apiClient.post(
    `${base(key)}/drafts/${version}/preview`,
    { sampleInput: sampleInput || undefined, variables },
    { timeout: 90_000 },
  );
  return unwrap(res, "Không chạy thử được prompt");
}

/** POST .../drafts/:version/publish — publish và kích hoạt ngay. */
export async function publishPromptDraft(key, version) {
  const res = await apiClient.post(`${base(key)}/drafts/${version}/publish`);
  return unwrap(res, "Không publish được bản nháp");
}

/** POST .../versions/:version/activate — kích hoạt lại bản đã publish; version 0 là khôi phục mặc định. */
export async function activatePromptVersion(key, version) {
  const res = await apiClient.post(`${base(key)}/versions/${version}/activate`);
  return unwrap(res, "Không kích hoạt được phiên bản");
}
