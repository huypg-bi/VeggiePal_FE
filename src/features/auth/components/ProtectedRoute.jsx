import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore, selectIsAuthenticated } from "@/features/auth/store/authStore";

export default function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}
