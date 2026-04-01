import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const ExitIntentPopup = () => {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !dismissed) {
        setShow(true);
      }
    };

    // Also trigger after 30s on mobile as exit-intent doesn't work
    const timeout = setTimeout(() => {
      if (!dismissed) setShow(true);
    }, 30000);

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      clearTimeout(timeout);
    };
  }, [dismissed]);

  const handleClose = () => {
    setShow(false);
    setDismissed(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setTimeout(handleClose, 2000);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4 animate-fade-in-scale">
      <div className="relative bg-background rounded-2xl shadow-soft max-w-md w-full p-8 text-center">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-muted transition-colors"
          aria-label="Close popup"
        >
          <X size={18} className="text-muted-foreground" />
        </button>

        {submitted ? (
          <div className="animate-fade-in">
            <p className="text-xl font-bold text-foreground">🎉 You're in!</p>
            <p className="mt-2 text-sm text-muted-foreground">Check your inbox for 30 exclusive wallpapers.</p>
          </div>
        ) : (
          <>
            <p className="text-2xl font-bold text-foreground leading-snug">
              Wait! Get 30 Exclusive Aesthetic Wallpapers Free
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Enter your email and we'll send you our most popular wallpaper pack — completely free.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
              <input
                type="email"
                required
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-3 rounded-full bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button variant="hero" type="submit" size="lg">
                Send Me The Pack ✨
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ExitIntentPopup;
