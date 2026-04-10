import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CommunityGuidelines = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground mb-6 hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </button>
      <h1 className="font-serif text-2xl font-semibold text-foreground mb-6">Diretrizes da Comunidade</h1>
      <div className="prose prose-sm text-muted-foreground space-y-4">
        <p>O <strong>Elo</strong> é uma comunidade construída sobre fé, respeito e propósito. Pedimos que todos os membros sigam estas diretrizes:</p>
        <h3 className="text-foreground font-serif">🙏 Respeito mútuo</h3>
        <p>Trate todos com dignidade e gentileza. Não toleramos linguagem ofensiva, discriminação ou assédio de qualquer tipo.</p>
        <h3 className="text-foreground font-serif">💍 Intenção séria</h3>
        <p>O Elo é para relacionamentos com propósito. Perfis com intenções casuais ou desrespeitosas serão removidos.</p>
        <h3 className="text-foreground font-serif">🛡️ Autenticidade</h3>
        <p>Use fotos reais e informações verdadeiras. Perfis falsos são banidos permanentemente.</p>
        <h3 className="text-foreground font-serif">📸 Conteúdo apropriado</h3>
        <p>Não envie conteúdo sexual, violento ou ofensivo. Mantenha as conversas respeitosas e construtivas.</p>
        <h3 className="text-foreground font-serif">🚫 Denúncias</h3>
        <p>Se encontrar comportamento inadequado, denuncie imediatamente. Cada denúncia é investigada com seriedade.</p>
        <p className="italic text-xs">"Amai-vos uns aos outros como eu vos amei." — João 13:34</p>
      </div>
    </div>
  );
};

export default CommunityGuidelines;
