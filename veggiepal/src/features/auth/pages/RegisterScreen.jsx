import RegisterForm from "@/features/auth/components/RegisterForm";
import bgRegister from "@/assets/img/bg_register.jpg";

export default function RegisterScreen() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-canvas">
      <style>{`
        @media (min-width: 1024px) {
          .register-card-slot { padding-right: 6%; }
        }
        @media (min-width: 1024px) and (min-aspect-ratio: 7/4) {
          .register-card-slot { padding-right: 8%; }
        }
      `}</style>
      <div
        aria-hidden
        className="fixed inset-0 hidden bg-cover bg-no-repeat lg:block"
        style={{ backgroundImage: `url(${bgRegister})`, backgroundPosition: "left top" }}
      />

      <div className="register-card-slot relative flex min-h-dvh items-center justify-center overflow-y-auto px-6 py-6 lg:justify-end lg:py-2 lg:pl-10">
        <RegisterForm />
      </div>
    </div>
  );
}
