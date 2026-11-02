import { useMutation, useQueryClient } from "@tanstack/react-query";

import { cancelOrder } from "@/features/payment/api/paymentApi";
import { paymentKeys } from "@/features/payment/queryKeys";

export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => cancelOrder(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.order(id) });
      queryClient.invalidateQueries({ queryKey: paymentKeys.history() });
    },
  });
}
