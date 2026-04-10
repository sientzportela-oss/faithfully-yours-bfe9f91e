import { Bell, Heart, MessageCircle, Shield, Star, Check } from "lucide-react";
import { useNotifications, useMarkNotificationRead } from "@/hooks/useNotifications";

const iconMap: Record<string, any> = {
  match: Heart,
  message: MessageCircle,
  like: Star,
  verification: Shield,
};

const Notifications = () => {
  const { data: notifications = [], isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();

  if (isLoading) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-6 text-center py-20">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground font-serif">Carregando notificações...</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
      <h1 className="font-serif text-2xl font-semibold text-foreground mb-6">Notificações</h1>

      {notifications.length === 0 ? (
        <div className="text-center py-16">
          <Bell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">Nenhuma notificação ainda</p>
          <p className="text-muted-foreground/60 text-xs mt-1">"Esperai no Senhor" — Salmo 27:14</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => {
            const Icon = iconMap[n.type ?? ""] || Bell;
            const isUnread = !n.read;
            return (
              <button
                key={n.id}
                onClick={() => !n.read && markRead.mutate(n.id)}
                className={`w-full flex items-start gap-3 p-4 rounded-xl text-left transition-colors ${
                  isUnread ? "bg-primary/5 border border-primary/10" : "bg-card border border-border"
                } hover:bg-secondary/50`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                  isUnread ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  {n.title && <p className="text-sm font-medium text-foreground">{n.title}</p>}
                  <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                </div>
                {isUnread && <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />}
                {!isUnread && <Check className="w-4 h-4 text-muted-foreground/40 shrink-0 mt-1" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notifications;
