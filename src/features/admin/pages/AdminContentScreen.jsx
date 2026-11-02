import { useSearchParams } from "react-router-dom";
import { ChefHat, FileText, Video } from "lucide-react";

import BlogContentSection from "@/features/admin/content/components/BlogContentSection";
import RecipeContentSection from "@/features/admin/content/components/RecipeContentSection";
import VideoContentSection from "@/features/admin/content/components/VideoContentSection";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "blogs", label: "Bài viết", icon: FileText, Section: BlogContentSection },
  { id: "recipes", label: "Công thức", icon: ChefHat, Section: RecipeContentSection },
  { id: "videos", label: "Video", icon: Video, Section: VideoContentSection },
];

// Trang quản lý nội dung (/admin/content): xem và xóa bài viết, công thức, video đã đăng; tab nằm trên URL (?tab=).
export default function AdminContentScreen() {
  const [searchParams, setSearchParams] = useSearchParams();
  const active = TABS.find((tab) => tab.id === searchParams.get("tab")) ?? TABS[0];
  const { Section } = active;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-ink">Quản lý nội dung</h1>
        <p className="mt-1 text-sm text-subtle">
          Xem và gỡ bài viết, công thức, video đã đăng công khai. Nội dung bị xóa không thể khôi phục.
        </p>
      </div>

      <div role="tablist" aria-label="Loại nội dung" className="flex flex-wrap items-center gap-2">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active.id === id}
            onClick={() => setSearchParams({ tab: id }, { replace: true })}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition",
              active.id === id ? "bg-brand text-brand-foreground" : "bg-surface text-subtle hover:text-ink"
            )}
          >
            <Icon className="size-4" />
            {label}
          </button>
        ))}
      </div>

      <Section key={active.id} />
    </div>
  );
}
