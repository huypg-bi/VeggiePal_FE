import { useQuery } from "@tanstack/react-query";

import { getCheckoutPreview } from "@/features/payment/api/paymentApi";
import { paymentKeys } from "@/features/payment/queryKeys";

// Kết quả phụ thuộc thời điểm hỏi nên không giữ cache: mỗi lần mở hộp thoại tính lại.
export function useCheckoutPreview(planCode, { enabled = true } = {}) {
  return useQuery({
    queryKey: paymentKeys.preview(planCode),
    queryFn: () => getCheckoutPreview(planCode),
    enabled: Boolean(planCode) && enabled,
    staleTime: 0,
    gcTime: 0,
  });
}
