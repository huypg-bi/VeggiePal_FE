import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import OrdersTableSection from "@/features/admin/payments/components/OrdersTableSection";
import PaymentDistributionSection from "@/features/admin/payments/components/PaymentDistributionSection";
import PaymentSummarySection from "@/features/admin/payments/components/PaymentSummarySection";
import RevenueChartSection from "@/features/admin/payments/components/RevenueChartSection";
import { PLAN_LABELS, toInstant, toOptions } from "@/features/admin/payments/utils/adminPaymentFormat";
import { cn } from "@/lib/utils";
import SelectField from "@/shared/components/SelectField";

const PLAN_OPTIONS = toOptions(PLAN_LABELS, "Mọi gói");

const fieldClass =
  "h-10 rounded-full border border-border bg-surface px-3.5 text-sm text-ink outline-none transition focus:border-brand/40 focus:ring-2 focus:ring-brand/15";

// Trang thanh toán (/admin/payments): doanh thu, phân bố trạng thái/gói và danh sách đơn hàng.
export default function AdminPaymentsScreen() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [planCode, setPlanCode] = useState("");


  // BE trả lỗi khi from > to nên chặn ngay từ form.
  const rangeInvalid = Boolean(fromDate && toDate && fromDate > toDate);

  const filters = useMemo(
    () => ({ from: toInstant(fromDate), to: toInstant(toDate, true), planCode }),
    [fromDate, toDate, planCode],
  );
  const enabled = !rangeInvalid;

  return (
    <div className="flex flex-col gap-8">


      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-border bg-card p-4 shadow-sm">
          <label className="flex items-center gap-2 text-sm text-subtle">
            Từ
            <input
              type="date"
              value={fromDate}
              max={toDate || undefined}
              onChange={(e) => setFromDate(e.target.value)}
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
              onChange={(e) => setToDate(e.target.value)}
              aria-label="Đến ngày"
              className={fieldClass}
            />
          </label>
          <SelectField
            aria-label="Lọc theo gói"
            options={PLAN_OPTIONS}
            value={planCode}
            onValueChange={setPlanCode}
            className="h-10"
          />
          {(fromDate || toDate || planCode) && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setFromDate("");
                setToDate("");
                setPlanCode("");
              }}
            >
              Xoá bộ lọc
            </Button>
          )}
        </div>
        {rangeInvalid && (
          <p className="rounded-xl bg-warning/15 px-3 py-2 text-sm text-warning">
            Ngày bắt đầu phải trước hoặc bằng ngày kết thúc.
          </p>
        )}
      </div>

      <PaymentSummarySection filters={filters} enabled={enabled} />
      <PaymentDistributionSection filters={filters} enabled={enabled} />
      <RevenueChartSection filters={filters} enabled={enabled} />
      <OrdersTableSection filters={filters} enabled={enabled} />
    </div>
  );
}
