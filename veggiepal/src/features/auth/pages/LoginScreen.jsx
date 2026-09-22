import LoginForm from "@/features/auth/components/LoginForm";
import ThemeToggle from "@/shared/components/ThemeToggle";
import bgLogin from "@/assets/img/bg_login.png";

export default function LoginScreen() {
  return (
    <div className="relative flex min-h-dvh items-center justify-center bg-gradient-to-br from-[#18A575] via-[white] to-[#1E5B53] px-6 py-10 dark:from-[#0d2a1c] dark:via-[#0a140f] dark:to-[#0d1f1a]">
      <ThemeToggle className="absolute right-6 top-6 z-10 bg-white/80 hover:bg-white dark:bg-black/30 dark:hover:bg-black/50" />

      <div className="flex w-full max-w-[1040px] flex-col items-center lg:flex-row lg:items-stretch lg:justify-center lg:gap-10 lg:rounded-[32px] lg:bg-[#E8FCE3] lg:p-10 lg:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.08),0_8px_10px_-6px_rgba(0,0,0,0.05)] dark:lg:bg-[#0f1e16]">
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
