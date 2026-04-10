import { ArrowLeft, ShieldCheck, Lock, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useVerification } from "@/hooks/useVerification";
import { Button } from "@/components/ui/button";

const statusLabels: Record<string, { text: string; color: string }> = {
  pendente: { text: "Em análise", color: "text-accent" },
  approved: { text: "Verificado ✓", color: "text-green-600" },
  rejected: { text: "Rejeitado — Reenvie", color: "text-destructive" },
};

const SettingsSecurity = () => {
  const navigate = useNavigate();
  const { data: verification } = useVerification();
  const status = verification?.status ?? "none";
  const info = statusLabels[status];

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground mb-6 hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </button>
      <h1 className="font-serif text-2xl font-semibold text-foreground mb-6">Segurança</h1>

      <div className="space-y-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3 mb-3">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <p className="text-sm font-medium text-foreground">Verificação de identidade</p>
          </div>
          {info ? (
            <p className={`text-sm ${info.color}`}>{info.text}</p>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Sua identidade ainda não foi verificada.</p>
              <Button onClick={() => navigate("/verification")} size="sm" className="gradient-gold text-foreground border-0">
                Verificar agora
              </Button>
            </div>
          )}
          {status === "rejected" && (
            <Button onClick={() => navigate("/verification")} size="sm" className="mt-2 gradient-gold text-foreground border-0">
              Reenviar documentos
            </Button>
          )}
        </div>

        <div className="bg-card rounded-xl border border-border p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">Dados protegidos</p>
              <p className="text-xs text-muted-foreground">Seus dados pessoais são criptografados e nunca compartilhados.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Eye className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">Email oculto</p>
              <p className="text-xs text-muted-foreground">Seu email nunca é visível para outros usuários.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsSecurity;
