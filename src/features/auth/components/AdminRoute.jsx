import { Navigate, Outlet, useLocation } from "react-router-dom";

import { selectIsAuthenticated, useAuthStore } from "@/features/auth/store/authStore";
import { isAdmin } from "@/features/auth/utils/roleRedirect";

export default function AdminRoute() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  if (!isAdmin(user)) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
