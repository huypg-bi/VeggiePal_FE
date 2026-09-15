import { Link } from "react-router-dom";

import logo from "@/assets/img/logo.png";
import iconOtp from "@/assets/img/icon_otp.png";
import VerifyOtpForm from "@/features/auth/components/VerifyOtpForm";

export default function VerifyOtpScreen() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-gradient-to-br from-[#18A575] via-[white] to-[#1E5B53] px-4 py-3">
      <div className="flex w-full max-w-[420px] flex-col items-center rounded-[32px] bg-[#EEFDEA] px-6 py-4 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.06),0_8px_10px_-6px_rgba(0,0,0,0.04)] sm:px-8">
        <Link to="/" className="self-start">
          <img src={logo} alt="VeggiePal" className="h-25 w-auto" />
        </Link>

        <img
          src={iconOtp}
          alt=""
          className="h-35 w-auto object-contain sm:h-35"
        />

        <h1 className="text-center text-[22px] font-bold tracking-[-0.01em] text-ink sm:text-[24px]">
          Xác thực mã OTP
        </h1>
        <p className="mt-1 max-w-[340px] text-center text-[14px] leading-relaxed text-subtle">
          Một mã xác thực gồm 6 chữ số đã được gửi đến số điện thoại của bạn.
        </p>

        <div className="mt-3 w-full">
          <VerifyOtpForm />
        </div>
      </div>
    </div>
  );
}
