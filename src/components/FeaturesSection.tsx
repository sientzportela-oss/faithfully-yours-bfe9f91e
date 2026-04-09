import { Heart, Shield, Users } from "lucide-react";

const features = [
  {
    icon: Heart,
    title: "Relacionamentos com propósito",
    description: "Conecte-se com pessoas que compartilham seus valores e buscam algo verdadeiro.",
    delay: "0.3s",
  },
  {
    icon: Shield,
    title: "Ambiente seguro e respeitoso",
    description: "Verificação de perfil, moderação ativa e prioridade para a segurança de todos.",
    delay: "0.45s",
  },
  {
    icon: Users,
    title: "Comunidade de valores",
    description: "Uma comunidade madura, onde fé, família e respeito são o centro de tudo.",
    delay: "0.6s",
  },
];

const FeaturesSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 pb-24">
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="bg-card rounded-xl p-8 shadow-card animate-fade-in"
            style={{ animationDelay: feature.delay }}
          >
            <div className="w-12 h-12 rounded-lg gradient-gold flex items-center justify-center mb-5">
              <feature.icon className="w-6 h-6 text-foreground" />
            </div>
            <h3 className="font-serif text-lg font-semibold mb-2 text-foreground">
              {feature.title}
            </h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
