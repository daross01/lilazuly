import { Button } from "@/components/ui/button";

const EmailSignup = () => {
  return (
    <section id="signup" className="bg-primary/20 py-16 md:py-20">
      <div className="container text-center max-w-lg mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          300+ Aesthetic Phone Wallpapers
        </h2>
        <p className="mt-3 text-muted-foreground text-sm md:text-base">
          All Collections Included
        </p>

        <div className="mt-6 flex justify-center">
          <Button variant="hero" size="lg" asChild>
            <a href="https://daross.gumroad.com/l/glow-wallpapers-all-collections" target="_blank" rel="noopener noreferrer">
              Get Free Pack
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EmailSignup;
