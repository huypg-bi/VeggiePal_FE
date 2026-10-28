export const paymentKeys = {
  all: ["payment"],
  plans: () => [...paymentKeys.all, "plans"],
  subscription: () => [...paymentKeys.all, "subscription", "me"],
  history: () => [...paymentKeys.all, "history"],
  order: (id) => [...paymentKeys.all, "order", String(id)],
};
