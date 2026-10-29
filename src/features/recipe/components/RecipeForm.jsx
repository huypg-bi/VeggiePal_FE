import { useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Trash2 } from "lucide-react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import ThumbnailPicker from "@/features/blog/components/ThumbnailPicker";
import IngredientPicker from "@/features/recipe/components/IngredientPicker";
import RecipeStepsEditor from "@/features/recipe/components/RecipeStepsEditor";
import {
  useCreateRecipe,
  usePublishRecipe,
  useUpdateRecipe,
  useUploadRecipeImage,
} from "@/features/recipe/hooks/useRecipeMutations";
import { RECIPE_LIMITS, recipeSchema } from "@/features/recipe/schema";
import { isGramUnit } from "@/features/recipe/utils/recipeNutrition";
import {
  RECIPE_IMAGE_TYPES,
  UNIT_OPTIONS,
  emptyRecipeForm,
  formValuesToPayload,
  recipeToFormValues,
  validateRecipeImage,
} from "@/features/recipe/utils/recipeForm";
import SelectField from "@/shared/components/SelectField";

const fieldClass =
  "w-full rounded-xl border border-border bg-surface px-3.5 text-sm text-ink outline-none transition placeholder:text-subtle focus:border-brand/40 focus:ring-2 focus:ring-brand/15 aria-[invalid=true]:border-destructive/50 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-destructive/20";
const inputClass = `${fieldClass} h-11`;
const labelClass = "mb-1.5 block text-sm font-semibold text-ink";
const errorClass = "mt-1.5 text-xs text-destructive";
const cardClass = "flex flex-col gap-5 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6";

export default function RecipeForm({ recipe }) {
  const idPrefix = useId();
  const navigate = useNavigate();
  const isEdit = Boolean(recipe);
  const canPublish = !isEdit || recipe.status !== "PUBLISHED";

  const createRecipe = useCreateRecipe();
  const updateRecipe = useUpdateRecipe();
  const publishRecipe = usePublishRecipe();
  const uploadImage = useUploadRecipeImage();
  const [imageFile, setImageFile] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(recipeSchema),
    defaultValues: recipe ? recipeToFormValues(recipe) : emptyRecipeForm(),
  });

  const ingredientFields = useFieldArray({ control, name: "ingredients" });
  // Đơn vị đang chọn của từng nguyên liệu, để cảnh báo ngay khi chọn đơn vị không tính được kcal.
  const watchedIngredients = useWatch({ control, name: "ingredients" });

  const addIngredient = (ingredient) =>
    ingredientFields.append({
      ingredientId: ingredient.id,
      ingredientName: ingredient.name,
      quantity: "100",
      unit: "GRAM",
      note: "",
    });

  // Trả true nếu tải ảnh thành công; lỗi thì báo nhưng không chặn, vì công thức đã được lưu.
  const uploadImageSafely = async (id) => {
    try {
      await uploadImage.mutateAsync({ id, file: imageFile });
      return true;
    } catch (error) {
      toast.error(`Công thức đã được lưu nhưng tải ảnh thất bại: ${error.message}`);
      return false;
    }
  };

  const save = (publish) =>
    handleSubmit(async (values) => {
      const payload = formValuesToPayload(values);

      try {
        const saved = isEdit
          ? await updateRecipe.mutateAsync({ id: recipe.id, payload })
          : await createRecipe.mutateAsync(payload);

        // Tải ảnh trước khi đăng để công thức vừa đăng đã có ảnh; ảnh lỗi thì giữ ở bản nháp để thử lại.
        if (imageFile && !(await uploadImageSafely(saved.id)) && publish) {
          toast.info("Công thức được lưu dưới dạng bản nháp, bạn có thể sửa và đăng lại sau.");
          navigate("/my-content?tab=recipes");
          return;
        }

        if (publish) {
          try {
            await publishRecipe.mutateAsync(saved.id);
            toast.success("Đã đăng công thức");
          } catch (error) {
            // Công thức đã được lưu, chỉ bước đăng lỗi -> không bắt người dùng nhập lại.
            toast.error(`Đã lưu công thức nhưng đăng thất bại: ${error.message}`);
          }
        } else {
          toast.success(isEdit ? "Đã cập nhật công thức" : "Đã lưu bản nháp");
        }
        navigate("/my-content?tab=recipes");
      } catch (error) {
        setError("root", { message: error.message });
      }
    });

  const ingredientsError =
    errors.ingredients?.root?.message ?? errors.ingredients?.message;

  return (
    <form onSubmit={(event) => event.preventDefault()} noValidate className="flex flex-col gap-5">
      {/* Thông tin chung */}
      <section className={cardClass}>
        <h2 className="font-heading text-lg font-bold text-ink">Thông tin chung</h2>

        <div>
          <label htmlFor={`${idPrefix}-title`} className={labelClass}>
            Tên công thức
          </label>
          <input
            id={`${idPrefix}-title`}
            type="text"
            placeholder="Ví dụ: Cơm gạo lứt đậu hũ"
            aria-invalid={Boolean(errors.title)}
            className={inputClass}
            {...register("title")}
          />
          {errors.title && <p className={errorClass}>{errors.title.message}</p>}
        </div>

        <div>
          <label htmlFor={`${idPrefix}-description`} className={labelClass}>
            Mô tả (không bắt buộc)
          </label>
          <textarea
            id={`${idPrefix}-description`}
            rows={3}
            placeholder="Giới thiệu ngắn về món ăn"
            maxLength={RECIPE_LIMITS.description}
            aria-invalid={Boolean(errors.description)}
            className={`${fieldClass} resize-y py-2.5`}
            {...register("description")}
          />
          {errors.description && <p className={errorClass}>{errors.description.message}</p>}
        </div>

        <div>
          <span className={labelClass}>Ảnh công thức (không bắt buộc)</span>
          <ThumbnailPicker
            currentUrl={recipe?.imageUrl}
            onChange={setImageFile}
            acceptTypes={RECIPE_IMAGE_TYPES}
            validate={validateRecipeImage}
            label="Ảnh công thức"
            hint="JPEG hoặc PNG, tối đa 5MB"
          />
        </div>

        <div>
          <label htmlFor={`${idPrefix}-image`} className={labelClass}>
            Hoặc dán link ảnh (không bắt buộc)
          </label>
          <input
            id={`${idPrefix}-image`}
            type="url"
            inputMode="url"
            placeholder="https://..."
            aria-invalid={Boolean(errors.imageUrl)}
            className={inputClass}
            {...register("imageUrl")}
          />
          {errors.imageUrl ? (
            <p className={errorClass}>{errors.imageUrl.message}</p>
          ) : (
            <p className="mt-1.5 text-xs text-subtle">Nếu bạn chọn ảnh tải lên, ảnh đó sẽ được dùng thay cho link.</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor={`${idPrefix}-servings`} className={labelClass}>
              Số khẩu phần
            </label>
            <input
              id={`${idPrefix}-servings`}
              type="text"
              inputMode="numeric"
              aria-invalid={Boolean(errors.servings)}
              className={inputClass}
              {...register("servings")}
            />
            {errors.servings && <p className={errorClass}>{errors.servings.message}</p>}
          </div>
          <div>
            <label htmlFor={`${idPrefix}-prep`} className={labelClass}>
              Chuẩn bị (phút)
            </label>
            <input
              id={`${idPrefix}-prep`}
              type="text"
              inputMode="numeric"
              placeholder="15"
              aria-invalid={Boolean(errors.prepTime)}
              className={inputClass}
              {...register("prepTime")}
            />
            {errors.prepTime && <p className={errorClass}>{errors.prepTime.message}</p>}
          </div>
          <div>
            <label htmlFor={`${idPrefix}-cook`} className={labelClass}>
              Nấu (phút)
            </label>
            <input
              id={`${idPrefix}-cook`}
              type="text"
              inputMode="numeric"
              placeholder="30"
              aria-invalid={Boolean(errors.cookTime)}
              className={inputClass}
              {...register("cookTime")}
            />
            {errors.cookTime && <p className={errorClass}>{errors.cookTime.message}</p>}
          </div>
        </div>
      </section>

      {/* Nguyên liệu */}
      <section className={cardClass}>
        <h2 className="font-heading text-lg font-bold text-ink">Nguyên liệu</h2>
        <p className="rounded-xl bg-brand-soft px-3 py-2 text-sm text-brand">
          Chọn đơn vị <b>gram</b> hoặc <b>kg</b> là hệ thống luôn tự tính được kcal và đạm cho công thức.
          Đơn vị khác (ml, muỗng, quả...) chỉ quy đổi được với một số nguyên liệu quen thuộc; nếu có nguyên liệu không
          quy đổi được, công thức sẽ chưa có thông tin dinh dưỡng.
        </p>

        <IngredientPicker
          selectedIds={ingredientFields.fields.map((f) => f.ingredientId)}
          onPick={addIngredient}
        />

        {ingredientFields.fields.length > 0 && (
          <ul className="flex flex-col gap-3">
            {ingredientFields.fields.map((field, index) => {
              const rowErrors = errors.ingredients?.[index];
              return (
                <li key={field.id} className="rounded-2xl bg-surface p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-ink">{field.ingredientName}</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Xóa ${field.ingredientName}`}
                      onClick={() => ingredientFields.remove(index)}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>

                  <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-[110px_160px_1fr]">
                    <div>
                      <input
                        type="text"
                        inputMode="decimal"
                        aria-label={`Số lượng ${field.ingredientName}`}
                        aria-invalid={Boolean(rowErrors?.quantity)}
                        className={`${inputClass} bg-card`}
                        {...register(`ingredients.${index}.quantity`)}
                      />
                    </div>
                    <div>
                      <Controller
                        name={`ingredients.${index}.unit`}
                        control={control}
                        render={({ field: unitField }) => (
                          <SelectField
                            aria-label={`Đơn vị ${field.ingredientName}`}
                            variant="field"
                            className="bg-card"
                            options={UNIT_OPTIONS}
                            value={unitField.value}
                            onValueChange={unitField.onChange}
                            onBlur={unitField.onBlur}
                          />
                        )}
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <input
                        type="text"
                        placeholder="Ghi chú (vd: cắt vuông)"
                        aria-label={`Ghi chú ${field.ingredientName}`}
                        aria-invalid={Boolean(rowErrors?.note)}
                        className={`${inputClass} bg-card`}
                        {...register(`ingredients.${index}.note`)}
                      />
                    </div>
                  </div>
                  {(rowErrors?.quantity || rowErrors?.note) && (
                    <p className={errorClass}>{rowErrors.quantity?.message ?? rowErrors.note?.message}</p>
                  )}
                  {watchedIngredients?.[index] && !isGramUnit(watchedIngredients[index].unit) && (
                    <p className="mt-1.5 text-xs text-warning">
                      Đơn vị này chỉ quy đổi được với một số nguyên liệu quen thuộc, nếu không công thức sẽ chưa có kcal. Chọn gram hoặc kg để chắc chắn tính được.
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        )}
        {ingredientsError && <p className="text-xs text-destructive">{ingredientsError}</p>}
      </section>

      <RecipeStepsEditor control={control} register={register} errors={errors} />

      {errors.root && (
        <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {errors.root.message}
        </p>
      )}

      <div className="flex flex-wrap justify-end gap-2">
        <Button type="button" variant="ghost" disabled={isSubmitting} onClick={() => navigate(-1)}>
          Hủy
        </Button>
        <Button
          type="button"
          variant={canPublish ? "outline" : "default"}
          disabled={isSubmitting}
          onClick={save(false)}
        >
          {isSubmitting && !canPublish && <Loader2 className="size-4 animate-spin" />}
          {isEdit ? "Lưu thay đổi" : "Lưu nháp"}
        </Button>
        {canPublish && (
          <Button type="button" disabled={isSubmitting} onClick={save(true)}>
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            Lưu và đăng
          </Button>
        )}
      </div>
    </form>
  );
}
