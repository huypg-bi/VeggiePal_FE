import { useState } from "react";
import { ArrowRight, Plus, Sparkles, Wand2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import iconChatbot from "@/assets/img/icon_chatbot_1.png";
import { availableIngredients, flavorPreferences } from "@/features/meal-planner/data/mockMealPlanner";
import { cn } from "@/lib/utils";

export default function AiMealSuggestion() {
  const [ingredients, setIngredients] = useState(availableIngredients);
  const [preferences, setPreferences] = useState(flavorPreferences);

  const togglePreference = (id) => {
    setPreferences((prev) =>
      prev.map((pref) => (pref.id === id ? { ...pref, active: !pref.active } : pref))
    );
  };

  const removeIngredient = (id) => {
    setIngredients((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <section className="relative rounded-[28px] bg-card p-6 shadow-lg sm:p-8">

      <div className="relative flex flex-col items-center text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-base font-semibold text-brand">
          <Sparkles className="h-3.5 w-3.5" />
          AI Gợi Ý Thực Đơn
        </span>
        <h2 className="mt-3 text-xl font-bold text-ink sm:text-2xl">
          Hôm nay tủ lạnh nhà bạn có nguyên liệu tươi nào?
        </h2>
        <p className="mt-2 max-w-xl text-sm text-subtle">
          Bé Bông Cải sẽ kết hợp các loại rau củ sẵn có để thiết kế thực đơn
          thuần thực vật chuẩn cân bằng vi chất.
        </p>
      </div>

      <div className="relative mt-7 flex flex-col items-center gap-6 lg:flex-row lg:items-center">
        <div className="relative shrink-0">
          <img
            src={iconChatbot}
            alt="Bé Bông Cải gợi ý thực đơn"
            className="mt-2 h-72 w-auto select-none sm:h-72"
            draggable={false}
          />
        </div>

        <div className="w-full flex-1 rounded-2xl bg-surface p-6 sm:p-8 min-h-[300px] flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-ink">
              Nguyên liệu có sẵn trong bếp:
            </h3>
            <button
              type="button"
              className="flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
            >
              <Plus className="h-3.5 w-3.5" />
              Thêm món mới
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {ingredients.map((item) => (
              <span
                key={item.id}
                className="flex items-center gap-2 rounded-full bg-card px-3 py-1.5 text-xs font-medium text-ink shadow-sm"
              >
                <span
                  className="grid size-5 shrink-0 place-items-center rounded-full text-[11px] leading-none"
                  style={{ background: item.color }}
                >
                  {item.icon}
                </span>
                {item.label}
                <button
                  type="button"
                  onClick={() => removeIngredient(item.id)}
                  aria-label={`Bỏ ${item.label}`}
                  className="grid size-4 shrink-0 place-items-center rounded-full text-subtle transition hover:bg-surface hover:text-ink"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {ingredients.length === 0 && (
              <span className="text-xs text-subtle">Chưa có nguyên liệu nào, thêm món mới nhé!</span>
            )}
          </div>

          <h3 className="text-base font-semibold text-ink mt-2">
            Gợi ý món & khẩu vị mong muốn:
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {preferences.map((pref) => (
              <button
                key={pref.id}
                type="button"
                onClick={() => togglePreference(pref.id)}
                className={cn(
                  "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition",
                  pref.active
                    ? "bg-brand text-brand-foreground"
                    : "bg-card text-ink ring-1 ring-border hover:bg-surface"
                )}
              >
                <span
                  className={cn(
                    "grid size-5 shrink-0 place-items-center rounded-full text-[11px] leading-none",
                    pref.active && "bg-white/20"
                  )}
                  style={!pref.active ? { background: pref.color } : undefined}
                >
                  {pref.icon}
                </span>
                {pref.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative mt-7 flex flex-col items-center gap-4 rounded-2xl bg-surface p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <p className="flex items-center gap-2 text-center text-xs text-subtle sm:text-left">
          <Wand2 className="h-4 w-4 shrink-0 text-brand" />
          Thuật toán AI tự động tối ưu hoá tỷ lệ Axit Amin hoàn chỉnh từ thực vật
        </p>
        <Button
          type="button"
          size="lg"
          className="h-auto min-h-11 w-full whitespace-normal px-6 py-2.5 shadow-sm sm:w-auto"
        >
          <Sparkles className="size-4" />
          Nhờ Bé Bông Cải Lên Thực Đơn Mới
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </section>
  );
}
