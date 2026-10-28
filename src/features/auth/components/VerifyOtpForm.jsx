import { useEffect, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  forgotPassword,
  resendVerification,
  verifyEmail,
  verifyResetOtp,
} from "@/features/auth/api/authApi";
import { useAuthStore } from "@/features/auth/store/authStore";
import { resolvePostLoginPath } from "@/features/auth/utils/roleRedirect";
import iconOtp from "@/assets/img/icon_otp.png";
import mailIcon from "@/assets/svg/mail.svg";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60; // BE chỉ gửi lại mã sau tối thiểu 60 giây
const OTP_CODE_EXPIRED = 1029; // hết hạn hoặc sai quá 5 lần

// mode "verify-email": xác minh email sau đăng ký (/verify-email), mode "reset": quên mật khẩu (/verify-otp).
// Email nằm trong location.state nên mở thẳng URL thì quay về bước đầu.
export default function VerifyOtpForm({ mode }) {
  const isReset = mode === "reset";
  const email = useLocation().state?.email;
  if (!email) return <Navigate to={isReset ? "/forgot-password" : "/login"} replace />;
  return <OtpEntry email={email} isReset={isReset} />;
}

function OtpEntry({ email, isReset }) {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const inputRefs = useRef([]);
  const sentOnMount = useRef(false);

  // Từ màn đăng nhập (1023) sang đây thì người dùng chưa có mã còn hạn: xin mã mới một lần.
  useEffect(() => {
    if (!location.state?.sendCode || sentOnMount.current) return;
    sentOnMount.current = true;
    resendVerification(email).catch((err) => setErrorMessage(err.message));
  }, [email, location.state?.sendCode]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");
  const code = digits.join("");
  const isComplete = code.length === OTP_LENGTH;

  const handleChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) return;
    e.preventDefault();
    setDigits((prev) => {
      const next = [...prev];
      for (let i = 0; i < OTP_LENGTH; i++) {
        next[i] = pasted[i] || next[i];
      }
      return next;
    });
    const focusIndex = Math.min(pasted.length, OTP_LENGTH) - 1;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isComplete) return;
    setIsSubmitting(true);
    setErrorMessage("");
    try {
      if (isReset) {
        const { resetToken } = await verifyResetOtp({ email, otp: code });
        navigate("/reset-password", { replace: true, state: { resetToken } });
      } else {
        const { token, refreshToken, user } = await verifyEmail({ email, otp: code });
        // Không có ô "Ghi nhớ đăng nhập" ở bước này nên giữ phiên lâu dài (localStorage), giống đăng nhập Google.
        setAuth({ token, refreshToken, user, remember: true });
        toast.success("Xác minh email thành công, chào mừng bạn đến với VeggiePal!");
        navigate(resolvePostLoginPath(user, location.state?.from?.pathname), { replace: true });
      }
    } catch (err) {
      setErrorMessage(err.message);
      if (err.code === OTP_CODE_EXPIRED) {
        // Mã hỏng hẳn: xóa các ô và cho gửi lại ngay, không bắt chờ hết đếm ngược.
        setDigits(Array(OTP_LENGTH).fill(""));
        setSecondsLeft(0);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (secondsLeft > 0) return;
    setErrorMessage("");
    try {
      await (isReset ? forgotPassword(email) : resendVerification(email));
      setSecondsLeft(RESEND_SECONDS);
      setDigits(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
      toast.info("Nếu email hợp lệ, mã mới đã được gửi tới hộp thư của bạn.");
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="w-full max-w-[380px] px-2 py-4">
      <div className="flex flex-col items-center gap-2">
        <img src={iconOtp} alt="" className="h-50 w-auto object-contain" />
        <h2 className="text-center text-[26px] font-extrabold tracking-tight text-white font-heading">
          {isReset ? "Nhập mã đặt lại mật khẩu" : "Xác minh email"}
        </h2>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <img src={mailIcon} alt="" className="w-[15px] shrink-0 brightness-0 invert opacity-80" />
          <div className="flex min-w-0 flex-col">
            <span className="text-[12px] text-white/70">Mã 6 số đã gửi tới email</span>
            <span className="truncate text-[14px] font-semibold text-white">{email}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="shrink-0 text-[14px] font-semibold text-white/90 transition hover:text-white hover:underline"
        >
          Thay đổi
        </button>
      </div>

      <form onSubmit={handleSubmit} noValidate className="mt-4 flex flex-col gap-3">
        {errorMessage && (
          <p role="alert" className="rounded-lg bg-destructive/15 px-3 py-2 text-sm text-destructive">
            {errorMessage}
          </p>
        )}

        <div className="flex justify-between gap-2" onPaste={handlePaste}>
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="h-12 w-full max-w-12 rounded-xl border border-white/30 bg-white/10 text-center text-[20px] font-bold text-white outline-none transition focus-visible:border-white focus-visible:bg-white/20"
            />
          ))}
        </div>

        <div className="flex items-center gap-1.5 text-[13px] text-white/70">
          <Clock className="size-3.5" />
          {secondsLeft > 0 ? (
            <span>
              Gửi lại mã sau{" "}
              <span className="font-semibold text-white">
                {minutes}:{seconds}
              </span>{" "}
              · mã có hiệu lực 10 phút
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="font-semibold text-white transition hover:underline"
            >
              Gửi lại mã xác thực
            </button>
          )}
        </div>

        <Button
          type="submit"
          variant="gradient"
          size="xl"
          disabled={!isComplete || isSubmitting}
          className="mt-1 w-full"
        >
          {isSubmitting ? "Đang xác nhận..." : "Xác nhận & Tiếp tục"}
          <ArrowRight className="size-4" />
        </Button>
      </form>

      <button
        type="button"
        onClick={() => navigate("/login", { replace: true })}
        className="mx-auto mt-5 flex items-center gap-1.5 text-[14px] font-semibold text-white/90 transition hover:text-white hover:underline"
      >
        <ArrowLeft className="size-4" />
        Quay lại đăng nhập
      </button>
    </div>
  );
}
