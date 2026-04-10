import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground mb-6 hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </button>
      <h1 className="font-serif text-2xl font-semibold text-foreground mb-6">Política de Privacidade</h1>
      <div className="prose prose-sm text-muted-foreground space-y-4">
        <p>A sua privacidade é sagrada para nós. O <strong>Elo</strong> trata seus dados com o mesmo cuidado com que tratamos a confiança da nossa comunidade.</p>
        <h3 className="text-foreground font-serif">Dados coletados</h3>
        <p>Coletamos apenas informações necessárias: nome, idade, localização aproximada, fotos, preferências de relacionamento e dados de verificação.</p>
        <h3 className="text-foreground font-serif">Uso dos dados</h3>
        <p>Seus dados são usados exclusivamente para melhorar sua experiência no app, sugerir conexões compatíveis e garantir a segurança da plataforma.</p>
        <h3 className="text-foreground font-serif">Compartilhamento</h3>
        <p>Nunca vendemos seus dados. Seu email e documentos de verificação não são visíveis para outros usuários.</p>
        <h3 className="text-foreground font-serif">Segurança</h3>
        <p>Utilizamos criptografia e políticas de acesso restrito para proteger suas informações.</p>
        <h3 className="text-foreground font-serif">Seus direitos</h3>
        <p>Você pode solicitar a exclusão de seus dados a qualquer momento. Basta entrar em contato conosco ou excluir sua conta.</p>
        <p className="italic text-xs">"O Senhor é o meu pastor e nada me faltará." — Salmo 23:1</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
