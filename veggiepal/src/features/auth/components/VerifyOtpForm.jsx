import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";

import phoneIcon from "@/assets/svg/phone.svg";
import lockIcon from "@/assets/svg/lock.svg";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 105; // 01:45

export default function VerifyOtpForm({ phone = "0912 *** 678" }) {
  const navigate = useNavigate();
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef([]);

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
    // Chưa gắn backend, chỉ mô phỏng UI.
    window.alert("Tính năng này sẽ sẵn sàng khi tích hợp backend.");
    setIsSubmitting(false);
  };

  const handleResend = () => {
    if (secondsLeft > 0) return;
    setSecondsLeft(RESEND_SECONDS);
    setDigits(Array(OTP_LENGTH).fill(""));
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="w-full max-w-[420px] rounded-2xl bg-white p-4">
      <div className="flex items-center justify-between gap-3 rounded-xl bg-brand-soft px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <img src={phoneIcon} alt="" className="w-[15px]" />
          <div className="flex flex-col">
            <span className="text-[12px] text-subtle">Số điện thoại</span>
            <span className="text-[14px] font-semibold text-ink">{phone}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-[14px] font-semibold text-brand hover:underline"
        >
          Thay đổi
        </button>
      </div>

      <form onSubmit={handleSubmit} noValidate className="mt-3 flex flex-col gap-2">
        <div className="flex justify-between gap-2" onPaste={handlePaste}>
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="h-12 w-full max-w-12 rounded-xl bg-brand-soft text-center text-[20px] font-bold text-ink outline-none transition focus-visible:ring-2 focus-visible:ring-brand/40"
            />
          ))}
        </div>

        <div className="flex items-center gap-1.5 text-[13px] text-subtle">
          <Clock className="size-3.5" />
          {secondsLeft > 0 ? (
            <span>
              Mã sẽ hết hiệu lực sau:{" "}
              <span className="font-semibold text-ink">
                {minutes}:{seconds}
              </span>
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="font-semibold text-brand hover:underline"
            >
              Gửi lại mã xác thực
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={!isComplete || isSubmitting}
          className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-brand text-[15px] font-bold text-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] transition hover:bg-brand/90 disabled:opacity-60"
        >
          {isSubmitting ? "Đang xác nhận..." : "Xác nhận & Tiếp tục"}
          <ArrowRight className="size-4" />
        </button>
      </form>

      <div className="mt-2 flex items-start gap-2.5 rounded-xl bg-brand-soft px-4 py-2.5">
        <img src={lockIcon} alt="" className="mt-0.5 w-3.5" />
        <p className="text-[13px] leading-relaxed text-subtle">
          Không chia sẻ mã xác thực này cho bất kỳ ai, kể cả nhân viên hỗ trợ
          VeggiePal để bảo vệ tài khoản và chế độ ăn của bạn.
        </p>
      </div>

      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mx-auto mt-2 flex items-center gap-1.5 text-[14px] font-semibold text-brand hover:underline"
      >
        <ArrowLeft className="size-4" />
        Quay lại trang trước
      </button>
    </div>
  );
}
