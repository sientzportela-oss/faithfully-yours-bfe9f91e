import { Heart } from "lucide-react";
import { useMatches } from "@/hooks/useMatches";
import { useNavigate } from "react-router-dom";

const Matches = () => {
  const { data: matches = [], isLoading } = useMatches();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-6 text-center py-20">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground font-serif">Carregando suas conexões...</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      <h1 className="font-serif text-2xl font-semibold text-foreground mb-6">Matches</h1>

      {/* Likes Received */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full gradient-gold flex items-center justify-center">
            <Heart className="w-4 h-4 text-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Pessoas curtiram você</p>
            <p className="text-xs text-muted-foreground">Assine Premium para ver quem</p>
          </div>
        </div>
        <div className="flex gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-20 h-20 rounded-xl bg-secondary overflow-hidden relative">
              <div className="absolute inset-0 backdrop-blur-xl bg-secondary/50" />
            </div>
          ))}
        </div>
      </div>

      {/* Mutual Matches */}
      <h2 className="font-serif text-lg font-semibold text-foreground mb-4">Conexões mútuas</h2>
      
      {matches.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground font-serif">Nenhuma conexão ainda</p>
          <p className="text-sm text-muted-foreground mt-1">
            Continue descobrindo perfis. Deus tem alguém especial para você. 🙏
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {matches.map((match) => (
            <div
              key={match.id}
              className="flex items-center gap-4 p-4 bg-card rounded-xl shadow-card"
            >
              <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center text-lg font-serif font-semibold text-muted-foreground overflow-hidden">
                {match.profile?.foto_perfil ? (
                  <img src={match.profile.foto_perfil} alt={match.profile.nome || ""} className="w-full h-full object-cover" />
                ) : (
                  (match.profile?.nome?.[0] || "?")
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{match.profile?.nome || "Usuário"}</p>
                <p className="text-xs text-muted-foreground">
                  {match.profile?.cidade ? `${match.profile.cidade}, ${match.profile.estado}` : "Nova conexão"}
                </p>
              </div>
              <button
                onClick={() => navigate("/app/messages")}
                className="px-4 py-2 rounded-lg gradient-gold text-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Mensagem
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Matches;
