import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";

const SettingsNotifications = () => {
  const navigate = useNavigate();
  const [prefs, setPrefs] = useState({ matches: true, messages: true, likes: true, verification: true });

  useEffect(() => {
    const saved = localStorage.getItem("elo_notif_prefs");
    if (saved) setPrefs(JSON.parse(saved));
  }, []);

  const toggle = (key: keyof typeof prefs) => {
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next);
    localStorage.setItem("elo_notif_prefs", JSON.stringify(next));
  };

  const items = [
    { key: "matches" as const, label: "Matches", desc: "Quando alguém se conectar com você" },
    { key: "messages" as const, label: "Mensagens", desc: "Novas mensagens recebidas" },
    { key: "likes" as const, label: "Curtidas", desc: "Quando alguém curtir seu perfil" },
    { key: "verification" as const, label: "Verificação", desc: "Atualizações da verificação de perfil" },
  ];

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground mb-6 hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </button>
      <h1 className="font-serif text-2xl font-semibold text-foreground mb-6">Notificações</h1>
      <div className="bg-card rounded-xl border border-border divide-y divide-border">
        {items.map((item) => (
          <div key={item.key} className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
            <Switch checked={prefs[item.key]} onCheckedChange={() => toggle(item.key)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsNotifications;
