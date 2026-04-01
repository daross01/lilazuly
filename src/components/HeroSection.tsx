const HeroSection = () => {
  return (
    <section className="bg-secondary py-10 md:py-14">
      <div className="container text-center">
        <h1 className="text-xl md:text-2xl font-semibold text-foreground leading-tight animate-fade-in max-w-xl mx-auto">
          Free Aesthetic Wallpapers for Your Phone
        </h1>
        <p className="mt-2 text-xs md:text-sm text-muted-foreground max-w-md mx-auto animate-fade-in" style={{ animationDelay: "0.15s" }}>
          Download high quality aesthetic wallpapers. New collections every week.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
