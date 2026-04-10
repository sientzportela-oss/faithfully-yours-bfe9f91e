import { BookOpen, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const DailyReflection = () => {
  const { data: versiculo } = useQuery({
    queryKey: ["versiculo-diario"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("versiculos")
        .select("*")
        .limit(10);
      if (error) throw error;
      if (!data?.length) return null;
      // Pick one based on day of year
      const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
      return data[dayOfYear % data.length];
    },
  });

  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      <h1 className="font-serif text-2xl font-semibold text-foreground mb-6">Reflexão do dia</h1>

      {/* Bible Verse */}
      <div className="bg-card rounded-2xl p-8 shadow-card mb-6 animate-fade-in">
        <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center mb-6">
          <BookOpen className="w-6 h-6 text-foreground" />
        </div>
        <blockquote className="font-serif text-xl leading-relaxed text-foreground mb-4 italic">
          "{versiculo?.versiculo || "O amor é paciente, o amor é bondoso. Não inveja, não se vangloria, não se orgulha."}"
        </blockquote>
        <p className="text-sm text-muted-foreground font-medium">
          {versiculo?.referencia || "1 Coríntios 13:4"}
        </p>
      </div>

      {/* Reflection */}
      <div className="bg-card rounded-2xl p-8 shadow-card mb-6 animate-fade-in" style={{ animationDelay: "0.15s" }}>
        <h2 className="font-serif text-lg font-semibold text-foreground mb-3">Reflexão sobre relacionamentos</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          O amor verdadeiro se constrói na paciência e na bondade. Em um relacionamento com propósito, 
          aprendemos a colocar o outro em primeiro lugar, a ser generosos com nosso tempo e atenção. 
          Hoje, reflita: como você pode ser mais paciente e bondoso nas suas relações?
        </p>
      </div>

      {/* Values */}
      <div className="bg-card rounded-2xl p-8 shadow-card animate-fade-in" style={{ animationDelay: "0.3s" }}>
        <h2 className="font-serif text-lg font-semibold text-foreground mb-3">Valores familiares</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          A família é o alicerce de uma vida plena. Construir uma família com valores sólidos 
          exige comprometimento, fé e amor incondicional. Cada passo no caminho do relacionamento 
          é uma semente para o futuro que você deseja construir.
        </p>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="w-4 h-4" /> Compartilhar
        </Button>
      </div>
    </div>
  );
};

export default DailyReflection;
