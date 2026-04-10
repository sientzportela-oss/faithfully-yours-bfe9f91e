import { Bell, Eye, MapPin, Shield, Crown, Trash2, Pause, ChevronRight, Info, FileText, Lock } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    toast({ title: "Até logo! 🙏", description: "Que Deus abençoe sua jornada." });
    navigate("/");
  };

  const sections = [
    {
      title: "Aparência",
      items: [{ custom: true }],
    },
    {
      title: "Conta",
      items: [
        { icon: Bell, label: "Notificações", desc: "Matches, mensagens, curtidas", action: () => navigate("/app/settings/notifications") },
        { icon: Eye, label: "Privacidade", desc: "Visibilidade do perfil", action: () => navigate("/app/settings/privacy") },
        { icon: MapPin, label: "Localização", desc: "Preferências de distância", action: () => navigate("/app/settings/location") },
        { icon: Shield, label: "Segurança", desc: "Verificação e proteção", action: () => navigate("/app/settings/security") },
      ],
    },
    {
      title: "Plano",
      items: [
        { icon: Crown, label: "Planos e assinatura", desc: "Gerencie seu plano", action: () => navigate("/app/plans") },
      ],
    },
    {
      title: "Informações",
      items: [
        { icon: Info, label: "Sobre o Elo", desc: "Missão e valores", action: () => navigate("/app/about") },
        { icon: FileText, label: "Termos de Uso", desc: "Regras da plataforma", action: () => navigate("/app/settings/terms") },
        { icon: Lock, label: "Política de Privacidade", desc: "Como protegemos seus dados", action: () => navigate("/app/settings/privacy-policy") },
        { icon: FileText, label: "Diretrizes da Comunidade", desc: "Regras de convivência", action: () => navigate("/app/settings/community") },
      ],
    },
    {
      title: "Conta",
      items: [
        { icon: Pause, label: "Pausar conta", desc: "Fique invisível temporariamente", action: () => navigate("/app/settings/pause") },
        { icon: Trash2, label: "Sair da conta", desc: "Encerrar sessão", danger: true, action: handleSignOut },
      ],
    },
  ];

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
      <h1 className="font-serif text-2xl font-semibold text-foreground mb-6">Configurações</h1>
      <div className="space-y-6">
        {sections.map((section, si) => (
          <div key={si} className="animate-fade-in" style={{ animationDelay: `${si * 0.05}s` }}>
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
              {section.title}
            </h2>
            <div className="bg-card rounded-xl shadow-card border border-border overflow-hidden divide-y divide-border">
              {section.items.map((item: any, ii) => {
                if (item.custom) {
                  return (
                    <div key={ii} className="flex items-center justify-between p-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">Tema</p>
                        <p className="text-xs text-muted-foreground">Claro, escuro ou automático</p>
                      </div>
                      <ThemeToggle />
                    </div>
                  );
                }
                return (
                  <button
                    key={ii}
                    onClick={item.action}
                    className="w-full flex items-center gap-3 p-4 text-left hover:bg-secondary/50 transition-colors"
                  >
                    <item.icon className={`w-5 h-5 ${item.danger ? "text-destructive" : "text-muted-foreground"}`} />
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${item.danger ? "text-destructive" : "text-foreground"}`}>{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;
