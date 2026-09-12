import { useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  Leaf,
  TrendingDown,
  Dumbbell,
  Droplet,
  Salad,
  Compass,
  UserPlus,
} from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/features/auth/schema";
import { register as registerUser } from "@/features/auth/api/authApi";

import mascot from "@/assets/img/veggiepal-mascot.png";
import peopleIcon from "@/assets/svg/people.svg";
import phoneIcon from "@/assets/svg/phone.svg";
import mailIcon from "@/assets/svg/mail.svg";
import keyIcon from "@/assets/svg/key.svg";
import lockIcon from "@/assets/svg/lock.svg";
import googleIcon from "@/assets/svg/gg.svg";

export default function RegisterForm() {
  const navigate = useNavigate();

  const fullNameId = useId();
  const phoneId = useId();
  const emailId = useId();
  const passwordId = useId();
  const confirmPasswordId = useId();

  const fieldClass =
    "h-12 w-full rounded-xl bg-brand-soft pl-10 pr-4 text-[15px] text-ink placeholder:text-subtle outline-none transition focus-visible:ring-2 focus-visible:ring-brand/40 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-destructive/40";

  const GOALS = [
    { id: "weight-loss", label: "Giảm cân lành mạnh", icon: TrendingDown },
    { id: "muscle-gain", label: "Tăng cơ thuần chay", icon: Dumbbell },
    { id: "detox", label: "Thanh lọc cơ thể", icon: Droplet },
    { id: "long-term-vegan", label: "Ăn chay trường", icon: Salad },
    { id: "explore", label: "Khám phá món mới", icon: Compass },
  ];

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState("weight-loss");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    }
  })

  const onSubmit = async ({ fullName, email, phone, password }) => {
    try {
      await registerUser({ fullName, email, phone, password });
      navigate("/login", { state: { justRegistered: true } });
    } catch (err) {
      setError("root", { message: err.message || "Đăng ký thất bại" });
    }
  };

  return (
    <div className="w-full max-w-[672px] rounded-xl bg-white p-12 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)]">
      {/* ---------- Header: badge + mascot + tiêu đề ---------- */}
      <div className="flex flex-col items-center gap-1 text-center">
        <img src={mascot} alt="VeggiePal" className="h-24 w-auto object-contain" />

        <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-[12px] font-semibold text-brand">
          <Leaf className="size-3.5" />
          Khởi đầu sống xanh
        </span>

        <h2 className="mt-2 text-[32px] font-semibold tracking-[-0.02em] text-ink">
          Tạo tài khoản VeggiePal
        </h2>
        <p className="max-w-[448px] text-[16px] leading-6 text-body">
          Bắt đầu hành trình dinh dưỡng thuần chay cá nhân hoá cùng trợ lý AI
          thông minh
        </p>
      </div>

      {/* ---------- Đăng ký với Google (chưa có OAuth ở BE) ---------- */}
      <button
        type="button"
        // TODO: BE chưa hỗ trợ OAuth Google — tạm alert/disable như comingSoon() của LoginForm.
        className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-brand-soft text-[14px] font-semibold text-ink shadow-[0_1px_1px_rgba(0,0,0,0.05)] transition hover:brightness-[0.98]"
      >
        <img src={googleIcon} alt="" className="size-5" />
        Đăng ký với Google
      </button>

      <div className="my-4 flex items-center gap-3">
        <span className="h-px flex-1 bg-[#dee8ff]" />
        <span className="text-[11px] font-medium uppercase tracking-[0.05em] text-subtle">
          Hoặc nhập thông tin
        </span>
        <span className="h-px flex-1 bg-[#dee8ff]" />
      </div>

      {/* ---------- Form ---------- */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-6"
      >
        {errors.root && (
          <p
            role="alert"
            className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {errors.root.message}
          </p>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
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
                placeholder="Nguyễn Văn A"
                className={fieldClass}
                {...register("fullName")}
              />
            </div>
            {errors.fullName && (
              <span className="text-xs text-destructive">
                {errors.fullName.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor={phoneId} className="text-[14px] font-semibold text-ink">
              Số điện thoại
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
                placeholder="0912 345 678"
                className={fieldClass}
                {...register("phone")}
              />
            </div>
            {errors.phone && (
              <span className="text-xs text-destructive">
                {errors.phone.message}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor={emailId} className="text-[14px] font-semibold text-ink">
            Địa chỉ Email
          </label>
          <div className="relative">
            <img
              src={mailIcon}
              alt=""
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2"
            />
            <input
              id={emailId}
              type="email"
              autoComplete="email"
              placeholder="ban@veggiepal.vn"
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

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor={passwordId} className="text-[14px] font-semibold text-ink">
              Mật khẩu
            </label>
            <div className="relative">
              <img
                src={keyIcon}
                alt=""
                className="pointer-events-none absolute left-3 top-1/2 w-[19px] -translate-y-1/2"
              />
              <input
                id={passwordId}
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Tối thiểu 6 ký tự"
                className={`${fieldClass} pr-11`}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label="Hiện mật khẩu"
                className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-subtle transition hover:text-ink"
              >
                <Eye className="size-[18px]" />
              </button>
            </div>
            {errors.password && (
              <span className="text-xs text-destructive">
                {errors.password.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor={confirmPasswordId} className="text-[14px] font-semibold text-ink">
              Xác nhận mật khẩu
            </label>
            <div className="relative">
              <img
                src={lockIcon}
                alt=""
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2"
              />
              <input
                id={confirmPasswordId}
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Nhập lại mật khẩu"
                className={`${fieldClass} pr-11`}
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                aria-label="Hiện mật khẩu"
                className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-subtle transition hover:text-ink"
              >
                <Eye className="size-[18px]" />
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="text-xs text-destructive">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>
        </div>

        {/* ---------- Mục tiêu (UI-only, BE chưa có field lưu) ---------- */}
        <div className="flex flex-col gap-2 rounded-xl bg-brand-soft p-4">
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-semibold text-ink">
              Mục tiêu của bạn là gì?
            </span>
            <span className="rounded-full bg-[rgb(160_213_253_/_0.4)] px-2 py-0.5 text-[11px] font-medium text-brand-blue">
              AI cá nhân hoá
            </span>
          </div>
          <p className="text-[14px] text-body">
            Chọn nhanh để VeggiePal gợi ý thực đơn phù hợp nhất ngay khi bắt đầu:
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {GOALS.map(({ id, label, icon: Icon }) => {
              const isSelected = id === selectedGoal;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSelectedGoal(id)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold transition ${isSelected
                    ? "bg-brand text-white shadow-[0_1px_1px_rgba(0,0,0,0.05)]"
                    : "bg-white text-ink shadow-[0_1px_1px_rgba(0,0,0,0.05)] hover:brightness-[0.98]"
                    }`}
                >
                  <Icon className="size-3.5" />
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ---------- Điều khoản ---------- */}
        <label className="flex items-start gap-2 text-[14px] text-body">
          <input
            type="checkbox"
            className="mt-0.5 size-4 shrink-0 rounded border-subtle/60 accent-brand"
            {...register("acceptTerms")} //nếu muốn required qua schema, hoặc kiểm tra riêng trước khi submit
          />
          <span>
            Tôi đồng ý với{" "}
            <span className="font-semibold text-brand">Điều khoản dịch vụ</span> và{" "}
            <span className="font-semibold text-brand">Chính sách quyền riêng tư</span>{" "}
            của VeggiePal.
          </span>
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-brand text-[14px] font-bold text-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] transition hover:bg-brand/90 disabled:opacity-60"
        >
          <UserPlus className="size-[17px]" />
          {isSubmitting ? "Đang đăng ký..." : "Đăng ký tài khoản"}
        </button>
      </form>

      {/* ---------- Footer ---------- */}
      <div className="mt-4 rounded-lg bg-[rgb(240_243_255_/_0.4)] px-3 pb-3 pt-4 text-center text-[14px] text-body">
        Đã có tài khoản?{" "}
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="font-semibold text-brand-blue hover:underline"
        >
          Đăng nhập ngay
        </button>
      </div>
    </div>
  );
}
