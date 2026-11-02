// Khóa cache React Query cho danh mục người dùng khu vực admin.
export const adminUserKeys = {
  all: ["admin", "users"],
  list: (filters) => [...adminUserKeys.all, "list", filters],
};
