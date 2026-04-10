import { useState, useRef } from "react";
import { Camera, FileText, ShieldCheck, Upload, Loader2, AlertCircle, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useVerification } from "@/hooks/useVerification";

const Verification = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: existingVerification, isLoading: loadingVerification } = useVerification();

  const [selfie, setSelfie] = useState<File | null>(null);
  const [document, setDocument] = useState<File | null>(null);
  const [selfieWithDoc, setSelfieWithDoc] = useState<File | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [docPreview, setDocPreview] = useState<string | null>(null);
  const [selfieDocPreview, setSelfieDocPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const selfieRef = useRef<HTMLInputElement>(null);
  const docRef = useRef<HTMLInputElement>(null);
  const selfieDocRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File, type: "selfie" | "document" | "selfie_doc") => {
    const url = URL.createObjectURL(file);
    if (type === "selfie") { setSelfie(file); setSelfiePreview(url); }
    else if (type === "document") { setDocument(file); setDocPreview(url); }
    else { setSelfieWithDoc(file); setSelfieDocPreview(url); }
  };

  const handleSubmit = async () => {
    if (!user || !selfie || !document || !selfieWithDoc) return;
    setLoading(true);
    try {
      const ts = Date.now();
      const ext = (f: File) => f.name.split(".").pop();
      const selfieP = `${user.id}/selfie_${ts}.${ext(selfie)}`;
      const docP = `${user.id}/doc_${ts}.${ext(document)}`;
      const selfieDocP = `${user.id}/selfie_doc_${ts}.${ext(selfieWithDoc)}`;

      const [s1, s2, s3] = await Promise.all([
        supabase.storage.from("verification-documents").upload(selfieP, selfie),
        supabase.storage.from("verification-documents").upload(docP, document),
        supabase.storage.from("verification-documents").upload(selfieDocP, selfieWithDoc),
      ]);
      if (s1.error) throw s1.error;
      if (s2.error) throw s2.error;
      if (s3.error) throw s3.error;

      const getUrl = (path: string) =>
        supabase.storage.from("verification-documents").getPublicUrl(path).data.publicUrl;

      const { error } = await supabase.from("verification").insert({
        user_id: user.id,
        selfie_photo: getUrl(selfieP),
        document_photo: getUrl(docP),
        selfie_with_document: getUrl(selfieDocP),
        status: "pending",
        created_at: new Date().toISOString(),
      });
      if (error) throw error;

      toast({ title: "Verificação enviada! 🙏", description: "Analisaremos seus documentos em breve." });
      // Force refresh
      window.location.reload();
    } catch (e: any) {
      toast({ title: "Erro ao enviar verificação", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (loadingVerification) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Already submitted — show status
  if (existingVerification) {
    const status = existingVerification.status;
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-6 animate-fade-in text-center">
          {status === "pending" && (
            <>
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-8 h-8 text-accent" />
              </div>
              <h1 className="text-2xl font-serif font-semibold text-foreground">Verificação em análise</h1>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Seu perfil está sendo verificado para manter o EloFaith seguro.
                <br />Isso pode levar algumas horas.
              </p>
              <div className="bg-card rounded-xl border border-border p-4">
                <p className="text-xs text-muted-foreground italic">
                  "A verdade vos libertará" — João 8:32
                </p>
              </div>
            </>
          )}
          {status === "approved" && (
            <>
              <div className="w-16 h-16 rounded-full gradient-gold flex items-center justify-center mx-auto">
                <UserCheck className="w-8 h-8 text-foreground" />
              </div>
              <h1 className="text-2xl font-serif font-semibold text-foreground">Perfil verificado ✓</h1>
              <p className="text-muted-foreground text-sm">Sua identidade foi confirmada com sucesso.</p>
              <Button className="gradient-gold text-foreground border-0" onClick={() => navigate("/app")}>
                Entrar no app
              </Button>
            </>
          )}
          {status === "rejected" && (
            <>
              <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
              <h1 className="text-2xl font-serif font-semibold text-foreground">Verificação não aprovada</h1>
              <p className="text-muted-foreground text-sm">
                Seus documentos não puderam ser verificados. Por favor, envie novamente com fotos mais claras.
              </p>
              <Button className="gradient-gold text-foreground border-0" onClick={() => {
                // Allow re-submission by clearing
                window.location.reload();
              }}>
                Tentar novamente
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="text-center space-y-3">
          <ShieldCheck className="w-12 h-12 text-primary mx-auto" />
          <h1 className="text-2xl font-serif font-semibold text-foreground">Verificação de Identidade</h1>
          <p className="text-sm text-muted-foreground">
            Para sua segurança e de toda a comunidade, precisamos verificar sua identidade antes de acessar o app.
            <br />
            <span className="italic">"A verdade vos libertará" — João 8:32</span>
          </p>
        </div>

        <div className="space-y-4">
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
            <p className="text-sm font-medium text-foreground">📄 Documento com foto</p>
            <p className="text-xs text-muted-foreground">RG, CNH ou passaporte</p>
          </div>

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
            <p className="text-sm font-medium text-foreground">📸 Selfie do rosto</p>
            <p className="text-xs text-muted-foreground">Tire uma foto clara do seu rosto</p>
          </div>

          {/* Selfie with document */}
          <div
            onClick={() => selfieDocRef.current?.click()}
            className="bg-card rounded-xl border-2 border-dashed border-border hover:border-primary/50 p-6 text-center cursor-pointer transition-colors"
          >
            <input ref={selfieDocRef} type="file" accept="image/*" capture="user" className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0], "selfie_doc")}
            />
            {selfieDocPreview ? (
              <img src={selfieDocPreview} alt="Selfie com documento" className="w-32 h-24 rounded-lg object-cover mx-auto mb-2" />
            ) : (
              <UserCheck className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
            )}
            <p className="text-sm font-medium text-foreground">🤳 Selfie segurando o documento</p>
            <p className="text-xs text-muted-foreground">Segure o documento ao lado do rosto</p>
          </div>
        </div>

        <div className="bg-secondary/50 rounded-xl p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            Seus documentos são analisados com segurança e não são compartilhados. A verificação é obrigatória para garantir um ambiente confiável para todos.
          </p>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!selfie || !document || !selfieWithDoc || loading}
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
