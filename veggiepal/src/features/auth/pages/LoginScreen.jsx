import BrandPanel from "@/features/auth/components/BrandPanel";
import LoginForm from "@/features/auth/components/LoginForm";

// Bố cục 2 cột theo file Figma: giới thiệu thương hiệu (trái) + form đăng nhập (phải).
// Dưới màn hình lớn thì ẩn cột trái, chỉ hiển thị form.
export default function LoginScreen() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-canvas">
      {/* Vệt sáng xanh mờ ở góc dưới phải (theo Figma) */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-10 right-8 size-80 rounded-full bg-[rgb(160_213_253_/_0.3)] blur-3xl"
      />

      <div className="relative mx-auto flex min-h-dvh max-w-[1280px] items-center px-6 py-10 lg:px-10 lg:py-16">
        <div className="grid w-full items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="hidden lg:block">
            <BrandPanel />
          </div>
          <div className="flex justify-center">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
