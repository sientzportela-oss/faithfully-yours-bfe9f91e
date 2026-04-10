import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import eloLogo from "@/assets/elo-logo.png";
import { ArrowLeft, ArrowRight, Check, Camera, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const INTERESTS = [
  "Família", "Casamento", "Fé", "Igreja", "Voluntariado",
  "Desenvolvimento pessoal", "Empreendedorismo", "Educação",
  "Esportes", "Música", "Viagem", "Comunidade",
  "Espiritualidade", "Vida simples", "Propósito de vida",
];

const VALUES_QUESTIONS = [
  { id: "faith", question: "A fé é importante para você?", options: ["Sim, muito", "Sim, um pouco", "Estou redescobrindo", "Prefiro não dizer"] },
  { id: "serious", question: "Você busca relacionamento sério?", options: ["Sim", "Estou aberto(a)", "Quero conhecer pessoas"] },
  { id: "marriage", question: "Você deseja casar?", options: ["Sim", "Talvez no futuro", "Ainda não sei"] },
  { id: "church", question: "Você participa de alguma igreja?", options: ["Sim, regularmente", "Às vezes", "Não no momento", "Prefiro não dizer"] },
];

const COUNTRIES = ["Brasil"];
const STATES: Record<string, string[]> = {
  Brasil: ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"],
};
const STATE_NAMES: Record<string, string> = {
  AC:"Acre",AL:"Alagoas",AP:"Amapá",AM:"Amazonas",BA:"Bahia",CE:"Ceará",DF:"Distrito Federal",ES:"Espírito Santo",GO:"Goiás",MA:"Maranhão",MT:"Mato Grosso",MS:"Mato Grosso do Sul",MG:"Minas Gerais",PA:"Pará",PB:"Paraíba",PR:"Paraná",PE:"Pernambuco",PI:"Piauí",RJ:"Rio de Janeiro",RN:"Rio Grande do Norte",RS:"Rio Grande do Sul",RO:"Rondônia",RR:"Roraima",SC:"Santa Catarina",SP:"São Paulo",SE:"Sergipe",TO:"Tocantins",
};

const RELIGIONS = ["Católico(a)", "Evangélico(a)", "Cristão(ã)", "Outro", "Prefiro não dizer"];
const RELATIONSHIP_INTENTIONS = ["Relacionamento sério", "Casamento", "Conhecer pessoas com valores", "Estou aberto(a)"];

const Onboarding = () => {
  const [step, setStep] = useState(0);
  const [gender, setGender] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [country, setCountry] = useState("Brasil");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");
  const [profession, setProfession] = useState("");
  const [education, setEducation] = useState("");
  const [height, setHeight] = useState("");
  const [religion, setReligion] = useState("");
  const [relationshipIntention, setRelationshipIntention] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState<string[]>([]);
  const [ageError, setAgeError] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const selectAnswer = (qId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: answer }));
  };

  const handleAgeChange = (val: string) => {
    setAge(val);
    const num = parseInt(val);
    if (val && num < 18) {
      setAgeError("Você precisa ter pelo menos 18 anos");
    } else {
      setAgeError("");
    }
  };

  const handlePhotoUpload = (index: number) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const newPhotos = [...photos];
        newPhotos[index] = file;
        setPhotos(newPhotos);

        const newUrls = [...photoPreviewUrls];
        newUrls[index] = URL.createObjectURL(file);
        setPhotoPreviewUrls(newUrls);
      }
    };
    input.click();
  };

  const saveProfile = async () => {
    if (!user) {
      toast({ title: "Erro", description: "Você precisa estar logado.", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      // Upload photos
      let profilePhotoUrl = "";
      for (let i = 0; i < photos.length; i++) {
        if (!photos[i]) continue;
        const ext = photos[i].name.split(".").pop();
        const path = `${user.id}/${i === 0 ? "profile" : `photo-${i}`}.${ext}`;
        
        const { error: uploadError } = await supabase.storage
          .from("profile-photos")
          .upload(path, photos[i], { upsert: true });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("profile-photos")
          .getPublicUrl(path);

        if (i === 0) profilePhotoUrl = urlData.publicUrl;

        // Save to photos table
        await supabase.from("photos").insert({
          user_id: user.id,
          photo_url: urlData.publicUrl,
          is_primary: i === 0,
          order_index: i,
        });
      }

      // Upsert profile (creates if missing, updates if exists)
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        nome: name,
        idade: parseInt(age),
        sexo: gender === "male" ? "Masculino" : "Feminino",
        cidade: city,
        estado: state,
        bio,
        "profissão": profession,
        "religião": religion,
        intencao_relacionamento: relationshipIntention || "casamento",
        foto_perfil: profilePhotoUrl || null,
        frequencia_igreja: answers.church || null,
        email: user.email || null,
      }, { onConflict: "id" });

      if (error) throw error;

      toast({
        title: "Perfil criado com sucesso! 🙏",
        description: "Agora vamos verificar sua identidade.",
      });
      navigate("/app/verification");
    } catch (error: any) {
      toast({
        title: "Erro ao salvar",
        description: error.message || "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const canProceed = () => {
    if (step === 0) return true;
    if (step === 1) return gender !== "";
    if (step === 2) {
      const ageNum = parseInt(age);
      return name.trim() && age.trim() && ageNum >= 18 && state && city.trim();
    }
    if (step === 3) return true;
    if (step === 4) return selectedInterests.length >= 3;
    if (step === 5) return true;
    return true;
  };

  const totalSteps = 6;

  const SelectField = ({ label, value, onChange, options, placeholder }: {
    label: string; value: string; onChange: (v: string) => void; options: string[]; placeholder: string;
  }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background appearance-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      </div>
    </div>
  );

  const steps = [
    // Step 0: Welcome
    <div key="welcome" className="flex flex-col items-center text-center space-y-8 animate-fade-in">
      <img src={eloLogo} alt="Elo" width={80} height={80} />
      <div className="space-y-3">
        <h1 className="text-3xl md:text-4xl font-serif font-semibold text-foreground">
          Bem-vindo ao <span className="text-gradient-gold">Elo</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-md leading-relaxed">
          Um espaço para conexões com propósito, valores e respeito.
        </p>
      </div>
      <p className="text-xs text-muted-foreground">Somente para maiores de 18 anos</p>
    </div>,

    // Step 1: Gender
    <div key="gender" className="space-y-6 animate-fade-in max-w-md mx-auto w-full">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl font-serif font-semibold text-foreground">Eu sou</h2>
        <p className="text-muted-foreground text-sm">Selecione seu gênero</p>
      </div>
      <div className="space-y-3">
        {[
          { value: "male", label: "Homem" },
          { value: "female", label: "Mulher" },
        ].map((g) => (
          <button
            key={g.value}
            onClick={() => setGender(g.value)}
            className={`w-full p-4 rounded-xl text-left font-medium transition-all ${
              gender === g.value
                ? "gradient-gold text-foreground shadow-warm"
                : "bg-card border border-border text-foreground hover:bg-secondary"
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>
    </div>,

    // Step 2: Basic Info + Location
    <div key="basic" className="space-y-5 animate-fade-in max-w-md mx-auto w-full">
      <div className="text-center space-y-2 mb-6">
        <h2 className="text-2xl font-serif font-semibold text-foreground">Sobre você</h2>
        <p className="text-muted-foreground text-sm">Informações básicas</p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input id="name" placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="age">Idade</Label>
          <Input id="age" type="number" placeholder="Sua idade" value={age} onChange={(e) => handleAgeChange(e.target.value)} />
          {ageError && <p className="text-xs text-destructive">{ageError}</p>}
        </div>
        <SelectField label="País" value={country} onChange={setCountry} options={COUNTRIES} placeholder="Selecione" />
        <SelectField
          label="Estado"
          value={state}
          onChange={(v) => { setState(v); setCity(""); }}
          options={(STATES[country] || []).map((s) => STATE_NAMES[s] || s)}
          placeholder="Selecione o estado"
        />
        <div className="space-y-2">
          <Label>Cidade</Label>
          <Input placeholder="Sua cidade" value={city} onChange={(e) => setCity(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Profissão</Label>
            <Input placeholder="Ex: Engenheiro" value={profession} onChange={(e) => setProfession(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Educação</Label>
            <Input placeholder="Ex: Graduação" value={education} onChange={(e) => setEducation(e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Altura (opcional)</Label>
            <Input placeholder="Ex: 1.75" value={height} onChange={(e) => setHeight(e.target.value)} />
          </div>
          <SelectField label="Religião" value={religion} onChange={setReligion} options={RELIGIONS} placeholder="Selecione" />
        </div>
        <SelectField label="Intenção de relacionamento" value={relationshipIntention} onChange={setRelationshipIntention} options={RELATIONSHIP_INTENTIONS} placeholder="Selecione" />
        <div className="space-y-2">
          <Label>Bio</Label>
          <textarea
            placeholder="Conte um pouco sobre você e sua fé..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
            maxLength={500}
          />
          <p className="text-xs text-muted-foreground text-right">{bio.length}/500</p>
        </div>
      </div>
    </div>,

    // Step 3: Photos
    <div key="photos" className="space-y-6 animate-fade-in max-w-md mx-auto w-full">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl font-serif font-semibold text-foreground">Suas fotos</h2>
        <p className="text-muted-foreground text-sm">Adicione até 6 fotos que representem você</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[...Array(6)].map((_, i) => (
          <button
            key={i}
            onClick={() => handlePhotoUpload(i)}
            className={`aspect-[3/4] rounded-xl flex items-center justify-center transition-all overflow-hidden ${
              photoPreviewUrls[i]
                ? "border-2 border-accent"
                : i === 0
                ? "border-2 border-dashed border-accent bg-accent/10"
                : "border-2 border-dashed border-border bg-secondary hover:border-accent/50"
            }`}
          >
            {photoPreviewUrls[i] ? (
              <img src={photoPreviewUrls[i]} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
            ) : (
              <div className="text-center">
                <Camera className={`w-6 h-6 mx-auto mb-1 ${i === 0 ? "text-accent" : "text-muted-foreground"}`} />
                <span className="text-[10px] text-muted-foreground">
                  {i === 0 ? "Principal" : `Foto ${i + 1}`}
                </span>
              </div>
            )}
          </button>
        ))}
      </div>
      <p className="text-xs text-center text-muted-foreground">
        A primeira foto será seu perfil principal. Fotos de rosto são recomendadas.
      </p>
    </div>,

    // Step 4: Interests
    <div key="interests" className="space-y-6 animate-fade-in max-w-lg mx-auto w-full">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl font-serif font-semibold text-foreground">Seus interesses</h2>
        <p className="text-muted-foreground text-sm">Escolha pelo menos 3 interesses</p>
      </div>
      <div className="flex flex-wrap gap-3 justify-center">
        {INTERESTS.map((interest) => {
          const selected = selectedInterests.includes(interest);
          return (
            <button
              key={interest}
              onClick={() => toggleInterest(interest)}
              className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                selected
                  ? "gradient-gold text-foreground shadow-warm"
                  : "bg-secondary text-secondary-foreground hover:bg-accent/20"
              }`}
            >
              {selected && <Check className="w-3.5 h-3.5 inline mr-1.5" />}
              {interest}
            </button>
          );
        })}
      </div>
    </div>,

    // Step 5: Values
    <div key="values" className="space-y-6 animate-fade-in max-w-md mx-auto w-full">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl font-serif font-semibold text-foreground">Valores e fé</h2>
        <p className="text-muted-foreground text-sm">Opcional, mas nos ajuda a encontrar conexões melhores</p>
      </div>
      <div className="space-y-6">
        {VALUES_QUESTIONS.map((q) => (
          <div key={q.id} className="space-y-3">
            <p className="font-medium text-sm text-foreground">{q.question}</p>
            <div className="flex flex-wrap gap-2">
              {q.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => selectAnswer(q.id, opt)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                    answers[q.id] === opt
                      ? "gradient-gold text-foreground shadow-warm"
                      : "bg-secondary text-secondary-foreground hover:bg-accent/20"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>,
  ];

  return (
    <div className="min-h-screen gradient-hero flex flex-col">
      {/* Progress */}
      <div className="px-6 pt-6">
        <div className="max-w-md mx-auto flex gap-2">
          {Array.from({ length: totalSteps }).map((_, s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                s <= step ? "gradient-gold" : "bg-border"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-h-[70vh] overflow-y-auto">
          {steps[step]}
        </div>
      </div>

      {/* Navigation */}
      <div className="px-6 pb-8">
        <div className="max-w-md mx-auto flex gap-4">
          {step > 0 && (
            <Button variant="outline" size="lg" className="flex-1" onClick={() => setStep(step - 1)}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
            </Button>
          )}
          <Button
            size="lg"
            disabled={!canProceed() || saving}
            className={`flex-1 gradient-gold text-foreground font-semibold border-0 hover:opacity-90 transition-opacity ${
              !canProceed() ? "opacity-50 pointer-events-none" : ""
            }`}
            onClick={() => {
              if (step < totalSteps - 1) setStep(step + 1);
              else saveProfile();
            }}
          >
            {step === totalSteps - 1
              ? saving ? "Salvando..." : "Entrar no Elo 🙏"
              : "Continuar"}{" "}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
