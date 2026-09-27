import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, UserRound } from "lucide-react";

import { updateProfileSchema } from "@/features/profile/schema";
import { updateProfile } from "@/features/profile/api/profileApi";

const fieldClass =
  "h-11 w-full rounded-xl border border-border bg-surface px-3.5 text-sm text-ink outline-none transition placeholder:text-subtle focus:border-brand/40 focus:ring-2 focus:ring-brand/15 aria-[invalid=true]:border-destructive/50 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-destructive/20";

/**
 * Form sửa fullName / phone / dateOfBirth → PATCH /users/me
 */
export default function ProfileInfoForm({ profile, onUpdated }) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      dateOfBirth: "",
    },
  });

  useEffect(() => {
    if (!profile) return;
    reset({
      fullName: profile.fullName || "",
      phone: profile.phone || "",
      dateOfBirth: profile.dateOfBirth
        ? String(profile.dateOfBirth).slice(0, 10)
        : "",
    });
  }, [profile, reset]);

  const onSubmit = async (values) => {
    try {
      const payload = {
        fullName: values.fullName.trim(),
        // "" để BE xóa phone
        phone: values.phone?.trim() ?? "",
        dateOfBirth: values.dateOfBirth || null,
      };
      const updated = await updateProfile(payload);
      onUpdated?.(updated);
      reset({
        fullName: updated.fullName || "",
        phone: updated.phone || "",
        dateOfBirth: updated.dateOfBirth
          ? String(updated.dateOfBirth).slice(0, 10)
          : "",
      });
    } catch (err) {
      setError("root", { message: err.message || "Cập nhật thất bại" });
    }
  };

  return (
    <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <UserRound className="h-4.5 w-4.5" />
        </span>
        <div>
          <h2 className="text-base font-semibold text-ink">Thông tin cá nhân</h2>
          <p className="text-xs text-subtle">Họ tên, số điện thoại, ngày sinh</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">
            Họ và tên
          </label>
          <input
            type="text"
            autoComplete="name"
            className={fieldClass}
            aria-invalid={Boolean(errors.fullName)}
            {...register("fullName")}
          />
          {errors.fullName && (
            <p className="mt-1 text-xs text-destructive">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">
            Số điện thoại
          </label>
          <input
            type="tel"
            autoComplete="tel"
            placeholder="Để trống nếu muốn xóa"
            className={fieldClass}
            aria-invalid={Boolean(errors.phone)}
            {...register("phone")}
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">
            Ngày sinh
          </label>
          <input
            type="date"
            className={fieldClass}
            aria-invalid={Boolean(errors.dateOfBirth)}
            {...register("dateOfBirth")}
          />
          {errors.dateOfBirth && (
            <p className="mt-1 text-xs text-destructive">
              {errors.dateOfBirth.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">
            Email
          </label>
          <input
            type="email"
            disabled
            value={profile?.email || ""}
            className={fieldClass + " cursor-not-allowed opacity-70"}
          />
          <p className="mt-1 text-xs text-subtle">Email không thể thay đổi tại đây</p>
        </div>

        {errors.root && (
          <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {errors.root.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Lưu thay đổi
        </button>
      </form>
    </section>
  );
}
