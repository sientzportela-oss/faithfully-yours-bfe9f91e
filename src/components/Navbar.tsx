import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="14" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
          <circle cx="18" cy="14" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
        <span className="text-xl font-semibold font-serif text-foreground">Elo</span>
      </Link>
      <div className="flex items-center gap-3">
        <Button variant="ghost" className="text-foreground font-medium">
          Entrar
        </Button>
        <Button variant="outline" className="font-medium">
          Começar
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
