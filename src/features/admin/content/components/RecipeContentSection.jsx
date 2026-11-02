import { useMemo, useState } from "react";

import ContentSearchBox from "@/features/admin/content/components/ContentSearchBox";
import ContentTable from "@/features/admin/content/components/ContentTable";
import { useAdminRecipes } from "@/features/admin/content/hooks/useAdminContent";
import { formatCount } from "@/features/admin/content/utils/contentFormat";
import { useDeleteRecipe } from "@/features/recipe/hooks/useRecipeMutations";

const COLUMNS = [
  { key: "servings", label: "Khẩu phần", align: "right", render: (recipe) => formatCount(recipe.servings) },
  { key: "favorites", label: "Lượt lưu", align: "right", render: (recipe) => formatCount(recipe.favoriteCount) },
];

const getAuthorId = (recipe) => recipe.userId;
const getViewPath = (recipe) => `/recipes/${recipe.id}`;
const getPublishedAt = (recipe) => recipe.publishedAt ?? recipe.createdAt;

// Tab "Công thức": công thức đã đăng (GET /recipes), tìm theo từ khóa ở BE.
export default function RecipeContentSection() {
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);
  const { data, isPending, isFetching, isError, error } = useAdminRecipes({ keyword, page });
  const deleteRecipe = useDeleteRecipe();
  const items = useMemo(() => data?.items ?? [], [data]);

  // Xóa hết công thức ở trang cuối thì lùi về trang trước (đặt lại theo dữ liệu mới, không dùng effect).
  if (data && page > 0 && page >= data.totalPages) setPage(Math.max(data.totalPages - 1, 0));

  return (
    <section aria-label="Quản lý công thức" className="flex flex-col gap-4">
      <ContentSearchBox
        placeholder="Tìm công thức theo tên..."
        ariaLabel="Tìm công thức"
        onChange={(value) => {
          setKeyword(value);
          setPage(0);
        }}
      />
      <ContentTable
        items={items}
        columns={COLUMNS}
        noun="công thức"
        deleteNote="sẽ bị gỡ khỏi trang công khai và không thể khôi phục."
        getAuthorId={getAuthorId}
        getViewPath={getViewPath}
        getPublishedAt={getPublishedAt}
        deleteMutation={deleteRecipe}
        page={page}
        totalPages={data?.totalPages ?? 0}
        totalElements={data?.totalElements ?? 0}
        onPageChange={setPage}
        isPending={isPending}
        isFetching={isFetching}
        isError={isError}
        error={error}
        emptyText={keyword ? "Không có công thức nào khớp từ khóa." : "Chưa có công thức nào được đăng."}
      />
    </section>
  );
}
