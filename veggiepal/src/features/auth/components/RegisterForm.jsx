import { useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Leaf, UserPlus } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/features/auth/schema";
import { register as registerUser } from "@/features/auth/api/authApi";

import peopleIcon from "@/assets/svg/people.svg";
import phoneIcon from "@/assets/svg/phone.svg";
import mailIcon from "@/assets/svg/mail.svg";
import keyIcon from "@/assets/svg/key.svg";
import lockIcon from "@/assets/svg/unlock.svg";
import googleIcon from "@/assets/svg/gg.svg";

const fieldClass =
  "h-11 w-full rounded-xl bg-brand-soft pl-10 pr-4 text-[15px] text-ink placeholder:text-subtle outline-none transition focus-visible:ring-2 focus-visible:ring-brand/40 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-destructive/40";

export default function RegisterForm() {
  const navigate = useNavigate();

  const fullNameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const passwordId = useId();
  const confirmPasswordId = useId();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const acceptTerms = watch("acceptTerms");

  const onSubmit = async ({ fullName, email, phone, password }) => {
    try {
      await registerUser({ fullName, email, phone, password });
      navigate("/login", { state: { justRegistered: true } });
    } catch (err) {
      setError("root", { message: err.message || "Đăng ký thất bại" });
    }
  };

  return (
    <div className="w-full max-w-[480px] rounded-2xl bg-card p-5 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)]">
      <div className="flex flex-col items-center gap-1">
        <span className="mb-1 flex size-10 items-center justify-center rounded-full bg-brand/10">
          <img src={lockIcon} alt="" className="h-5 w-auto" />
        </span>
        <h2 className="flex items-center justify-center gap-1.5 text-center text-[24px] font-semibold tracking-[-0.015em] text-ink">
          Tạo tài khoản VeggiePal
        </h2>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-4 flex flex-col gap-4"
      >
        {errors.root && (
          <p
            role="alert"
            className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {errors.root.message}
          </p>
        )}

        <div className="relative flex flex-col gap-1">
          <label htmlFor={fullNameId} className="text-[14px] font-semibold text-ink">
            Họ và tên
          </label>
          <div className="relative">
            <img
              src={peopleIcon}
              alt=""
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2"
            />
            <input
              id={fullNameId}
              type="text"
              autoComplete="name"
              placeholder="Nhập họ và tên của bạn"
              aria-invalid={Boolean(errors.fullName)}
              className={fieldClass}
              {...register("fullName")}
            />
          </div>
          {errors.fullName && (
            <span className="absolute left-0 top-full mt-1 text-xs leading-tight text-destructive">
              {errors.fullName.message}
            </span>
          )}
        </div>

        <div className="relative flex flex-col gap-1">
          <label htmlFor={emailId} className="text-[14px] font-semibold text-ink">
            Email
          </label>
          <div className="relative">
            <img
              src={mailIcon}
              alt=""
              className="pointer-events-none absolute left-3 top-1/2 w-[17px] -translate-y-1/2"
            />
            <input
              id={emailId}
              type="email"
              autoComplete="email"
              placeholder="Nhập email của bạn"
              aria-invalid={Boolean(errors.email)}
              className={fieldClass}
              {...register("email")}
            />
          </div>
          {errors.email && (
            <span className="absolute left-0 top-full mt-1 text-xs leading-tight text-destructive">
              {errors.email.message}
            </span>
          )}
        </div>

        <div className="relative flex flex-col gap-1">
          <label htmlFor={phoneId} className="text-[14px] font-semibold text-ink">
            Số điện thoại (không bắt buộc)
          </label>
          <div className="relative">
            <img
              src={phoneIcon}
              alt=""
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2"
            />
            <input
              id={phoneId}
              type="tel"
              autoComplete="tel"
              placeholder="Nhập số điện thoại của bạn"
              aria-invalid={Boolean(errors.phone)}
              className={fieldClass}
              {...register("phone")}
            />
          </div>
          {errors.phone && (
            <span className="absolute left-0 top-full mt-1 text-xs leading-tight text-destructive">
              {errors.phone.message}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="relative flex flex-col gap-1">
            <label htmlFor={passwordId} className="text-[14px] font-semibold text-ink">
              Mật khẩu
            </label>
            <div className="relative">
              <img
                src={keyIcon}
                alt=""
                className="pointer-events-none absolute left-3 top-1/2 w-[17px] -translate-y-1/2"
              />
              <input
                id={passwordId}
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Tối thiểu 6 ký tự"
                aria-invalid={Boolean(errors.password)}
                className={`${fieldClass} pr-9`}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                className="absolute right-1.5 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-subtle transition hover:text-ink"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.password && (
              <span className="absolute left-0 top-full mt-1 text-xs leading-tight text-destructive">
                {errors.password.message}
              </span>
            )}
          </div>

          <div className="relative flex flex-col gap-1">
            <label htmlFor={confirmPasswordId} className="text-[14px] font-semibold text-ink">
              Xác nhận mật khẩu
            </label>
            <div className="relative">
              <img
                src={keyIcon}
                alt=""
                className="pointer-events-none absolute left-3 top-1/2 w-[17px] -translate-y-1/2"
              />
              <input
                id={confirmPasswordId}
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Nhập lại mật khẩu"
                aria-invalid={Boolean(errors.confirmPassword)}
                className={`${fieldClass} pr-9`}
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                className="absolute right-1.5 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-subtle transition hover:text-ink"
              >
                {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="absolute left-0 top-full mt-1 text-xs leading-tight text-destructive">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>
        </div>

        <label className="flex items-start gap-2 text-[13px] leading-5 text-body">
          <input
            type="checkbox"
            className="mt-0.5 size-4 shrink-0 rounded border-subtle/60 accent-brand"
            {...register("acceptTerms")}
          />
          <span>
            Tôi đồng ý với{" "}
            <span className="font-semibold text-brand">Điều khoản sử dụng</span> và{" "}
            <span className="font-semibold text-brand">Chính sách bảo mật</span>
          </span>
        </label>

        <button
          type="submit"
          disabled={isSubmitting || !acceptTerms}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-brand text-[14px] font-bold text-brand-foreground shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] transition hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:hover:bg-brand"
        >
          <UserPlus className="size-[17px]" />
          {isSubmitting ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
        </button>
      </form>

      <div className="my-3 flex items-center gap-3">
        <span className="h-px flex-1 bg-[rgb(191_201_190_/_0.4)] dark:bg-white/10" />
        <span className="text-[11px] font-medium uppercase tracking-[0.05em] text-subtle">
          Hoặc đăng ký với
        </span>
        <span className="h-px flex-1 bg-[rgb(191_201_190_/_0.4)] dark:bg-white/10" />
      </div>

      <button
        type="button"
        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-soft text-[14px] font-semibold text-ink shadow-[0_1px_1px_rgba(0,0,0,0.05)] transition hover:brightness-[0.98]"
      >
        <img src={googleIcon} alt="" className="size-5" />
        Tiếp tục với Google
      </button>

      <p className="mt-3 text-center text-[14px] text-body">
        Đã có tài khoản?{" "}
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="font-bold text-brand hover:underline"
        >
          Đăng nhập ngay
        </button>
      </p>
    </div>
  );
}
