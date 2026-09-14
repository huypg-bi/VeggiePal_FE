import LoginForm from "@/features/auth/components/LoginForm";
import bgLogin from "@/assets/img/bg_login.png";

export default function LoginScreen() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-canvas">
      <style>{`
        @media (min-width: 1024px) {
          .login-card-slot { padding-right: 6%; }
        }
        @media (min-width: 1024px) and (min-aspect-ratio: 7/4) {
          .login-card-slot { padding-right: 13%; }
        }
      `}</style>
      <div
        aria-hidden
        className="fixed inset-0 hidden bg-cover bg-no-repeat lg:block"
        style={{ backgroundImage: `url(${bgLogin})`, backgroundPosition: "left top" }}
      />

      <div className="login-card-slot relative flex min-h-dvh items-center justify-center overflow-y-auto px-6 py-10 lg:justify-end lg:py-10 lg:pl-10">
        <LoginForm />
      </div>
    </div>
  );
}
