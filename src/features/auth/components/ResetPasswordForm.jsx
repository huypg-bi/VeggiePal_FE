import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { resetPassword } from "@/features/auth/api/authApi";
import { resetPasswordSchema } from "@/features/auth/schema";
import iconFgp from "@/assets/img/icon_fgp.png";

// resetToken chỉ nằm trong location.state (dùng một lần, sống 10 phút) nên mở thẳng URL thì quay về bước đầu.
export default function ResetPasswordForm() {
  const resetToken = useLocation().state?.resetToken;
  if (!resetToken) return <Navigate to="/forgot-password" replace />;
  return <ResetPasswordFields resetToken={resetToken} />;
}

function ResetPasswordFields({ resetToken }) {
  const navigate = useNavigate();
  const passwordId = useId();
  const confirmId = useId();
  const [showPassword, setShowPassword] = useState(false);
  const [expired, setExpired] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const onSubmit = async ({ newPassword }) => {
    try {
      await resetPassword({ resetToken, newPassword });
      toast.success("Đã đặt lại mật khẩu, vui lòng đăng nhập bằng mật khẩu mới.");
      navigate("/login", { replace: true });
    } catch (err) {
      // 1030: phiên đặt lại đã hết hạn, phải xin mã mới từ đầu.
      if (err.code === 1030) setExpired(true);
      setError("root", { message: err.message || "Đặt lại mật khẩu thất bại" });
    }
  };

  const toggle = (
    <button
      type="button"
      onClick={() => setShowPassword((v) => !v)}
      aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
      className="absolute right-0 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center text-white/80 transition hover:text-white"
    >
      {showPassword ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
    </button>
  );

  return (
    <div className="w-full max-w-[380px] px-2 py-4">
      <div className="flex flex-col items-center gap-2">
        <img src={iconFgp} alt="" className="h-50 w-auto object-contain" />
        <h2 className="text-center text-[26px] font-extrabold tracking-tight text-white font-heading">
          Đặt mật khẩu mới
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 flex flex-col gap-4">
        {errors.root && (
          <p role="alert" className="rounded-lg bg-destructive/15 px-3 py-2 text-sm text-destructive">
            {errors.root.message}
          </p>
        )}

        <div className="flex flex-col gap-1">
          <label htmlFor={passwordId} className="text-[20px] font-semibold tracking-tight text-white font-heading">
            Mật khẩu mới
          </label>
          <div className="relative">
            <Input
              variant="auth"
              id={passwordId}
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Tối thiểu 6 ký tự..."
              aria-invalid={Boolean(errors.newPassword)}
              {...register("newPassword")}
            />
            {toggle}
          </div>
          {errors.newPassword && (
            <span className="text-xs text-destructive">{errors.newPassword.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor={confirmId} className="text-[20px] font-semibold tracking-tight text-white font-heading">
            Nhập lại mật khẩu
          </label>
          <Input
            variant="auth"
            id={confirmId}
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            aria-invalid={Boolean(errors.confirmPassword)}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <span className="text-xs text-destructive">{errors.confirmPassword.message}</span>
          )}
        </div>

        {expired ? (
          <Button type="button" variant="gradient" size="xl" className="mt-1 w-full" onClick={() => navigate("/forgot-password", { replace: true })}>
            Bắt đầu lại
          </Button>
        ) : (
          <Button type="submit" variant="gradient" size="xl" disabled={isSubmitting} className="mt-1 w-full">
            {isSubmitting ? "Đang lưu..." : "Đặt lại mật khẩu"}
          </Button>
        )}
      </form>

      <button
        type="button"
        onClick={() => navigate("/login")}
        className="mx-auto mt-5 flex items-center gap-1.5 text-[14px] font-semibold text-white/90 transition hover:text-white hover:underline"
      >
        <ArrowLeft className="size-4" />
        Quay lại đăng nhập
      </button>
    </div>
  );
}
