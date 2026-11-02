import { useQuery } from "@tanstack/react-query";

import { getOrder } from "@/features/payment/api/paymentApi";
import { paymentKeys } from "@/features/payment/queryKeys";

export function useOrder(id, { poll = false, intervalMs = 2500 } = {}) {
  const query = useQuery({
    queryKey: paymentKeys.order(id),
    queryFn: () => getOrder(id),
    enabled: Boolean(id),
    refetchInterval: (queryState) => {
      if (!poll) return false;
      const status = queryState?.state?.data?.status;
      // Khi đã PAID, FAILED hoặc CANCELLED thì dừng polling
      if (status === "PAID" || status === "FAILED" || status === "CANCELLED") {
        return false;
      }
      return intervalMs;
    },
  });

  return {
    ...query,
    order: query.data ?? null,
    loading: query.isLoading,
  };
}
