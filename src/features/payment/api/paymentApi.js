import apiClient from "@/shared/api/apiClient";
import { PAYMENT_ERROR_MESSAGES } from "@/shared/api/errorMessages";

function toPaymentMessage(res, fallbackMessage) {
  const code = res.data?.code;
  if (code && PAYMENT_ERROR_MESSAGES[code]) {
    return PAYMENT_ERROR_MESSAGES[code];
  }
  if (res.status === 401) {
    return PAYMENT_ERROR_MESSAGES[1008];
  }
  if (res.status === 503) {
    return PAYMENT_ERROR_MESSAGES[6004];
  }
  return res.data?.message || fallbackMessage;
}

function networkError(error, timeoutMessage) {
  return new Error(
    error?.code === "ECONNABORTED"
      ? timeoutMessage
      : "Không kết nối được máy chủ thanh toán, vui lòng thử lại",
    { cause: error },
  );
}

function unwrap(res, fallbackMessage) {
  if (res.status >= 400) {
    const error = new Error(toPaymentMessage(res, fallbackMessage));
    error.status = res.status;
    error.code = res.data?.code;
    throw error;
  }
  return res.data?.result;
}

export async function getPlans() {
  let res;
  try {
    res = await apiClient.get("/payments/plans");
  } catch (error) {
    throw networkError(error, "Tải danh sách gói thành viên quá thời gian chờ");
  }
  return unwrap(res, "Không lấy được danh sách gói thành viên") ?? [];
}

export async function checkout(planCode) {
  let res;
  try {
    res = await apiClient.post("/payments/checkout", { planCode });
  } catch (error) {
    throw networkError(error, "Yêu cầu thanh toán quá thời gian chờ");
  }
  return unwrap(res, "Tạo yêu cầu thanh toán thất bại");
}

export async function getOrder(id) {
  let res;
  try {
    res = await apiClient.get(`/payments/orders/${id}`);
  } catch (error) {
    throw networkError(error, "Lấy thông tin đơn hàng quá thời gian chờ");
  }
  return unwrap(res, "Không tìm thấy đơn hàng");
}

export async function cancelOrder(id) {
  let res;
  try {
    res = await apiClient.post(`/payments/orders/${id}/cancel`);
  } catch (error) {
    throw networkError(error, "Yêu cầu huỷ đơn quá thời gian chờ");
  }
  return unwrap(res, PAYMENT_ERROR_MESSAGES[6009]);
}

export async function getHistory() {
  let res;
  try {
    res = await apiClient.get("/payments/history");
  } catch (error) {
    throw networkError(error, "Tải lịch sử thanh toán quá thời gian chờ");
  }
  return unwrap(res, "Không lấy được lịch sử thanh toán") ?? [];
}

export async function getMySubscription() {
  let res;
  try {
    res = await apiClient.get("/subscriptions/me");
  } catch (error) {
    throw networkError(error, "Tải thông tin gói thành viên quá thời gian chờ");
  }
  return unwrap(res, "Không lấy được thông tin gói thành viên");
}
