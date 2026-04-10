import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const location = useLocation();

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground font-serif">Carregando com fé...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  // Allow access to onboarding page always
  if (location.pathname === "/onboarding") return <>{children}</>;

  // Redirect to onboarding if profile is incomplete
  const isComplete = profile?.nome && profile?.bio && profile?.cidade && profile?.estado && profile?.religião && profile?.intencao_relacionamento && profile?.frequencia_igreja && profile?.foto_perfil;

  if (!isComplete) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
