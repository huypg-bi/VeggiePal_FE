import { Routes, Route, Navigate } from "react-router-dom";

import AuthScreen from "@/features/auth/pages/AuthScreen";
import ForgotPasswordScreen from "@/features/auth/pages/ForgotPasswordScreen";
import VerifyOtpScreen from "@/features/auth/pages/VerifyOtpScreen";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import { useAuthStore } from "@/features/auth/store/authStore";
import LandingScreen from "@/features/home/pages/HomeScreen";
import MealPlannerScreen from "@/features/meal-planner/pages/HomeScreen";
import RestaurantMapScreen from "@/features/restaurant-map/pages/RestaurantMapScreen";
import VideoHomeScreen from "@/features/video/pages/VideoHomeScreen";
import VideoWatchScreen from "@/features/video/pages/VideoWatchScreen";
import ProfileScreen from "@/features/profile/pages/ProfileScreen";
import ChatbotScreen from "@/features/chatbot/pages/ChatbotScreen";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
      <Route path="/verify-otp" element={<VerifyOtpScreen />} />
      <Route path="/" element={<LandingScreen />} />
      <Route
        path="/meal-planner"
        element={
          <ProtectedRoute>
            <MealPlannerPage />
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
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chatbot"
        element={
          <ProtectedRoute>
            <ChatbotPage />
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

  return <AuthScreen />;
}

function RegisterPage() {
  const isAuthenticated = useAuthStore((s) => Boolean(s.token));
  if (isAuthenticated) return <Navigate to="/" replace />;

  return <AuthScreen />;
}

function MealPlannerPage() {
  return <MealPlannerScreen />;
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

function ProfilePage() {
  return <ProfileScreen />;
}

function ChatbotPage() {
  return <ChatbotScreen />;
}
