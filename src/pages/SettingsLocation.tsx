import { useState } from "react";
import { ArrowLeft, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const distances = ["10", "25", "50", "100", "200", "Sem limite"];

const SettingsLocation = () => {
  const navigate = useNavigate();
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();
  const { toast } = useToast();
  const [distance, setDistance] = useState(profile?.distance_preference ?? "50");

  const saveDistance = () => {
    updateProfile.mutate({ distance_preference: distance }, {
      onSuccess: () => toast({ title: "Salvo! ✓", description: "Preferência de distância atualizada." }),
    });
  };

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground mb-6 hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </button>
      <h1 className="font-serif text-2xl font-semibold text-foreground mb-6">Localização</h1>

      <div className="bg-card rounded-xl border border-border p-4 space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{profile?.cidade ? `${profile.cidade}, ${profile.estado}` : "Localização não definida"}</span>
        </div>

        <div>
          <p className="text-sm font-medium text-foreground mb-2">Distância máxima (km)</p>
          <Select value={distance} onValueChange={setDistance}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {distances.map((d) => <SelectItem key={d} value={d}>{d === "Sem limite" ? d : `${d} km`}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={saveDistance} className="w-full gradient-gold text-foreground border-0">Salvar</Button>
      </div>

      <p className="text-xs text-muted-foreground text-center mt-4">
        Sua localização exata nunca é compartilhada. Apenas a cidade é visível.
      </p>
    </div>
  );
};

export default SettingsLocation;
