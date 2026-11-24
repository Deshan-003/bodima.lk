import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "../auth/AdminAuthContext";

/** Blocks /admin routes for everyone without a valid demo admin session. */
export default function AdminRoute({ children }: { children: ReactNode }) {
  const { session } = useAdminAuth();
  const location = useLocation();

  if (!session) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
