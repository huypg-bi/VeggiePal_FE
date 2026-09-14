import LoginForm from "@/features/auth/components/LoginForm";
import bgLogin from "@/assets/img/bg_login_1.png";

export default function LoginScreen() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-gradient-to-br from-[#BFFFC7] via-[white] to-[#BFFFC7] px-6 py-10">
      <div className="flex w-full max-w-[1040px] flex-col items-center lg:flex-row lg:items-stretch lg:justify-center lg:gap-10 lg:rounded-[32px] lg:bg-[#EEFDEA] lg:p-10 lg:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.08),0_8px_10px_-6px_rgba(0,0,0,0.05)]">
        <img
          src={bgLogin}
          alt="VeggiePal — Ẩm thực xanh, thấu hiểu bởi AI"
          className="hidden h-full w-auto max-w-[580px] object-contain lg:block"
        />
        <LoginForm />
      </div>
    </div>
  );
}
