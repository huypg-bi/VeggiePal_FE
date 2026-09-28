import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Activity,
  Loader2,
  Plus,
  Ruler,
  Scale,
  History,
} from "lucide-react";

import iconBmi from "@/assets/img/icon_bmi.png";
import { healthRecordSchema } from "@/lib/schema";
import {
  createHealthRecord,
  getHealthRecords,
  getLatestHealthRecord,
} from "@/features/profile/api/profileApi";

const fieldClass =
  "h-11 w-full rounded-xl border border-border bg-surface px-3.5 text-sm text-ink outline-none transition placeholder:text-subtle focus:border-brand/40 focus:ring-2 focus:ring-brand/15 aria-[invalid=true]:border-destructive/50 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-destructive/20";

function bmiLabel(bmi) {
  const n = Number(bmi);
  if (!n || Number.isNaN(n)) return { text: "—", color: "text-subtle" };
  if (n < 18.5) return { text: "Thiếu cân", color: "text-sky-600" };
  if (n < 23) return { text: "Bình thường", color: "text-emerald-600" };
  if (n < 25) return { text: "Thừa cân", color: "text-amber-600" };
  return { text: "Béo phì", color: "text-rose-600" };
}

function formatDt(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

/**
 * Chỉ số sức khỏe: latest + form ghi mới + lịch sử ngắn.
 * Gọi nutrition-service: /nutrition/me/health-records*
 */
export default function HealthRecordSection() {
  const [latest, setLatest] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(healthRecordSchema),
    defaultValues: { heightCm: "", weightKg: "" },
  });

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const [lat, page] = await Promise.all([
        getLatestHealthRecord(),
        getHealthRecords({ page: 0, size: 5 }),
      ]);
      setLatest(lat);
      setHistory(page?.items ?? []);
      if (lat) {
        reset({
          heightCm: lat.heightCm ?? "",
          weightKg: lat.weightKg ?? "",
        });
      }
    } catch (err) {
      setLoadError(err.message || "Không tải được dữ liệu sức khỏe");
    } finally {
      setLoading(false);
    }
  }, [reset]);

  useEffect(() => {
    load();
  }, [load]);

  const onSubmit = async (values) => {
    try {
      const created = await createHealthRecord({
        heightCm: values.heightCm,
        weightKg: values.weightKg,
      });
      setLatest(created);
      await load();
    } catch (err) {
      setError("root", { message: err.message || "Ghi nhận thất bại" });
    }
  };

  const label = bmiLabel(latest?.bmi);

  return (
    <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100">
          <img src={iconBmi} alt="" className="h-5 w-5 object-contain" />
        </span>
        <div>
          <h2 className="text-base font-semibold text-ink">Chỉ số sức khỏe</h2>
          <p className="text-xs text-subtle">
            Chiều cao, cân nặng — BMI tính bởi hệ thống
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-10 text-sm text-subtle">
          <Loader2 className="h-4 w-4 animate-spin" />
          Đang tải…
        </div>
      ) : loadError ? (
        <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {loadError}
        </p>
      ) : (
        <>
          {/* Latest cards */}
          <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
              <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                <Ruler className="h-3.5 w-3.5" />
                Chiều cao
              </div>
              <p className="text-xl font-bold text-ink">
                {latest?.heightCm != null ? `${latest.heightCm} cm` : "—"}
              </p>
            </div>
            <div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-4">
              <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-sky-700">
                <Scale className="h-3.5 w-3.5" />
                Cân nặng
              </div>
              <p className="text-xl font-bold text-ink">
                {latest?.weightKg != null ? `${latest.weightKg} kg` : "—"}
              </p>
            </div>
            <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4">
              <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-amber-700">
                <Activity className="h-3.5 w-3.5" />
                BMI
              </div>
              <p className="text-xl font-bold text-ink">
                {latest?.bmi != null ? Number(latest.bmi).toFixed(1) : "—"}
              </p>
              <p className={`text-xs font-medium ${label.color}`}>{label.text}</p>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto]"
          >
            <div>
              <label className="mb-1 block text-xs font-medium text-ink">
                Chiều cao (cm)
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="170"
                className={fieldClass}
                aria-invalid={Boolean(errors.heightCm)}
                {...register("heightCm")}
              />
              {errors.heightCm && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.heightCm.message}
                </p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink">
                Cân nặng (kg)
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="60"
                className={fieldClass}
                aria-invalid={Boolean(errors.weightKg)}
                {...register("weightKg")}
              />
              {errors.weightKg && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.weightKg.message}
                </p>
              )}
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50 sm:w-auto"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                Ghi nhận
              </button>
            </div>
            {errors.root && (
              <p className="sm:col-span-3 rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {errors.root.message}
              </p>
            )}
          </form>

          {/* History */}
          <div>
            <div className="mb-2 flex items-center gap-1.5 text-sm font-medium text-ink">
              <History className="h-4 w-4 text-subtle" />
              Lịch sử gần đây
            </div>
            {history.length === 0 ? (
              <p className="text-sm text-subtle">Chưa có bản ghi nào.</p>
            ) : (
              <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border">
                {history.map((r) => (
                  <li
                    key={r.id}
                    className="flex flex-wrap items-center justify-between gap-2 bg-surface/50 px-4 py-3 text-sm"
                  >
                    <span className="text-subtle">{formatDt(r.recordedAt)}</span>
                    <span className="font-medium text-ink">
                      {r.heightCm} cm · {r.weightKg} kg · BMI{" "}
                      {r.bmi != null ? Number(r.bmi).toFixed(1) : "—"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </section>
  );
}
