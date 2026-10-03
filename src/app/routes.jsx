import { Routes, Route, Navigate } from "react-router-dom";

import AuthScreen from "@/features/auth/pages/AuthScreen";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import { useAuthStore, selectIsAuthenticated } from "@/features/auth/store/authStore";
import HomeScreen from "@/features/home/pages/HomeScreen";
import MealPlannerScreen from "@/features/meal-planner/pages/MealPlannerScreen";
import RestaurantMapScreen from "@/features/restaurant-map/pages/RestaurantMapScreen";
import VideoHomeScreen from "@/features/video/pages/VideoHomeScreen";
import VideoWatchScreen from "@/features/video/pages/VideoWatchScreen";
import ProfileScreen from "@/features/profile/pages/ProfileScreen";
import ChatbotScreen from "@/features/chatbot/pages/ChatbotScreen";

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <RedirectIfAuthenticated>
            <AuthScreen />
          </RedirectIfAuthenticated>
        }
      />
      <Route
        path="/register"
        element={
          <RedirectIfAuthenticated>
            <AuthScreen />
          </RedirectIfAuthenticated>
        }
      />
      <Route path="/forgot-password" element={<AuthScreen />} />
      <Route path="/verify-otp" element={<AuthScreen />} />
      <Route path="/" element={<HomeScreen />} />
      <Route
        path="/meal-planner"
        element={
          <ProtectedRoute>
            <MealPlannerScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/map"
        element={
          <ProtectedRoute>
            <RestaurantMapScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/videos"
        element={
          <ProtectedRoute>
            <VideoHomeScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/videos/:videoId"
        element={
          <ProtectedRoute>
            <VideoWatchScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfileScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chatbot"
        element={
          <ProtectedRoute>
            <ChatbotScreen />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// Ngược với ProtectedRoute: đã đăng nhập thì không cho vào trang login/register nữa.
function RedirectIfAuthenticated({ children }) {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  if (isAuthenticated) return <Navigate to="/" replace />;

  return children;
}
