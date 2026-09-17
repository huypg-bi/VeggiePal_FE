import { useState } from "react";
import { ArrowRight, Heart, Leaf, Plus, Sparkles } from "lucide-react";

import iconChatbot from "@/assets/img/icon_chatbot_1.png";
import { availableIngredients, flavorPreferences } from "@/features/home/data/mockHome";
import { cn } from "@/lib/utils";

export default function AiMealSuggestion() {
  const [preferences, setPreferences] = useState(flavorPreferences);

  const togglePreference = (id) => {
    setPreferences((prev) =>
      prev.map((pref) => (pref.id === id ? { ...pref, active: !pref.active } : pref))
    );
  };

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-black/15 bg-[#FBFBF3] p-6 shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:p-8">

      <div className="relative flex flex-col items-center text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F5E9] px-3 py-1 text-base font-semibold text-[#1D6C3D]">
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

        <div className="w-full flex-1 rounded-2xl border border-black/15 bg-white p-6 sm:p-8 min-h-[300px] flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-ink">
              Nguyên liệu có sẵn trong bếp:
            </h3>
            <button
              type="button"
              className="flex items-center gap-1 text-xs font-semibold text-[#1D6C3D] hover:underline"
            >
              <Plus className="h-3.5 w-3.5" />
              Thêm món mới
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {availableIngredients.map((item) => (
              <span
                key={item.id}
                className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-ink ring-1 ring-black/10"
              >
                <span
                  className="grid size-5 shrink-0 place-items-center rounded-full text-[11px] leading-none"
                  style={{ background: item.color }}
                >
                  {item.icon}
                </span>
                {item.label}
              </span>
            ))}
          </div>

          <div className="my-1 h-px" />

          <h3 className="text-base font-semibold text-ink">
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
                    ? "bg-[#1D6C3D] text-white"
                    : "bg-white text-ink ring-1 ring-black/10 hover:bg-[#F5F8F3]"
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

      <div className="relative mt-7 flex flex-col items-center">
        <button
          type="button"
          className="flex w-full max-w-md items-center justify-center gap-2 rounded-full bg-[#1D6C3D] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#17542F]"
        >
          <Sparkles className="h-4 w-4" />
          Nhờ Bé Bông Cải Lên Thực Đơn Tuần
          <ArrowRight className="h-4 w-4" />
        </button>
        <p className="mt-2.5 text-center text-xs text-subtle">
          Thuật toán AI tự động tối ưu hoá tỷ lệ Axit Amin hoàn chỉnh từ thực vật
        </p>
      </div>
    </section>
  );
}
