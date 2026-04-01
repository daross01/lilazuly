import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card py-10">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="font-semibold text-foreground flex items-center gap-2"><img src="/favicon.svg" alt="DeluneVibes logo" className="w-5 h-5 inline" /> DeluneVibes</p>
            <p className="text-sm text-muted-foreground mt-1">Free aesthetic wallpapers for your phone.</p>
          </div>

          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <a href="mailto:darosscontact@gmail.com" className="hover:text-foreground transition-colors">Contact</a>
            <a
              href="https://es.pinterest.com/delunevibes/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Pinterest
            </a>
          </nav>
        </div>

        <div className="text-center mt-8 text-xs text-muted-foreground">
          © {new Date().getFullYear()} DeluneVibes. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
