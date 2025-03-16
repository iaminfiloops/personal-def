
import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, profile, isLoading } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    if (!isLoading) {
      console.log("ProtectedRoute check:", {
        path: location.pathname,
        isAuthenticated: !!user,
        userEmail: user?.email,
        userRole: profile?.role,
        requireAdmin
      });
    }
  }, [isLoading, user, profile, location.pathname, requireAdmin]);
  
  // If authentication is still loading, show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  // If no user is found, redirect to login
  if (!user) {
    console.log("No user found, redirecting to login from:", location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If admin access is required but user is not an admin, redirect to home
  if (requireAdmin && profile?.role !== 'admin') {
    console.log("Admin access required but user is not admin, redirecting to home");
    return <Navigate to="/" replace />;
  }
  
  // If user is authenticated and meets role requirements, render children
  console.log("Access granted to:", location.pathname);
  return <>{children}</>;
};

export default ProtectedRoute;
