import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { healthRecordSchema } from "@/lib/schema";
import { useCreateHealthRecord } from "@/features/profile/hooks/useHealthRecords";
import {
  errorBoxClass,
  errorTextClass,
  healthInputClass,
  successBoxClass,
} from "@/features/profile/utils/editProfileConstants";

const labelClass = "block text-xs font-semibold text-body mb-1";

/** Form ghi nhận chiều cao / cân nặng mới (POST /nutrition/me/health-records). */
export default function EditHealthForm({ latest }) {
  const create = useCreateHealthRecord();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(healthRecordSchema),
    defaultValues: { heightCm: "", weightKg: "" },
    // Điền sẵn từ bản ghi mới nhất; tự cập nhật sau khi ghi nhận xong và refetch.
    values: latest
      ? { heightCm: latest.heightCm ?? "", weightKg: latest.weightKg ?? "" }
      : undefined,
  });

  const onSubmit = async (values) => {
    try {
      await create.mutateAsync({ heightCm: values.heightCm, weightKg: values.weightKg });
    } catch (err) {
      setError("root", { message: err.message || "Ghi nhận chỉ số thất bại" });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap items-start gap-3.5 mb-4">
      <div className="flex-1 min-w-[130px]">
        <label htmlFor="edit-heightCm" className={labelClass}>
          Chiều cao (cm)
        </label>
        <input
          id="edit-heightCm"
          type="number"
          step="0.1"
          placeholder="170"
          aria-invalid={Boolean(errors.heightCm)}
          className={healthInputClass}
          {...register("heightCm")}
        />
        {errors.heightCm && <span className={errorTextClass}>{errors.heightCm.message}</span>}
      </div>

      <div className="flex-1 min-w-[130px]">
        <label htmlFor="edit-weightKg" className={labelClass}>
          Cân nặng (kg)
        </label>
        <input
          id="edit-weightKg"
          type="number"
          step="0.1"
          placeholder="60"
          aria-invalid={Boolean(errors.weightKg)}
          className={healthInputClass}
          {...register("weightKg")}
        />
        {errors.weightKg && <span className={errorTextClass}>{errors.weightKg.message}</span>}
      </div>

      {/* mt-5 để nút thẳng hàng với ô nhập (bỏ qua dòng label) */}
      <Button
        type="submit"
        variant="default"
        disabled={isSubmitting}
        className="mt-5 rounded-2xl gap-1.5 px-5 font-semibold shadow-xs cursor-pointer"
      >
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        {isSubmitting ? "Đang ghi…" : "Ghi nhận"}
      </Button>

      {errors.root && <p className={`basis-full ${errorBoxClass}`}>{errors.root.message}</p>}
      {create.isSuccess && !errors.root && (
        <p className={`basis-full ${successBoxClass}`}>Đã ghi nhận chỉ số mới.</p>
      )}
    </form>
  );
}
