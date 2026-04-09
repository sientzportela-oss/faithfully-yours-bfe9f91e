const Footer = () => {
  return (
    <footer className="border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10" cy="14" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
            <circle cx="18" cy="14" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
          <span>Elo — Conexões com fé e intenção</span>
        </div>
        <p className="text-muted-foreground text-sm">
          © 2026 Elo. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
