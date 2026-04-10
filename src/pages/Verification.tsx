import { useState, useRef } from "react";
import { Camera, FileText, ShieldCheck, Upload, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Verification = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selfie, setSelfie] = useState<File | null>(null);
  const [document, setDocument] = useState<File | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [docPreview, setDocPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const selfieRef = useRef<HTMLInputElement>(null);
  const docRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File, type: "selfie" | "document") => {
    const url = URL.createObjectURL(file);
    if (type === "selfie") { setSelfie(file); setSelfiePreview(url); }
    else { setDocument(file); setDocPreview(url); }
  };

  const handleSubmit = async () => {
    if (!user || !selfie || !document) return;
    setLoading(true);
    try {
      const ts = Date.now();
      const selfieP = `${user.id}/selfie_${ts}.${selfie.name.split(".").pop()}`;
      const docP = `${user.id}/doc_${ts}.${document.name.split(".").pop()}`;

      const [s1, s2] = await Promise.all([
        supabase.storage.from("verification-documents").upload(selfieP, selfie),
        supabase.storage.from("verification-documents").upload(docP, document),
      ]);
      if (s1.error) throw s1.error;
      if (s2.error) throw s2.error;

      const selfieUrl = supabase.storage.from("verification-documents").getPublicUrl(selfieP).data.publicUrl;
      const docUrl = supabase.storage.from("verification-documents").getPublicUrl(docP).data.publicUrl;

      const { error } = await supabase.from("verification").insert({
        user_id: user.id,
        selfie_photo: selfieUrl,
        document_photo: docUrl,
        status: "pendente",
        created_at: new Date().toISOString(),
      });
      if (error) throw error;

      toast({ title: "Verificação enviada! 🙏", description: "Analisaremos seus documentos em breve." });
      navigate("/app");
    } catch (e: any) {
      toast({ title: "Erro ao enviar verificação", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="text-center space-y-3">
          <ShieldCheck className="w-12 h-12 text-primary mx-auto" />
          <h1 className="text-2xl font-serif font-semibold text-foreground">Verificação de Perfil</h1>
          <p className="text-sm text-muted-foreground">
            Para sua segurança e de toda a comunidade, precisamos verificar sua identidade.
            <br />
            <span className="italic">"A verdade vos libertará" — João 8:32</span>
          </p>
        </div>

        <div className="space-y-4">
          {/* Selfie */}
          <div
            onClick={() => selfieRef.current?.click()}
            className="bg-card rounded-xl border-2 border-dashed border-border hover:border-primary/50 p-6 text-center cursor-pointer transition-colors"
          >
            <input ref={selfieRef} type="file" accept="image/*" capture="user" className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0], "selfie")}
            />
            {selfiePreview ? (
              <img src={selfiePreview} alt="Selfie" className="w-24 h-24 rounded-full object-cover mx-auto mb-2" />
            ) : (
              <Camera className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
            )}
            <p className="text-sm font-medium text-foreground">Selfie do rosto</p>
            <p className="text-xs text-muted-foreground">Tire uma foto clara do seu rosto</p>
          </div>

          {/* Document */}
          <div
            onClick={() => docRef.current?.click()}
            className="bg-card rounded-xl border-2 border-dashed border-border hover:border-primary/50 p-6 text-center cursor-pointer transition-colors"
          >
            <input ref={docRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0], "document")}
            />
            {docPreview ? (
              <img src={docPreview} alt="Documento" className="w-32 h-20 rounded-lg object-cover mx-auto mb-2" />
            ) : (
              <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
            )}
            <p className="text-sm font-medium text-foreground">Documento com foto</p>
            <p className="text-xs text-muted-foreground">RG, CNH ou passaporte</p>
          </div>
        </div>

        <div className="bg-secondary/50 rounded-xl p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            Seus documentos são analisados com segurança e não são compartilhados. A verificação garante um ambiente confiável para todos.
          </p>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!selfie || !document || loading}
          className="w-full h-12 gradient-gold text-foreground font-semibold border-0 hover:opacity-90"
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Enviando...</> : <>
            <Upload className="w-4 h-4 mr-2" /> Enviar para verificação
          </>}
        </Button>

        <p className="text-center text-[11px] text-muted-foreground">
          Seus dados estão protegidos conforme nossa Política de Privacidade
        </p>
      </div>
    </div>
  );
};

export default Verification;
