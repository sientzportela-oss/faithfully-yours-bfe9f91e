import { Check, Crown, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const PLANS = [
  {
    name: "Grátis",
    price: "R$ 0",
    period: "",
    icon: Star,
    highlight: false,
    features: [
      "Likes limitados por dia",
      "Filtros básicos",
      "Matching básico",
      "Mensagens básicas",
      "Reflexão diária",
    ],
    cta: "Plano atual",
    disabled: true,
  },
  {
    name: "Premium",
    price: "R$ 29,90",
    period: "/mês",
    icon: Crown,
    highlight: true,
    features: [
      "Likes ilimitados",
      "Veja quem curtiu você",
      "Filtros avançados",
      "Visibilidade prioritária",
      "Boost de perfil mensal",
      "Sem anúncios",
      "Reflexão diária",
    ],
    cta: "Assinar Premium",
    disabled: false,
  },
  {
    name: "Elite",
    price: "R$ 49,90",
    period: "/mês",
    icon: Sparkles,
    highlight: false,
    features: [
      "Tudo do Premium",
      "Visibilidade máxima",
      "Badge Premium exclusivo",
      "Matching avançado por IA",
      "Boost de perfil semanal",
      "Recursos exclusivos",
      "Suporte prioritário",
    ],
    cta: "Assinar Elite",
    disabled: false,
  },
];

const Plans = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 pt-6 pb-24">
      <div className="text-center mb-10 animate-fade-in">
        <h1 className="font-serif text-3xl font-semibold text-foreground mb-3">
          Escolha seu plano
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Desbloqueie recursos exclusivos e encontre conexões mais significativas.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {PLANS.map((plan, i) => (
          <div
            key={plan.name}
            className={`rounded-2xl p-6 animate-fade-in relative ${
              plan.highlight
                ? "gradient-gold shadow-warm ring-2 ring-accent/30"
                : "bg-card shadow-card border border-border"
            }`}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {plan.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-foreground text-card text-xs font-semibold">
                Mais popular
              </span>
            )}
            <div className="flex items-center gap-2 mb-4">
              <plan.icon className={`w-5 h-5 ${plan.highlight ? "text-foreground" : "text-accent"}`} />
              <h3 className="font-serif text-lg font-semibold text-foreground">{plan.name}</h3>
            </div>
            <div className="mb-6">
              <span className="text-3xl font-bold text-foreground">{plan.price}</span>
              {plan.period && <span className="text-sm text-muted-foreground">{plan.period}</span>}
            </div>
            <ul className="space-y-3 mb-6">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                  <span className="text-foreground">{f}</span>
                </li>
              ))}
            </ul>
            <Button
              className={`w-full font-semibold ${
                plan.highlight
                  ? "bg-foreground text-card hover:bg-foreground/90"
                  : plan.disabled
                  ? "bg-secondary text-muted-foreground"
                  : "gradient-gold text-foreground border-0 hover:opacity-90"
              }`}
              disabled={plan.disabled}
            >
              {plan.cta}
            </Button>
          </div>
        ))}
      </div>

      {/* Feature Comparison */}
      <div className="mt-16 animate-fade-in" style={{ animationDelay: "0.3s" }}>
        <h2 className="font-serif text-2xl font-semibold text-foreground text-center mb-8">
          Comparação de recursos
        </h2>
        <div className="bg-card rounded-2xl shadow-card overflow-hidden border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 font-medium text-muted-foreground">Recurso</th>
                <th className="p-4 font-medium text-muted-foreground">Grátis</th>
                <th className="p-4 font-medium text-accent">Premium</th>
                <th className="p-4 font-medium text-muted-foreground">Elite</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Likes diários", "10", "Ilimitado", "Ilimitado"],
                ["Ver quem curtiu", "—", "✓", "✓"],
                ["Filtros avançados", "—", "✓", "✓"],
                ["Boost de perfil", "—", "Mensal", "Semanal"],
                ["Visibilidade prioritária", "—", "✓", "Máxima"],
                ["Badge exclusivo", "—", "—", "✓"],
                ["Matching por IA", "Básico", "Avançado", "Premium"],
                ["Reflexão diária", "✓", "✓", "✓"],
                ["Suporte", "Padrão", "Prioritário", "VIP"],
              ].map(([feature, free, premium, elite], i) => (
                <tr key={feature} className={i % 2 === 0 ? "bg-secondary/30" : ""}>
                  <td className="p-4 font-medium text-foreground">{feature}</td>
                  <td className="p-4 text-center text-muted-foreground">{free}</td>
                  <td className="p-4 text-center text-accent font-medium">{premium}</td>
                  <td className="p-4 text-center text-muted-foreground">{elite}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Plans;
