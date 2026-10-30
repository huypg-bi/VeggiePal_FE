import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Info, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useUsageLogs } from "@/features/admin/monitoring/hooks/useMonitoring";
import {
  describeCaller,
  formatDateTime,
  formatNumber,
  STATUS_LABELS,
  toIsoDateTime,
} from "@/features/admin/monitoring/utils/monitoringFormat";
import { cn } from "@/lib/utils";
import SelectField from "@/shared/components/SelectField";
import UserDisplayName from "@/shared/components/UserDisplayName";
import { usePublicUsers } from "@/shared/hooks/usePublicUsers";

const PAGE_SIZE = 20;
const USER_DEBOUNCE_MS = 400;

const STATUS_OPTIONS = [
  { value: "", label: "Mọi trạng thái" },
  { value: "SUCCESS", label: "Thành công" },
  { value: "FAILED", label: "Thất bại" },
];

const fieldClass =
  "h-10 rounded-full border border-border bg-surface px-3.5 text-sm text-ink outline-none transition focus:border-brand/40 focus:ring-2 focus:ring-brand/15";

// Khối nhật ký kiểm duyệt hiển thị các lượt gọi AI kiểm duyệt nội dung.
export default function ModerationLogsSection() {
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
      feature: "MODERATION",
      status: status || undefined,
      userId: userId || undefined,
      from: toIsoDateTime(fromDate),
      to: toIsoDateTime(toDate, true),
      page,
      size: PAGE_SIZE,
    },
    { enabled: !rangeInvalid },
  );

  const handleSelectStatus = (value) => {
    setStatus(value);
    setPage(0);
  };

  const handleDateChange = (setter) => (event) => {
    setter(event.target.value);
    setPage(0);
  };

  const handleUserChange = (event) => {
    const value = event.target.value.replace(/\D/g, "");
    setUserText(value);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setUserId(value);
      setPage(0);
    }, USER_DEBOUNCE_MS);
  };

  const handleResetFilters = () => {
    setStatus("");
    setUserText("");
    setUserId("");
    setFromDate("");
    setToDate("");
    setPage(0);
  };

  const hasActiveFilters = Boolean(status || userId || fromDate || toDate);
  const items = data?.items ?? [];
  const userIds = useMemo(() => items.map((l) => l.userId).filter(Boolean), [items]);
  const { data: userMap } = usePublicUsers(userIds);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 text-xs text-subtle shadow-sm">
        <Info className="mt-0.5 size-4 shrink-0 text-brand" />
        <div className="space-y-1">
          <p className="font-semibold text-ink">Nhật ký thực thi AI kiểm duyệt (Audit Logs):</p>
          <p className="leading-relaxed">
            • Tab này hiển thị nhật ký các lượt gọi AI kiểm duyệt tự động (thời gian, tác giả, model, token, độ trễ và trạng thái).
          </p>
          <p className="leading-relaxed">
            • Để xem lịch sử các ca kiểm duyệt hoàn chỉnh (kèm quyết định, lý do, độ tin cậy và người duyệt), vui lòng chuyển sang tab <strong className="text-ink">Đã xử lý</strong>.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-border bg-card p-4 shadow-sm">
        <SelectField
          aria-label="Lọc theo trạng thái"
          options={STATUS_OPTIONS}
          value={status}
          onValueChange={handleSelectStatus}
          className="h-10"
        />

        <input
          type="text"
          inputMode="numeric"
          value={userText}
          onChange={handleUserChange}
          placeholder="ID tác giả"
          aria-label="Lọc theo ID tác giả"
          className={cn(fieldClass, "w-36 placeholder:text-subtle")}
        />

        <label className="flex items-center gap-2 text-sm text-subtle">
          Từ
          <input
            type="date"
            value={fromDate}
            max={toDate || undefined}
            onChange={handleDateChange(setFromDate)}
            aria-label="Từ ngày"
            className={fieldClass}
          />
        </label>

        <label className="flex items-center gap-2 text-sm text-subtle">
          Đến
          <input
            type="date"
            value={toDate}
            min={fromDate || undefined}
            onChange={handleDateChange(setToDate)}
            aria-label="Đến ngày"
            className={fieldClass}
          />
        </label>

        {hasActiveFilters && (
          <Button type="button" variant="ghost" size="sm" onClick={handleResetFilters} className="text-subtle">
            <RotateCcw className="size-3.5" />
            Đặt lại
          </Button>
        )}
      </div>

      {rangeInvalid ? (
        <p className="rounded-xl bg-warning/15 px-3 py-2 text-sm text-warning">
          Ngày bắt đầu phải trước hoặc bằng ngày kết thúc.
        </p>
      ) : isError ? (
        <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{error.message}</p>
      ) : isPending ? (
        <div aria-hidden className="h-64 animate-pulse rounded-3xl border border-border bg-card" />
      ) : items.length === 0 ? (
        <p className="rounded-3xl border border-border bg-card p-6 text-sm text-subtle">
          Không có lượt gọi AI kiểm duyệt nào khớp bộ lọc.
        </p>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="bg-surface text-xs uppercase tracking-wide text-subtle">
                <tr>
                  <th className="px-4 py-3 font-semibold">Thời gian</th>
                  <th className="px-3 py-3 font-semibold">Tác giả</th>
                  <th className="px-3 py-3 font-semibold">Model AI</th>
                  <th className="px-3 py-3 text-right font-semibold">Token vào/ra</th>
                  <th className="px-3 py-3 text-right font-semibold">Độ trễ</th>
                  <th className="px-3 py-3 font-semibold">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((log) => (
                  <tr key={log.id} className="align-top text-body transition-colors hover:bg-surface/50">
                    <td className="whitespace-nowrap px-4 py-3 tabular-nums">{formatDateTime(log.createdAt)}</td>
                    <td className="px-3 py-3 text-xs font-semibold text-ink">
                      {log.userId != null ? (
                        <UserDisplayName userId={log.userId} userMap={userMap} />
                      ) : (
                        describeCaller(log, userMap)
                      )}
                    </td>
                    <td className="px-3 py-3 font-mono text-xs">{log.model}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-right tabular-nums">
                      {formatNumber(log.promptTokens)} / {formatNumber(log.completionTokens)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-right tabular-nums">
                      {formatNumber(log.latencyMs)} ms
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium",
                          log.status === "FAILED" ? "bg-destructive/10 text-destructive" : "bg-brand-soft text-brand",
                        )}
                      >
                        {STATUS_LABELS[log.status] ?? log.status}
                      </span>
                      {log.errorMessage && (
                        <p className="mt-1 max-w-60 break-words text-xs text-subtle">{log.errorMessage}</p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 text-sm text-subtle">
            <span>
              {formatNumber(data.totalElements)} lượt • Trang {data.page + 1}/{Math.max(data.totalPages, 1)}
              {isFetching && " • Đang tải..."}
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
    </div>
  );
}
