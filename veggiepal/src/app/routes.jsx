import { Routes, Route, Navigate } from "react-router-dom";

import LoginScreen from "@/features/auth/pages/LoginScreen";
import RegisterScreen from "@/features/auth/pages/RegisterScreen";
import ForgotPasswordScreen from "@/features/auth/pages/ForgotPasswordScreen";
import VerifyOtpScreen from "@/features/auth/pages/VerifyOtpScreen";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import { useAuthStore } from "@/features/auth/store/authStore";
import HomeScreen from "@/features/home/pages/HomeScreen";
import RestaurantMapScreen from "@/features/restaurant-map/pages/RestaurantMapScreen";
import VideoHomeScreen from "@/features/video/pages/VideoHomeScreen";
import VideoWatchScreen from "@/features/video/pages/VideoWatchScreen";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
      <Route path="/verify-otp" element={<VerifyOtpScreen />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/map"
        element={
          <ProtectedRoute>
            <MapPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/videos"
        element={
          <ProtectedRoute>
            <VideoHomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/videos/:videoId"
        element={
          <ProtectedRoute>
            <VideoWatchPage />
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

function HomePage() {
  return <HomeScreen />;
}

function MapPage() {
  return <RestaurantMapScreen />;
}

function VideoHomePage() {
  return <VideoHomeScreen />;
}

function VideoWatchPage() {
  return <VideoWatchScreen />;
}
