import { useId } from "react";
import { ChevronDown, Target } from "lucide-react";

const inputClass =
  "h-10 w-full rounded-xl border border-border bg-card px-3 text-sm text-ink outline-none transition placeholder:text-subtle focus:border-brand/40 focus:ring-2 focus:ring-brand/15 aria-[invalid=true]:border-destructive/50 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-destructive/20";

// Mỗi dòng là một chất: field min/max trùng tên với dailyNutritionTarget của BE.
const ROWS = [
  { key: "Calories", label: "Năng lượng", unit: "kcal", placeholder: ["1500", "2200"] },
  { key: "Protein", label: "Đạm", unit: "g", placeholder: ["60", "140"] },
  { key: "Carbohydrate", label: "Tinh bột", unit: "g", placeholder: ["150", "320"] },
  { key: "Fat", label: "Chất béo", unit: "g", placeholder: ["35", "90"] },
];

/**
 * Mục tiêu dinh dưỡng MỖI NGÀY (tùy chọn), nằm trong form react-hook-form của AiMealSuggestion.
 * Để trống = không ràng buộc. Nhập quá chặt thì BE trả lỗi 6012 (mục tiêu không đạt được).
 */
export default function NutritionTargetFields({ register, errors }) {
  const idPrefix = useId();

  return (
    <details className="group rounded-2xl bg-card ring-1 ring-border">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-semibold text-ink [&::-webkit-details-marker]:hidden">
        <Target className="size-4 text-brand" />
        Mục tiêu dinh dưỡng mỗi ngày
        <span className="text-xs font-normal text-subtle">(không bắt buộc)</span>
        <ChevronDown className="ml-auto size-4 text-subtle transition group-open:rotate-180" />
      </summary>

      <div className="flex flex-col gap-3 border-t border-border px-4 pb-4 pt-3">
        <p className="text-xs leading-relaxed text-subtle">
          Điền khoảng bạn muốn, mỗi ngày trong thực đơn sẽ nằm trong khoảng đó (cho phép lệch tối đa khoảng
          15%). Bỏ trống ô nào thì ô đó không bị giới hạn. Khoảng quá chặt so với các món hiện có sẽ không lên được thực đơn.
        </p>

        {ROWS.map((row) => {
          const minName = `min${row.key}`;
          const maxName = `max${row.key}`;
          return (
            <div key={row.key} className="grid grid-cols-[6.5rem_1fr_1fr] items-start gap-2 sm:grid-cols-[8rem_1fr_1fr]">
              <span className="pt-2.5 text-xs font-semibold text-ink">
                {row.label} <span className="font-normal text-subtle">({row.unit})</span>
              </span>
              <div>
                <input
                  id={`${idPrefix}-${minName}`}
                  type="text"
                  inputMode="decimal"
                  placeholder={`Từ ${row.placeholder[0]}`}
                  aria-label={`${row.label} tối thiểu`}
                  aria-invalid={Boolean(errors[minName])}
                  className={inputClass}
                  {...register(minName)}
                />
                {errors[minName] && <p className="mt-1 text-xs text-destructive">{errors[minName].message}</p>}
              </div>
              <div>
                <input
                  id={`${idPrefix}-${maxName}`}
                  type="text"
                  inputMode="decimal"
                  placeholder={`Đến ${row.placeholder[1]}`}
                  aria-label={`${row.label} tối đa`}
                  aria-invalid={Boolean(errors[maxName])}
                  className={inputClass}
                  {...register(maxName)}
                />
                {errors[maxName] && <p className="mt-1 text-xs text-destructive">{errors[maxName].message}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </details>
  );
}
