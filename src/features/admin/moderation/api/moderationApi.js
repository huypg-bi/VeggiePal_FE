import apiClient from "@/shared/api/apiClient";

function toMessage(res, fallbackMessage) {
  const code = res.data?.code;
  if (code === 6000) return "Tham s? l?c ki?m duy?t kh?ng h?p l?";
  if (code === 6012) return "N?i dung ?? b? x?a, kh?ng th? ?p d?ng quy?t ??nh";
  if (code === 6013) return "Case ?? ???c x? l?";
  if (res.status === 401) return "Phi?n ??ng nh?p ?? h?t h?n, vui l?ng ??ng nh?p l?i";
  if (res.status === 403) return "B?n kh?ng c? quy?n th?c hi?n ki?m duy?t n?i dung";
  if (res.status === 404) return "Kh?ng t?m th?y y?u c?u ki?m duy?t n?y";
  if (res.status === 400) return "D? li?u quy?t ??nh ki?m duy?t kh?ng h?p l?";
  return res.data?.message || fallbackMessage;
}

function unwrap(res, fallbackMessage) {
  if (res.status >= 400) {
    const error = new Error(toMessage(res, fallbackMessage));
    error.code = res.data?.code;
    error.status = res.status;
    error.response = res;
    throw error;
  }
  return res.data?.result;
}

export async function getPendingModerationCases() {
  const res = await apiClient.get("/ai/admin/moderation");
  return unwrap(res, "Kh?ng l?y ???c danh s?ch h?ng ??i ki?m duy?t") ?? [];
}

/** L?y l?ch s? c?c ca ki?m duy?t ?? x? l? (GET /ai/admin/moderation/history). */
export async function getModerationHistory(params = {}) {
  const cleanParams = {};
  if (params.contentType) cleanParams.contentType = params.contentType;
  if (params.decision) cleanParams.decision = params.decision;
  if (params.reviewer) cleanParams.reviewer = params.reviewer;
  if (params.from) cleanParams.from = params.from;
  if (params.to) cleanParams.to = params.to;
  if (params.page != null) cleanParams.page = params.page;
  if (params.size != null) cleanParams.size = params.size;

  const res = await apiClient.get("/ai/admin/moderation/history", { params: cleanParams });
  return (
    unwrap(res, "Kh?ng l?y ???c l?ch s? ki?m duy?t") ?? {
      items: [],
      totalElements: 0,
      totalPages: 0,
      page: 0,
      size: 20,
    }
  );
}

export async function reviewModerationCase(id, { decision, reason }) {
  const res = await apiClient.put(`/ai/admin/moderation/${id}`, {
    decision,
    reason: reason?.trim() || undefined,
  });
  return unwrap(res, "Kh?ng th? c?p nh?t quy?t ??nh ki?m duy?t");
}

export async function dismissModerationCase(id, { reason } = {}) {
  const res = await apiClient.delete(`/ai/admin/moderation/${id}`, {
    params: { reason: reason?.trim() || undefined },
  });
  return unwrap(res, "Kh?ng th? b? qua case ki?m duy?t");
}
