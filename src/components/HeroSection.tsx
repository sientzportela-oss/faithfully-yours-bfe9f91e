import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-couple.jpg";

const HeroSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 pt-12 pb-20">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 animate-fade-in">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold leading-tight text-foreground">
              Conexões com <span className="text-gradient-gold">fé e propósito</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
              Um espaço para quem busca relacionamentos verdadeiros, baseados em valores, respeito e intenção.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="gradient-gold text-foreground font-semibold px-8 py-6 text-base shadow-warm border-0 hover:opacity-90 transition-opacity">
              Criar minha conta
            </Button>
            <Button variant="outline" className="px-8 py-6 text-base">
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
  );
};

export default HeroSection;
