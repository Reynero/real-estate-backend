import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/authStore";

export function AdminRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || user?.role !== "Admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}