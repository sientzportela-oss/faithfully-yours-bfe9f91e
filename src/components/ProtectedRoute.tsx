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
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="max-w-md text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
            <span className="text-3xl">📝</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-serif font-semibold text-foreground">Perfil incompleto</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Para garantir conexões de qualidade, precisamos que você complete seu perfil antes de acessar o feed. Preencha todas as informações obrigatórias.
            </p>
          </div>
          <ul className="text-left text-sm text-muted-foreground space-y-1.5">
            {!profile?.nome && <li className="flex items-center gap-2">❌ Nome</li>}
            {!profile?.cidade && <li className="flex items-center gap-2">❌ Cidade</li>}
            {!profile?.estado && <li className="flex items-center gap-2">❌ Estado</li>}
            {!profile?.religião && <li className="flex items-center gap-2">❌ Denominação religiosa</li>}
            {!profile?.frequencia_igreja && <li className="flex items-center gap-2">❌ Frequência na igreja</li>}
            {!profile?.intencao_relacionamento && <li className="flex items-center gap-2">❌ Intenção de relacionamento</li>}
            {!profile?.foto_perfil && <li className="flex items-center gap-2">❌ Fotos</li>}
            {!profile?.bio && <li className="flex items-center gap-2">❌ Biografia</li>}
          </ul>
          <a
            href="/onboarding"
            className="inline-flex items-center justify-center rounded-md gradient-gold text-foreground font-semibold px-8 py-3 hover:opacity-90 transition-opacity"
          >
            Completar perfil
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
