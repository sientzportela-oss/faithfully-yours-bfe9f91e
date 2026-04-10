import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Compass, Heart, MessageCircle, User, BookOpen } from "lucide-react";

const NAV_ITEMS = [
  { path: "/app", icon: Compass, label: "Descobrir" },
  { path: "/app/matches", icon: Heart, label: "Matches" },
  { path: "/app/messages", icon: MessageCircle, label: "Mensagens" },
  { path: "/app/reflection", icon: BookOpen, label: "Reflexão" },
  { path: "/app/profile", icon: User, label: "Perfil" },
];

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-card">
        <div className="max-w-lg mx-auto flex justify-around py-2">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                  isActive ? "text-accent" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-accent" : ""}`} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default AppLayout;
