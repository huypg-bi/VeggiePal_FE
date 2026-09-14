import { Routes, Route, Navigate } from "react-router-dom";

import LoginScreen from "@/features/auth/pages/LoginScreen";
import RegisterScreen from "@/features/auth/pages/RegisterScreen";
import ForgotPasswordScreen from "@/features/auth/pages/ForgotPasswordScreen";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import { useAuthStore } from "@/features/auth/store/authStore";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function LoginPage() {
  const isAuthenticated = useAuthStore((s) => Boolean(s.token));
  if (isAuthenticated) return <Navigate to="/" replace />;

  return <LoginScreen />;
}

function RegisterPage() {
  const isAuthenticated = useAuthStore((s) => Boolean(s.token));
  if (isAuthenticated) return <Navigate to="/" replace />;

  return <RegisterScreen />;
}

// Trang tạm để thấy luồng login chạy end-to-end.
function HomePage() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <div className="min-h-dvh bg-background p-8 text-foreground">
      <p>
        Xin chào, <strong>{user?.fullName}</strong> ({user?.email})
      </p>
      <button
        onClick={logout}
        className="mt-4 rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-muted"
      >
        Đăng xuất
      </button>
    </div>
  );
}
