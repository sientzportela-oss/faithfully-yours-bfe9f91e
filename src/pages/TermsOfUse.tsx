import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TermsOfUse = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground mb-6 hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </button>
      <h1 className="font-serif text-2xl font-semibold text-foreground mb-6">Termos de Uso</h1>
      <div className="prose prose-sm text-muted-foreground space-y-4">
        <p>Bem-vindo ao <strong>Elo</strong> — uma plataforma de relacionamentos com propósito, fundamentada em valores cristãos e respeito mútuo.</p>
        <h3 className="text-foreground font-serif">1. Elegibilidade</h3>
        <p>O uso do Elo é restrito a maiores de 18 anos. Ao criar uma conta, você confirma que atende a esse requisito.</p>
        <h3 className="text-foreground font-serif">2. Conduta do Usuário</h3>
        <p>Esperamos que todos os membros ajam com respeito, honestidade e integridade. Comportamentos abusivos, ofensivos ou fraudulentos resultarão em suspensão ou banimento.</p>
        <h3 className="text-foreground font-serif">3. Verificação</h3>
        <p>A verificação de identidade é obrigatória para garantir a autenticidade de cada perfil e a segurança da comunidade.</p>
        <h3 className="text-foreground font-serif">4. Conteúdo</h3>
        <p>Você é responsável pelo conteúdo que compartilha. Não é permitido postar conteúdo sexual, violento, discriminatório ou que viole direitos de terceiros.</p>
        <h3 className="text-foreground font-serif">5. Premium</h3>
        <p>Funcionalidades premium são cobradas conforme os planos disponíveis. Cancelamentos podem ser feitos a qualquer momento.</p>
        <h3 className="text-foreground font-serif">6. Limitação de Responsabilidade</h3>
        <p>O Elo facilita conexões, mas não garante resultados. Interações entre usuários são de responsabilidade dos envolvidos.</p>
        <p className="italic text-xs">"Tudo posso naquele que me fortalece." — Filipenses 4:13</p>
      </div>
    </div>
  );
};

export default TermsOfUse;
