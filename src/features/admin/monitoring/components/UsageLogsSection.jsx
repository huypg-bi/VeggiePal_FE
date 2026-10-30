import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, FileText, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useUsageLogs } from "@/features/admin/monitoring/hooks/useMonitoring";
import {
  FEATURE_LABELS,
  STATUS_LABELS,
  describeCaller,
  formatDateTime,
  formatNumber,
  toIsoDateTime,
} from "@/features/admin/monitoring/utils/monitoringFormat";
import { cn } from "@/lib/utils";
import SelectField from "@/shared/components/SelectField";
import UserDisplayName from "@/shared/components/UserDisplayName";
import { usePublicUsers } from "@/shared/hooks/usePublicUsers";

const PAGE_SIZE = 20;
const USER_DEBOUNCE_MS = 400;

const toOptions = (labels, allLabel) => [
  { value: "", label: allLabel },
  ...Object.entries(labels).map(([value, label]) => ({ value, label })),
];

const FEATURE_OPTIONS = toOptions(FEATURE_LABELS, "Mọi tác vụ");
const STATUS_OPTIONS = toOptions(STATUS_LABELS, "Mọi trạng thái");

export default function UsageLogsSection({ includeModeration = false, onToggleModeration }) {
  const [feature, setFeature] = useState("");
  const [status, setStatus] = useState("");
  const [userText, setUserText] = useState("");
  const [userId, setUserId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(0);
  const timerRef = useRef(undefined);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const rangeInvalid = Boolean(fromDate && toDate && fromDate > toDate);

  const { data, isPending, isError, error, isFetching } = useUsageLogs(
    {
      feature,
      excludeFeature: includeModeration ? undefined : "MODERATION",
      status,
      userId,
      from: toIsoDateTime(fromDate),
      to: toIsoDateTime(toDate, true),
      page,
      size: PAGE_SIZE,
    },
    { enabled: !rangeInvalid },
  );

  const handleFilter = (setter) => (event) => {
    setter(event.target.value);
    setPage(0);
  };

  const handleSelect = (setter) => (value) => {
    setter(value);
    setPage(0);
  };

  const handleUserChange = (event) => {
    // Chỉ giữ chữ số để userId luôn hợp lệ với BE (Long).
    const value = event.target.value.replace(/\D/g, "");
    setUserText(value);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setUserId(value);
      setPage(0);
    }, USER_DEBOUNCE_MS);
  };

  const handleResetFilters = () => {
    setFeature("");
    setStatus("");
    setUserText("");
    setUserId("");
    setFromDate("");
    setToDate("");
    setPage(0);
  };

  const hasActiveFilters = Boolean(feature || status || userId || fromDate || toDate);
  const items = data?.items ?? [];
  const userIds = useMemo(() => items.map((l) => l.userId).filter(Boolean), [items]);
  const { data: userMap } = usePublicUsers(userIds);

  return (
    <section aria-label="Nhật ký sử dụng" className="flex flex-col gap-4">
      {/* Tiêu đề mục */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FileText className="size-5 text-brand" />
          <h2 className="font-heading text-xl font-bold text-ink">Nhật ký chi tiết</h2>
        </div>
      </div>

      {/* Thanh tìm kiếm và bộ lọc */}
      <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-border bg-card p-3.5 shadow-xs">
        <SelectField
          aria-label="Lọc theo tác vụ"
          options={FEATURE_OPTIONS}
          value={feature}
          onValueChange={handleSelect(setFeature)}
          className="h-10 min-w-44"
        />
        <SelectField
          aria-label="Lọc theo trạng thái"
          options={STATUS_OPTIONS}
          value={status}
          onValueChange={handleSelect(setStatus)}
          className="h-10 min-w-40"
        />
        <div className="relative min-w-36">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={userText}
            onChange={handleUserChange}
            placeholder="ID người dùng..."
            aria-label="Lọc theo ID người dùng"
            className="h-10 w-full rounded-full border border-border bg-surface px-4 text-sm text-ink outline-none transition placeholder:text-subtle focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
          />
        </div>
        <div className="flex items-center gap-1.5 text-xs text-subtle font-medium">
          <span>Từ:</span>
          <input
            type="date"
            value={fromDate}
            max={toDate || undefined}
            onChange={handleFilter(setFromDate)}
            aria-label="Từ ngày"
            className="h-10 rounded-full border border-border bg-surface px-3 text-xs text-ink outline-none transition focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
          />
        </div>
        <div className="flex items-center gap-1.5 text-xs text-subtle font-medium">
          <span>Đến:</span>
          <input
            type="date"
            value={toDate}
            min={fromDate || undefined}
            onChange={handleFilter(setToDate)}
            aria-label="Đến ngày"
            className="h-10 rounded-full border border-border bg-surface px-3 text-xs text-ink outline-none transition focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
          />
        </div>

        {/* Ô bật/tắt "Hiện cả kiểm duyệt" */}
        <label className="flex items-center gap-2 text-xs font-medium text-subtle cursor-pointer select-none rounded-full border border-border bg-surface px-3 py-2 transition hover:text-ink">
          <input
            type="checkbox"
            checked={includeModeration}
            onChange={(e) => onToggleModeration?.(e.target.checked)}
            className="size-4 rounded border-border accent-brand cursor-pointer"
          />
          Hiện cả kiểm duyệt
        </label>

        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleResetFilters}
            className="text-subtle hover:text-ink cursor-pointer"
          >
            <RotateCcw className="size-3.5" />
            Đặt lại
          </Button>
        )}
      </div>

      {rangeInvalid ? (
        <div className="rounded-2xl border border-warning/30 bg-warning/15 px-4 py-3 text-sm text-warning">
          Ngày bắt đầu phải trước hoặc bằng ngày kết thúc.
        </div>
      ) : isError ? (
        <div className="rounded-3xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          {error?.message || "Không thể tải nhật ký AI"}
        </div>
      ) : isPending ? (
        <div aria-hidden className="h-72 animate-pulse rounded-3xl border border-border bg-card" />
      ) : items.length === 0 ? (
        <div className="rounded-3xl border border-border bg-card p-8 text-center text-sm text-subtle">
          Không có lượt gọi AI nào khớp bộ lọc hiện tại.
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-sm border-collapse">
              <thead className="border-b border-border bg-surface/75 text-xs uppercase tracking-wider text-subtle font-semibold">
                <tr className="divide-x divide-border">
                  <th className="px-6 py-3.5 text-center">Thời gian</th>
                  <th className="px-4 py-3.5 text-center">Tác vụ</th>
                  <th className="px-6 py-3.5 text-center">Người dùng</th>
                  <th className="px-4 py-3.5 text-center">Model</th>
                  <th className="px-4 py-3.5 text-center">Token (Vào / Ra)</th>
                  <th className="px-4 py-3.5 text-center">Độ trễ</th>
                  <th className="px-4 py-3.5 text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((log) => (
                  <tr
                    key={log.id}
                    className="divide-x divide-border text-body transition-colors hover:bg-surface/50"
                  >
                    {/* Thời gian */}
                    <td className="whitespace-nowrap px-6 py-4 text-center tabular-nums text-xs text-subtle font-medium">
                      {formatDateTime(log.createdAt)}
                    </td>

                    {/* Tác vụ */}
                    <td className="px-4 py-4 text-center font-medium text-ink text-xs whitespace-nowrap">
                      {FEATURE_LABELS[log.feature] ?? log.feature}
                    </td>

                    {/* Người dùng */}
                    <td className="px-6 py-4 text-center text-xs font-semibold text-ink">
                      {log.userId != null ? (
                        <UserDisplayName userId={log.userId} userMap={userMap} />
                      ) : (
                        describeCaller(log, userMap)
                      )}
                    </td>

                    {/* Model */}
                    <td className="px-4 py-4 text-center font-mono text-xs text-subtle whitespace-nowrap">
                      {log.model}
                    </td>

                    {/* Token */}
                    <td className="whitespace-nowrap px-4 py-4 text-center tabular-nums text-xs font-medium text-ink">
                      {formatNumber(log.promptTokens)}{" "}
                      <span className="text-subtle font-normal">/</span>{" "}
                      {formatNumber(log.completionTokens)}
                    </td>

                    {/* Độ trễ */}
                    <td className="whitespace-nowrap px-4 py-4 text-center tabular-nums text-xs font-medium text-ink">
                      <span className={cn(log.latencyMs > 3000 ? "text-amber-600 dark:text-amber-400 font-semibold" : "")}>
                        {formatNumber(log.latencyMs)} ms
                      </span>
                    </td>

                    {/* Trạng thái */}
                    <td className="px-4 py-4 text-center">
                      <div className="flex flex-col items-center justify-center gap-1">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium shadow-2xs whitespace-nowrap",
                            log.status === "FAILED"
                              ? "border-rose-200 bg-rose-50/80 text-rose-700 dark:border-rose-800/60 dark:bg-rose-950/40 dark:text-rose-300"
                              : "border-emerald-200 bg-emerald-50/80 text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300"
                          )}
                        >
                          <span
                            className={cn(
                              "size-1.5 rounded-full",
                              log.status === "FAILED" ? "bg-rose-500" : "bg-emerald-500"
                            )}
                          />
                          {STATUS_LABELS[log.status] ?? log.status}
                        </span>
                        {log.errorMessage && (
                          <p
                            className="max-w-[180px] truncate text-[11px] text-destructive hover:underline cursor-help"
                            title={log.errorMessage}
                          >
                            {log.errorMessage}
                          </p>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Phân trang */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-card px-6 py-3.5 text-sm text-subtle">
            <span className="font-medium text-xs sm:text-sm">
              {formatNumber(data.totalElements)} lượt • Trang {data.page + 1}/{Math.max(data.totalPages, 1)}
              {isFetching && " • Đang cập nhật..."}
            </span>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={data.page <= 0 || isFetching}
                onClick={() => setPage((p) => Math.max(p - 1, 0))}
                className="rounded-xl border-border px-3 text-xs font-medium hover:bg-surface cursor-pointer"
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
                className="rounded-xl border-border px-3 text-xs font-medium hover:bg-surface cursor-pointer"
              >
                Sau
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
