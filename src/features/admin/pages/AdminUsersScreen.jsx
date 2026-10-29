import { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Lock,
  RotateCcw,
  Search,
  Shield,
  ShieldCheck,
  Unlock,
  User,
  Users,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import ChangeRoleDialog from "@/features/admin/users/components/ChangeRoleDialog";
import LockUserDialog from "@/features/admin/users/components/LockUserDialog";
import UnlockUserDialog from "@/features/admin/users/components/UnlockUserDialog";
import UserStatusBadge from "@/features/admin/users/components/UserStatusBadge";
import { useAdminUsers } from "@/features/admin/users/hooks/useAdminUsers";
import {
  formatDateTime,
  ROLE_CONFIG,
  ROLE_OPTIONS,
  STATUS_OPTIONS,
} from "@/features/admin/users/utils/adminUserFormat";
import { useAuthStore } from "@/features/auth/store/authStore";
import SelectField from "@/shared/components/SelectField";

const PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 400;

// Màn hình quản lý danh sách và quyền hạn người dùng dành cho quản trị viên.
export default function AdminUsersScreen() {
  const currentUser = useAuthStore((s) => s.user);

  const [text, setText] = useState("");
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(0);

  const [lockTarget, setLockTarget] = useState(null);
  const [unlockTarget, setUnlockTarget] = useState(null);
  const [roleTarget, setRoleTarget] = useState(null);

  const timerRef = useRef(null);

  const { data, isPending, isError, error, isFetching } = useAdminUsers({
    keyword,
    status,
    role,
    page,
    size: PAGE_SIZE,
  });

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const handleSearch = (event) => {
    const value = event.target.value;
    setText(value);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setKeyword(value.trim());
      setPage(0);
    }, SEARCH_DEBOUNCE_MS);
  };

  const handleClearSearch = () => {
    setText("");
    setKeyword("");
    setPage(0);
  };

  const handleFilter = (setter) => (value) => {
    setter(value);
    setPage(0);
  };

  const handleResetFilters = () => {
    setText("");
    setKeyword("");
    setStatus("");
    setRole("");
    setPage(0);
  };

  const hasActiveFilters = Boolean(keyword || status || role);
  const items = data?.items ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Users className="size-6 text-brand" />
            <h1 className="font-heading text-3xl font-bold text-ink">Người dùng</h1>
          </div>
          <p className="mt-1 text-sm text-subtle">
            Quản lý tài khoản thành viên, phân quyền quản trị và thực hiện khóa hoặc mở khóa tài khoản.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-border bg-card p-4 shadow-sm">
        <div className="relative min-w-56 flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-subtle" />
          <input
            type="search"
            value={text}
            onChange={handleSearch}
            placeholder="Tìm theo email hoặc họ tên..."
            aria-label="Tìm người dùng"
            className="h-10 w-full rounded-full border border-border bg-surface pl-10 pr-9 text-sm text-ink outline-none transition placeholder:text-subtle focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
          />
          {text && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle hover:text-ink"
              aria-label="Xóa từ khóa tìm kiếm"
            >
              <RotateCcw className="size-3.5" />
            </button>
          )}
        </div>

        <SelectField
          aria-label="Lọc trạng thái"
          options={STATUS_OPTIONS}
          value={status}
          onValueChange={handleFilter(setStatus)}
          className="h-10"
        />

        <SelectField
          aria-label="Lọc vai trò"
          options={ROLE_OPTIONS}
          value={role}
          onValueChange={handleFilter(setRole)}
          className="h-10"
        />

        {hasActiveFilters && (
          <Button type="button" variant="ghost" size="sm" onClick={handleResetFilters} className="text-subtle">
            <RotateCcw className="size-3.5" />
            Đặt lại
          </Button>
        )}
      </div>

      {isError ? (
        <div className="rounded-3xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          {error.message || "Không thể tải danh sách người dùng"}
        </div>
      ) : isPending ? (
        <div aria-hidden className="h-72 animate-pulse rounded-3xl border border-border bg-card" />
      ) : items.length === 0 ? (
        <div className="rounded-3xl border border-border bg-card p-8 text-center text-sm text-subtle">
          Không tìm thấy tài khoản người dùng nào phù hợp với bộ lọc hiện tại.
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-surface text-xs uppercase tracking-wide text-subtle">
                <tr>
                  <th className="px-4 py-3 font-semibold">Người dùng</th>
                  <th className="px-3 py-3 font-semibold">Vai trò</th>
                  <th className="px-3 py-3 font-semibold">Trạng thái</th>
                  <th className="px-3 py-3 font-semibold">Ngày tham gia</th>
                  <th className="px-4 py-3 text-right font-semibold">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((user) => {
                  const isSelf = currentUser?.id === user.id;
                  const isTargetAdmin = user.role === "ADMIN";
                  const isBlocked = user.status === "BLOCKED";
                  const roleConfig = ROLE_CONFIG[user.role] || ROLE_CONFIG.USER;

                  return (
                    <tr key={user.id} className="text-body transition-colors hover:bg-surface/50">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          {user.avatarUrl ? (
                            <img
                              src={user.avatarUrl}
                              alt={user.fullName || user.email}
                              className="size-9 shrink-0 rounded-full object-cover ring-1 ring-border"
                            />
                          ) : (
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-soft font-semibold text-brand">
                              {user.fullName ? (
                                user.fullName.charAt(0).toUpperCase()
                              ) : (
                                <User className="size-4" />
                              )}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="truncate font-semibold text-ink">
                                {user.fullName || "Chưa đặt tên"}
                              </span>
                              {isSelf && (
                                <span className="rounded-full bg-brand-soft px-2 py-0.2 text-[10px] font-bold text-brand">
                                  Bạn
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-subtle">
                              <span className="truncate">{user.email}</span>
                              <span aria-hidden>•</span>
                              {user.emailVerified ? (
                                <span className="inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400">
                                  <CheckCircle2 className="size-3" />
                                  Đã xác minh
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-0.5 text-amber-600 dark:text-amber-400">
                                  <XCircle className="size-3" />
                                  Chưa xác minh
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-3 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${roleConfig.className}`}
                        >
                          {user.role === "ADMIN" ? (
                            <Shield className="size-3" />
                          ) : (
                            <User className="size-3" />
                          )}
                          {roleConfig.label}
                        </span>
                      </td>

                      <td className="px-3 py-3.5">
                        <div className="flex flex-col items-start gap-1">
                          <UserStatusBadge status={user.status} />
                          {isBlocked && (
                            <div className="max-w-xs text-xs text-destructive">
                              {user.lockedReason && (
                                <p className="truncate" title={user.lockedReason}>
                                  Lý do: {user.lockedReason}
                                </p>
                              )}
                              {user.lockedAt && (
                                <p className="text-[11px] text-subtle">
                                  Khóa lúc: {formatDateTime(user.lockedAt)}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="px-3 py-3.5 whitespace-nowrap text-xs text-subtle">
                        {formatDateTime(user.createdAt)}
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        {isSelf ? (
                          <span className="text-xs italic text-subtle">Tài khoản hiện tại</span>
                        ) : isTargetAdmin ? (
                          <span className="text-xs italic text-subtle">Quản trị viên khác</span>
                        ) : (
                          <div className="flex items-center justify-end gap-1.5">
                            {isBlocked ? (
                              <Button
                                type="button"
                                size="sm"
                                variant="soft"
                                onClick={() => setUnlockTarget(user)}
                              >
                                <Unlock className="size-3.5" />
                                Mở khóa
                              </Button>
                            ) : (
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                onClick={() => setLockTarget(user)}
                              >
                                <Lock className="size-3.5" />
                                Khóa
                              </Button>
                            )}

                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => setRoleTarget(user)}
                              title="Nâng quyền lên Quản trị viên"
                            >
                              <ShieldCheck className="size-3.5 text-purple-600 dark:text-purple-400" />
                              Nâng quyền
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 text-sm text-subtle">
            <span>
              {data.totalElements} người dùng • Trang {data.page + 1}/{Math.max(data.totalPages, 1)}
              {isFetching && " • Đang nạp..."}
            </span>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={data.page <= 0 || isFetching}
                onClick={() => setPage((p) => Math.max(p - 1, 0))}
              >
                <ChevronLeft className="size-4" />
                Trước
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={data.page + 1 >= data.totalPages || isFetching}
                onClick={() => setPage((p) => p + 1)}
              >
                Sau
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <LockUserDialog user={lockTarget} onClose={() => setLockTarget(null)} />
      <UnlockUserDialog user={unlockTarget} onClose={() => setUnlockTarget(null)} />
      <ChangeRoleDialog user={roleTarget} onClose={() => setRoleTarget(null)} />
    </div>
  );
}
