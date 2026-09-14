import RegisterForm from "@/features/auth/components/RegisterForm";
import bgRegister from "@/assets/img/bg_register.png";

export default function RegisterScreen() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-gradient-to-br from-[#BFFFC7] via-[white] to-[#BFFFC7] px-6 py-4">
      <div className="flex w-full max-w-[1040px] flex-col items-center lg:flex-row lg:items-stretch lg:justify-center lg:gap-8 lg:rounded-[32px] lg:bg-[#E4FCE4] lg:p-6 lg:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.08),0_8px_10px_-6px_rgba(0,0,0,0.05)]">
        <img
          src={bgRegister}
          alt="VeggiePal — Gia nhập VeggiePal"
          className="hidden h-full w-auto max-w-[420px] object-contain lg:block"
        />
        <RegisterForm />
      </div>
    </div>
  );
}
