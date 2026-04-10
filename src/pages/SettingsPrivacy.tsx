import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";

const SettingsPrivacy = () => {
  const navigate = useNavigate();
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();
  const [hideLocation, setHideLocation] = useState(profile?.hide_location ?? false);

  const toggleActive = () => {
    updateProfile.mutate({ ativo: !profile?.ativo });
  };

  const toggleLocation = () => {
    const next = !hideLocation;
    setHideLocation(next);
    updateProfile.mutate({ hide_location: next });
  };

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground mb-6 hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </button>
      <h1 className="font-serif text-2xl font-semibold text-foreground mb-6">Privacidade</h1>
      <div className="bg-card rounded-xl border border-border divide-y divide-border">
        <div className="flex items-center justify-between p-4">
          <div>
            <p className="text-sm font-medium text-foreground">Perfil visível</p>
            <p className="text-xs text-muted-foreground">Outros usuários podem ver seu perfil</p>
          </div>
          <Switch checked={profile?.ativo ?? true} onCheckedChange={toggleActive} />
        </div>
        <div className="flex items-center justify-between p-4">
          <div>
            <p className="text-sm font-medium text-foreground">Esconder localização</p>
            <p className="text-xs text-muted-foreground">Ocultar cidade e estado do perfil</p>
          </div>
          <Switch checked={hideLocation} onCheckedChange={toggleLocation} />
        </div>
      </div>
    </div>
  );
};

export default SettingsPrivacy;
