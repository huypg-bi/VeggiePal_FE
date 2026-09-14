import { Link } from "react-router-dom";

import logo from "@/assets/img/logo.png";
import iconFgp from "@/assets/img/icon_fgp.png";
import imgFpg from "@/assets/img/img_fpg.png";
import ForgotPasswordForm from "@/features/auth/components/ForgotPasswordForm";

export default function ForgotPasswordScreen() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-gradient-to-br from-[#18A575] via-[white] to-[#1E5B53] px-4 py-6">
      <div className="flex w-full max-w-[420px] flex-col items-center rounded-[32px] bg-[#EEFDEA] px-6 py-6 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.06),0_8px_10px_-6px_rgba(0,0,0,0.04)] sm:px-8">
        <Link to="/" className="self-start">
          <img src={logo} alt="VeggiePal" className="h-25 w-auto" />
        </Link>

        <img
          src={iconFgp}
          alt=""
          className="mt-1 h-35 w-auto object-contain sm:h-35"
        />

        <h1 className="mt-2 text-center text-[22px] font-bold tracking-[-0.01em] text-ink sm:text-[24px]">
          Bạn quên mật khẩu rồi à?
        </h1>
        <p className="mt-1.5 max-w-[340px] text-center text-[14px] leading-relaxed text-subtle">
          Đừng lo lắng! Vui lòng nhập địa chỉ email hoặc số điện thoại đăng ký
          để chúng mình gửi mã xác nhận cho bạn.
        </p>

        <div className="mt-5 w-full">
          <ForgotPasswordForm />
        </div>

        <img src={imgFpg} alt="" className="mt-3 h-20 w-auto object-contain" />
      </div>
    </div>
  );
}
