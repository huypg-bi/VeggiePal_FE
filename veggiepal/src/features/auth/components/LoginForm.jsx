import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import { loginSchema } from "@/features/auth/schema";
import { login } from "@/features/auth/api/authApi";
import { useAuthStore } from "@/features/auth/store/authStore";

import mailIcon from "@/assets/svg/mail.svg";
import keyIcon from "@/assets/svg/key.svg";
import lockIcon from "@/assets/svg/unlock.svg";
import loginIcon from "@/assets/svg/login.svg";
import googleIcon from "@/assets/svg/gg.svg";

const fieldClass =
  "h-12 w-full rounded-xl bg-brand-soft pl-10 pr-4 text-[15px] text-ink placeholder:text-subtle outline-none transition focus-visible:ring-2 focus-visible:ring-brand/40 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-destructive/40";

export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [showPassword, setShowPassword] = useState(false);

  const emailId = useId();
  const passwordId = useId();

  // trang người dùng muốn vào trước khi bị đá về /login (nếu có)
  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: false },
  });

  const onSubmit = async (values) => {
    try {
      const { token, user } = await login(values);
      setAuth({ token, user });
      navigate(from, { replace: true });
    } catch (err) {
      setError("root", { message: err.message || "Đăng nhập thất bại" });
    }
  };

  // Các nút phụ chưa gắn backend.
  const comingSoon = () =>
    window.alert("Tính năng này sẽ sẵn sàng khi tích hợp backend.");

  return (
    <div className="w-full max-w-[448px] rounded-2xl bg-white p-8 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] lg:max-w-[416px]">
      <div className="flex flex-col items-center gap-1">
        <span className="mb-2 flex size-12 items-center justify-center rounded-full bg-brand/10">
          <img src={lockIcon} alt="" className="h-6 w-auto" />
        </span>
        <h2 className="text-center text-[32px] font-semibold tracking-[-0.015em] text-ink lg:text-[28px]">
          Đăng nhập vào VeggiePal
        </h2>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-6 flex flex-col gap-4"
      >
        {errors.root && (
          <p
            role="alert"
            className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {errors.root.message}
          </p>
        )}

        <div className="flex flex-col gap-1">
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
              type="text"
              autoComplete="email"
              placeholder="Nhập email hoặc số điện thoại..."
              aria-invalid={Boolean(errors.email)}
              className={fieldClass}
              {...register("email")}
            />
          </div>
          {errors.email && (
            <span className="text-xs text-destructive">
              {errors.email.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <label
              htmlFor={passwordId}
              className="text-[14px] font-semibold text-ink"
            >
              Mật khẩu
            </label>
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-[14px] font-semibold text-brand hover:underline"
            >
              Quên mật khẩu?
            </button>
          </div>
          <div className="relative">
            <img
              src={keyIcon}
              alt=""
              className="pointer-events-none absolute left-3 top-1/2 w-[19px] -translate-y-1/2"
            />
            <input
              id={passwordId}
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Nhập mật khẩu của bạn..."
              aria-invalid={Boolean(errors.password)}
              className={`${fieldClass} pr-11`}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-subtle transition hover:text-ink"
            >
              {showPassword ? (
                <EyeOff className="size-[18px]" />
              ) : (
                <Eye className="size-[18px]" />
              )}
            </button>
          </div>
          {errors.password && (
            <span className="text-xs text-destructive">
              {errors.password.message}
            </span>
          )}
        </div>

        <label className="flex items-center gap-2 text-[14px] font-semibold text-body">
          <input
            type="checkbox"
            className="size-4 rounded border-subtle/60 accent-brand"
            {...register("remember")}
          />
          Ghi nhớ đăng nhập
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-1 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-brand text-[14px] font-bold text-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] transition hover:bg-brand/90 disabled:opacity-60"
        >
          <img src={loginIcon} alt="" className="size-[15px]" />
          {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>

      <div className="my-4 flex items-center gap-3">
        <span className="h-px flex-1 bg-[rgb(191_201_190_/_0.4)]" />
        <span className="text-[13px] font-medium text-subtle">
          Hoặc tiếp tục với
        </span>
        <span className="h-px flex-1 bg-[rgb(191_201_190_/_0.4)]" />
      </div>

      <button
        type="button"
        onClick={comingSoon}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-soft text-[14px] font-semibold text-ink shadow-[0_1px_1px_rgba(0,0,0,0.05)] transition hover:brightness-[0.98]"
      >
        <img src={googleIcon} alt="" className="size-5" />
        Tiếp tục với Google
      </button>

      <p className="mt-4 text-center text-[14px] text-body">
        Chưa có tài khoản?{" "}
        <button
          type="button"
          onClick={() => navigate("/register")}
          className="font-bold text-brand hover:underline"
        >
          Đăng ký ngay
        </button>
      </p>
    </div>
  );
}
