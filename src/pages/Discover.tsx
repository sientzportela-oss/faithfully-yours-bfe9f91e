import { useState } from "react";
import { Heart, X, Star, Shield, MapPin, Flag, Ban, Filter, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDiscoverProfiles } from "@/hooks/useProfile";
import { useSendLike } from "@/hooks/useLikes";
import { useBlockUser, useReportUser } from "@/hooks/useBlockReport";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop";

const RELIGIONS = ["Católica", "Evangélica", "Protestante", "Ortodoxa", "Outra"];
const INTENTIONS = ["Casamento", "Namoro sério", "Noivado"];

const Discover = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [filterReligion, setFilterReligion] = useState<string>("all");
  const [filterIntention, setFilterIntention] = useState<string>("all");
  const [filterMinAge, setFilterMinAge] = useState<string>("18");
  const [filterMaxAge, setFilterMaxAge] = useState<string>("99");
  const [reportReason, setReportReason] = useState("");

  const { data: allProfiles = [], isLoading } = useDiscoverProfiles();
  const sendLike = useSendLike();
  const blockUser = useBlockUser();
  const reportUser = useReportUser();

  // Filter profiles
  const profiles = allProfiles.filter((p) => {
    if (filterReligion !== "all" && p["religião"] !== filterReligion) return false;
    if (filterIntention !== "all" && p.intencao_relacionamento !== filterIntention) return false;
    const age = p.idade ?? 0;
    if (age < parseInt(filterMinAge) || age > parseInt(filterMaxAge)) return false;
    return true;
  });

  const profile = profiles[currentIndex % Math.max(profiles.length, 1)];

  const handleLike = () => {
    if (profile) sendLike.mutate(profile.id);
    setCurrentIndex((i) => i + 1);
  };
  const handlePass = () => setCurrentIndex((i) => i + 1);

  const handleBlock = () => {
    if (profile) {
      blockUser.mutate(profile.id);
      setCurrentIndex((i) => i + 1);
    }
  };

  const handleReport = () => {
    if (profile && reportReason) {
      reportUser.mutate({ reportedId: profile.id, reason: reportReason });
      setShowReport(false);
      setReportReason("");
      setCurrentIndex((i) => i + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-6 text-center py-20">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground font-serif">Buscando conexões com propósito...</p>
      </div>
    );
  }

  if (!profiles.length) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-6 text-center py-20">
        <p className="text-xl font-serif text-foreground mb-2">Nenhum perfil encontrado</p>
        <p className="text-muted-foreground text-sm">Continue orando, novas conexões estão a caminho. 🙏</p>
        <Button variant="outline" className="mt-4" onClick={() => { setFilterReligion("all"); setFilterIntention("all"); setFilterMinAge("18"); setFilterMaxAge("99"); setCurrentIndex(0); }}>
          Limpar filtros
        </Button>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-semibold text-foreground">Descobrir</h1>
        <Button variant="ghost" size="sm" className="text-muted-foreground text-xs gap-1" onClick={() => setShowFilters(true)}>
          <Filter className="w-3.5 h-3.5" /> Filtros
        </Button>
      </div>

      {/* Filters Dialog */}
      <Dialog open={showFilters} onOpenChange={setShowFilters}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif">Filtros de busca</DialogTitle>
            <DialogDescription>Encontre pessoas com valores semelhantes</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Religião</label>
              <Select value={filterReligion} onValueChange={setFilterReligion}>
                <SelectTrigger><SelectValue placeholder="Todas" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {RELIGIONS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Intenção</label>
              <Select value={filterIntention} onValueChange={setFilterIntention}>
                <SelectTrigger><SelectValue placeholder="Todas" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {INTENTIONS.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Idade mín.</label>
                <Select value={filterMinAge} onValueChange={setFilterMinAge}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{Array.from({ length: 63 }, (_, i) => i + 18).map((a) => <SelectItem key={a} value={String(a)}>{a}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Idade máx.</label>
                <Select value={filterMaxAge} onValueChange={setFilterMaxAge}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{Array.from({ length: 63 }, (_, i) => i + 18).map((a) => <SelectItem key={a} value={String(a)}>{a}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <Button className="w-full gradient-gold text-foreground border-0" onClick={() => { setCurrentIndex(0); setShowFilters(false); }}>
              Aplicar filtros
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Report Dialog */}
      <Dialog open={showReport} onOpenChange={setShowReport}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif">Denunciar perfil</DialogTitle>
            <DialogDescription>Ajude a manter a comunidade segura</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {["Perfil falso", "Conteúdo inadequado", "Comportamento abusivo", "Spam", "Outro"].map((r) => (
              <button key={r} onClick={() => setReportReason(r)}
                className={`w-full text-left p-3 rounded-lg border text-sm transition-colors ${
                  reportReason === r ? "border-primary bg-primary/5 text-foreground" : "border-border text-muted-foreground hover:bg-secondary/50"
                }`}
              >{r}</button>
            ))}
            <Button className="w-full" disabled={!reportReason} onClick={handleReport}>Enviar denúncia</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Profile Card */}
      <div className="relative rounded-2xl overflow-hidden shadow-warm bg-card animate-fade-in-scale" key={currentIndex}>
        <div className="aspect-[3/4] relative">
          <img src={profile.foto_perfil || FALLBACK_IMAGE} alt={profile.nome || "Perfil"} className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />

          {/* Block/Report buttons */}
          <div className="absolute top-3 right-3 flex gap-2">
            <button onClick={handleBlock} className="w-8 h-8 rounded-full bg-foreground/20 backdrop-blur-sm flex items-center justify-center hover:bg-foreground/40 transition-colors" title="Bloquear">
              <Ban className="w-4 h-4" style={{ color: "white" }} />
            </button>
            <button onClick={() => setShowReport(true)} className="w-8 h-8 rounded-full bg-foreground/20 backdrop-blur-sm flex items-center justify-center hover:bg-foreground/40 transition-colors" title="Denunciar">
              <Flag className="w-4 h-4" style={{ color: "white" }} />
            </button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 text-card">
            {/* Compatibility badge */}
            {(profile as any)._score > 0 && (
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold mb-2" style={{ background: "rgba(197,148,58,0.85)", color: "white" }}>
                ✨ {(profile as any)._score}% compatível
              </div>
            )}
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl font-serif font-semibold" style={{ color: "white" }}>
                {profile.nome || "Anônimo"}{profile.idade ? `, ${profile.idade}` : ""}
              </h2>
              {profile.verificado && <Shield className="w-5 h-5 text-gold-light" />}
            </div>
            {(profile.cidade || profile.estado) && (
              <div className="flex items-center gap-1 mb-3" style={{ color: "rgba(255,255,255,0.8)" }}>
                <MapPin className="w-3.5 h-3.5" />
                <span className="text-sm">{[profile.cidade, profile.estado].filter(Boolean).join(", ")}</span>
              </div>
            )}
            {profile.bio && (
              <p className="text-sm leading-relaxed mb-3" style={{ color: "rgba(255,255,255,0.9)" }}>{profile.bio}</p>
            )}
            <div className="flex flex-wrap gap-1.5">
              {profile.intencao_relacionamento && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-medium" style={{ background: "rgba(255,255,255,0.2)", color: "white" }}>
                  {profile.intencao_relacionamento}
                </span>
              )}
              {profile["religião"] && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-medium" style={{ background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.9)" }}>
                  {profile["religião"]}
                </span>
              )}
              {profile["profissão"] && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-medium" style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)" }}>
                  {profile["profissão"]}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-6 py-8">
        <button onClick={handlePass} className="w-14 h-14 rounded-full bg-card shadow-card flex items-center justify-center border border-border hover:border-destructive transition-colors">
          <X className="w-6 h-6 text-muted-foreground" />
        </button>
        <button onClick={handleLike} className="w-16 h-16 rounded-full gradient-gold shadow-warm flex items-center justify-center hover:opacity-90 transition-opacity">
          <Star className="w-7 h-7 text-foreground" />
        </button>
        <button onClick={handleLike} className="w-14 h-14 rounded-full bg-card shadow-card flex items-center justify-center border border-border hover:border-primary transition-colors">
          <Heart className="w-6 h-6 text-primary" />
        </button>
      </div>
    </div>
  );
};

export default Discover;
