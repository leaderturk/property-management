import { ReactNode, useEffect } from "react";
import { useAuth } from "@/hooks/auth-context";
import { useLocation } from "wouter";
import { Loader2, Shield } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  redirectTo = "/auth" 
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // Show loading skeleton while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 p-8">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-orange-600 animate-pulse" />
            <Loader2 className="h-6 w-6 text-orange-600 animate-spin" />
          </div>
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Kimlik Doğrulanıyor
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Lütfen bekleyin...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Safe redirect using useEffect to avoid render side-effects
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user)) {
      setLocation(redirectTo);
    }
  }, [isLoading, isAuthenticated, user, redirectTo, setLocation]);

  // Show redirect message for unauthenticated users
  if (!isLoading && (!isAuthenticated || !user)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 p-8">
          <Shield className="h-8 w-8 text-orange-600" />
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Erişim Engellendi
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Giriş sayfasına yönlendiriliyorsunuz...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Render protected content if authenticated
  return <>{children}</>;
}