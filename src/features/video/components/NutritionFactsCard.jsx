import { useState } from "react";
import { ChevronDown, ClipboardList, Loader2 } from "lucide-react";
import { toast } from "sonner";

import iconNutrition from "@/assets/img/icon_video_page.png";
import { Button } from "@/components/ui/button";
import { useVideoRecipe } from "@/features/video/hooks/useVideoRecipe";
import { readNutritionEstimate } from "@/features/video/utils/videoJob";
import { cn } from "@/lib/utils";

// Thu gọn: chỉ hiện vài nguyên liệu đầu; "Hiện thêm" mới mở hết.
const COLLAPSED_INGREDIENTS = 3;

const formatAmount = (value, digits) => value.toLocaleString("vi-VN", { maximumFractionDigits: digits });

const EMPTY_NOTE = {
  unsupported: "Video YouTube chưa hỗ trợ bóc tách nên chưa có dinh dưỡng ước tính.",
  processing: "AI đang bóc tách công thức, dinh dưỡng ước tính sẽ hiện khi xong.",
};

export default function NutritionFactsCard({ video }) {
  const { status, extraction } = useVideoRecipe(video);
  const nutrition = status === "ready" ? readNutritionEstimate(extraction) : null;
  const ingredients = status === "ready" ? (extraction?.ingredients ?? []) : [];
  const [expanded, setExpanded] = useState(false);
  const canToggle = ingredients.length > COLLAPSED_INGREDIENTS;
  const visibleIngredients = expanded || !canToggle ? ingredients : ingredients.slice(0, COLLAPSED_INGREDIENTS);

  // Chép đủ mọi nguyên liệu (kể cả phần đang gập) để dán vào ghi chú đi chợ.
  const handleCopyShoppingList = async () => {
    const text = ingredients.map((item) => `- ${item.name}: ${item.quantity}`).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`Đã chép ${ingredients.length} nguyên liệu, bạn dán vào ghi chú để đi chợ`);
    } catch {
      toast.error("Không chép được, bạn thử lại nhé");
    }
  };

  return (
    <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <img src={iconNutrition} alt="" className="size-9 shrink-0" />
          <div>
            <h2 className="text-sm font-bold leading-snug text-ink">Giá Trị Dinh Dưỡng</h2>
            <span className="text-[11px] font-medium text-subtle">AI ước tính từ nguyên liệu trong video</span>
          </div>
        </div>
        {nutrition && (
          <span className="rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-semibold text-brand">
            Cả công thức
          </span>
        )}
      </div>

      {status === "loading" && (
        <div className="mt-4 flex items-center gap-2 text-xs text-subtle">
          <Loader2 className="size-4 animate-spin text-brand" />
          Đang tải…
        </div>
      )}

      {status !== "loading" && status !== "ready" && (
        <p className="mt-4 text-xs leading-relaxed text-subtle">
          {EMPTY_NOTE[status] ?? "Bóc tách công thức AI của video này để xem dinh dưỡng ước tính."}
        </p>
      )}

      {status === "ready" && !nutrition && (
        <p className="mt-4 text-xs leading-relaxed text-subtle">
          Kết quả bóc tách này được tạo trước khi có tính năng ước tính dinh dưỡng nên chưa có số liệu.
        </p>
      )}

      {nutrition && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-2 text-center">
            <NutritionStat value={formatAmount(nutrition.calories, 0)} label="Năng lượng (kcal)" valueClass="text-ink" />
            <NutritionStat value={`${formatAmount(nutrition.protein, 1)} g`} label="Đạm" valueClass="text-chart-5" />
            <NutritionStat
              value={`${formatAmount(nutrition.carbohydrate, 1)} g`}
              label="Tinh bột (carb)"
              valueClass="text-chart-1"
            />
            <NutritionStat value={`${formatAmount(nutrition.fat, 1)} g`} label="Chất béo" valueClass="text-chart-4" />
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-subtle">
            Số liệu ước tính cho cả công thức (không phải mỗi khẩu phần), chỉ mang tính tham khảo.
          </p>
        </>
      )}

      {ingredients.length > 0 && (
        <>
          <ul className="mt-4 flex flex-col gap-2">
            {visibleIngredients.map((item, index) => (
              <li key={index} className="flex items-center justify-between gap-3 text-xs text-body">
                <span className="flex items-center gap-2">
                  <span className="size-1.5 shrink-0 rounded-full bg-brand" />
                  {item.name}
                </span>
                <span className="shrink-0 font-medium text-subtle">{item.quantity}</span>
              </li>
            ))}
          </ul>

          {canToggle && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              className="mt-3 flex items-center gap-1 text-xs font-semibold text-subtle transition hover:text-ink"
            >
              {expanded ? "Ẩn bớt" : `Hiện thêm (${ingredients.length - COLLAPSED_INGREDIENTS} nguyên liệu)`}
              <ChevronDown className={cn("size-3.5 transition-transform", expanded && "rotate-180")} />
            </button>
          )}

          <Button type="button" size="md" onClick={handleCopyShoppingList} className="mt-4 w-full shadow-sm">
            <ClipboardList className="size-4" />
            Chép danh sách nguyên liệu
          </Button>
        </>
      )}
    </section>
  );
}

function NutritionStat({ value, label, valueClass }) {
  return (
    <div className="rounded-xl bg-surface px-2 py-2.5">
      <p className={`text-lg font-bold ${valueClass}`}>{value}</p>
      <p className="mt-0.5 text-[10px] leading-tight text-subtle">{label}</p>
    </div>
  );
}
