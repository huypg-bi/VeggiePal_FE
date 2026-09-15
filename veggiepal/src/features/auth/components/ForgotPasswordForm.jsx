import { useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";

import mailIcon from "@/assets/svg/mail.svg";

const fieldClass =
  "h-12 w-full rounded-xl bg-brand-soft pl-10 pr-4 text-[15px] text-ink placeholder:text-subtle outline-none transition focus-visible:ring-2 focus-visible:ring-brand/40";

export default function ForgotPasswordForm() {
  const navigate = useNavigate();
  const contactId = useId();
  const [contact, setContact] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Chưa gắn backend, chỉ mô phỏng UI.
    navigate("/verify-otp");
    setIsSubmitting(false);
  };

  return (
    <div className="w-full max-w-[420px] rounded-2xl bg-white p-5">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-2">
        <label htmlFor={contactId} className="text-[14px] font-semibold text-ink">
          Email hoặc số điện thoại đăng ký
        </label>
        <div className="relative">
          <img
            src={mailIcon}
            alt=""
            className="pointer-events-none absolute left-3 top-1/2 w-[17px] -translate-y-1/2"
          />
          <input
            id={contactId}
            type="text"
            autoComplete="username"
            placeholder="Nhập email hoặc số điện thoại..."
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className={fieldClass}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-brand text-[15px] font-bold text-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] transition hover:bg-brand/90 disabled:opacity-60"
        >
          {isSubmitting ? "Đang gửi..." : "Gửi mã xác nhận"}
          <ArrowRight className="size-4" />
        </button>
      </form>

      <button
        type="button"
        onClick={() => navigate("/login")}
        className="mx-auto mt-3 flex items-center gap-1.5 text-[14px] font-semibold text-brand hover:underline"
      >
        <ArrowLeft className="size-4" />
        Quay lại đăng nhập
      </button>
    </div>
  );
}
