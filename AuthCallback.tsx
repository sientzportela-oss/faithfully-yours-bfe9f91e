import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ensureProfile, getPostAuthDestination } from "@/lib/auth";
import eloLogo from "@/assets/elo-logo.png";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // 1. Check for OAuth error in hash
        const hash = window.location.hash;
        if (hash) {
          const hashParams = new URLSearchParams(hash.replace("#", "?"));
          const errorParam = hashParams.get("error");
          const errorDescription = hashParams.get("error_description");
          if (errorParam) {
            setError(errorDescription || "Erro ao autenticar. Tente novamente.");
            setTimeout(() => navigate("/auth", { replace: true }), 3000);
            return;
          }
        }

        // 2. Check for OAuth code in query string (PKCE flow)
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");

        let session;

        if (code) {
          // Exchange the code for a session
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            console.error("exchangeCodeForSession error:", exchangeError);
            setError("Erro ao trocar código de autenticação. Tente novamente.");
            setTimeout(() => navigate("/auth", { replace: true }), 3000);
            return;
          }
          session = data.session;
        } else {
          // Fallback: try to get existing session (e.g. implicit flow or already restored)
          const { data } = await supabase.auth.getSession();
          session = data.session;

          if (!session) {
            // Wait briefly for session restoration
            await new Promise((r) => setTimeout(r, 1500));
            const { data: retry } = await supabase.auth.getSession();
            session = retry.session;
          }
        }

        if (!session) {
          setError("Sessão não encontrada. Tente fazer login novamente.");
          setTimeout(() => navigate("/auth", { replace: true }), 3000);
          return;
        }

        // 3. Ensure profile exists
        await ensureProfile(session.user);

        // 4. Decide destination
        const destination = await getPostAuthDestination(session.user.id);
        navigate(destination, { replace: true });
      } catch (err) {
        console.error("AuthCallback error:", err);
        setError("Erro inesperado. Tente novamente.");
        setTimeout(() => navigate("/auth", { replace: true }), 3000);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen gradient-hero flex flex-col items-center justify-center px-6">
      <img src={eloLogo} alt="Elo" width={64} height={64} className="mb-6" />
      {error ? (
        <div className="text-center space-y-2">
          <p className="text-destructive font-medium">{error}</p>
          <p className="text-sm text-muted-foreground">Redirecionando...</p>
        </div>
      ) : (
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground text-sm">Autenticando...</p>
        </div>
      )}
    </div>
  );
};

export default AuthCallback;
