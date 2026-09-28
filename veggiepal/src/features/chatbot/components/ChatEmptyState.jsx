import { ArrowUpRight, Pill, Scale, Soup, Sparkles, Sprout } from "lucide-react";

import { SUGGESTED_PROMPTS } from "@/features/chatbot/data/mockChatData";

const CATEGORY_ICONS = {
  sprout: Sprout,
  soup: Soup,
  pill: Pill,
  scale: Scale,
};

export default function ChatEmptyState({ onPromptClick }) {
  return (
    <div className="flex flex-col items-center gap-6 py-6 text-center">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3.5 py-1.5 text-xs font-semibold text-brand dark:bg-[#16301f]">
        <Sparkles className="h-3.5 w-3.5" />
        Trợ lý Dinh dưỡng VeggiePal
      </span>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-ink sm:text-3xl">
          Hôm nay bạn muốn nấu hoặc tìm hiểu món gì?
        </h2>
        <p className="mx-auto max-w-lg text-sm text-subtle">
          Tôi có thể giúp bạn giải đáp về giá trị dinh dưỡng, công thức món
          chay chuẩn Việt và cân đối calo theo thể trạng.
        </p>
      </div>

      <div className="grid w-full grid-cols-1 gap-3 text-left sm:grid-cols-2">
        {SUGGESTED_PROMPTS.map((prompt) => {
          const Icon = CATEGORY_ICONS[prompt.icon] ?? Sparkles;
          return (
            <button
              key={prompt.id}
              type="button"
              onClick={() => onPromptClick(prompt.description)}
              className="group relative flex flex-col gap-2 rounded-2xl border border-border bg-surface/60 p-4 text-left transition hover:border-brand/30 hover:bg-surface"
            >
              <ArrowUpRight className="absolute right-3 top-3 h-4 w-4 text-subtle transition group-hover:text-brand" />
              <span className="grid size-9 place-items-center rounded-full bg-brand-soft text-brand dark:bg-[#16301f]">
                <Icon className="h-4.5 w-4.5" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wide text-brand">
                {prompt.category}
              </span>
              <span className="text-sm font-semibold text-ink">
                {prompt.title}
              </span>
              <span className="line-clamp-2 text-xs text-subtle">
                {prompt.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
