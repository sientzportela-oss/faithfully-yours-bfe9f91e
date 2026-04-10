import heroImage from "@/assets/hero-couple.jpg";
import eloLogo from "@/assets/elo-logo.png";
import { Button } from "@/components/ui/button";
import { Heart, Shield, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LandingHero = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-hero">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <img src={eloLogo} alt="Elo" width={36} height={36} />
          <span className="font-serif text-xl font-semibold text-foreground">Elo</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>
            Entrar
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate("/auth?mode=signup")}>
            Começar
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold leading-tight text-foreground">
                Conexões com{" "}
                <span className="text-gradient-gold">fé e propósito</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
                Um espaço para quem busca relacionamentos verdadeiros, baseados em valores, respeito e intenção.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="gradient-gold text-foreground font-semibold px-8 py-6 text-base shadow-warm border-0 hover:opacity-90 transition-opacity"
                onClick={() => navigate("/auth?mode=signup")}
              >
                Criar minha conta
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 text-base"
                onClick={() => navigate("/auth")}
              >
                Saiba mais
              </Button>
            </div>
          </div>

          <div className="relative animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="rounded-2xl overflow-hidden shadow-warm">
              <img
                src={heroImage}
                alt="Casal caminhando juntos em um jardim ao pôr do sol"
                width={1920}
                height={1080}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Heart,
              title: "Relacionamentos com propósito",
              desc: "Conecte-se com pessoas que compartilham seus valores e buscam algo verdadeiro.",
            },
            {
              icon: Shield,
              title: "Ambiente seguro e respeitoso",
              desc: "Verificação de perfil, moderação ativa e prioridade para a segurança de todos.",
            },
            {
              icon: Users,
              title: "Comunidade de valores",
              desc: "Uma comunidade madura, onde fé, família e respeito são o centro de tudo.",
            },
          ].map((feature, i) => (
            <div
              key={feature.title}
              className="bg-card rounded-xl p-8 shadow-card animate-fade-in"
              style={{ animationDelay: `${0.3 + i * 0.15}s` }}
            >
              <div className="w-12 h-12 rounded-lg gradient-gold flex items-center justify-center mb-5">
                <feature.icon className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="font-serif text-lg font-semibold mb-2 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={eloLogo} alt="Elo" width={24} height={24} />
            <span className="font-serif text-sm text-muted-foreground">Elo — Conexões com fé e intenção</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 Elo. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingHero;
