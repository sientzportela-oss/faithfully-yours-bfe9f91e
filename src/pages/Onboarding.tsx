import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import eloLogo from "@/assets/elo-logo.png";
import { ArrowLeft, ArrowRight, Check, Camera, ChevronDown, ShieldCheck, FileText, UserCheck, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
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

const STEP_LABELS = ["Bem-vindo", "Gênero", "Sobre você", "Fotos", "Interesses", "Valores e fé", "Verificação"];

const RequiredLabel = ({ children, htmlFor, valid }: { children: React.ReactNode; htmlFor?: string; valid?: boolean }) => (
  <Label htmlFor={htmlFor} className="flex items-center gap-1">
    {children} <span className="text-destructive">*</span>
    {valid && <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />}
  </Label>
);

const FieldError = ({ show, message }: { show: boolean; message: string }) =>
  show ? (
    <p className="text-xs text-destructive flex items-center gap-1">
      <AlertCircle className="w-3 h-3" /> {message}
    </p>
  ) : null;

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
  const [saving, setSaving] = useState(false);
  const [verDoc, setVerDoc] = useState<File | null>(null);
  const [verSelfie, setVerSelfie] = useState<File | null>(null);
  const [verSelfieDoc, setVerSelfieDoc] = useState<File | null>(null);
  const [verDocPreview, setVerDocPreview] = useState<string | null>(null);
  const [verSelfiePreview, setVerSelfiePreview] = useState<string | null>(null);
  const [verSelfieDocPreview, setVerSelfieDocPreview] = useState<string | null>(null);
  const verDocRef = useRef<HTMLInputElement>(null);
  const verSelfieRef = useRef<HTMLInputElement>(null);
  const verSelfieDocRef = useRef<HTMLInputElement>(null);

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [attemptedNext, setAttemptedNext] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const touch = (field: string) => setTouched((p) => ({ ...p, [field]: true }));
  const showError = (field: string) => touched[field] || attemptedNext;

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const selectAnswer = (qId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: answer }));
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

  // Validation
  const ageNum = parseInt(age);
  const nameValid = name.trim().length > 0;
  const ageValid = age.trim().length > 0 && ageNum >= 18;
  const stateValid = state.length > 0;
  const cityValid = city.trim().length > 0;
  const religionValid = religion.length > 0;
  const intentionValid = relationshipIntention.length > 0;
  const bioValid = bio.trim().length >= 20;
  const photoCount = photos.filter(Boolean).length;
  const photosValid = photoCount >= 3;
  const interestsValid = selectedInterests.length >= 3;
  const verComplete = !!verDoc && !!verSelfie && !!verSelfieDoc;

  const canProceed = () => {
    if (step === 0) return true;
    if (step === 1) return gender !== "";
    if (step === 2) return nameValid && ageValid && stateValid && cityValid;
    if (step === 3) return photosValid;
    if (step === 4) return interestsValid;
    if (step === 5) return true;
    if (step === 6) return verComplete;
    return true;
  };

  const totalSteps = 7;
  const progressPercent = ((step + 1) / totalSteps) * 100;

  const handleNext = () => {
    if (!canProceed()) {
      setAttemptedNext(true);
      return;
    }
    setAttemptedNext(false);
    if (step < totalSteps - 1) setStep(step + 1);
    else saveProfile();
  };

  const inputClass = (valid: boolean, field: string) => {
    if (!showError(field)) return "";
    return valid ? "border-green-500 focus-visible:ring-green-500" : "border-destructive focus-visible:ring-destructive";
  };

  const selectClass = (valid: boolean, field: string) => {
    if (!showError(field)) return "";
    return valid ? "border-green-500" : "border-destructive";
  };

  const saveProfile = async () => {
    if (!user) {
      toast({ title: "Erro", description: "Você precisa estar logado.", variant: "destructive" });
      return;
    }
    if (!verDoc || !verSelfie || !verSelfieDoc) {
      toast({ title: "Erro", description: "Envie todos os documentos de verificação.", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      let profilePhotoUrl = "";
      for (let i = 0; i < photos.length; i++) {
        if (!photos[i]) continue;
        const ext = photos[i].name.split(".").pop();
        const path = `${user.id}/${i === 0 ? "profile" : `photo-${i}`}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("profile-photos").upload(path, photos[i], { upsert: true });
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from("profile-photos").getPublicUrl(path);
        if (i === 0) profilePhotoUrl = urlData.publicUrl;
        await supabase.from("photos").insert({ user_id: user.id, photo_url: urlData.publicUrl, is_primary: i === 0, order_index: i });
      }

      const ts = Date.now();
      const getExt = (f: File) => f.name.split(".").pop();
      const verDocPath = `${user.id}/doc_${ts}.${getExt(verDoc)}`;
      const verSelfiePath = `${user.id}/selfie_${ts}.${getExt(verSelfie)}`;
      const verSelfieDocPath = `${user.id}/selfie_doc_${ts}.${getExt(verSelfieDoc)}`;

      const [v1, v2, v3] = await Promise.all([
        supabase.storage.from("verification-documents").upload(verDocPath, verDoc),
        supabase.storage.from("verification-documents").upload(verSelfiePath, verSelfie),
        supabase.storage.from("verification-documents").upload(verSelfieDocPath, verSelfieDoc),
      ]);
      if (v1.error) throw v1.error;
      if (v2.error) throw v2.error;
      if (v3.error) throw v3.error;

      const getUrl = (p: string) => supabase.storage.from("verification-documents").getPublicUrl(p).data.publicUrl;

      const { error } = await supabase.from("profiles").upsert({
        id: user.id, nome: name, idade: parseInt(age),
        sexo: gender === "male" ? "Masculino" : "Feminino",
        cidade: city, estado: state, bio, "profissão": profession, "religião": religion,
        intencao_relacionamento: relationshipIntention || "casamento",
        foto_perfil: profilePhotoUrl || null, frequencia_igreja: answers.church || null, email: user.email || null,
      }, { onConflict: "id" });
      if (error) throw error;

      const { error: verError } = await supabase.from("verification").insert({
        user_id: user.id, document_photo: getUrl(verDocPath), selfie_photo: getUrl(verSelfiePath),
        selfie_with_document: getUrl(verSelfieDocPath), status: "pending", created_at: new Date().toISOString(),
      });
      if (verError) throw verError;

      toast({ title: "Perfil criado e verificação enviada! 🙏", description: "Analisaremos seus documentos em breve." });
      navigate("/app");
    } catch (error: any) {
      toast({ title: "Erro ao salvar", description: error.message || "Tente novamente.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const SelectField = ({ label, value, onChange, options, placeholder, required, valid, fieldName }: {
    label: string; value: string; onChange: (v: string) => void; options: string[]; placeholder: string;
    required?: boolean; valid?: boolean; fieldName?: string;
  }) => (
    <div className="space-y-2">
      {required ? <RequiredLabel valid={showError(fieldName || "") && valid}>{label}</RequiredLabel> : <Label>{label}</Label>}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => { onChange(e.target.value); if (fieldName) touch(fieldName); }}
          onBlur={() => { if (fieldName) touch(fieldName); }}
          className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background appearance-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${fieldName ? selectClass(!!valid, fieldName) : ""}`}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      </div>
      {required && fieldName && <FieldError show={showError(fieldName) && !valid} message="Este campo é obrigatório" />}
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
        <p className="text-muted-foreground text-sm">Selecione seu gênero <span className="text-destructive">*</span></p>
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
      <FieldError show={attemptedNext && !gender} message="Selecione seu gênero" />
    </div>,

    // Step 2: Basic Info + Location
    <div key="basic" className="space-y-5 animate-fade-in max-w-md mx-auto w-full">
      <div className="text-center space-y-2 mb-6">
        <h2 className="text-2xl font-serif font-semibold text-foreground">Sobre você</h2>
        <p className="text-muted-foreground text-sm">Informações básicas</p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <RequiredLabel htmlFor="name" valid={showError("name") && nameValid}>Nome</RequiredLabel>
          <Input id="name" placeholder="Seu nome" value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => touch("name")}
            className={inputClass(nameValid, "name")}
          />
          <FieldError show={showError("name") && !nameValid} message="Este campo é obrigatório" />
        </div>
        <div className="space-y-2">
          <RequiredLabel htmlFor="age" valid={showError("age") && ageValid}>Idade</RequiredLabel>
          <Input id="age" type="number" placeholder="Sua idade" value={age}
            onChange={(e) => { setAge(e.target.value); }}
            onBlur={() => touch("age")}
            className={inputClass(ageValid, "age")}
          />
          <FieldError show={showError("age") && !age.trim()} message="Este campo é obrigatório" />
          <FieldError show={showError("age") && !!age.trim() && ageNum < 18} message="Você precisa ter pelo menos 18 anos" />
        </div>
        <SelectField label="País" value={country} onChange={setCountry} options={COUNTRIES} placeholder="Selecione" />
        <SelectField label="Estado" value={state}
          onChange={(v) => { setState(v); setCity(""); }}
          options={(STATES[country] || []).map((s) => STATE_NAMES[s] || s)}
          placeholder="Selecione o estado"
          required valid={stateValid} fieldName="state"
        />
        <div className="space-y-2">
          <RequiredLabel valid={showError("city") && cityValid}>Cidade</RequiredLabel>
          <Input placeholder="Sua cidade" value={city}
            onChange={(e) => setCity(e.target.value)}
            onBlur={() => touch("city")}
            className={inputClass(cityValid, "city")}
          />
          <FieldError show={showError("city") && !cityValid} message="Este campo é obrigatório" />
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
          <SelectField label="Religião" value={religion} onChange={setReligion} options={RELIGIONS} placeholder="Selecione"
            required valid={religionValid} fieldName="religion"
          />
        </div>
        <SelectField label="Intenção de relacionamento" value={relationshipIntention} onChange={setRelationshipIntention}
          options={RELATIONSHIP_INTENTIONS} placeholder="Selecione"
          required valid={intentionValid} fieldName="intention"
        />
        <div className="space-y-2">
          <RequiredLabel valid={showError("bio") && bioValid}>Bio</RequiredLabel>
          <textarea
            placeholder="Conte um pouco sobre você e sua fé (mínimo 20 caracteres)..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            onBlur={() => touch("bio")}
            className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none ${showError("bio") ? (bioValid ? "border-green-500" : "border-destructive") : ""}`}
            maxLength={500}
          />
          <div className="flex justify-between">
            <FieldError show={showError("bio") && !bioValid} message={bio.trim().length === 0 ? "Este campo é obrigatório" : "A bio deve ter pelo menos 20 caracteres"} />
            <p className={`text-xs ml-auto ${bio.length >= 20 ? "text-green-500" : "text-muted-foreground"}`}>{bio.length}/500</p>
          </div>
        </div>
      </div>
    </div>,

    // Step 3: Photos
    <div key="photos" className="space-y-6 animate-fade-in max-w-md mx-auto w-full">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl font-serif font-semibold text-foreground">Suas fotos <span className="text-destructive">*</span></h2>
        <p className="text-muted-foreground text-sm">Adicione pelo menos 3 fotos (obrigatório)</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[...Array(6)].map((_, i) => (
          <button
            key={i}
            onClick={() => handlePhotoUpload(i)}
            className={`aspect-[3/4] rounded-xl flex items-center justify-center transition-all overflow-hidden ${
              photoPreviewUrls[i]
                ? "border-2 border-green-500"
                : i < 3
                ? "border-2 border-dashed border-accent bg-accent/10"
                : "border-2 border-dashed border-border bg-secondary hover:border-accent/50"
            }`}
          >
            {photoPreviewUrls[i] ? (
              <img src={photoPreviewUrls[i]} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
            ) : (
              <div className="text-center">
                <Camera className={`w-6 h-6 mx-auto mb-1 ${i < 3 ? "text-accent" : "text-muted-foreground"}`} />
                <span className="text-[10px] text-muted-foreground">
                  {i === 0 ? "Principal *" : i < 3 ? `Foto ${i + 1} *` : `Foto ${i + 1}`}
                </span>
              </div>
            )}
          </button>
        ))}
      </div>
      <div className={`text-center text-sm font-medium ${photosValid ? "text-green-500" : "text-destructive"}`}>
        {photoCount}/3 fotos obrigatórias {photosValid ? <CheckCircle2 className="w-4 h-4 inline ml-1" /> : "— adicione mais"}
      </div>
      <FieldError show={attemptedNext && !photosValid} message="Você precisa adicionar pelo menos 3 fotos" />
      <p className="text-xs text-center text-muted-foreground">
        A primeira foto será seu perfil principal. Fotos de rosto são recomendadas.
      </p>
    </div>,

    // Step 4: Interests
    <div key="interests" className="space-y-6 animate-fade-in max-w-lg mx-auto w-full">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl font-serif font-semibold text-foreground">Seus interesses <span className="text-destructive">*</span></h2>
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
      <div className={`text-center text-sm font-medium ${interestsValid ? "text-green-500" : "text-destructive"}`}>
        {selectedInterests.length}/3 selecionados {interestsValid ? <CheckCircle2 className="w-4 h-4 inline ml-1" /> : "— selecione mais"}
      </div>
      <FieldError show={attemptedNext && !interestsValid} message="Escolha pelo menos 3 interesses" />
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

    // Step 6: Verification (mandatory)
    <div key="verification" className="space-y-6 animate-fade-in max-w-md mx-auto w-full">
      <div className="text-center space-y-3 mb-6">
        <ShieldCheck className="w-12 h-12 text-primary mx-auto" />
        <h2 className="text-2xl font-serif font-semibold text-foreground">Verificação de Identidade <span className="text-destructive">*</span></h2>
        <p className="text-muted-foreground text-sm">
          Para sua segurança, envie os 3 documentos abaixo. Esta etapa é <strong>obrigatória</strong>.
        </p>
      </div>

      <div className="space-y-4">
        {/* Document */}
        <div
          onClick={() => verDocRef.current?.click()}
          className={`bg-card rounded-xl border-2 border-dashed p-5 text-center cursor-pointer transition-colors ${verDoc ? "border-green-500" : "border-border hover:border-primary/50"}`}
        >
          <input ref={verDocRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) { setVerDoc(f); setVerDocPreview(URL.createObjectURL(f)); } }}
          />
          {verDocPreview ? (
            <img src={verDocPreview} alt="Documento" className="w-28 h-18 rounded-lg object-cover mx-auto mb-2" />
          ) : (
            <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          )}
          <p className="text-sm font-medium text-foreground">📄 Documento com foto <span className="text-destructive">*</span></p>
          <p className="text-xs text-muted-foreground">RG, CNH ou passaporte</p>
          {verDoc && <p className="text-xs text-green-500 mt-1 flex items-center justify-center gap-1"><CheckCircle2 className="w-3 h-3" /> Enviado</p>}
        </div>

        {/* Selfie */}
        <div
          onClick={() => verSelfieRef.current?.click()}
          className={`bg-card rounded-xl border-2 border-dashed p-5 text-center cursor-pointer transition-colors ${verSelfie ? "border-green-500" : "border-border hover:border-primary/50"}`}
        >
          <input ref={verSelfieRef} type="file" accept="image/*" capture="user" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) { setVerSelfie(f); setVerSelfiePreview(URL.createObjectURL(f)); } }}
          />
          {verSelfiePreview ? (
            <img src={verSelfiePreview} alt="Selfie" className="w-20 h-20 rounded-full object-cover mx-auto mb-2" />
          ) : (
            <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          )}
          <p className="text-sm font-medium text-foreground">📸 Selfie do rosto <span className="text-destructive">*</span></p>
          <p className="text-xs text-muted-foreground">Tire uma foto clara do seu rosto</p>
          {verSelfie && <p className="text-xs text-green-500 mt-1 flex items-center justify-center gap-1"><CheckCircle2 className="w-3 h-3" /> Enviado</p>}
        </div>

        {/* Selfie with document */}
        <div
          onClick={() => verSelfieDocRef.current?.click()}
          className={`bg-card rounded-xl border-2 border-dashed p-5 text-center cursor-pointer transition-colors ${verSelfieDoc ? "border-green-500" : "border-border hover:border-primary/50"}`}
        >
          <input ref={verSelfieDocRef} type="file" accept="image/*" capture="user" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) { setVerSelfieDoc(f); setVerSelfieDocPreview(URL.createObjectURL(f)); } }}
          />
          {verSelfieDocPreview ? (
            <img src={verSelfieDocPreview} alt="Selfie com doc" className="w-28 h-20 rounded-lg object-cover mx-auto mb-2" />
          ) : (
            <UserCheck className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          )}
          <p className="text-sm font-medium text-foreground">🤳 Selfie segurando o documento <span className="text-destructive">*</span></p>
          <p className="text-xs text-muted-foreground">Segure o documento ao lado do rosto</p>
          {verSelfieDoc && <p className="text-xs text-green-500 mt-1 flex items-center justify-center gap-1"><CheckCircle2 className="w-3 h-3" /> Enviado</p>}
        </div>
      </div>

      <div className={`text-center text-sm font-medium ${verComplete ? "text-green-500" : "text-destructive"}`}>
        {[verDoc, verSelfie, verSelfieDoc].filter(Boolean).length}/3 documentos enviados {verComplete ? <CheckCircle2 className="w-4 h-4 inline ml-1" /> : ""}
      </div>
      <FieldError show={attemptedNext && !verComplete} message="Envie todos os 3 documentos para continuar" />

      <div className="bg-secondary/50 rounded-xl p-4 flex gap-3">
        <ShieldCheck className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          Seus documentos são analisados com segurança e não são compartilhados. A verificação garante um ambiente confiável para todos.
        </p>
      </div>
    </div>,
  ];

  return (
    <div className="min-h-screen gradient-hero flex flex-col">
      {/* Progress bar */}
      <div className="px-6 pt-6 space-y-2">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-foreground">
              Passo {step + 1} de {totalSteps} — <span className="text-muted-foreground">{STEP_LABELS[step]}</span>
            </p>
            <p className="text-xs text-muted-foreground">{Math.round(progressPercent)}%</p>
          </div>
          <Progress value={progressPercent} className="h-2 bg-border [&>div]:gradient-gold" />
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
        <div className="max-w-md mx-auto space-y-2">
          {attemptedNext && !canProceed() && (
            <p className="text-center text-sm text-destructive flex items-center justify-center gap-1">
              <AlertCircle className="w-4 h-4" /> Preencha todos os campos obrigatórios para continuar
            </p>
          )}
          <div className="flex gap-4">
            {step > 0 && (
              <Button variant="outline" size="lg" className="flex-1" onClick={() => { setStep(step - 1); setAttemptedNext(false); }}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
              </Button>
            )}
            <Button
              size="lg"
              disabled={saving}
              className={`flex-1 gradient-gold text-foreground font-semibold border-0 hover:opacity-90 transition-opacity ${
                !canProceed() ? "opacity-60" : ""
              }`}
              onClick={handleNext}
            >
              {step === totalSteps - 1
                ? saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Enviando...</> : "Enviar e verificar 🛡️"
                : "Continuar"}{" "}
              {step < totalSteps - 1 && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
