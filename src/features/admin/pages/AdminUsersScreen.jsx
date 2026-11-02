import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
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
      {/* Tiêu đề & giới thiệu chức năng */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <Users className="size-6 text-brand" />
            <h1 className="font-heading text-3xl font-bold text-ink">Người dùng</h1>
          </div>
          <p className="mt-1 text-sm text-subtle">
            Quản lý tài khoản thành viên, phân quyền quản trị và thực hiện khóa hoặc mở khóa tài khoản.
          </p>
        </div>
      </div>

      {/* Thanh tìm kiếm và bộ lọc */}
      <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-border bg-card p-3.5 shadow-xs">
        <div className="relative min-w-64 flex-1">
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle transition hover:text-ink cursor-pointer"
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
          className="h-10 min-w-44"
        />

        <SelectField
          aria-label="Lọc vai trò"
          options={ROLE_OPTIONS}
          value={role}
          onValueChange={handleFilter(setRole)}
          className="h-10 min-w-36"
        />

        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleResetFilters}
            className="text-subtle hover:text-ink"
          >
            <RotateCcw className="size-3.5" />
            Đặt lại
          </Button>
        )}
      </div>

      {/* Bảng danh sách người dùng */}
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
            <table className="w-full min-w-[860px] text-sm border-collapse">
              <thead className="border-b border-border bg-surface/75 text-xs uppercase tracking-wider text-subtle font-semibold">
                <tr className="divide-x divide-border">
                  <th className="px-6 py-3.5 text-center">Người dùng</th>
                  <th className="px-4 py-3.5 text-center">Vai trò</th>
                  <th className="px-4 py-3.5 text-center">Trạng thái</th>
                  <th className="px-4 py-3.5 text-center">Ngày tham gia</th>
                  <th className="px-6 py-3.5 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((user) => {
                  const isSelf = currentUser?.id === user.id;
                  const isTargetAdmin = user.role === "ADMIN";
                  const isBlocked = user.status === "BLOCKED";
                  const roleConfig = ROLE_CONFIG[user.role] || ROLE_CONFIG.USER;

                  return (
                    <tr key={user.id} className="divide-x divide-border text-body transition-colors hover:bg-surface/50">
                      {/* Người dùng: Avatar + Họ tên + Email + Xác thực */}
                      <td className="px-6 py-4 text-left">
                        <div className="flex items-center gap-3">
                          {user.avatarUrl ? (
                            <img
                              src={user.avatarUrl}
                              alt={user.fullName || user.email}
                              className="size-10 shrink-0 rounded-full object-cover ring-1 ring-border shadow-2xs"
                            />
                          ) : (
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                              {user.fullName ? (
                                user.fullName.charAt(0).toUpperCase()
                              ) : (
                                <User className="size-5" />
                              )}
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="truncate font-semibold text-ink text-sm">
                                {user.fullName || "Chưa đặt tên"}
                              </span>
                              {isSelf && (
                                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                                  Bạn
                                </span>
                              )}
                            </div>
                            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-subtle">
                              <span className="truncate max-w-[200px]" title={user.email}>
                                {user.email}
                              </span>
                              <span aria-hidden className="text-border">•</span>
                              {user.emailVerified ? (
                                <span className="inline-flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                                  <CheckCircle2 className="size-3.5 shrink-0" />
                                  Đã xác minh
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 font-medium text-amber-600 dark:text-amber-400">
                                  <AlertCircle className="size-3.5 shrink-0" />
                                  Chưa xác minh
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Vai trò */}
                      <td className="px-4 py-4 text-center">
                        <div className="flex justify-center">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium whitespace-nowrap shadow-2xs ${roleConfig.className}`}
                          >
                            {user.role === "ADMIN" ? (
                              <Shield className="size-3.5 text-purple-600 dark:text-purple-400" />
                            ) : (
                              <User className="size-3.5 text-slate-500" />
                            )}
                            {roleConfig.label}
                          </span>
                        </div>
                      </td>

                      {/* Trạng thái */}
                      <td className="px-4 py-4 text-center">
                        <div className="flex flex-col items-center justify-center gap-1">
                          <UserStatusBadge status={user.status} />
                          {isBlocked && user.lockedReason && (
                            <p
                              className="max-w-[180px] truncate text-[11px] text-destructive hover:underline cursor-help"
                              title={`Lý do: ${user.lockedReason}${user.lockedAt ? ` (${formatDateTime(user.lockedAt)})` : ""}`}
                            >
                              Lý do: {user.lockedReason}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Ngày tham gia */}
                      <td className="px-4 py-4 text-center whitespace-nowrap text-xs text-subtle font-medium tabular-nums">
                        {formatDateTime(user.createdAt)}
                      </td>

                      {/* Thao tác */}
                      <td className="px-6 py-4 text-center">
                        {isSelf ? (
                          <span className="inline-flex items-center text-xs font-medium italic text-subtle">
                            Tài khoản hiện tại
                          </span>
                        ) : isTargetAdmin ? (
                          <span className="inline-flex items-center text-xs font-medium italic text-subtle">
                            Quản trị viên khác
                          </span>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            {isBlocked ? (
                              <button
                                type="button"
                                onClick={() => setUnlockTarget(user)}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300/80 bg-emerald-50/70 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 hover:border-emerald-400 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 shadow-2xs cursor-pointer"
                                title="Mở khóa tài khoản người dùng"
                              >
                                <Unlock className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                                Mở khóa
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setLockTarget(user)}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-300/80 bg-rose-50/70 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 hover:border-rose-400 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-400 shadow-2xs cursor-pointer"
                                title="Khóa tài khoản người dùng"
                              >
                                <Lock className="size-3.5 text-rose-500 dark:text-rose-400" />
                                Khóa
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => setRoleTarget(user)}
                              disabled={isBlocked}
                              className="inline-flex items-center gap-1.5 rounded-xl border border-purple-300/80 bg-purple-50/70 px-3 py-1.5 text-xs font-semibold text-purple-700 transition hover:bg-purple-100 hover:border-purple-400 disabled:opacity-40 disabled:pointer-events-none dark:border-purple-800 dark:bg-purple-950/40 dark:text-purple-300 shadow-2xs cursor-pointer"
                              title="Nâng quyền lên Quản trị viên"
                            >
                              <ShieldCheck className="size-3.5 text-purple-600 dark:text-purple-400" />
                              Nâng quyền
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Phân trang */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-card px-6 py-3.5 text-sm text-subtle">
            <span className="font-medium text-xs sm:text-sm">
              {data.totalElements} người dùng • Trang {data.page + 1}/{Math.max(data.totalPages, 1)}
              {isFetching && " • Đang cập nhật..."}
            </span>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={data.page <= 0 || isFetching}
                onClick={() => setPage((p) => Math.max(p - 1, 0))}
                className="rounded-xl border-border px-3 text-xs font-medium hover:bg-surface"
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
                className="rounded-xl border-border px-3 text-xs font-medium hover:bg-surface"
              >
                Sau
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Các hộp thoại thao tác */}
      <LockUserDialog user={lockTarget} onClose={() => setLockTarget(null)} />
      <UnlockUserDialog user={unlockTarget} onClose={() => setUnlockTarget(null)} />
      <ChangeRoleDialog user={roleTarget} onClose={() => setRoleTarget(null)} />
    </div>
  );
}
