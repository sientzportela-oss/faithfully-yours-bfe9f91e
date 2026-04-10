import { Heart, Shield, Users, Target, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import eloLogo from "@/assets/elo-logo.png";

const About = () => {
  const navigate = useNavigate();

  const values = [
    { icon: Heart, title: "Propósito", desc: "Conexões com significado, baseadas em valores, fé e respeito mútuo." },
    { icon: Shield, title: "Segurança", desc: "Verificação de identidade, moderação ativa e ambiente protegido." },
    { icon: Users, title: "Comunidade", desc: "Pessoas que buscam relacionamentos sérios e duradouros." },
    { icon: Target, title: "Intenção", desc: "Cada conexão é pensada para construir algo verdadeiro." },
  ];

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
      <div className="flex items-center gap-3 mb-8">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="font-serif text-2xl font-semibold text-foreground">Sobre o Elo</h1>
      </div>

      <div className="text-center mb-10 animate-fade-in">
        <img src={eloLogo} alt="Elo" width={64} height={64} className="mx-auto mb-4" />
        <h2 className="font-serif text-xl font-semibold text-foreground mb-2">
          Mais que encontros, <span className="text-gradient-gold">conexões com sentido</span>
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
          O Elo nasceu para pessoas que acreditam em algo maior. Um espaço seguro para quem busca
          relacionamentos com propósito, valores compartilhados e respeito.
        </p>
      </div>

      <div className="space-y-4 mb-10">
        <h3 className="font-serif text-lg font-semibold text-foreground">Nossa missão</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Criar um ambiente onde pessoas com valores e fé possam se conectar de forma autêntica,
          segura e respeitosa. Acreditamos que relacionamentos significativos transformam vidas
          e comunidades.
        </p>
      </div>

      <div className="space-y-4 mb-10">
        <h3 className="font-serif text-lg font-semibold text-foreground">Nossos valores</h3>
        <div className="grid grid-cols-2 gap-3">
          {values.map((v, i) => (
            <div
              key={v.title}
              className="bg-card rounded-xl p-4 shadow-card border border-border animate-fade-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <v.icon className="w-6 h-6 text-accent mb-2" />
              <h4 className="font-semibold text-sm text-foreground mb-1">{v.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-xl p-6 shadow-card border border-border">
        <h3 className="font-serif text-lg font-semibold text-foreground mb-3">Segurança</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Verificação de identidade em múltiplos níveis</li>
          <li>• Moderação ativa com IA e equipe dedicada</li>
          <li>• Sistema de denúncia e bloqueio</li>
          <li>• Proteção prioritária para mulheres</li>
          <li>• Detecção de perfis falsos</li>
        </ul>
      </div>
    </div>
  );
};

export default About;
