import { useQuery } from "@tanstack/react-query";

import { useAuthStore, selectIsAuthenticated } from "@/features/auth/store/authStore";
import { getHistory } from "@/features/payment/api/paymentApi";
import { paymentKeys } from "@/features/payment/queryKeys";

export function usePaymentHistory() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  const query = useQuery({
    queryKey: paymentKeys.history(),
    queryFn: getHistory,
    enabled: Boolean(isAuthenticated),
    staleTime: 30 * 1000,
  });

  return {
    ...query,
    history: query.data ?? [],
    loading: query.isLoading,
  };
}
