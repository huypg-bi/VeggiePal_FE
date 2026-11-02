export const paymentKeys = {
  all: ["payment"],
  plans: () => [...paymentKeys.all, "plans"],
  subscription: () => [...paymentKeys.all, "subscription", "me"],
  history: () => [...paymentKeys.all, "history"],
  preview: (planCode) => [...paymentKeys.all, "checkout-preview", planCode],
  order: (id) => [...paymentKeys.all, "order", String(id)],
};
