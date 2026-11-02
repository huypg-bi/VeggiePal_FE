import { useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider, useGoogleOAuth } from "@react-oauth/google";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { loginWithGoogle } from "@/features/auth/api/authApi";
import { useAuthStore } from "@/features/auth/store/authStore";
import { resolvePostLoginPath } from "@/features/auth/utils/roleRedirect";

import googleIcon from "@/assets/svg/gg.svg";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Google chỉ cho nút rộng 200-400px.
const MIN_WIDTH = 200;
const MAX_WIDTH = 400;

export default function GoogleSignInButton({ onError }) {
  if (!GOOGLE_CLIENT_ID) {
    return <GoogleButtonBody status="missing" />;
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID} locale="vi">
      <GoogleButton onError={onError} />
    </GoogleOAuthProvider>
  );
}

function GoogleButton({ onError }) {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((s) => s.setAuth);
  const { scriptLoadedSuccessfully } = useGoogleOAuth();

  const wrapperRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [busy, setBusy] = useState(false);

  // trang người dùng muốn vào trước khi bị đá về /login (nếu có)
  const from = location.state?.from?.pathname;

  // Đo bề rộng khung và đo lại (chờ 150ms) mỗi khi khung đổi cỡ để nút co giãn theo.
  useLayoutEffect(() => {
    const el = wrapperRef.current;
    if (!el) return undefined;
    const measure = () => setWidth(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, Math.round(el.offsetWidth))));
    measure();
    let timer;
    const observer = new ResizeObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(measure, 150);
    });
    observer.observe(el);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  const handleSuccess = async ({ credential }) => {
    if (!credential) {
      onError("Không nhận được thông tin từ Google. Vui lòng thử lại.");
      return;
    }
    setBusy(true);
    try {
      const { token, refreshToken, user } = await loginWithGoogle(credential);
      // Không có ô "Ghi nhớ đăng nhập" ở luồng Google nên giữ phiên lâu dài (localStorage).
      setAuth({ token, refreshToken, user, remember: true });
      navigate(resolvePostLoginPath(user, from), { replace: true });
    } catch (err) {
      onError(err.message || "Đăng nhập bằng Google thất bại");
      setBusy(false);
    }
  };

  const showGoogleButton = !busy && scriptLoadedSuccessfully && width > 0;

  return (
    <div ref={wrapperRef} className="mt-3 w-full">
      {showGoogleButton ? (
        // Nút Google phải hiện rõ (opacity 1) vì iframe của Google bỏ qua cú bấm khi bị làm mờ.
        <div className="flex h-10 items-center justify-center">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => onError("Đăng nhập bằng Google thất bại. Vui lòng thử lại.")}
            width={width}
            size="large"
            text="continue_with"
            shape="pill"
            locale="vi"
          />
        </div>
      ) : (
        <GoogleButtonBody status={busy ? "busy" : "loading"} />
      )}
    </div>
  );
}

function GoogleButtonBody({ status }) {
  const onClick = () => {
    if (status === "missing") {
      toast.error("Đăng nhập Google chưa được cấu hình (thiếu VITE_GOOGLE_CLIENT_ID).");
    } else if (status === "loading") {
      toast.info("Đang tải Google, nếu mãi không được hãy kiểm tra kết nối mạng rồi thử lại.");
    }
  };

  return (
    <Button
      type="button"
      variant="glass"
      size="md"
      disabled={status === "busy"}
      onClick={onClick}
      className={status === "missing" ? "mt-3 w-full text-[13px]" : "w-full text-[13px]"}
    >
      <img src={googleIcon} alt="" className="size-4" />
      {status === "busy" ? "Đang đăng nhập..." : "Tiếp tục với Google"}
    </Button>
  );
}
