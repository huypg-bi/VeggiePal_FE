import { useId } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { forgotPassword } from "@/features/auth/api/authApi";
import { forgotPasswordSchema } from "@/features/auth/schema";
import mailIcon from "@/assets/svg/mail.svg";
import iconFgp from "@/assets/img/icon_fgp.png";

export default function ForgotPasswordForm() {
  const navigate = useNavigate();
  const emailId = useId();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async ({ email }) => {
    const normalized = email.trim().toLowerCase();
    try {
      await forgotPassword(normalized);
      // BE luôn báo thành công dù email có đăng ký hay không, nên câu thông báo cũng phải trung tính.
      toast.info("Nếu email đã đăng ký, mã xác nhận đã được gửi tới hộp thư của bạn.");
      navigate("/verify-otp", { state: { email: normalized } });
    } catch (err) {
      setError("root", { message: err.message || "Không gửi được mã xác nhận" });
    }
  };

  return (
    <div className="w-full max-w-[380px] px-2 py-4">
      <div className="flex flex-col items-center gap-2">
        <img src={iconFgp} alt="" className="h-50 w-auto object-contain" />
        <h2 className="text-center text-[26px] font-extrabold tracking-tight text-white font-heading">
          Bạn quên mật khẩu rồi à?
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 flex flex-col gap-4">
        {errors.root && (
          <p role="alert" className="rounded-lg bg-destructive/15 px-3 py-2 text-sm text-destructive">
            {errors.root.message}
          </p>
        )}

        <div className="flex flex-col gap-1">
          <label htmlFor={emailId} className="text-[20px] font-semibold tracking-tight text-white font-heading">
            Nhập email đã đăng ký
          </label>
          <div className="relative">
            <Input
              variant="auth"
              id={emailId}
              type="text"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              {...register("email")}
            />
            <img
              src={mailIcon}
              alt=""
              className="pointer-events-none absolute right-0 top-1/2 w-[17px] -translate-y-1/2 brightness-0 invert opacity-80"
            />
          </div>
          {errors.email && <span className="text-xs text-destructive">{errors.email.message}</span>}
        </div>

        <Button
          type="submit"
          variant="gradient"
          size="xl"
          disabled={isSubmitting}
          className="mt-1 w-full"
        >
          {isSubmitting ? "Đang gửi..." : "Gửi mã xác nhận"}
          <ArrowRight className="size-4" />
        </Button>
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
