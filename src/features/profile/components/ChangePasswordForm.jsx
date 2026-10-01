import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { changePasswordSchema } from "@/lib/schema";
import { useChangePassword } from "@/features/profile/hooks/useProfile";

const fieldClass =
  "h-11 w-full rounded-xl border border-border bg-surface px-3.5 pr-11 text-sm text-ink outline-none transition placeholder:text-subtle focus:border-brand/40 focus:ring-2 focus:ring-brand/15 aria-[invalid=true]:border-destructive/50 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-destructive/20";

/**
 * Đổi mật khẩu → PUT /users/me/password
 */
export default function ChangePasswordForm() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const change = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      await change.mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      reset();
    } catch (err) {
      setError("root", { message: err.message || "Đổi mật khẩu thất bại" });
    }
  };

  return (
    <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-700">
          <KeyRound className="h-4.5 w-4.5" />
        </span>
        <div>
          <h2 className="text-base font-semibold text-ink">Đổi mật khẩu</h2>
          <p className="text-xs text-subtle">Tối thiểu 6 ký tự</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">
            Mật khẩu hiện tại
          </label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              autoComplete="current-password"
              className={fieldClass}
              aria-invalid={Boolean(errors.currentPassword)}
              {...register("currentPassword")}
            />
            <button
              type="button"
              onClick={() => setShowCurrent((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle hover:text-ink"
              aria-label="Hiện/ẩn mật khẩu"
            >
              {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="mt-1 text-xs text-destructive">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">
            Mật khẩu mới
          </label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              autoComplete="new-password"
              className={fieldClass}
              aria-invalid={Boolean(errors.newPassword)}
              {...register("newPassword")}
            />
            <button
              type="button"
              onClick={() => setShowNew((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle hover:text-ink"
              aria-label="Hiện/ẩn mật khẩu mới"
            >
              {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="mt-1 text-xs text-destructive">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">
            Nhập lại mật khẩu mới
          </label>
          <input
            type="password"
            autoComplete="new-password"
            className={fieldClass}
            aria-invalid={Boolean(errors.confirmPassword)}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {errors.root && (
          <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {errors.root.message}
          </p>
        )}
        {change.isSuccess && (
          <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            Đổi mật khẩu thành công.
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="rounded-xl"
        >
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          Đổi mật khẩu
        </Button>
      </form>
    </section>
  );
}
