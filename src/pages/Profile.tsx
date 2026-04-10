import { Shield, Settings, Crown, ChevronRight, Heart, Target, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";

const Profile = () => {
  const navigate = useNavigate();
  const { data: profile, isLoading } = useProfile();

  if (isLoading) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-6 text-center py-20">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  const displayName = profile?.nome || "Usuário";
  const initial = displayName[0]?.toUpperCase() || "?";

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-semibold text-foreground">Perfil</h1>
        <Button variant="ghost" size="icon" onClick={() => navigate("/app/settings")}>
          <Settings className="w-5 h-5 text-muted-foreground" />
        </Button>
      </div>

      {/* Profile Header */}
      <div className="bg-card rounded-2xl p-6 shadow-card mb-6 text-center animate-fade-in border border-border">
        <div className="relative inline-block mb-4">
          <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center text-3xl font-serif font-semibold text-muted-foreground overflow-hidden">
            {profile?.foto_perfil ? (
              <img src={profile.foto_perfil} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              initial
            )}
          </div>
          {profile?.verificado && (
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full gradient-gold flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-foreground" />
            </div>
          )}
        </div>
        <h2 className="font-serif text-xl font-semibold text-foreground">
          {displayName}{profile?.idade ? `, ${profile.idade}` : ""}
        </h2>
        <p className="text-sm text-muted-foreground">
          {[profile?.cidade, profile?.estado].filter(Boolean).join(", ") || "Localização não informada"}
        </p>
        <div className="flex items-center justify-center gap-2 mt-2">
          {profile?.verificado && (
            <span className="px-3 py-1 rounded-full bg-gold-subtle text-xs font-medium text-accent">
              Perfil verificado
            </span>
          )}
          {profile?.ativo && (
            <span className="px-3 py-1 rounded-full bg-soft-blue-light text-xs font-medium text-primary">
              Perfil ativo
            </span>
          )}
        </div>
      </div>

      {/* Premium CTA */}
      <div className="gradient-gold rounded-2xl p-6 mb-6 animate-fade-in cursor-pointer" style={{ animationDelay: "0.15s" }} onClick={() => navigate("/app/plans")}>
        <div className="flex items-center gap-3 mb-3">
          <Crown className="w-6 h-6 text-foreground" />
          <h3 className="font-serif text-lg font-semibold text-foreground">Elo Premium</h3>
        </div>
        <p className="text-sm text-foreground/80 mb-4">
          Likes ilimitados, veja quem curtiu você, filtros avançados e muito mais.
        </p>
        <Button className="bg-foreground text-card hover:bg-foreground/90 w-full font-semibold">
          Ver planos
        </Button>
      </div>

      {/* Profile Sections */}
      <div className="space-y-3 animate-fade-in" style={{ animationDelay: "0.3s" }}>
        {[
          { icon: Heart, label: "Intenção de relacionamento", value: profile?.intencao_relacionamento || "Não informado" },
          { icon: Target, label: "Religião", value: profile?.["religião"] || "Não informado" },
          { icon: Sparkles, label: "Profissão", value: profile?.["profissão"] || "Não informado" },
        ].map((item) => (
          <button
            key={item.label}
            className="w-full flex items-center gap-4 p-4 bg-card rounded-xl shadow-card border border-border text-left hover:bg-secondary/50 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              <item.icon className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="text-sm font-medium text-foreground">{item.value}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        ))}
      </div>

      {profile?.bio && (
        <div className="mt-6 bg-card rounded-2xl p-6 shadow-card border border-border animate-fade-in" style={{ animationDelay: "0.45s" }}>
          <h3 className="font-serif text-sm font-semibold text-foreground mb-2">Sobre mim</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{profile.bio}</p>
        </div>
      )}
    </div>
  );
};

export default Profile;
