import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { changeUserRole, lockUser, searchUsers, unlockUser } from "../api/usersApi";
import { adminUserKeys } from "../queryKeys";

// Hook tải danh sách người dùng quản trị theo bộ lọc và trang.
export function useAdminUsers(filters) {
  return useQuery({
    queryKey: adminUserKeys.list(filters),
    queryFn: () => searchUsers(filters),
    placeholderData: (prev) => prev,
  });
}

// Mutation khóa tài khoản người dùng và làm mới danh sách khi thành công.
export function useLockUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }) => lockUser(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUserKeys.all });
    },
  });
}

// Mutation mở khóa tài khoản người dùng và làm mới danh sách khi thành công.
export function useUnlockUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => unlockUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUserKeys.all });
    },
  });
}

// Mutation cập nhật vai trò người dùng và làm mới danh sách khi thành công.
export function useChangeUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }) => changeUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUserKeys.all });
    },
  });
}
