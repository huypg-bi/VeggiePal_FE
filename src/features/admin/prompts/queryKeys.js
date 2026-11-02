// Khóa cache React Query của khu admin: quản lý prompt AI.
export const promptKeys = {
  all: ["admin", "prompts"],
  list: ["admin", "prompts", "list"],
  versions: (key) => ["admin", "prompts", "versions", key],
  activations: (key) => ["admin", "prompts", "activations", key],
};
