import RegisterForm from "@/features/auth/components/RegisterForm";

// Bố cục màn đăng ký theo Figma: 1 card trắng căn giữa trên nền canvas
// (khác /login — không có BrandPanel 2 cột, vì thiết kế Figma của màn này chỉ có 1 card).
export default function RegisterScreen() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-canvas px-6 py-10 lg:py-16">
      <RegisterForm />
    </div>
  );
}
