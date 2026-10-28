import { useMutation } from "@tanstack/react-query";

import { checkout } from "@/features/payment/api/paymentApi";

export function useCheckout() {
  return useMutation({
    mutationFn: (planCode) => checkout(planCode),
  });
}
