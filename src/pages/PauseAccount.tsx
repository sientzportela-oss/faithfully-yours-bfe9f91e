import { ArrowLeft, Pause, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";

const PauseAccount = () => {
  const navigate = useNavigate();
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();
  const { toast } = useToast();
  const isActive = profile?.ativo ?? true;

  const togglePause = () => {
    updateProfile.mutate({ ativo: !isActive }, {
      onSuccess: () => {
        toast({
          title: isActive ? "Conta pausada" : "Conta reativada! 🙏",
          description: isActive
            ? "Seu perfil ficará invisível para outros usuários."
            : "Bem-vindo de volta! Seu perfil está visível novamente.",
        });
      },
    });
  };

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground mb-6 hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </button>
      <h1 className="font-serif text-2xl font-semibold text-foreground mb-6">
        {isActive ? "Pausar conta" : "Conta pausada"}
      </h1>

      <div className="bg-card rounded-xl border border-border p-6 text-center space-y-4">
        <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${isActive ? "bg-secondary" : "bg-primary/10"}`}>
          {isActive ? <Pause className="w-7 h-7 text-muted-foreground" /> : <Play className="w-7 h-7 text-primary" />}
        </div>

        <div>
          <p className="text-sm text-foreground font-medium">
            {isActive ? "Seu perfil está ativo e visível" : "Seu perfil está pausado e invisível"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {isActive
              ? "Ao pausar, você ficará invisível e não receberá novos matches."
              : "Reative para voltar a ser descoberto por outras pessoas."}
          </p>
        </div>

        <Button onClick={togglePause} className={`w-full ${isActive ? "" : "gradient-gold text-foreground border-0"}`}
          variant={isActive ? "destructive" : "default"}
        >
          {isActive ? "Pausar conta" : "Reativar conta"}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center mt-4 italic">
        "Para tudo há uma estação e um tempo para cada propósito." — Eclesiastes 3:1
      </p>
    </div>
  );
};

export default PauseAccount;
