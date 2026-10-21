import { Link, useSearchParams } from "react-router-dom";
import { BookOpen, ChefHat, Plus } from "lucide-react";

import { buttonVariants } from "@/components/ui/variants/button-variants";
import MyBlogList from "@/features/my-content/components/MyBlogList";
import MyRecipeList from "@/features/my-content/components/MyRecipeList";
import { cn } from "@/lib/utils";
import AppFooter from "@/shared/components/AppFooter";
import AppHeader from "@/shared/components/AppHeader";

const TABS = [
  { id: "blogs", label: "Bài viết", icon: BookOpen },
  { id: "recipes", label: "Công thức", icon: ChefHat },
];

// Trang "Bài viết của tôi" (route /my-content, cần đăng nhập): bài viết (GET /blogs/me)
// và công thức (GET /recipes/me) của chính mình ở mọi trạng thái, kèm nút tạo mới / sửa / xóa.
// Tab nằm trên URL (?tab=recipes) để form công thức quay về đúng tab.
export default function MyContentScreen() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") === "recipes" ? "recipes" : "blogs";
  const setTab = (id) => setSearchParams(id === "blogs" ? {} : { tab: id }, { replace: true });

  return (
    <div className="min-h-dvh">
      <AppHeader />

      <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-heading text-3xl font-bold text-ink">Bài viết của tôi</h1>
            <p className="mt-1 text-sm text-subtle">
              Quản lý bài viết và công thức bạn đã tạo, kể cả bản nháp và nội dung đang chờ duyệt.
            </p>
          </div>
          <Link
            to={tab === "blogs" ? "/blog/new" : "/recipes/new"}
            className={buttonVariants({ variant: "default", size: "md" })}
          >
            <Plus className="size-4" />
            {tab === "blogs" ? "Viết bài mới" : "Tạo công thức"}
          </Link>
        </div>

        <div role="tablist" className="flex items-center gap-2">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition",
                tab === id
                  ? "bg-brand text-brand-foreground"
                  : "bg-surface text-subtle hover:text-ink"
              )}
            >
              <Icon className="size-4" />
              {label}
            </button>
          ))}
        </div>

        {tab === "blogs" ? <MyBlogList /> : <MyRecipeList />}
      </main>

      <AppFooter />
    </div>
  );
}
