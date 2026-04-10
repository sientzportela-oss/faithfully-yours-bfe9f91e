import { useState } from "react";
import { Search, ArrowLeft, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useConversations, useChatMessages, useSendMessage } from "@/hooks/useMessages";
import { useAuth } from "@/contexts/AuthContext";

const Messages = () => {
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);
  const [selectedPartnerName, setSelectedPartnerName] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const { data: conversations = [], isLoading } = useConversations();
  const { data: chatMessages = [] } = useChatMessages(selectedPartner);
  const sendMessage = useSendMessage();

  const handleSend = () => {
    if (!newMessage.trim() || !selectedPartner) return;
    sendMessage.mutate({ receiverId: selectedPartner, message: newMessage.trim() });
    setNewMessage("");
  };

  // Chat view
  if (selectedPartner) {
    return (
      <div className="max-w-lg mx-auto flex flex-col h-[calc(100vh-5rem)]">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <button onClick={() => setSelectedPartner(null)}>
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <h2 className="font-serif font-semibold text-foreground">{selectedPartnerName}</h2>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {chatMessages.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-8 font-serif">
              Iniciem uma conversa com respeito e fé. 🙏
            </p>
          )}
          {chatMessages.map((msg) => {
            const isMe = msg.sender_id === user?.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                    isMe
                      ? "gradient-gold text-foreground rounded-br-md"
                      : "bg-card border border-border text-foreground rounded-bl-md"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            );
          })}
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-border flex gap-2">
          <Input
            placeholder="Escreva com carinho..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!newMessage.trim() || sendMessage.isPending}
            size="icon"
            className="gradient-gold border-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  // Conversation list
  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      <h1 className="font-serif text-2xl font-semibold text-foreground mb-6">Mensagens</h1>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar conversas"
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : conversations.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground font-serif">Nenhuma conversa ainda</p>
          <p className="text-sm text-muted-foreground mt-1">Faça conexões para começar a conversar com fé</p>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations
            .filter((c) =>
              !searchQuery || c.profile?.nome?.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((convo) => (
              <button
                key={convo.partnerId}
                onClick={() => {
                  setSelectedPartner(convo.partnerId);
                  setSelectedPartnerName(convo.profile?.nome || "Usuário");
                }}
                className="w-full flex items-center gap-4 p-4 bg-card rounded-xl shadow-card text-left hover:bg-secondary/50 transition-colors"
              >
                <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center text-lg font-serif font-semibold text-muted-foreground overflow-hidden">
                  {convo.profile?.foto_perfil ? (
                    <img src={convo.profile.foto_perfil} alt="" className="w-full h-full object-cover" />
                  ) : (
                    (convo.profile?.nome?.[0] || "?")
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-foreground">{convo.profile?.nome || "Usuário"}</p>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{convo.lastMessage}</p>
                </div>
                {convo.unread > 0 && (
                  <div className="w-5 h-5 rounded-full gradient-gold flex items-center justify-center">
                    <span className="text-[10px] font-bold text-foreground">{convo.unread}</span>
                  </div>
                )}
              </button>
            ))}
        </div>
      )}
    </div>
  );
};

export default Messages;
