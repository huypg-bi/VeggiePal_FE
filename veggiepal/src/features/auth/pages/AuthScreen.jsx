import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import AuthLayout from "@/features/auth/components/AuthLayout";
import LoginForm from "@/features/auth/components/LoginForm";
import RegisterForm from "@/features/auth/components/RegisterForm";
import bgLogin from "@/assets/img/bg_register.png";

// Trang chung cho /login và /register: URL quyết định form nào hiển thị,
// bấm "Đăng ký ngay" / "Đăng nhập ngay" chỉ đổi URL (replace, giữ state.from
// cho redirect sau đăng nhập) — useEffect đồng bộ isRegister theo URL nên
// back/forward của trình duyệt cũng tự đổi đúng form, không cần set state thủ công.
// Chỉ 1 form được render tại 1 thời điểm (key đổi theo mode) để CSS
// auth-form-enter (globals.css) tự phát lại hiệu ứng xuất hiện mỗi lần đổi.
export default function AuthScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(() => location.pathname === "/register");

  useEffect(() => {
    setIsRegister(location.pathname === "/register");
  }, [location.pathname]);

  const toRegister = () => navigate("/register", { replace: true, state: location.state });
  const toLogin = () => navigate("/login", { replace: true, state: location.state });

  return (
    <AuthLayout className="px-6 py-10">
      <div className="flex w-full max-w-[1040px] flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-center lg:gap-12">
        <img
          src={bgLogin}
          alt="VeggiePal — Ẩm thực xanh, thấu hiểu bởi AI"
          className="hidden h-full w-auto max-w-[420px] object-contain lg:block"
        />

        <div className="flex w-full items-center justify-center">
          <div key={isRegister ? "register" : "login"} className="auth-form-enter w-full flex justify-center">
            {isRegister ? (
              <RegisterForm onSwitchMode={toLogin} />
            ) : (
              <LoginForm onSwitchMode={toRegister} />
            )}
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
